/**
 * API de DoloVibes - Cliente para Strapi CMS
 * 
 * ARQUITECTURA:
 * ─────────────────────────────────────────────────────────────
 * 
 * TIPOS DE CONTENIDO EN STRAPI 5:
 * 
 *   Single Types (endpoint = singularName):
 *   ├── hero-section   → /api/hero-section
 *   ├── about-page     → /api/about-page
 *   └── site-setting   → /api/site-setting
 * 
 *   Collection Types (endpoint = pluralName):
 *   ├── experiences    → /api/experiences
 *   └── packages       → /api/packages
 * 
 * MANEJO DE LOCALES (i18n):
 * ─────────────────────────────────────────────────────────────
 * - Strapi soporta múltiples idiomas
 * - DEFAULT_LOCALE = 'es' (idioma base con contenido completo)
 * - Si el contenido no existe en el idioma solicitado, usa español
 * - El frontend detecta el idioma del usuario y lo pasa a las APIs
 * 
 * POPULATE:
 * ─────────────────────────────────────────────────────────────
 * - populate=* NO funciona bien para media en Strapi 5
 * - Usamos populate explícito para cada relación/media
 */
import strapiClient, { getStrapiMediaUrl } from './strapiClient';
import i18n from '../i18n';

// ═══════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE LOCALES
// ═══════════════════════════════════════════════════════════════

const DEFAULT_LOCALE = 'es'; // Idioma con contenido completo garantizado
const SUPPORTED_STRAPI_LOCALES = ['es', 'en', 'it', 'de']; // Idiomas disponibles en Strapi (optimizados por ROI)

/**
 * Obtiene el locale actual para Strapi
 * Si el idioma del usuario no tiene contenido en Strapi, usa español
 */
const getCurrentLocale = () => {
  const userLang = i18n.language?.substring(0, 2) || DEFAULT_LOCALE;
  return SUPPORTED_STRAPI_LOCALES.includes(userLang) ? userLang : DEFAULT_LOCALE;
};

// ═══════════════════════════════════════════════════════════════
// WRAPPER PRINCIPAL
// ═══════════════════════════════════════════════════════════════

/**
 * Campos de media que necesitan fallback desde español (después de transformación)
 * Strapi v5 no comparte media entre traducciones automáticamente
 */
const MEDIA_FIELDS = ['image', 'heroImage', 'gallery', 'itinerary'];

/**
 * Enriquece un item individual con media de español
 * @param {Object} item - Item actual (puede tener campos vacíos)
 * @param {Object} spanishItem - Item en español (con media completa)
 * @returns {Object} Item enriquecido con media de español
 */
const enrichItemWithSpanishMedia = (item, spanishItem) => {
  if (!item || !spanishItem) return item;

  const enrichedItem = { ...item };

  // Image y heroImage
  if (!enrichedItem.image && spanishItem.image) {
    enrichedItem.image = spanishItem.image;
  }
  if (!enrichedItem.heroImage && spanishItem.heroImage) {
    enrichedItem.heroImage = spanishItem.heroImage;
  }

  // Gallery - si no hay galería o está vacía, usar la de español
  if ((!enrichedItem.gallery || enrichedItem.gallery.length === 0) && spanishItem.gallery && spanishItem.gallery.length > 0) {
    enrichedItem.gallery = spanishItem.gallery;
  }

  // Itinerary - manejar varios casos:
  // 1. Si no hay itinerario actual, usar el de español completo
  // 2. Si hay itinerario pero faltan imágenes en días específicos, copiar de español
  if (spanishItem.itinerary && spanishItem.itinerary.length > 0) {
    if (!enrichedItem.itinerary || enrichedItem.itinerary.length === 0) {
      // Caso 1: No hay itinerario en el idioma actual - usar el de español
      enrichedItem.itinerary = spanishItem.itinerary;
    } else {
      // Caso 2: Hay itinerario - enriquecer cada día con imágenes de español
      enrichedItem.itinerary = enrichedItem.itinerary.map((day, idx) => {
        const spanishDay = spanishItem.itinerary[idx];
        if (!spanishDay) return day;

        // Copiar imagen si falta
        if (!day.image && spanishDay.image) {
          return { ...day, image: spanishDay.image };
        }
        return day;
      });

      // Si el itinerario español tiene más días, agregar los que faltan
      if (spanishItem.itinerary.length > enrichedItem.itinerary.length) {
        const missingDays = spanishItem.itinerary.slice(enrichedItem.itinerary.length);
        enrichedItem.itinerary = [...enrichedItem.itinerary, ...missingDays];
      }
    }
  }

  return enrichedItem;
};

