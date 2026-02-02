/**
 * Utilidades para rutas localizadas por idioma
 * 
 * ARQUITECTURA SEO:
 * ─────────────────────────────────────────────────────────────
 * URLs con prefijo de idioma para mejor SEO internacional:
 * 
 *   /es/experiencias/senderismo
 *   /en/experiences/hiking-experiences
 *   /it/esperienze/trekking
 *   /de/erlebnisse/wandern
 * 
 * Beneficios:
 * - Google indexa cada idioma como página separada
 * - Usuarios ven URLs en su idioma
 * - Posibilidad de usar hreflang tags
 * - Mejor experiencia de usuario
 */

// Idiomas soportados
export const SUPPORTED_LOCALES = ['es', 'en', 'it', 'de'];
export const DEFAULT_LOCALE = 'es';

/**
 * Paths de rutas por idioma
 * Cada idioma tiene sus propios nombres de ruta traducidos
 */
export const ROUTE_PATHS = {
  es: {
    home: '',
    experiences: 'experiencias',
    packages: 'paquetes',
    about: 'nosotros',
    legal: 'legales',
  },
  en: {
    home: '',
    experiences: 'experiences',
    packages: 'packages',
    about: 'about',
    legal: 'legal',
  },
  it: {
    home: '',
    experiences: 'esperienze',
    packages: 'pacchetti',
    about: 'chi-siamo',
    legal: 'legale',
  },
  de: {
    home: '',
    experiences: 'erlebnisse',
    packages: 'pakete',
    about: 'ueber-uns',
    legal: 'rechtliches',
  },
};

/**
 * Obtiene el path localizado para una ruta
 * @param {string} routeKey - Clave de ruta (home, experiences, packages, about, legal)
 * @param {string} locale - Código de idioma (es, en, it, de)
 * @returns {string} Path localizado
 */
export const getLocalizedPath = (routeKey, locale = DEFAULT_LOCALE) => {
  const paths = ROUTE_PATHS[locale] || ROUTE_PATHS[DEFAULT_LOCALE];
  return paths[routeKey] || routeKey;
};

/**
 * Genera una URL completa localizada
 * @param {string} routeKey - Clave de ruta
 * @param {string} slug - Slug opcional (para páginas de detalle)
 * @param {string} locale - Código de idioma
 * @returns {string} URL completa con prefijo de idioma
 */
export const generateLocalizedUrl = (routeKey, slug = null, locale = DEFAULT_LOCALE) => {
  const basePath = getLocalizedPath(routeKey, locale);
  
  if (routeKey === 'home') {
    return `/${locale}`;
  }
  
  if (slug) {
    return `/${locale}/${basePath}/${slug}`;
  }
  
  return `/${locale}/${basePath}`;
};

/**
 * Extrae el locale de una URL
 * @param {string} pathname - Path de la URL (ej: /es/experiencias/senderismo)
 * @returns {string} Código de idioma o DEFAULT_LOCALE
 */
export const getLocaleFromPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  if (SUPPORTED_LOCALES.includes(potentialLocale)) {
    return potentialLocale;
  }
  
  return DEFAULT_LOCALE;
};

/**
 * Extrae el path sin el prefijo de idioma
 * @param {string} pathname - Path completo
 * @returns {string} Path sin prefijo de idioma
 */
export const getPathWithoutLocale = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const potentialLocale = segments[0];
  
  if (SUPPORTED_LOCALES.includes(potentialLocale)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
};

/**
 * Determina el tipo de ruta y extrae información
 * @param {string} pathname - Path de la URL
 * @returns {object} { locale, routeKey, slug }
 */
export const parseLocalizedPath = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  const locale = SUPPORTED_LOCALES.includes(segments[0]) ? segments[0] : DEFAULT_LOCALE;
  const pathWithoutLocale = SUPPORTED_LOCALES.includes(segments[0]) ? segments.slice(1) : segments;
  
  // Encontrar qué tipo de ruta es
  const paths = ROUTE_PATHS[locale];
  const routeSegment = pathWithoutLocale[0] || '';
  
  let routeKey = 'home';
  for (const [key, value] of Object.entries(paths)) {
    if (value === routeSegment) {
      routeKey = key;
      break;
    }
  }
  
  const slug = pathWithoutLocale[1] || null;
  
  return { locale, routeKey, slug };
};

/**
 * Convierte una URL de un idioma a otro
 * @param {string} pathname - Path actual
 * @param {string} targetLocale - Idioma destino
 * @param {string} newSlug - Nuevo slug opcional (para cambio de idioma en páginas de detalle)
 * @returns {string} Nueva URL en el idioma destino
 */
export const convertPathToLocale = (pathname, targetLocale, newSlug = null) => {
  const { routeKey, slug } = parseLocalizedPath(pathname);
  const finalSlug = newSlug || slug;
  
  return generateLocalizedUrl(routeKey, finalSlug, targetLocale);
};

/**
 * Verifica si una ruta necesita redirect al idioma por defecto
 * @param {string} pathname - Path de la URL
 * @returns {boolean}
 */
export const needsLocaleRedirect = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  
  // Si el primer segmento no es un locale válido, necesita redirect
  if (segments.length === 0) return true;
  
  return !SUPPORTED_LOCALES.includes(segments[0]);
};

export default {
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  ROUTE_PATHS,
  getLocalizedPath,
  generateLocalizedUrl,
  getLocaleFromPath,
  getPathWithoutLocale,
  parseLocalizedPath,
  convertPathToLocale,
  needsLocaleRedirect,
};
