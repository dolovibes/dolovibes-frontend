import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

// ============================================
// CONFIGURACIÓN DE I18N CON LAZY LOADING
// ============================================
// 
// OPTIMIZACIÓN: Las traducciones se cargan bajo demanda
// Solo se descarga el idioma que el usuario necesita
// Reduce el bundle inicial en ~100KB+
//
// ============================================

const SUPPORTED_LANGUAGES = ['es', 'en', 'it', 'de'];
const DEFAULT_LANGUAGE = 'es';

// ============================================
// OBTENER IDIOMA INICIAL DE FORMA SÍNCRONA
// ============================================
// Esto es CRÍTICO para evitar race conditions con React Query
// Si no obtenemos el idioma inmediatamente, las queries se disparan
// con un locale undefined/cambiante y luego se cancelan

const getInitialLanguage = () => {
  // 1. Primero intentar localStorage (más rápido y confiable)
  try {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
      return saved;
    }
  } catch (e) {
    // localStorage no disponible (SSR, privacidad)
  }

  // 2. Luego intentar navigator.language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLang = navigator.language.substring(0, 2);
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang;
    }
  }

  // 3. Fallback a español
  return DEFAULT_LANGUAGE;
};

// Configuración del detector de idioma
const languageDetectorOptions = {
  // Orden de prioridad para detección
  order: ['localStorage', 'navigator', 'htmlTag'],

  // Caches donde guardar el idioma detectado
  caches: ['localStorage'],

  // Key en localStorage
  lookupLocalStorage: 'preferredLanguage',

  // Detectar solo estos idiomas
  checkWhitelist: true,
};

// Crear instancia de i18n
const i18nInstance = i18n.createInstance();

// Aplicar plugins
i18nInstance
  .use(HttpBackend) // Carga archivos JSON bajo demanda
  .use(LanguageDetector) // Detecta idioma del usuario
  .use(initReactI18next); // Integración con React

// Inicializar
i18nInstance.init({
  // Configuración del backend HTTP para cargar traducciones
  backend: {
    // Ruta a los archivos de traducción
    loadPath: '/locales/{{lng}}/{{ns}}.json',

    // Cache de traducciones en el navegador
    requestOptions: {
      cache: 'default',
    },
  },

  // CRÍTICO: Usar idioma inicial determinado síncronamente
  // Esto evita race conditions con React Query donde las queries
  // se cancelan porque el locale cambia después del mount
  lng: getInitialLanguage(),
  fallbackLng: 'en', // Fallback a inglés - previene mostrar keys crudas si falta una traducción
  supportedLngs: ['es', 'en', 'it', 'de'], // Idiomas soportados

  // Namespaces disponibles
  ns: ['common', 'home', 'about', 'experiences', 'packageInfo', 'quoteForm', 'hikingLevel', 'legal'],
  defaultNS: 'common',

  // No precargar idiomas - solo se carga el idioma detectado/activo
  // Esto reduce las peticiones iniciales de 24 a 8 (solo 1 idioma × 8 namespaces)

  // Configuración del detector
  detection: languageDetectorOptions,

  interpolation: {
    escapeValue: false, // React ya escapa por defecto
  },

  // Configuración de carga
  load: 'languageOnly', // Solo cargar 'es', no 'es-MX'

  // Precargar namespaces para evitar cargas parciales al cambiar idioma
  // Esto asegura que todos los textos estén disponibles de inmediato
  preload: false, // No precargar en el inicio (optimización de carga inicial)
  
  // Configuración de desarrollo
  debug: import.meta.env.DEV && false,

  // Comportamiento de carga
  react: {
    useSuspense: true, // Usar React Suspense para estados de carga
  },
});

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Obtiene el idioma actual
 * @returns {string} 'es', 'en', 'it', 'de'
 */
export const getCurrentLanguage = () => i18nInstance.language;

/**
 * Cambia el idioma manualmente
 * @param {string} lang - 'es', 'en', 'it', 'de'
 */
export const changeLanguage = (lang) => {
  if (['es', 'en', 'it', 'de'].includes(lang)) {
    i18nInstance.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
  }
};

/**
 * Cambia el idioma y precarga todos los namespaces necesarios
 * Útil para asegurar que todas las traducciones estén disponibles
 * antes de navegar a la nueva URL
 * @param {string} lang - 'es', 'en', 'it', 'de'
 * @returns {Promise} Promesa que se resuelve cuando todos los namespaces están cargados
 */
export const changeLanguageComplete = async (lang) => {
  if (!['es', 'en', 'it', 'de'].includes(lang)) {
    throw new Error(`Idioma no soportado: ${lang}`);
  }

  // Lista de todos los namespaces que necesitamos precargar
  const namespaces = ['common', 'home', 'about', 'experiences', 'packageInfo', 'quoteForm', 'hikingLevel', 'legal'];
  
  try {
    // Cambiar idioma - esto automáticamente intentará cargar los namespaces que ya están en uso
    await i18nInstance.changeLanguage(lang);
    
    // Precargar explícitamente todos los namespaces para asegurar que estén disponibles
    // loadNamespaces retorna una promesa que se resuelve cuando todos están cargados
    await i18nInstance.loadNamespaces(namespaces);
    
    // Guardar preferencia
    localStorage.setItem('preferredLanguage', lang);
    
    return true;
  } catch (error) {
    console.error('Error al cambiar idioma:', error);
    throw error;
  }
};

/**
 * Obtiene la preferencia de idioma guardada
 * @returns {string|null}
 */
export const getSavedLanguage = () => {
  return localStorage.getItem('preferredLanguage');
};

/**
 * Mapea país a idioma preferido
 */
export const COUNTRY_LANGUAGE_MAP = {
  // Español
  MX: 'es', ES: 'es', AR: 'es', CO: 'es', PE: 'es', CL: 'es',
  EC: 'es', VE: 'es', UY: 'es', PY: 'es', BO: 'es', CR: 'es',
  PA: 'es', GT: 'es', HN: 'es', SV: 'es', NI: 'es', DO: 'es',
  CU: 'es', PR: 'es',
  // Inglés
  US: 'en', GB: 'en', CA: 'en', AU: 'en', NZ: 'en', IE: 'en',
  // Italiano
  IT: 'it', SM: 'it',
  // Alemán
  DE: 'de', AT: 'de', CH: 'de', LI: 'de',
};

/**
 * Detecta el idioma óptimo basado en código de país
 * @param {string} countryCode - Código ISO del país
 * @returns {string} Idioma ('es', 'en', 'it', 'de')
 */
export const detectLanguageByCountry = (countryCode) => {
  return COUNTRY_LANGUAGE_MAP[countryCode?.toUpperCase()] || 'en';
};

export default i18nInstance;
