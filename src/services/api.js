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

      // Copiar campos de media que estén vacíos o null
      const enrichedItem = { ...item };

      // Image y heroImage
      if (!enrichedItem.image && spanishItem.image) {
        enrichedItem.image = spanishItem.image;
      }
      if (!enrichedItem.heroImage && spanishItem.heroImage) {
        enrichedItem.heroImage = spanishItem.heroImage;
      }

      // Gallery (array de objetos con url)
      if ((!enrichedItem.gallery || enrichedItem.gallery.length === 0) && spanishItem.gallery && spanishItem.gallery.length > 0) {
        enrichedItem.gallery = spanishItem.gallery;
      }

      // Itinerary (array de objetos con image)
      if (enrichedItem.itinerary && spanishItem.itinerary) {
        enrichedItem.itinerary = enrichedItem.itinerary.map((day, idx) => {
          if (!day.image && spanishItem.itinerary[idx]?.image) {
            return { ...day, image: spanishItem.itinerary[idx].image };
          }
          return day;
        });
      }

      return enrichedItem;
    });
  }

  // Para objetos individuales
  if (typeof currentData === 'object') {
    const enrichedItem = { ...currentData };

    if (!enrichedItem.image && spanishData.image) {
      enrichedItem.image = spanishData.image;
    }
    if (!enrichedItem.heroImage && spanishData.heroImage) {
      enrichedItem.heroImage = spanishData.heroImage;
    }
    if ((!enrichedItem.gallery || enrichedItem.gallery.length === 0) && spanishData.gallery) {
      enrichedItem.gallery = spanishData.gallery;
    }

    return enrichedItem;
  }

  return currentData;
};

/**
 * Wrapper centralizado para peticiones a Strapi con fallback de idioma
 * 
 * ESTRATEGIA DE FALLBACK:
 * 1. Si el locale NO es español, obtiene datos en ambos idiomas
 * 2. Enriquece los datos del locale actual con imágenes de español
 * 3. Si no hay datos en el locale actual, usa español completo
 * 
 * @param {string} endpoint - Ruta del API (ej: '/experiences')
 * @param {object} params - Parámetros de query (populate, filters, etc.)
 * @param {function} transformFn - Función para transformar la respuesta
 * @param {boolean} isSingleType - true = no agregar locale
 * @returns {Promise<any>} Datos transformados
 */
