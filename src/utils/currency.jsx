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
 * - Soporte para múltiples monedas (EUR, USD, MXN)
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
// Optimización: 3 monedas principales (Europa + Internacional + México)
// NOTA: countryCode se usa para cargar banderas SVG (los emojis no funcionan en Windows Chrome)
export const SUPPORTED_CURRENCIES = {
  // Mercado europeo - Italia/Dolomitas (40% turismo) + Alemania (35%) + España
  EUR: {
    symbol: '€',
    name: 'Euro',
    nameShort: 'EUR',
    locale: 'es-ES',
    position: 'after',
    countryCode: 'eu', // Unión Europea
    decimals: 2
  },
  // Internacional - Norteamérica + referencia global
  USD: {
    symbol: '$',
    name: 'US Dollar',
    nameShort: 'USD',
    locale: 'en-US',
    position: 'before',
    countryCode: 'us', // Estados Unidos
    decimals: 2
  },
  // Mercado mexicano
  MXN: {
    symbol: '$',
    name: 'Peso Mexicano',
    nameShort: 'MXN',
    locale: 'es-MX',
    position: 'before',
    countryCode: 'mx', // México
    decimals: 0
  },
};

// Mapeo de países a monedas (ISO 3166-1 alpha-2)
// Optimizado para 3 monedas: EUR, USD, MXN
export const COUNTRY_CURRENCY_MAP = {
  // México
  MX: 'MXN',
  // Norteamérica + Internacional
  US: 'USD',
  CA: 'USD',
  GB: 'USD', // Reino Unido -> USD como alternativa
  AU: 'USD', // Australia -> USD
  NZ: 'USD', // Nueva Zelanda -> USD
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
  // Suiza y Liechtenstein -> EUR (CHF eliminado)
  CH: 'EUR',
  LI: 'EUR',
  // Default para resto del mundo
  DEFAULT: 'EUR', // EUR como default para mercado europeo
};

// ============================================
// CACHE Y ESTADO
// ============================================

let ratesCache = null;
let ratesCacheExpiry = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 horas (optimizado)

const GEO_CACHE_KEY = 'dolovibes_geo_data';
const GEO_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 días (optimizado)

const RATES_CACHE_KEY = 'dolovibes_rates';
const RATES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 horas en localStorage

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

  // 3. Fallback por idioma del navegador (simplificado a 4 monedas)
  const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();

  // México
  if (browserLang.startsWith('es-mx')) return 'MXN';
  // España y otros hispanohablantes -> EUR
  if (browserLang.startsWith('es')) return 'EUR';
  // Estados Unidos y Canadá
  if (browserLang.startsWith('en-us') || browserLang.startsWith('en-ca')) return 'USD';
  // Reino Unido, Australia, Nueva Zelanda -> USD
  if (browserLang.startsWith('en')) return 'USD';
  // Alemán, Francés (incluye Suiza), Italiano -> EUR
  if (browserLang.startsWith('de') || browserLang.startsWith('fr') || browserLang.startsWith('it')) return 'EUR';

  // 4. Default para mercado europeo (base del negocio)
  return 'EUR';
};

// ============================================
// TASAS DE CAMBIO
// ============================================

/**
 * Tasas de fallback actualizadas
 * Se usan cuando la API no está disponible
 * Última actualización: 25 enero 2026
 * Fuente: exchange-rates.org, ECB, Federal Reserve
 *
 * IMPORTANTE: Actualizar estas tasas semanalmente para mantener precisión
 * Las tasas reales pueden variar ±2-3% dependiendo del mercado
 */
const getFallbackRates = () => {
  return {
    EUR: 1,        // Moneda base
    USD: 1.04,     // 1 EUR ≈ 1.04 USD (promedio ene 2026: 1.03-1.05)
    MXN: 20.85,    // 1 EUR ≈ 20.85 MXN (promedio ene 2026: 20.5-21.0)
  };
};

/**
 * Carga las tasas desde localStorage al iniciar
 * Mejora el tiempo de carga inicial evitando esperar por la API
 */
const loadRatesFromStorage = () => {
  try {
    const cached = localStorage.getItem(RATES_CACHE_KEY);
    if (cached) {
      const { rates, expiry } = JSON.parse(cached);
      // Usar tasas de localStorage si no han expirado hace más de 24 horas
      if (Date.now() < expiry) {
        ratesCache = rates;
        ratesCacheExpiry = expiry;
        return true;
      }
    }
  } catch (e) {
    console.warn('[Currency] Could not load rates from storage');
  }
  return false;
};

/**
 * Obtiene las tasas de cambio actuales
 * Estrategia optimizada en capas:
 * 1. Cache en memoria (6 horas)
 * 2. localStorage (24 horas)
 * 3. API externa (si hay key)
 * 4. Tasas de fallback hardcoded
 *
 * @returns {Promise<Object>} Tasas de cambio
 */
export const fetchExchangeRates = async () => {
  // Verificar cache en memoria primero
  if (ratesCache && ratesCacheExpiry && Date.now() < ratesCacheExpiry) {
    return ratesCache;
  }

  // Intentar cargar desde localStorage (más rápido que API)
  if (loadRatesFromStorage() && ratesCache) {
    return ratesCache;
  }

  // Si no hay API key, usar tasas de fallback directamente
  if (!CURRENCY_CONVERSION_ENABLED || !EXCHANGE_RATE_API_KEY) {
    console.info('[Currency] Using fallback rates (no API key configured)');
    return getFallbackRates();
  }

  // Intentar obtener desde API
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
      // Filtrar solo las monedas que soportamos para reducir tamaño del cache
      const supportedCurrencyCodes = Object.keys(SUPPORTED_CURRENCIES);
      const filteredRates = {};
      supportedCurrencyCodes.forEach(code => {
        filteredRates[code] = data.conversion_rates[code] || getFallbackRates()[code];
      });

      ratesCache = filteredRates;
      ratesCacheExpiry = Date.now() + CACHE_DURATION;

      // Guardar en localStorage con expiración de 24 horas
      try {
        localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({
          rates: ratesCache,
          expiry: Date.now() + RATES_CACHE_DURATION,
          updated: new Date().toISOString(),
        }));
      } catch (e) {
        console.warn('[Currency] Could not save to localStorage');
      }

      return ratesCache;
    }

    throw new Error(data['error-type'] || 'Unknown error');
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.warn('[Currency] Exchange rate fetch failed:', error.message);
    }

    // Intentar recuperar del localStorage incluso si expiró
    try {
      const cached = localStorage.getItem(RATES_CACHE_KEY);
      if (cached) {
        const { rates } = JSON.parse(cached);
        console.info('[Currency] Using expired localStorage rates as fallback');
        ratesCache = rates;
        return rates;
      }
    } catch (e) { }

    // Último recurso: tasas de fallback hardcoded
    console.info('[Currency] Using hardcoded fallback rates');
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
