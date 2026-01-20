/**
 * Utilidades de Conversión de Moneda
 * 
 * ESTADO: ACTIVADO
 * 
 * IMPORTANTE: Los precios se capturan en EUROS (EUR) en el CMS
 * 
 * Funcionalidades:
 * - Moneda base: EUR (todos los precios en Strapi se almacenan en euros)
 * - Detección automática de moneda por ubicación del usuario
 * - Conversión de precios en tiempo real con cache
 * - Soporte para múltiples monedas (EUR, USD, MXN, CHF, etc.)
 * - Persistencia de preferencias en localStorage
 * - Fallbacks para navegadores antiguos y errores de red
 */

import { useState, useEffect, useCallback, createContext, useContext } from 'react';

// ============================================
// CONFIGURACIÓN
// ============================================

// Funcionalidad habilitada
export const CURRENCY_CONVERSION_ENABLED = true;

// API Key para servicio de tasas de cambio (gratuito: 1500 requests/mes)
// Registro en: https://exchangerate-api.com/
const EXCHANGE_RATE_API_KEY = import.meta.env.VITE_EXCHANGE_RATE_API_KEY || '';

// API para detección de ubicación (gratuito, sin key)
const GEO_API_URL = 'https://ipapi.co/json/';

// URL base de la API de tasas
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6';

// Moneda base del sistema (precios en Strapi/datos estáticos)
// IMPORTANTE: Los precios se capturan en EUR en el CMS
export const BASE_CURRENCY = 'EUR';

// Monedas soportadas con configuración completa
// Optimización: 4 monedas principales (México + Europa + Internacional + Suiza)
export const SUPPORTED_CURRENCIES = {
  // Moneda base - Mercado mexicano
  MXN: {
    symbol: '$',
    name: 'Peso Mexicano',
    nameShort: 'MXN',
    locale: 'es-MX',
    position: 'before',
    flag: '🇲🇽',
    decimals: 0
  },
  // Mercado europeo - Italia/Dolomitas (40% turismo) + Alemania (35%) + España
  EUR: {
    symbol: '€',
    name: 'Euro',
    nameShort: 'EUR',
    locale: 'es-ES',
    position: 'after',
    flag: '🇪🇺',
    decimals: 2
  },
  // Internacional - Norteamérica + referencia global
  USD: {
    symbol: '$',
    name: 'US Dollar',
    nameShort: 'USD',
    locale: 'en-US',
    position: 'before',
    flag: '🇺🇸',
    decimals: 2
  },
  // Turismo suizo en Dolomitas (8% mercado)
  CHF: {
    symbol: 'CHF',
    name: 'Swiss Franc',
    nameShort: 'CHF',
    locale: 'de-CH',
    position: 'before',
    flag: '🇨🇭',
    decimals: 2
  },
  AUD: {
    symbol: 'A$',
    name: 'Australian Dollar',
    nameShort: 'AUD',
    locale: 'en-AU',
    position: 'before',
    flag: '🇦🇺',
    decimals: 2
  },
  NZD: {
    symbol: 'NZ$',
    name: 'New Zealand Dollar',
    nameShort: 'NZD',
    locale: 'en-NZ',
    position: 'before',
    flag: '🇳🇿',
    decimals: 2
  },
};

// Mapeo de países a monedas (ISO 3166-1 alpha-2)
// Simplificado para 4 monedas: MXN, EUR, USD, CHF
export const COUNTRY_CURRENCY_MAP = {
  // México
  MX: 'MXN',
  // Norteamérica + Internacional
  US: 'USD',
  CA: 'USD',
  // Europa - Zona Euro (Italia, Alemania, España, etc.)
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
  ES: 'EUR',
  AT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  PT: 'EUR',
  IE: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  LU: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  EE: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  MT: 'EUR',
  CY: 'EUR',
  // Suiza y Liechtenstein
  CH: 'CHF',
  LI: 'CHF',
  // Default para resto del mundo
  DEFAULT: 'USD',
};

