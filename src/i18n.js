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

const LANGUAGE_DETECTION_ENABLED = true;

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
  
  // Si la detección está deshabilitada, usar español por defecto
  lng: LANGUAGE_DETECTION_ENABLED ? undefined : 'es',
  fallbackLng: 'en', // Idioma de respaldo
  supportedLngs: ['es', 'en', 'it', 'de'], // Idiomas soportados
  
  // Namespaces disponibles
  ns: ['common', 'home', 'about', 'experiences', 'packageInfo', 'quoteForm', 'hikingLevel', 'legal'],
  defaultNS: 'common',
  
  // Precargar namespaces críticos para el primer render
  preload: ['es', 'en'], // Precargar español e inglés (los más comunes)
  
  // Configuración del detector
  detection: languageDetectorOptions,
  
  interpolation: {
    escapeValue: false, // React ya escapa por defecto
  },
  
  // Configuración de carga
  load: 'languageOnly', // Solo cargar 'es', no 'es-MX'
  
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
