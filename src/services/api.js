/**
 * Servicios API para comunicación con Strapi
 * 
 * Proporciona funciones para obtener:
 * - Experiencias
 * - Paquetes
 * - Hero Section
 * - About Page
 * - Site Settings
 * - Guías
 * - Testimonios
 */
import strapiClient, { getStrapiMediaUrl } from './strapiClient';

// ============================================
// EXPERIENCIAS
// ============================================

/**
 * Obtiene todas las experiencias
 * @param {string} locale - Idioma (es/en)
 * @param {string} season - Filtro por temporada (summer/winter)
 * @returns {Promise<Array>} Lista de experiencias
 */
export const getExperiences = async (locale = 'es', season = null) => {
  const params = {
    locale,
    populate: '*',
    'pagination[pageSize]': 100,
  };
  
  if (season) {
    params['filters[season][$eq]'] = season;
  }
  
  const response = await strapiClient.get('/experiences', { params });
  return transformExperiences(response.data.data);
};

/**
 * Obtiene una experiencia por slug
 * @param {string} slug - Slug de la experiencia
 * @param {string} locale - Idioma
 * @returns {Promise<Object>} Experiencia
 */
export const getExperienceBySlug = async (slug, locale = 'es') => {
  const params = {
    locale,
    'filters[slug][$eq]': slug,
    populate: 'deep',
  };
  
  const response = await strapiClient.get('/experiences', { params });
  const experiences = transformExperiences(response.data.data);
  return experiences[0] || null;
};

// ============================================
// PAQUETES
// ============================================

/**
 * Obtiene todos los paquetes
 * @param {string} locale - Idioma
 * @param {object} filters - Filtros adicionales
 * @returns {Promise<Array>} Lista de paquetes
 */
export const getPackages = async (locale = 'es', filters = {}) => {
  const params = {
    locale,
    populate: 'deep',
    'pagination[pageSize]': 100,
  };
  
  // Aplicar filtros
  if (filters.experienceSlug) {
    params['filters[experience][slug][$eq]'] = filters.experienceSlug;
  }
  if (filters.season) {
    params['filters[season][$eq]'] = filters.season;
  }
  
  const response = await strapiClient.get('/packages', { params });
  return transformPackages(response.data.data);
};

/**
 * Obtiene un paquete por slug
 * @param {string} slug - Slug del paquete
 * @param {string} locale - Idioma
 * @returns {Promise<Object>} Paquete completo
 */
export const getPackageBySlug = async (slug, locale = 'es') => {
  const params = {
    locale,
    'filters[slug][$eq]': slug,
    populate: 'deep',
  };
  
  const response = await strapiClient.get('/packages', { params });
  const packages = transformPackages(response.data.data);
  return packages[0] || null;
};

/**
 * Obtiene paquetes por experiencia
 * @param {string} experienceSlug - Slug de la experiencia
 * @param {string} locale - Idioma
 * @returns {Promise<Array>} Lista de paquetes
 */
export const getPackagesByExperience = async (experienceSlug, locale = 'es') => {
  return getPackages(locale, { experienceSlug });
};

// ============================================
// HERO SECTION (Single Type)
// ============================================

/**
 * Obtiene el contenido del Hero Section
 * @param {string} locale - Idioma
 * @returns {Promise<Object>} Datos del hero
 */
export const getHeroSection = async (locale = 'es') => {
  const params = {
    locale,
    populate: '*',
  };
  
  const response = await strapiClient.get('/hero-section', { params });
  return transformHeroSection(response.data.data);
};

// ============================================
// ABOUT PAGE (Single Type)
// ============================================

/**
 * Obtiene el contenido de la página About
 * @param {string} locale - Idioma
 * @returns {Promise<Object>} Datos de about
 */
export const getAboutPage = async (locale = 'es') => {
  const params = {
    locale,
    populate: 'deep',
  };
  
  const response = await strapiClient.get('/about-page', { params });
  return transformAboutPage(response.data.data);
};

// ============================================
// SITE SETTINGS (Single Type)
// ============================================

/**
 * Obtiene la configuración del sitio
 * @param {string} locale - Idioma
 * @returns {Promise<Object>} Configuración
 */
export const getSiteSettings = async (locale = 'es') => {
  const params = {
    locale,
    populate: '*',
  };
  
  const response = await strapiClient.get('/site-setting', { params });
  return transformSiteSettings(response.data.data);
};

// ============================================
// GUÍAS
// ============================================

/**
 * Obtiene todos los guías
 * @param {string} locale - Idioma
 * @param {boolean} featured - Solo destacados
 * @returns {Promise<Array>} Lista de guías
 */
export const getGuides = async (locale = 'es', featured = false) => {
  const params = {
    locale,
    populate: '*',
  };
  
  if (featured) {
    params['filters[featured][$eq]'] = true;
  }
  
  const response = await strapiClient.get('/guides', { params });
  return transformGuides(response.data.data);
};

// ============================================
// TESTIMONIOS
// ============================================

/**
 * Obtiene testimonios
 * @param {string} locale - Idioma
 * @param {boolean} featured - Solo destacados
 * @returns {Promise<Array>} Lista de testimonios
 */