// ============================================
// CACHE Y ESTADO
// ============================================

let ratesCache = null;
let ratesCacheExpiry = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hora

const GEO_CACHE_KEY = 'dolovibes_geo_data';
const GEO_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas

// ============================================
// DETECCIÓN DE UBICACIÓN
// ============================================

/**
 * Detecta la ubicación del usuario por IP
 * Usa cache para evitar requests innecesarios
 * @returns {Promise<{country: string, currency: string} | null>}
 */
export const detectUserLocation = async () => {
  // Verificar cache en localStorage
  try {
    const cached = localStorage.getItem(GEO_CACHE_KEY);
    if (cached) {
      const { data, expiry } = JSON.parse(cached);
      if (Date.now() < expiry) {
        return data;
      }
    }
  } catch (e) {
    // localStorage no disponible o corrupto
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(GEO_API_URL, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Geo API error');
    }

    const data = await response.json();

    const result = {
      country: data.country_code || null,
      countryName: data.country_name || null,
      city: data.city || null,
      timezone: data.timezone || null,
    };

    // Guardar en cache
    try {
      localStorage.setItem(GEO_CACHE_KEY, JSON.stringify({
        data: result,
        expiry: Date.now() + GEO_CACHE_DURATION,
      }));
    } catch (e) {
      // localStorage lleno o no disponible
    }

    return result;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.warn('[Currency] Geo detection failed:', error.message);
    }
    return null;
  }
};

/**
 * Detecta la moneda óptima para el usuario
 * Prioridad: localStorage > ubicación > navegador > default
 * @returns {Promise<string>} Código de moneda
 */
export const detectUserCurrency = async () => {
  // 1. Preferencia guardada por el usuario
  const saved = getUserCurrency();
  if (saved && SUPPORTED_CURRENCIES[saved]) {
    return saved;
  }

  // 2. Detección por ubicación (IP)
  if (CURRENCY_CONVERSION_ENABLED) {
    const location = await detectUserLocation();
    if (location?.country) {
      const currency = COUNTRY_CURRENCY_MAP[location.country] || COUNTRY_CURRENCY_MAP.DEFAULT;
      return currency;
    }
  }

  // 3. Fallback por idioma del navegador
  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();

  // México
  if (browserLang.startsWith('es-mx')) return 'MXN';
  // Argentina
  if (browserLang.startsWith('es-ar')) return 'ARS';
  // Colombia
  if (browserLang.startsWith('es-co')) return 'COP';
  // Chile
  if (browserLang.startsWith('es-cl')) return 'CLP';
  // Perú
  if (browserLang.startsWith('es-pe')) return 'PEN';
  // España y otros hispanohablantes
  if (browserLang.startsWith('es')) return 'EUR';
  // Brasil
  if (browserLang.startsWith('pt-br')) return 'BRL';
  // Portugal
  if (browserLang.startsWith('pt')) return 'EUR';
  // Estados Unidos
  if (browserLang.startsWith('en-us')) return 'USD';
  // Canadá inglés
  if (browserLang.startsWith('en-ca')) return 'CAD';
  // Reino Unido
  if (browserLang.startsWith('en-gb')) return 'GBP';
  // Australia
  if (browserLang.startsWith('en-au')) return 'AUD';
  // Nueva Zelanda
  if (browserLang.startsWith('en-nz')) return 'NZD';
  // Otros en inglés
  if (browserLang.startsWith('en')) return 'USD';
  // Alemán de Suiza
  if (browserLang.startsWith('de-ch')) return 'CHF';
  // Alemán
  if (browserLang.startsWith('de')) return 'EUR';
  // Francés de Suiza
  if (browserLang.startsWith('fr-ch')) return 'CHF';
  // Francés
  if (browserLang.startsWith('fr')) return 'EUR';
  // Italiano
  if (browserLang.startsWith('it')) return 'EUR';
  // Japonés
  if (browserLang.startsWith('ja')) return 'JPY';

  // 4. Default
  return 'USD';
};

