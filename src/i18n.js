import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones en español
import commonES from './locales/es/common.json';
import homeES from './locales/es/home.json';
import aboutES from './locales/es/about.json';
import experiencesES from './locales/es/experiences.json';

// Importar traducciones en inglés
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import aboutEN from './locales/en/about.json';
import experiencesEN from './locales/en/experiences.json';

// ============================================
// CONFIGURACIÓN DE AUTO-DETECCIÓN DE IDIOMA
// ============================================
// ESTADO: PREPARADO pero DESACTIVADO
// 
// Para activar la detección automática:
// 1. Cambiar LANGUAGE_DETECTION_ENABLED a true
// 2. El idioma se detectará automáticamente del navegador
// 3. Se guardará la preferencia del usuario en localStorage
//
// COSTO ESTIMADO DE IMPLEMENTACIÓN: $1,500-2,500 MXN
// ============================================

const LANGUAGE_DETECTION_ENABLED = false;

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
i18nInstance.use(initReactI18next);

// Solo usar detector si está habilitado
if (LANGUAGE_DETECTION_ENABLED) {
  i18nInstance.use(LanguageDetector);
}

// Inicializar
i18nInstance.init({
  resources: {
    es: {
      common: commonES,
      home: homeES,
      about: aboutES,
      experiences: experiencesES,
    },
    en: {
      common: commonEN,
      home: homeEN,
      about: aboutEN,
      experiences: experiencesEN,
    }
  },
  // Si la detección está deshabilitada, usar español por defecto
  lng: LANGUAGE_DETECTION_ENABLED ? undefined : 'es',
  fallbackLng: 'es', // Idioma de respaldo
  supportedLngs: ['es', 'en'], // Idiomas soportados
  defaultNS: 'common', // Namespace por defecto
  
  // Configuración del detector (solo aplica si está habilitado)
  detection: LANGUAGE_DETECTION_ENABLED ? languageDetectorOptions : undefined,
  
  interpolation: {
    escapeValue: false, // React ya escapa por defecto
  },
  
  // Configuración de desarrollo
  debug: import.meta.env.DEV && false, // Cambiar a true para debug
});

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Obtiene el idioma actual
 * @returns {string} 'es' o 'en'
 */
export const getCurrentLanguage = () => i18nInstance.language;

/**
 * Cambia el idioma manualmente
 * @param {string} lang - 'es' o 'en'
 */
export const changeLanguage = (lang) => {
  if (['es', 'en'].includes(lang)) {
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
 * Útil cuando se detecta el país por IP
 */
export const COUNTRY_LANGUAGE_MAP = {
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CO: 'es',
  PE: 'es',
  CL: 'es',
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  // Italia y países de los Dolomitas -> español por defecto del negocio
  IT: 'es',
  AT: 'es',
  DE: 'en',
  FR: 'en',
};

/**
 * Detecta el idioma óptimo basado en código de país
 * @param {string} countryCode - Código ISO del país (MX, US, etc.)
 * @returns {string} Idioma ('es' o 'en')
 */
export const detectLanguageByCountry = (countryCode) => {
  return COUNTRY_LANGUAGE_MAP[countryCode?.toUpperCase()] || 'es';
};

export default i18nInstance;