export const getTestimonials = async (locale = 'es', featured = false) => {
  const params = {
    locale,
    populate: '*',
  };
  
  if (featured) {
    params['filters[featured][$eq]'] = true;
  }
  
  const response = await strapiClient.get('/testimonials', { params });
  return transformTestimonials(response.data.data);
};

// ============================================
// TRANSFORMADORES DE DATOS
// Convierte formato Strapi al formato del frontend
// ============================================

/**
 * Transforma experiencias de Strapi al formato del frontend
 */
const transformExperiences = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];
  
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    season: item.season === 'summer' ? 'verano' : 'invierno',
    tags: item.tags?.map(t => t.name) || [],
    image: getStrapiMediaUrl(item.thumbnail?.url),
    heroImage: getStrapiMediaUrl(item.heroImage?.url),
    shortDescription: item.shortDescription,
    longDescription: item.longDescription,
    highlights: item.highlights?.map(h => h.text) || [],
    whatToExpect: item.whatToExpect,
    difficulty: item.difficulty,
    bestFor: item.bestFor,
  }));
};

/**
 * Transforma paquetes de Strapi al formato del frontend
 */
const transformPackages = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];
  
  return items.map((item) => ({
    id: item.id,
    experienceSlug: item.experience?.slug || '',
    title: item.title,
    slug: item.slug,
    location: item.location,
    // Precios: guardamos el monto numérico para conversión futura
    price: `${item.baseCurrency} ${item.priceAmount?.toLocaleString()}`,
    priceAmount: item.priceAmount,
    baseCurrency: item.baseCurrency,
    originalPrice: item.originalPriceAmount 
      ? `${item.baseCurrency} ${item.originalPriceAmount?.toLocaleString()}`
      : null,
    originalPriceAmount: item.originalPriceAmount,
    duration: item.duration,
    rating: item.rating,
    image: getStrapiMediaUrl(item.thumbnail?.url),
    heroImage: getStrapiMediaUrl(item.heroImage?.url),
    gallery: item.gallery?.map(img => getStrapiMediaUrl(img.url)) || [],
    tags: item.tags?.map(t => t.name) || [],
    hasDiscount: item.hasDiscount,
    season: item.season === 'summer' ? 'verano' : 'invierno',
    description: item.description,
    itinerary: item.itinerary?.map(day => ({
      day: day.day,
      title: day.title,
      description: day.description,
      image: getStrapiMediaUrl(day.image?.url),
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
  }));
};

/**
 * Transforma Hero Section
 */
const transformHeroSection = (data) => {
  if (!data) return null;
  
  return {
    title: data.title,
    titleHighlight: data.titleHighlight,
    badge: data.badge,
    subtitle: data.subtitle,
    videoDesktop: getStrapiMediaUrl(data.videoDesktop?.url),
    videoMobile: getStrapiMediaUrl(data.videoMobile?.url),
    fallbackImage: getStrapiMediaUrl(data.fallbackImage?.url),
  };
};

/**
 * Transforma About Page
 */
const transformAboutPage = (data) => {
  if (!data) return null;
  
  return {
    pageTitle: data.pageTitle,
    mainPhoto: getStrapiMediaUrl(data.mainPhoto?.url),
    photoAlt: data.photoAlt,
    origin: {
      title: data.origin?.title,
      text: data.origin?.content,
    },
    essence: {
      title: data.essence?.title,
      text: data.essence?.content,
    },
    vision: {
      title: data.vision?.title,
      text: data.vision?.content,
    },
    mission: {
      title: data.mission?.title,
      text: data.mission?.content,
    },
  };
};

/**
 * Transforma Site Settings
 */
const transformSiteSettings = (data) => {
  if (!data) return null;
  
  return {
    siteName: data.siteName,
    logo: getStrapiMediaUrl(data.logo?.url),
    logoDark: getStrapiMediaUrl(data.logoDark?.url),
    favicon: getStrapiMediaUrl(data.favicon?.url),
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

/**
 * Transforma Guías
 */
const transformGuides = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];
  
  return items.map((item) => ({
    id: item.id,
    name: item.name,
    slug: item.slug,
    photo: getStrapiMediaUrl(item.photo?.url),
    certifications: item.certifications?.map(c => c.text) || [],
    yearsExperience: item.yearsExperience,
    specialty: item.specialty,
    bio: item.bio,
    languages: item.languages?.map(l => l.text) || [],
    featured: item.featured,
  }));
};

/**
 * Transforma Testimonios
 */
const transformTestimonials = (data) => {
  if (!data) return [];
  const items = Array.isArray(data) ? data : [data];
  
  return items.map((item) => ({
    id: item.id,
    clientName: item.clientName,
    country: item.country,
    rating: item.rating,
    comment: item.comment,
    photo: getStrapiMediaUrl(item.photo?.url),
    tripDate: item.tripDate,
    packageSlug: item.package?.slug,
    featured: item.featured,
  }));
};

export default {
  getExperiences,
  getExperienceBySlug,
  getPackages,
  getPackageBySlug,
  getPackagesByExperience,
  getHeroSection,
  getAboutPage,
  getSiteSettings,
  getGuides,
  getTestimonials,
};