// ============================================
// TASAS DE CAMBIO
// ============================================

/**
 * Tasas de fallback aproximadas (actualizadas manualmente)
 * Se usan cuando la API no está disponible
 * Tasas aproximadas a enero 2026 (EUR como base, 1 EUR = X moneda)
 */
const getFallbackRates = () => {
  return {
    EUR: 1,        // Moneda base
    // Norteamérica
    USD: 1.09,     // 1 EUR ≈ 1.09 USD
    CAD: 1.49,     // 1 EUR ≈ 1.49 CAD
    MXN: 18.8,     // 1 EUR ≈ 18.8 MXN
    // Europa
    GBP: 0.85,     // 1 EUR ≈ 0.85 GBP
    CHF: 0.96,     // 1 EUR ≈ 0.96 CHF
    // Latinoamérica
    ARS: 998,      // 1 EUR ≈ 998 ARS
    COP: 4320,     // 1 EUR ≈ 4320 COP
    CLP: 978,      // 1 EUR ≈ 978 CLP
    BRL: 5.45,     // 1 EUR ≈ 5.45 BRL
    PEN: 4.13,     // 1 EUR ≈ 4.13 PEN
    // Asia/Oceanía
    JPY: 164,      // 1 EUR ≈ 164 JPY
    AUD: 1.68,     // 1 EUR ≈ 1.68 AUD
    NZD: 1.83,     // 1 EUR ≈ 1.83 NZD
  };
};

/**
 * Obtiene las tasas de cambio actuales
 * Usa cache para minimizar requests a la API
 * @returns {Promise<Object | null>} Tasas de cambio o null si falla
 */