/**
 * Enriquece los datos transformados del locale actual con imágenes del locale español
 * @param {Array|Object} currentData - Datos transformados en el locale actual
 * @param {Array|Object} spanishData - Datos transformados en español (con imágenes)
 * @returns {Array|Object} Datos enriquecidos con imágenes
 */
const enrichWithSpanishMedia = (currentData, spanishData) => {
  if (!currentData || !spanishData) return currentData;

  // Para arrays (experiencias, paquetes)
  if (Array.isArray(currentData)) {
    // Crear mapa de datos españoles por documentId (identificador entre traducciones)
    const spanishMap = new Map();
    spanishData.forEach(item => {
      if (item.documentId) {
        spanishMap.set(item.documentId, item);
      }
    });

    return currentData.map(item => {
      const spanishItem = spanishMap.get(item.documentId);
      if (!spanishItem) return item;
      return enrichItemWithSpanishMedia(item, spanishItem);
    });
  }

  // Para objetos individuales
  if (typeof currentData === 'object') {
    return enrichItemWithSpanishMedia(currentData, spanishData);
  }

  return currentData;
};

// ═══════════════════════════════════════════════════════════════
// CACHE EN MEMORIA PARA DATOS ESPAÑOLES
// ═══════════════════════════════════════════════════════════════
// Evita requests duplicados al obtener imágenes de español
// Los datos se cachean por 5 minutos

const spanishDataCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
// fix #41: Deduplicate concurrent in-flight requests to prevent race conditions
const pendingSpanishRequests = new Map();

/**
 * Limpia el cache de datos españoles
 * Se llama cuando cambia el idioma para evitar datos obsoletos
 */
export const clearSpanishDataCache = () => {
  spanishDataCache.clear();
};

/**
 * Obtiene datos españoles desde cache o API
 * fix #41: Deduplicates concurrent requests for the same endpoint
 */
const getSpanishDataCached = async (endpoint, params, transformFn) => {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = spanishDataCache.get(cacheKey);

  // Verificar si hay cache válido
  if (cached && Date.now() < cached.expiry) {
    return cached.data;
  }

  // Deduplicate: reuse in-flight request for the same cache key
  if (pendingSpanishRequests.has(cacheKey)) {
    return pendingSpanishRequests.get(cacheKey);
  }

  const promise = (async () => {
    try {
      const spanishParams = { ...params, locale: DEFAULT_LOCALE };
      const response = await strapiClient.get(endpoint, { params: spanishParams });
      const data = response.data.data;
      const transformedData = transformFn ? transformFn(data) : data;

      // Guardar en cache
      spanishDataCache.set(cacheKey, {
        data: transformedData,
        expiry: Date.now() + CACHE_TTL,
      });

      return transformedData;
    } finally {
      pendingSpanishRequests.delete(cacheKey);
    }
  })();

  pendingSpanishRequests.set(cacheKey, promise);
  return promise;
};

/**
 * Wrapper centralizado para peticiones a Strapi con fallback de idioma
 * 
 * ESTRATEGIA DE FALLBACK:
 * 1. Si el locale NO es español, obtiene datos en ambos idiomas
 * 2. Enriquece los datos del locale actual con imágenes de español
 * 3. Si no hay datos en el locale actual, usa español completo
 * 
 * OPTIMIZACIÓN: Los datos españoles se cachean en memoria para evitar
 * requests duplicados cuando hay múltiples componentes pidiendo datos.
 * 
 * @param {string} endpoint - Ruta del API (ej: '/experiences')
 * @param {object} params - Parámetros de query (populate, filters, etc.)
 * @param {function} transformFn - Función para transformar la respuesta
 * @param {boolean} isSingleType - true = no agregar locale
 * @returns {Promise<any>} Datos transformados
 */