const fetchFromStrapi = async (endpoint, params = {}, transformFn = null, isSingleType = false) => {
  const locale = getCurrentLocale();

  // Single Types no usan locale
  if (isSingleType) {
    const response = await strapiClient.get(endpoint, { params });
    const data = response.data.data;
    return transformFn ? transformFn(data) : data;
  }

  // Collection Types: obtener datos en el locale actual
  const finalParams = { ...params, locale };

  try {
    const response = await strapiClient.get(endpoint, { params: finalParams });
    let data = response.data.data;

    // Si no hay datos, intentar con español como fallback completo
    if (!data || (Array.isArray(data) && data.length === 0)) {
      if (locale !== DEFAULT_LOCALE) {
        const fallbackParams = { ...params, locale: DEFAULT_LOCALE };
        const fallbackResponse = await strapiClient.get(endpoint, { params: fallbackParams });
        const fallbackData = fallbackResponse.data.data;
        return transformFn ? transformFn(fallbackData) : fallbackData;
      }
      return transformFn ? transformFn(data) : data;
    }

    // Transformar datos PRIMERO
    const transformedData = transformFn ? transformFn(data) : data;

    // Si tenemos datos pero NO estamos en español, enriquecer con imágenes de español
    if (locale !== DEFAULT_LOCALE) {
      try {
        const spanishParams = { ...params, locale: DEFAULT_LOCALE };
        const spanishResponse = await strapiClient.get(endpoint, { params: spanishParams });
        const spanishData = spanishResponse.data.data;

        // Transformar datos españoles también
        const transformedSpanishData = transformFn ? transformFn(spanishData) : spanishData;

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
        const fallbackParams = { ...params, locale: DEFAULT_LOCALE };
        const fallbackResponse = await strapiClient.get(endpoint, { params: fallbackParams });
        const fallbackData = fallbackResponse.data.data;
        return transformFn ? transformFn(fallbackData) : fallbackData;
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
  startDates: true,
  experience: true,
  locationInfo: true,
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
 * Obtiene paquetes de una experiencia específica
 * @param {string} experienceSlug - Slug de la experiencia
 */
export const getPackagesByExperience = async (experienceSlug) => {
  return getPackages({ experienceSlug });
};

// ═══════════════════════════════════════════════════════════════
// HERO SECTION (Single Type)
// Endpoint: /api/hero-section
// ═══════════════════════════════════════════════════════════════

const HERO_POPULATE = {
  videoDesktop: true,
  videoMobile: true,
  fallbackImage: true,
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

const ABOUT_POPULATE = {
  mainPhoto: true,
  team: {
    populate: ['photo']
  },
  values: true,
  origin: true,
  essence: true,
  vision: true,
  mission: true,
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
  legalPages: true,
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
// TRANSFORMADORES DE DATOS
// Convierte formato Strapi → formato Frontend
// ═══════════════════════════════════════════════════════════════

const transformExperiences = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];

  return items.map((item) => ({
    id: item.id,
    documentId: item.documentId, // Necesario para enrichWithSpanishMedia
    title: item.title,
    slug: item.slug,
    season: item.season === 'summer' ? 'verano' : 'invierno',
    tags: item.tags?.map(t => t.name) || [],
    image: getStrapiMediaUrl(item.thumbnail),
    heroImage: getStrapiMediaUrl(item.heroImage),
    shortDescription: item.shortDescription,
    longDescription: item.longDescription,
    highlights: item.highlights?.map(h => h.text) || [],
    whatToExpect: item.whatToExpect,
    difficulty: item.difficulty,
    bestFor: item.bestFor,
  }));
};

const transformPackages = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];

  return items.map((item) => ({
    id: item.id,
    documentId: item.documentId, // Necesario para enrichWithSpanishMedia
    experienceSlug: item.experience?.slug || '',
    title: item.title,
    slug: item.slug,
    location: item.location,
    price: `MXN ${item.priceAmount?.toLocaleString()}`,
    priceAmount: item.priceAmount,
    originalPrice: item.originalPriceAmount
      ? `MXN ${item.originalPriceAmount?.toLocaleString()}`
      : null,
    originalPriceAmount: item.originalPriceAmount,
    duration: item.duration,
    rating: item.rating,
    // Pasar objeto media completo - getStrapiMediaUrl maneja ambos formatos
    image: getStrapiMediaUrl(item.thumbnail),
    heroImage: getStrapiMediaUrl(item.heroImage),
    gallery: item.gallery?.map(g => ({
      url: getStrapiMediaUrl(g.image),
      caption: g.caption || '',
      alt: g.caption || item.title,
    })) || [],
    tags: item.tags?.map(t => t.name) || [],
    hasDiscount: item.hasDiscount,
    season: item.season === 'summer' ? 'verano' : 'invierno',
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
    notIncludes: item.notIncludes?.map(ni => ni.text) || [],
    difficulty: item.difficulty,
    groupSize: item.groupSize,
    guideType: item.guideType,
    availableDates: item.availableDates,
    startDates: item.startDates?.map(sd => sd.displayText || sd.date) || [],
    locationInfo: item.locationInfo ? {
      howToGetThere: item.locationInfo.howToGetThere,
      latitude: item.locationInfo.latitude,
      longitude: item.locationInfo.longitude,
      googleMapsUrl: item.locationInfo.googleMapsUrl,
      nearestAirport: item.locationInfo.nearestAirport,
      nearestCity: item.locationInfo.nearestCity,
    } : null,
  }));
};

const transformHeroSection = (data) => {
  if (!data) return null;

  return {
    title: data.title,
    titleHighlight: data.titleHighlight,
    badge: data.badge,
    subtitle: data.subtitle,
    // Pasar objeto media completo
    videoDesktop: getStrapiMediaUrl(data.videoDesktop),
    videoMobile: getStrapiMediaUrl(data.videoMobile),
    fallbackImage: getStrapiMediaUrl(data.fallbackImage),
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
      text: data.origin.content,
    } : null,
    essence: data.essence ? {
      title: data.essence.title,
      text: data.essence.content,
    } : null,
    vision: data.vision ? {
      title: data.vision.title,
      text: data.vision.content,
    } : null,
    mission: data.mission ? {
      title: data.mission.title,
      text: data.mission.content,
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
    defaultCurrency: data.defaultCurrency,
    legalPages: data.legalPages?.map(page => ({
      title: page.title,
      slug: page.slug,
      content: page.content,
    })) || [],
  };
};

const transformSiteTexts = (data) => {
  if (!data) return null;

  return {
    loadingExperience: data.loadingExperience,
    loadingPackage: data.loadingPackage,
    loadingGeneric: data.loadingGeneric,
    availablePackagesTitle: data.availablePackagesTitle,
    availablePackagesSubtitle: data.availablePackagesSubtitle,
    contactMethodLabel: data.contactMethodLabel,
  };
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  getExperiences,
  getExperienceBySlug,
  getPackages,
  getPackageBySlug,
  getPackagesByExperience,
  getHeroSection,
  getAboutPage,
  getSiteSettings,
  getSiteTexts,
};