export const fetchExchangeRates = async () => {
  if (!CURRENCY_CONVERSION_ENABLED || !EXCHANGE_RATE_API_KEY) {
    // Si no hay API key, usar tasas aproximadas
    return getFallbackRates();
  }

  // Verificar cache
  if (ratesCache && ratesCacheExpiry && Date.now() < ratesCacheExpiry) {
    return ratesCache;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(
      `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/latest/${BASE_CURRENCY}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (data.result === 'success') {
      ratesCache = data.conversion_rates;
      ratesCacheExpiry = Date.now() + CACHE_DURATION;

      // Guardar en localStorage como backup
      try {
        localStorage.setItem('dolovibes_rates', JSON.stringify({
          rates: ratesCache,
          expiry: ratesCacheExpiry,
        }));
      } catch (e) { }

      return ratesCache;
    }

    throw new Error(data['error-type'] || 'Unknown error');
  } catch (error) {
    console.warn('[Currency] Exchange rate fetch failed:', error.message);

    // Intentar recuperar del localStorage
    try {
      const cached = localStorage.getItem('dolovibes_rates');
      if (cached) {
        const { rates } = JSON.parse(cached);
        ratesCache = rates;
        return rates;
      }
    } catch (e) { }

    // Usar tasas de fallback
    return getFallbackRates();
  }
};

// ============================================
// CONVERSIÓN Y FORMATEO
// ============================================

/**
 * Convierte un precio desde la moneda base (EUR) a otra moneda
 * @param {number} amount - Monto en EUR
 * @param {string} targetCurrency - Moneda destino
 * @param {Object} rates - Tasas (opcional, usa cache)
 * @returns {number} Monto convertido
 */
export const convertPrice = (amount, targetCurrency, rates = null) => {
  if (!amount || isNaN(amount)) return 0;

  // Si la moneda es la base, no convertir
  if (targetCurrency === BASE_CURRENCY) {
    return amount;
  }

  const exchangeRates = rates || ratesCache || getFallbackRates();
  const rate = exchangeRates[targetCurrency];

  if (!rate) {
    console.warn(`[Currency] No rate for ${targetCurrency}, using original`);
    return amount;
  }

  return amount * rate;
};

/**
 * Convierte un precio desde EUR a otra moneda
 * Útil para precios almacenados en EUR en Strapi
 * NOTA: Esta función ahora es equivalente a convertPrice ya que EUR es la moneda base
 * @param {number} amountInEUR - Monto en EUR
 * @param {string} targetCurrency - Moneda destino
 * @param {Object} rates - Tasas (opcional, usa cache)
 * @returns {number} Monto convertido
 */
export const convertFromEUR = (amountInEUR, targetCurrency, rates = null) => {
  // Ahora que EUR es la moneda base, esta función es simplemente un alias de convertPrice
  return convertPrice(amountInEUR, targetCurrency, rates);
};

/**
 * Formatea un precio con el símbolo de moneda correcto
 * Compatible con navegadores antiguos usando fallbacks
 * @param {number} amount - Monto numérico
 * @param {string} currency - Código de moneda
 * @param {object} options - Opciones adicionales
 * @returns {string} Precio formateado
 */
export const formatCurrency = (amount, currency = 'EUR', options = {}) => {
  const config = SUPPORTED_CURRENCIES[currency] || SUPPORTED_CURRENCIES.EUR;

  const {
    showCurrencyCode = true,
    showSymbol = true,
    forceDecimals = null,
  } = options;

  const decimals = forceDecimals !== null ? forceDecimals : config.decimals;

  // Formatear número
  let formattedNumber;

  try {
    // Intl.NumberFormat - navegadores modernos
    formattedNumber = new Intl.NumberFormat(config.locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  } catch (e) {
    // Fallback para navegadores muy antiguos
    formattedNumber = amount.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // Construir resultado
  let result = '';

  if (showSymbol) {
    if (config.position === 'before') {
      result = `${config.symbol}${formattedNumber}`;
    } else {
      result = `${formattedNumber} ${config.symbol}`;
    }
  } else {
    result = formattedNumber;
  }

  if (showCurrencyCode) {
    result = `${result} ${currency}`;
  }

  return result;
};

/**
 * Convierte y formatea un precio en un solo paso
 * @param {number} amountInEUR - Monto en euros
 * @param {string} targetCurrency - Moneda destino
 * @param {Object} rates - Tasas (opcional)
 * @returns {string} Precio convertido y formateado
 */
export const formatConvertedPrice = (amountInEUR, targetCurrency, rates = null) => {
  const converted = convertPrice(amountInEUR, targetCurrency, rates);
  return formatCurrency(converted, targetCurrency);
};

// ============================================
// PERSISTENCIA
// ============================================

const CURRENCY_STORAGE_KEY = 'dolovibes_preferred_currency';

/**
 * Guarda la preferencia de moneda del usuario
 * @param {string} currency - Código de moneda
 */
export const setUserCurrency = (currency) => {
  if (SUPPORTED_CURRENCIES[currency]) {
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
    } catch (e) {
      // localStorage no disponible
    }
  }
};

/**
 * Obtiene la preferencia de moneda guardada
 * @returns {string | null}
 */
export const getUserCurrency = () => {
  try {
    return localStorage.getItem(CURRENCY_STORAGE_KEY);
  } catch (e) {
    return null;
  }
};

/**
 * Limpia la preferencia de moneda (vuelve a auto-detección)
 */
export const clearUserCurrency = () => {
  try {
    localStorage.removeItem(CURRENCY_STORAGE_KEY);
  } catch (e) { }
};

// ============================================
// HOOK DE REACT
// ============================================

/**
 * Hook para gestionar la moneda del usuario
 * Proporciona: moneda actual, función para cambiar, estado de carga
 */
export const useCurrency = () => {
  const [currency, setCurrencyState] = useState(getUserCurrency() || BASE_CURRENCY);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicialización: detectar moneda y cargar tasas
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);

        // Cargar tasas de cambio
        const fetchedRates = await fetchExchangeRates();
        if (mounted) setRates(fetchedRates);

        // Detectar moneda si no hay preferencia guardada
        if (!getUserCurrency()) {
          const detected = await detectUserCurrency();
          if (mounted && detected) {
            setCurrencyState(detected);
          }
        }
      } catch (e) {
        if (mounted) setError(e.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();
    return () => { mounted = false; };
  }, []);

  // Cambiar moneda
  const setCurrency = useCallback((newCurrency) => {
    if (SUPPORTED_CURRENCIES[newCurrency]) {
      setCurrencyState(newCurrency);
      setUserCurrency(newCurrency);
    }
  }, []);

  // Convertir precio (desde EUR)
  const convert = useCallback((amountInEUR) => {
    return convertPrice(amountInEUR, currency, rates);
  }, [currency, rates]);

  // Formatear precio
  const format = useCallback((amount, options = {}) => {
    return formatCurrency(amount, currency, options);
  }, [currency]);

  // Convertir y formatear desde EUR (precios de Strapi)
  const formatPrice = useCallback((amountInEUR, options = {}) => {
    const converted = convertPrice(amountInEUR, currency, rates);
    return formatCurrency(converted, currency, options);
  }, [currency, rates]);

  // Alias para compatibilidad - ahora formatPrice y formatPriceFromEUR son equivalentes
  const formatPriceFromEUR = useCallback((amountInEUR, options = {}) => {
    const converted = convertPrice(amountInEUR, currency, rates);
    return formatCurrency(converted, currency, options);
  }, [currency, rates]);

  return {
    currency,
    setCurrency,
    rates,
    loading,
    error,
    convert,
    format,
    formatPrice,
    formatPriceFromEUR,
    currencies: SUPPORTED_CURRENCIES,
  };
};

// ============================================
// CONTEXT (para uso global)
// ============================================

const CurrencyContext = createContext(null);

/**
 * Provider para contexto de moneda
 * Envuelve la app para compartir estado de moneda globalmente
 */
export const CurrencyProvider = ({ children }) => {
  const currencyState = useCurrency();

  return (
    <CurrencyContext.Provider value={currencyState}>
      {children}
    </CurrencyContext.Provider>
  );
};

/**
 * Hook para consumir el contexto de moneda
 * Debe usarse dentro de CurrencyProvider
 */
export const useCurrencyContext = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrencyContext must be used within CurrencyProvider');
  }
  return context;
};

// ============================================
// EXPORTS
// ============================================

/**
 * Extrae el valor numérico de un precio en formato string
 * Ej: "€25,000" -> 25000, "$15,000 USD" -> 15000
 * @param {string|number} priceString - Precio como string o número
 * @returns {number} Valor numérico del precio
 */
export const parsePrice = (priceString) => {
  if (typeof priceString === 'number') {
    return priceString;
  }
  if (!priceString || typeof priceString !== 'string') {
    return 0;
  }
  // Eliminar todo excepto números, puntos y comas
  const cleaned = priceString.replace(/[^0-9.,]/g, '');
  // Manejar formatos con coma como separador de miles
  // "25,000" -> 25000, "25.000" -> 25000
  const normalized = cleaned.replace(/[.,]/g, '');
  return parseInt(normalized, 10) || 0;
};

export default {
  CURRENCY_CONVERSION_ENABLED,
  SUPPORTED_CURRENCIES,
  BASE_CURRENCY,
  detectUserLocation,
  detectUserCurrency,
  fetchExchangeRates,
  convertPrice,
  formatCurrency,
  formatConvertedPrice,
  setUserCurrency,
  getUserCurrency,
  clearUserCurrency,
  useCurrency,
  CurrencyProvider,
  useCurrencyContext,
  parsePrice,
};