const fetchFromStrapi = async (endpoint, params = {}, transformFn = null, isSingleType = false) => {
  const locale = getCurrentLocale();

  // Single Types también necesitan locale para i18n
  if (isSingleType) {
    const finalParams = { ...params, locale };
    
    try {
      const response = await strapiClient.get(endpoint, { params: finalParams });
      const data = response.data.data;
      
      // Transformar datos PRIMERO
      const transformedData = transformFn ? transformFn(data) : data;
      
      // Si NO estamos en español, enriquecer con imágenes de español
      if (locale !== DEFAULT_LOCALE && transformedData) {
        try {
          // Obtener datos españoles desde cache
          const transformedSpanishData = await getSpanishDataCached(endpoint, params, transformFn);
          
          // Enriquecer con media de español
          const enrichedData = enrichWithSpanishMedia(transformedData, transformedSpanishData);
          return enrichedData;
        } catch (spanishError) {
          // Si falla obtener español, continuar con datos actuales
          console.warn('[Strapi] Could not fetch Spanish fallback for media:', spanishError.message);
          return transformedData;
        }
      }
      
      return transformedData;
    } catch (error) {
      // Si falla en idioma actual y no es español, intentar fallback completo a español
      if (locale !== DEFAULT_LOCALE) {
        try {
          return getSpanishDataCached(endpoint, params, transformFn);
        } catch {
          throw error;
        }
      }
      throw error;
    }
  }

  // Collection Types: obtener datos en el locale actual
  const finalParams = { ...params, locale };

  try {
    const response = await strapiClient.get(endpoint, { params: finalParams });
    let data = response.data.data;

    // Si no hay datos, intentar con español como fallback completo
    if (!data || (Array.isArray(data) && data.length === 0)) {
      if (locale !== DEFAULT_LOCALE) {
        // Usar cache para datos españoles
        return getSpanishDataCached(endpoint, params, transformFn);
      }
      return transformFn ? transformFn(data) : data;
    }

    // Transformar datos PRIMERO
    const transformedData = transformFn ? transformFn(data) : data;

    // Si tenemos datos pero NO estamos en español, enriquecer con imágenes de español
    if (locale !== DEFAULT_LOCALE) {
      try {
        // Usar cache para evitar requests duplicados
        const transformedSpanishData = await getSpanishDataCached(endpoint, params, transformFn);

        // Enriquecer datos actuales con media de español (DESPUÉS de transformar)
        const enrichedData = enrichWithSpanishMedia(transformedData, transformedSpanishData);

        return enrichedData;
      } catch (spanishError) {
        // Si falla obtener español, continuar con datos actuales
        console.warn('[Strapi] Could not fetch Spanish fallback for media:', spanishError.message);
        return transformedData;
      }
    }

    return transformedData;
  } catch (error) {
    // Error principal: intentar fallback completo a español
    if (locale !== DEFAULT_LOCALE) {
      try {
        return getSpanishDataCached(endpoint, params, transformFn);
      } catch {
        throw error;
      }
    }
    throw error;
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPERIENCIAS (Collection Type)
// Endpoint: /api/experiences
// ═══════════════════════════════════════════════════════════════

const EXPERIENCE_POPULATE = {
  thumbnail: true,
  heroImage: true,
  packages: {
    populate: ['thumbnail', 'heroImage']
  }
};

/**
 * Obtiene todas las experiencias
 * @param {string|null} season - Filtrar por temporada ('summer' | 'winter')
 */
export const getExperiences = async (season = null) => {
  const params = {
    populate: EXPERIENCE_POPULATE,
    'pagination[pageSize]': 100,
    'sort': 'displayOrder:asc',  // Ordenar por campo displayOrder
  };

  if (season) {
    params['filters[season][$eq]'] = season;
  }

  return fetchFromStrapi('/experiences', params, transformExperiences);
};

/**
 * Obtiene una experiencia por slug
 * @param {string} slug - Slug único de la experiencia
 */
export const getExperienceBySlug = async (slug) => {
  const params = {
    'filters[slug][$eq]': slug,
    populate: EXPERIENCE_POPULATE,
  };

  const experiences = await fetchFromStrapi('/experiences', params, transformExperiences);
  return experiences[0] || null;
};

/**
 * Obtiene el slug de una experiencia por documentId en un locale específico
 * Usado para redirección inteligente al cambiar idioma
 * @param {string} documentId - Document ID de la experiencia
 * @param {string} targetLocale - Locale objetivo (es, en, it, de)
 * @returns {Promise<string|null>} Slug en el locale objetivo o null si no existe
 */
export const getExperienceSlugByDocumentId = async (documentId, targetLocale) => {
  try {
    const params = {
      'filters[documentId][$eq]': documentId,
      locale: targetLocale,
      fields: ['slug'],
    };
    const response = await strapiClient.get('/experiences', { params });
    const data = response.data.data;
    if (data && data.length > 0) {
      return data[0].slug;
    }
    return null;
  } catch (error) {
    console.warn('[Strapi] Error fetching experience slug by documentId:', error.message);
    return null;
  }
};

/**
 * Obtiene las experiencias para mostrar en el footer
 * Solo retorna experiencias con showInFooter=true, ordenadas por footerDisplayOrder
 */
export const getFooterExperiences = async () => {
  const params = {
    populate: EXPERIENCE_POPULATE,
    'pagination[pageSize]': 20,
    'sort': 'footerDisplayOrder:asc',
    'filters[showInFooter][$eq]': true,
  };

  return fetchFromStrapi('/experiences', params, transformExperiences);
};

// ═══════════════════════════════════════════════════════════════
// PAQUETES (Collection Type)
// Endpoint: /api/packages
// ═══════════════════════════════════════════════════════════════

const PACKAGE_POPULATE = {
  thumbnail: true,
  heroImage: true,
  gallery: {
    populate: ['image']
  },
  itinerary: {
    populate: ['image']
  },
  includes: true,
  notIncludes: true,
  additionalInfo: true,
  additionalServices: true,
  mapImage: true,
  startDates: true,
  tags: true,
  experience: true,
};

/**
 * Obtiene todos los paquetes
 * @param {object} filters - Filtros opcionales
 * @param {string} filters.experienceSlug - Filtrar por experiencia
 * @param {string} filters.season - Filtrar por temporada
 */
export const getPackages = async (filters = {}) => {
  const params = {
    populate: PACKAGE_POPULATE,
    'pagination[pageSize]': 100,
    'sort': 'displayOrder:asc',  // Ordenar por campo displayOrder
  };

  if (filters.experienceSlug) {
    params['filters[experience][slug][$eq]'] = filters.experienceSlug;
  }
  if (filters.season) {
    params['filters[season][$eq]'] = filters.season;
  }

  return fetchFromStrapi('/packages', params, transformPackages);
};

/**
 * Obtiene un paquete por slug
 * @param {string} slug - Slug único del paquete
 */
export const getPackageBySlug = async (slug) => {
  const params = {
    'filters[slug][$eq]': slug,
    populate: PACKAGE_POPULATE,
  };

  const packages = await fetchFromStrapi('/packages', params, transformPackages);
  return packages[0] || null;
};

/**
 * Obtiene el slug de un paquete por documentId en un locale específico
 * Usado para redirección inteligente al cambiar idioma
 * @param {string} documentId - Document ID del paquete
 * @param {string} targetLocale - Locale objetivo (es, en, it, de)
 * @returns {Promise<string|null>} Slug en el locale objetivo o null si no existe
 */
export const getPackageSlugByDocumentId = async (documentId, targetLocale) => {
  try {
    const params = {
      'filters[documentId][$eq]': documentId,
      locale: targetLocale,
      fields: ['slug'],
    };
    const response = await strapiClient.get('/packages', { params });
    const data = response.data.data;
    if (data && data.length > 0) {
      return data[0].slug;
    }
    return null;
  } catch (error) {
    console.warn('[Strapi] Error fetching package slug by documentId:', error.message);
    return null;
  }
};

/**
 * Obtiene paquetes de una experiencia específica
 * @param {string} experienceSlug - Slug de la experiencia
 */
export const getPackagesByExperience = async (experienceSlug) => {
  return getPackages({ experienceSlug });
};

/**
 * Obtiene los paquetes destacados para mostrar en el home
 * Solo retorna paquetes con showInHome=true, ordenados por homeDisplayOrder
 */
export const getFeaturedPackages = async () => {
  const params = {
    populate: PACKAGE_POPULATE,
    'pagination[pageSize]': 20,
    'sort': 'homeDisplayOrder:asc',
    'filters[showInHome][$eq]': true,
  };

  return fetchFromStrapi('/packages', params, transformPackages);
};

// ═══════════════════════════════════════════════════════════════
// HERO SECTION (Single Type)
// Endpoint: /api/hero-section
// ═══════════════════════════════════════════════════════════════

const HERO_POPULATE = {
  videoDesktop: true,   // Video para desktop
  imageMobile: true,    // Imagen estática para móvil (mejor rendimiento)
};

/**
 * Obtiene el contenido del Hero Section
 */
export const getHeroSection = async () => {
  return fetchFromStrapi('/hero-section', { populate: HERO_POPULATE }, transformHeroSection, true);
};

// ═══════════════════════════════════════════════════════════════
// ABOUT PAGE (Single Type)
// Endpoint: /api/about-page
// ═══════════════════════════════════════════════════════════════

// Usar objeto para populate según documentación oficial Strapi 5.x
// Incluye todos los campos actuales del modelo About Page
const ABOUT_POPULATE = {
  mainPhoto: true,
  origin: {
    populate: '*'
  },
  essence: {
    populate: '*'
  },
  vision: {
    populate: '*'
  },
  mission: {
    populate: '*'
  },
};

/**
 * Obtiene el contenido de la página About
 */
export const getAboutPage = async () => {
  return fetchFromStrapi('/about-page', { populate: ABOUT_POPULATE }, transformAboutPage, true);
};

// ═══════════════════════════════════════════════════════════════
// SITE SETTINGS (Single Type)
// Endpoint: /api/site-setting (singular!)
// ═══════════════════════════════════════════════════════════════

const SETTINGS_POPULATE = {
  logo: true,
  logoDark: true,
  favicon: true,
};

/**
 * Obtiene la configuración del sitio
 */
export const getSiteSettings = async () => {
  return fetchFromStrapi('/site-setting', { populate: SETTINGS_POPULATE }, transformSiteSettings, true);
};

// ═══════════════════════════════════════════════════════════════
// SITE TEXTS (Single Type)
// Endpoint: /api/site-text
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene los textos globales del sitio
 */
export const getSiteTexts = async () => {
  return fetchFromStrapi('/site-text', {}, transformSiteTexts, true);
};

// ═══════════════════════════════════════════════════════════════
// LEGAL PAGES (Collection Type)
// Endpoint: /api/legal-pages
// ═══════════════════════════════════════════════════════════════

/**
 * Obtiene una página legal por slug
 * Si no existe en el idioma actual, intenta obtenerla en español (fallback)
 * @param {string} slug - Slug de la página legal (ej. 'privacidad', 'terminos')
 */
export const getLegalPageBySlug = async (slug) => {
  const params = {
    'filters[slug][$eq]': slug,
  };

  // Intentar obtener en el idioma actual
  let pages = await fetchFromStrapi('/legal-pages', params, transformLegalPage);
  
  // Si no encontró nada y no estamos en español, intentar en español como fallback
  if ((!pages || !Array.isArray(pages) || pages.length === 0) && getCurrentLocale() !== 'es') {
    console.log('[Strapi] Legal page not found in current locale, trying Spanish fallback...');
    try {
      const spanishParams = {
        'filters[slug][$eq]': slug,
        locale: 'es',
      };
      const response = await strapiClient.get('/legal-pages', { params: spanishParams });
      
      if (response.data.data && response.data.data.length > 0) {
        pages = transformLegalPage(response.data);
      }
    } catch (error) {
      console.warn('[Strapi] Error fetching Spanish fallback for legal page:', error.message);
    }
  }
  
  return pages && pages.length > 0 ? pages[0] : null;
};

/**
 * Obtiene las páginas legales para mostrar en el footer
 * Solo retorna legal pages con showInFooter=true, ordenadas por footerDisplayOrder
 */
export const getFooterLegalPages = async () => {
  const params = {
    'pagination[pageSize]': 20,
    'sort': 'footerDisplayOrder:asc',
    'filters[showInFooter][$eq]': true,
  };

  return fetchFromStrapi('/legal-pages', params, transformLegalPage);
};

/**
 * Obtiene el slug de una página legal por documentId en un locale específico
 * Usado para redirección inteligente al cambiar idioma
 * @param {string} documentId - Document ID de la página legal
 * @param {string} targetLocale - Locale objetivo (es, en, it, de)
 * @returns {Promise<string|null>} Slug en el locale objetivo o null si no existe
 */
export const getLegalPageSlugByDocumentId = async (documentId, targetLocale) => {
  try {
    const params = {
      'filters[documentId][$eq]': documentId,
      locale: targetLocale,
      fields: ['slug'],
    };
    const response = await strapiClient.get('/legal-pages', { params });
    const data = response.data.data;
    if (data && data.length > 0) {
      return data[0].slug;
    }
    return null;
  } catch (error) {
    console.warn('[Strapi] Error fetching legal page slug by documentId:', error.message);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
// TRANSFORMADORES DE DATOS
// Convierte formato Strapi → formato Frontend
// ═══════════════════════════════════════════════════════════════

const transformExperiences = (data) => {
  if (!data) return [];
  const validData = data.data || data;
  const items = Array.isArray(validData) ? validData : [validData];

  return items.map((item) => ({
    id: item.id,
    documentId: item.documentId, // Necesario para enrichWithSpanishMedia
    title: item.title,
    slug: item.slug,
    season: item.season, // fix #42: keep raw Strapi value (summer/winter) - frontend seasonMap handles both formats
    image: getStrapiMediaUrl(item.thumbnail),
    heroImage: getStrapiMediaUrl(item.heroImage),
    longDescription: item.longDescription,
    // Campos para footer
    showInFooter: item.showInFooter ?? true, // Default true para backwards compatibility
    footerDisplayOrder: item.footerDisplayOrder || 0,
  }));
};

const transformPackages = (data) => {
  if (!data) return [];
  const validData = data.data || data;
  const items = Array.isArray(validData) ? validData : [validData];

  return items.map((item) => {
    // Determinar si mostrar descuento: solo si hasDiscount=true Y hay originalPriceAmount
    const showDiscount = item.hasDiscount === true && item.originalPriceAmount && item.originalPriceAmount > item.priceAmount;

    return {
      id: item.id,
      documentId: item.documentId, // Necesario para enrichWithSpanishMedia
      experienceSlug: item.experience?.slug || '',
      title: item.title,
      slug: item.slug,
      location: item.location,
      // Precios en EUR (vienen como priceAmount desde Strapi) - el frontend se encarga de la conversión
      priceEUR: item.priceAmount,
      originalPriceEUR: showDiscount ? item.originalPriceAmount : null,
      hasDiscount: showDiscount,
      duration: item.duration,
      rating: item.rating,
      // Pasar objeto media completo - getStrapiMediaUrl maneja ambos formatos
      image: getStrapiMediaUrl(item.thumbnail),
      heroImage: getStrapiMediaUrl(item.heroImage),
      // Galería: filtrar solo items con imagen válida
      gallery: (item.gallery || [])
        .map(g => ({
          url: getStrapiMediaUrl(g.image),
          caption: g.caption || '',
          alt: g.caption || item.title,
        }))
        .filter(g => g.url), // Solo incluir fotos con URL válida
      tags: item.tags?.map(t => t.name) || [],
      season: item.season, // fix #42: keep raw Strapi value (summer/winter)
      description: item.description,
      itinerary: item.itinerary?.map(day => ({
        day: day.day,
        title: day.title,
        description: day.description,
        image: getStrapiMediaUrl(day.image),
      })) || [],
      includes: item.includes?.map(inc => ({
        label: inc.label,
        detail: inc.detail,
      })) || [],
      // notIncludes ahora usa el mismo formato que includes (con label y detail)
      notIncludes: item.notIncludes?.map(ni => ({
        label: ni.label,
        detail: ni.detail,
      })) || [],
      // Nuevos campos de información adicional
      additionalInfo: item.additionalInfo?.map(info => ({
        label: info.label,
        detail: info.detail,
      })) || [],
      additionalServices: item.additionalServices?.map(svc => ({
        label: svc.label,
        detail: svc.detail,
      })) || [],
      // Imagen de mapa (solo imagen, sin coordenadas)
      mapImage: getStrapiMediaUrl(item.mapImage),
      difficulty: item.difficulty,
      groupSize: item.groupSize,
      guideType: item.guideType,
      availableDates: item.availableDates,
      startDates: item.startDates?.map(sd => sd.displayText || sd.date) || [],
      // Campos para recomendaciones del home
      showInHome: item.showInHome || false,
      homeDisplayOrder: item.homeDisplayOrder || 0,
    };
  });
};

const transformHeroSection = (data) => {
  if (!data) return null;

  return {
    title: data.title,
    titleHighlight: data.titleHighlight,
    subtitle: data.subtitle,
    videoDesktop: getStrapiMediaUrl(data.videoDesktop),
    imageMobile: getStrapiMediaUrl(data.imageMobile),
  };
};

const transformAboutPage = (data) => {
  if (!data) return null;

  return {
    pageTitle: data.pageTitle,
    // Pasar objeto media completo
    mainPhoto: getStrapiMediaUrl(data.mainPhoto),
    photoAlt: data.photoAlt,
    origin: data.origin ? {
      title: data.origin.title,
      content: data.origin.content,
    } : null,
    essence: data.essence ? {
      title: data.essence.title,
      content: data.essence.content,
    } : null,
    vision: data.vision ? {
      title: data.vision.title,
      content: data.vision.content,
    } : null,
    mission: data.mission ? {
      title: data.mission.title,
      content: data.mission.content,
    } : null,
  };
};

const transformSiteSettings = (data) => {
  if (!data) return null;

  return {
    siteName: data.siteName,
    logo: getStrapiMediaUrl(data.logo),
    logoDark: getStrapiMediaUrl(data.logoDark),
    favicon: getStrapiMediaUrl(data.favicon),
    location: data.location,
    phone: data.phone,
    email: data.email,
    whatsappNumber: data.whatsappNumber,
    instagramUrl: data.instagramUrl,
    facebookUrl: data.facebookUrl,
    tiktokUrl: data.tiktokUrl,
    footerDescription: data.footerDescription,
    copyrightText: data.copyrightText,
    // Language toggles (es is always enabled — no field needed)
    enableLanguageEn: data.enableLanguageEn ?? true,
    enableLanguageIt: data.enableLanguageIt ?? true,
    enableLanguageDe: data.enableLanguageDe ?? true,
    // Currency toggles (EUR is always enabled — no field needed)
    enableCurrencyUsd: data.enableCurrencyUsd ?? true,
    enableCurrencyMxn: data.enableCurrencyMxn ?? true,
  };
};

const transformSiteTexts = (data) => {
  if (!data) return null;

  // Mapea los campos de Strapi a una estructura organizada por sección
  // Compatible con el fallback a i18n
  return {
    // Navegación
    navbar: {
      experiences: data.navExperiences,
      aboutUs: data.navAboutUs,
      quote: data.navQuote,
    },
    // Temporadas
    seasons: {
      summer: data.seasonSummer,
      winter: data.seasonWinter,
    },
    // Botones
    buttons: {
      next: data.btnNext,
      back: data.btnBack,
      submit: data.btnSubmit,
      close: data.btnClose,
      quoteCustomTrip: data.btnQuoteCustomTrip,
    },
    // Etiquetas
    labels: {
      perPerson: data.labelPerPerson,
      days: data.labelDays,
      persons: data.labelPersons,
    },
    // Estados de carga
    loading: {
      generic: data.loadingGeneric,
    },
    // Hero / Home
    hero: {
      title: data.heroTitle,
      titleHighlight: data.heroTitleHighlight,
      subtitle: data.heroSubtitle,
    },
    selector: {
      whatQuestion: data.selectorWhatQuestion,
      selectExperience: data.selectorSelectExperience,
      noExperiences: data.selectorNoExperiences,
    },
    // Footer
    footer: {
      description: data.footerDescription,
      allRightsReserved: data.footerRights,
    },
    // About
    about: {
      title: data.aboutTitle,
    },
    // Booking / Packages
    booking: {
      requestQuote: data.bookingRequestQuote,
      noCommitment: data.bookingNoCommitment,
    },
    packageInfo: {
      packageNotFound: data.packageNotFound,
      itinerary: data.packageItinerary,
      includes: data.packageIncludes,
      notIncludes: data.packageNotIncludes,
    },
    // Nuevas secciones agregadas
    quoteModal: {
      title: data.quoteModalTitle,
      step: data.quoteModalStep,
      of: data.quoteModalOf,
      step1Title: data.quoteModalStep1Title,
      interestLabel: data.quoteModalInterestLabel,
      customPlan: data.quoteModalCustomPlan,
      dateLabel: data.quoteModalDateLabel,
      travelersLabel: data.quoteModalTravelersLabel,
      notesLabel: data.quoteModalNotesLabel,
      notesPlaceholder: data.quoteModalNotesPlaceholder,
      step2Title: data.quoteModalStep2Title,
      namePlaceholder: data.quoteModalNamePlaceholder,
      emailPlaceholder: data.quoteModalEmailPlaceholder,
      phonePlaceholder: data.quoteModalPhonePlaceholder,
      successTitle: data.quoteModalSuccessTitle,
      successMessage: data.quoteModalSuccessMessage,
    },
    recommendations: {
      title: data.recommendationsTitle,
      subtitle: data.recommendationsSubtitle,
      offer: data.recommendationsOffer,
      viewDetails: data.recommendationsViewDetails,
    },
    contactMethod: {
      label: data.contactMethodLabel,
      whatsapp: data.contactMethodWhatsapp,
      phone: data.contactMethodPhone,
      email: data.contactMethodEmail,
    },
  };
};

const transformLegalPage = (data) => {
  if (!data) return [];
  const validData = data.data || data;
  const items = Array.isArray(validData) ? validData : [validData];

  return items.map((item) => ({
    id: item.id,
    documentId: item.documentId, // fix #19: Necesario para resolución de slugs al cambiar idioma
    title: item.title,
    slug: item.slug,
    content: item.content, // Rico texto (Markdown)
    updatedAt: item.updatedAt,
  }));
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  // Experiences
  getExperiences,
  getExperienceBySlug,
  getExperienceSlugByDocumentId,
  getFooterExperiences,
  // Packages
  getPackages,
  getPackageBySlug,
  getPackageSlugByDocumentId,
  getPackagesByExperience,
  getFeaturedPackages,
  // Content
  getHeroSection,
  getAboutPage,
  getSiteSettings,
  getSiteTexts,
  // Legal
  getLegalPageBySlug,
  getLegalPageSlugByDocumentId,
  getFooterLegalPages,
};
