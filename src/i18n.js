import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traducciones en español
import commonES from './locales/es/common.json';
import homeES from './locales/es/home.json';
import aboutES from './locales/es/about.json';
import experiencesES from './locales/es/experiences.json';
import packageInfoES from './locales/es/packageInfo.json';
import quoteFormES from './locales/es/quoteForm.json';
import hikingLevelES from './locales/es/hikingLevel.json';
import legalES from './locales/es/legal.json';

// Importar traducciones en inglés
import commonEN from './locales/en/common.json';
import homeEN from './locales/en/home.json';
import aboutEN from './locales/en/about.json';
import experiencesEN from './locales/en/experiences.json';
import packageInfoEN from './locales/en/packageInfo.json';
import quoteFormEN from './locales/en/quoteForm.json';
import hikingLevelEN from './locales/en/hikingLevel.json';
import legalEN from './locales/en/legal.json';

// Importar traducciones en italiano
import commonIT from './locales/it/common.json';
import homeIT from './locales/it/home.json';
import aboutIT from './locales/it/about.json';
import experiencesIT from './locales/it/experiences.json';
import packageInfoIT from './locales/it/packageInfo.json';
import quoteFormIT from './locales/it/quoteForm.json';
import hikingLevelIT from './locales/it/hikingLevel.json';
import legalIT from './locales/it/legal.json';

// Importar traducciones en portugués
import commonPT from './locales/pt/common.json';
import homePT from './locales/pt/home.json';
import aboutPT from './locales/pt/about.json';
import experiencesPT from './locales/pt/experiences.json';
import packageInfoPT from './locales/pt/packageInfo.json';
import quoteFormPT from './locales/pt/quoteForm.json';
import hikingLevelPT from './locales/pt/hikingLevel.json';
import legalPT from './locales/pt/legal.json';

// Importar traducciones en francés
import commonFR from './locales/fr/common.json';
import homeFR from './locales/fr/home.json';
import aboutFR from './locales/fr/about.json';
import experiencesFR from './locales/fr/experiences.json';
import packageInfoFR from './locales/fr/packageInfo.json';
import quoteFormFR from './locales/fr/quoteForm.json';
import hikingLevelFR from './locales/fr/hikingLevel.json';
import legalFR from './locales/fr/legal.json';

// Importar traducciones en alemán
import commonDE from './locales/de/common.json';
import homeDE from './locales/de/home.json';
import aboutDE from './locales/de/about.json';
import experiencesDE from './locales/de/experiences.json';
import packageInfoDE from './locales/de/packageInfo.json';
import quoteFormDE from './locales/de/quoteForm.json';
import hikingLevelDE from './locales/de/hikingLevel.json';
import legalDE from './locales/de/legal.json';

// ============================================
// CONFIGURACIÓN DE AUTO-DETECCIÓN DE IDIOMA
// ============================================
// ESTADO: ACTIVADO ✅
// 
// El idioma se detecta automáticamente:
// 1. Primero busca preferencia guardada en localStorage
// 2. Después detecta idioma del navegador
// 3. Como fallback usa español (es)
//
// IMPLEMENTADO: Junio 2025
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
      packageInfo: packageInfoES,
      quoteForm: quoteFormES,
      hikingLevel: hikingLevelES,
      legal: legalES,
    },
    en: {
      common: commonEN,
      home: homeEN,
      about: aboutEN,
      experiences: experiencesEN,
      packageInfo: packageInfoEN,
      quoteForm: quoteFormEN,
      hikingLevel: hikingLevelEN,
      legal: legalEN,
    },
    it: {
      common: commonIT,
      home: homeIT,
      about: aboutIT,
      experiences: experiencesIT,
      packageInfo: packageInfoIT,
      quoteForm: quoteFormIT,
      hikingLevel: hikingLevelIT,
      legal: legalIT,
    },
    pt: {
      common: commonPT,
      home: homePT,
      about: aboutPT,
      experiences: experiencesPT,
      packageInfo: packageInfoPT,
      quoteForm: quoteFormPT,
      hikingLevel: hikingLevelPT,
      legal: legalPT,
    },
    fr: {
      common: commonFR,
      home: homeFR,
      about: aboutFR,
      experiences: experiencesFR,
      packageInfo: packageInfoFR,
      quoteForm: quoteFormFR,
      hikingLevel: hikingLevelFR,
      legal: legalFR,
    },
    de: {
      common: commonDE,
      home: homeDE,
      about: aboutDE,
      experiences: experiencesDE,
      packageInfo: packageInfoDE,
      quoteForm: quoteFormDE,
      hikingLevel: hikingLevelDE,
      legal: legalDE,
    }
  },
  // Si la detección está deshabilitada, usar español por defecto
  lng: LANGUAGE_DETECTION_ENABLED ? undefined : 'es',
  fallbackLng: 'en', // Idioma de respaldo (inglés tiene contenido más completo)
  supportedLngs: ['es', 'en', 'it', 'pt', 'fr', 'de'], // Idiomas soportados
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
 * @param {string} lang - 'es', 'en', 'it', 'pt', 'fr', 'de'
 */
export const changeLanguage = (lang) => {
  if (['es', 'en', 'it', 'pt', 'fr', 'de'].includes(lang)) {
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
  // Español
  MX: 'es',
  ES: 'es',
  AR: 'es',
  CO: 'es',
  PE: 'es',
  CL: 'es',
  EC: 'es',
  VE: 'es',
  UY: 'es',
  PY: 'es',
  BO: 'es',
  CR: 'es',
  PA: 'es',
  GT: 'es',
  HN: 'es',
  SV: 'es',
  NI: 'es',
  DO: 'es',
  CU: 'es',
  PR: 'es',
  // Inglés
  US: 'en',
  GB: 'en',
  CA: 'en',
  AU: 'en',
  NZ: 'en',
  IE: 'en',
  // Italiano
  IT: 'it',
  SM: 'it',
  // Portugués
  BR: 'pt',
  PT: 'pt',
  // Francés
  FR: 'fr',
  BE: 'fr',
  CH: 'fr', // Suiza tiene varios idiomas, usamos francés
  LU: 'fr',
  MC: 'fr',
  // Alemán
  DE: 'de',
  AT: 'de',
  LI: 'de',
};

/**
 * Detecta el idioma óptimo basado en código de país
 * @param {string} countryCode - Código ISO del país (MX, US, etc.)
 * @returns {string} Idioma ('es', 'en', 'it', 'pt', 'fr', 'de')
 */
export const detectLanguageByCountry = (countryCode) => {
  return COUNTRY_LANGUAGE_MAP[countryCode?.toUpperCase()] || 'en';
};

export default i18nInstance;
