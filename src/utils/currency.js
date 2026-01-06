/**
 * Utilidades de Conversión de Moneda
 * 
 * ESTADO: PREPARADO pero DESACTIVADO
 * 
 * Para activar la conversión automática de moneda:
 * 1. Registrarse en https://exchangerate-api.io (plan gratuito disponible)
 * 2. Agregar VITE_EXCHANGE_RATE_API_KEY en .env
 * 3. Cambiar CURRENCY_CONVERSION_ENABLED a true
 * 
 * COSTO ESTIMADO DE IMPLEMENTACIÓN: $2,500-3,500 MXN
 */

// ============================================
// CONFIGURACIÓN
// ============================================

// CAMBIAR A true CUANDO SE ACTIVE LA FUNCIONALIDAD
const CURRENCY_CONVERSION_ENABLED = false;

// API Key para servicio de tasas de cambio
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || '';

// URL base de la API
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6';

// Moneda base del sistema (los precios en Strapi están en esta moneda)
const BASE_CURRENCY = 'MXN';

// Monedas soportadas con sus símbolos y configuración
export const SUPPORTED_CURRENCIES = {
  MXN: { symbol: '$', name: 'Peso Mexicano', locale: 'es-MX', position: 'before' },
  USD: { symbol: '$', name: 'US Dollar', locale: 'en-US', position: 'before' },
  EUR: { symbol: '€', name: 'Euro', locale: 'de-DE', position: 'after' },
  GBP: { symbol: '£', name: 'British Pound', locale: 'en-GB', position: 'before' },
};

// Mapeo de países a monedas (para detección automática)
export const COUNTRY_CURRENCY_MAP = {
  MX: 'MXN',
  US: 'USD',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  AT: 'EUR', // Austria (Dolomitas)
  GB: 'GBP',
  // Agregar más según necesidad
};

// ============================================
// CACHE DE TASAS
// ============================================

let ratesCache = null;
let ratesCacheExpiry = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

// ============================================
// FUNCIONES PRINCIPALES
// ============================================

/**
 * Obtiene las tasas de cambio actuales
 * @returns {Promise<Object>} Tasas de cambio
 */
export const fetchExchangeRates = async () => {
  if (!CURRENCY_CONVERSION_ENABLED) {
    return null;
  }

  // Verificar cache
  if (ratesCache && ratesCacheExpiry && Date.now() < ratesCacheExpiry) {
    return ratesCache;
  }

  try {
    const response = await fetch(
      `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`
    );
    
    if (!response.ok) {
      throw new Error('Error fetching exchange rates');
    }

    const data = await response.json();
    
    if (data.result === 'success') {
      ratesCache = data.conversion_rates;
      ratesCacheExpiry = Date.now() + CACHE_DURATION;
      return ratesCache;
    }
    
    throw new Error(data.error || 'Unknown error');
  } catch (error) {
    console.error('[Currency] Error fetching rates:', error);
    return null;
  }
};

/**
 * Convierte un precio de la moneda base a otra moneda
 * @param {number} amount - Monto en moneda base (MXN)
 * @param {string} targetCurrency - Moneda destino (USD, EUR, etc.)
 * @param {Object} rates - Tasas de cambio (opcional, usa cache)
 * @returns {number} Monto convertido
 */
export const convertPrice = (amount, targetCurrency, rates = null) => {
  // Si la conversión está desactivada, retornar el monto original
  if (!CURRENCY_CONVERSION_ENABLED) {
    return amount;
  }

  // Si la moneda destino es la base, no hay conversión
  if (targetCurrency === BASE_CURRENCY) {
    return amount;
  }

  // Usar cache o tasas proporcionadas
  const exchangeRates = rates || ratesCache;
  
  if (!exchangeRates || !exchangeRates[targetCurrency]) {
    console.warn(`[Currency] No rate available for ${targetCurrency}`);
    return amount;
  }

  return amount * exchangeRates[targetCurrency];
};

/**
 * Formatea un precio con el símbolo de moneda correcto
 * @param {number} amount - Monto numérico
 * @param {string} currency - Código de moneda (MXN, USD, EUR)
 * @param {object} options - Opciones adicionales
 * @returns {string} Precio formateado (ej: "$25,000 MXN")
 */
export const formatCurrency = (amount, currency = 'MXN', options = {}) => {
  const currencyConfig = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.MXN;
  
  const {
    showCurrencyCode = true,
    decimals = 0,
  } = options;

  // Formatear número con separadores de miles
  const formattedNumber = new Intl.NumberFormat(currencyConfig.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  // Construir string final
  let result = '';
  
  if (currencyConfig.position === 'before') {
    result = `${currencyConfig.symbol}${formattedNumber}`;
  } else {
    result = `${formattedNumber}${currencyConfig.symbol}`;
  }

  if (showCurrencyCode) {
    result = `${result} ${currency}`;
  }

  return result;
};

/**
 * Formatea un precio completo: convierte y formatea
 * @param {number} amountInBaseCurrency - Monto en MXN
 * @param {string} targetCurrency - Moneda destino
 * @returns {string} Precio convertido y formateado
 */
export const formatConvertedPrice = (amountInBaseCurrency, targetCurrency) => {
  const convertedAmount = convertPrice(amountInBaseCurrency, targetCurrency);
  return formatCurrency(convertedAmount, targetCurrency);
};

// ============================================
// DETECCIÓN DE MONEDA
// ============================================

/**
 * Detecta la moneda preferida del usuario basándose en:
 * 1. Preferencia guardada en localStorage
 * 2. País detectado por IP (requiere API de geolocalización)
 * 3. Idioma del navegador
 * 4. Moneda por defecto (MXN)
 * 
 * @returns {string} Código de moneda
 */
export const detectUserCurrency = () => {
  // 1. Verificar preferencia guardada
  const savedCurrency = localStorage.getItem('preferredCurrency');
  if (savedCurrency && SUPPORTED_CURRENCIES[savedCurrency]) {
    return savedCurrency;
  }

  // 2. Detectar por idioma del navegador (simplificado)
  // NOTA: Para detección por IP, se necesita API externa (ipapi.co, etc.)
  const browserLang = navigator.language || navigator.userLanguage || '';
  
  if (browserLang.includes('es-MX')) return 'MXN';
  if (browserLang.includes('en-US')) return 'USD';
  if (browserLang.includes('en-GB')) return 'GBP';
  if (browserLang.includes('de') || browserLang.includes('fr') || browserLang.includes('it')) {
    return 'EUR';
  }

  // 3. Default
  return BASE_CURRENCY;
};

/**
 * Guarda la preferencia de moneda del usuario
 * @param {string} currency - Código de moneda
 */
export const setUserCurrency = (currency) => {
  if (SUPPORTED_CURRENCIES[currency]) {
    localStorage.setItem('preferredCurrency', currency);
  }
};

/**
 * Obtiene la preferencia de moneda guardada
 * @returns {string|null} Código de moneda o null
 */
export const getUserCurrency = () => {
  return localStorage.getItem('preferredCurrency');
};

// ============================================
// HOOK DE REACT (para uso futuro)
// ============================================

/**
 * EJEMPLO DE HOOK - Implementar cuando se active la funcionalidad
 * 
 * import { useState, useEffect } from 'react';
 * 
 * export const useCurrency = () => {
 *   const [currency, setCurrency] = useState(detectUserCurrency());
 *   const [rates, setRates] = useState(null);
 *   const [loading, setLoading] = useState(false);
 * 
 *   useEffect(() => {
 *     if (CURRENCY_CONVERSION_ENABLED) {
 *       setLoading(true);
 *       fetchExchangeRates()
 *         .then(setRates)
 *         .finally(() => setLoading(false));
 *     }
 *   }, []);
 * 
 *   const changeCurrency = (newCurrency) => {
 *     setCurrency(newCurrency);
 *     setUserCurrency(newCurrency);
 *   };
 * 
 *   const convert = (amount) => convertPrice(amount, currency, rates);
 *   const format = (amount) => formatCurrency(convert(amount), currency);
 * 
 *   return { currency, rates, loading, changeCurrency, convert, format };
 * };
 */

export default {
  CURRENCY_CONVERSION_ENABLED,
  SUPPORTED_CURRENCIES,
  fetchExchangeRates,
  convertPrice,
  formatCurrency,
  formatConvertedPrice,
  detectUserCurrency,
  setUserCurrency,
  getUserCurrency,
};
