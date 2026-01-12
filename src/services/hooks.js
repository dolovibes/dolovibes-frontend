/**
 * React Query Hooks para datos de Strapi
 * 
 * ARQUITECTURA:
 * ─────────────────────────────────────────────────────────────
 * - El contenido de Strapi está SOLO en español ('es')
 * - No se pasa locale a las funciones API
 * - La UI soporta 6 idiomas via archivos JSON (i18n)
 * - React Query maneja caching y revalidación
 * 
 * FALLBACK:
 * ─────────────────────────────────────────────────────────────
 * Si VITE_USE_STRAPI=false, se usan datos estáticos de /data/
 */
import { useQuery } from '@tanstack/react-query';
import api from './api';

// Importar datos estáticos como fallback
import { experiences as staticExperiences } from '../data/experiences';
import { packages as staticPackages } from '../data/packages';

// Determinar si usar Strapi o datos estáticos
const USE_STRAPI = import.meta.env.VITE_USE_STRAPI === 'true';

/**
 * Configuración por defecto para queries
 */
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 30 * 60 * 1000, // 30 minutos
  retry: 2,
  refetchOnWindowFocus: false,
};

// ============================================
// HOOKS DE EXPERIENCIAS
// ============================================

/**
 * Hook para obtener todas las experiencias
 * @param {string} season - Filtro por temporada
 */
export const useExperiences = (season = null) => {
  const { i18n } = useTranslation();
  const locale = i18n.language; // Necesario para queryKey

  return useQuery({
    queryKey: ['experiences', season, locale], // Incluir locale para refrescar cache
    queryFn: async () => {
      if (!USE_STRAPI) {
        // Usar datos estáticos
        let data = staticExperiences;
        if (season) {
          data = data.filter(exp => exp.season === season);
        }
        return data;
      }
      return api.getExperiences(season);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener una experiencia por slug
 * @param {string} slug - Slug de la experiencia
 */
export const useExperience = (slug) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['experience', slug, locale],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return staticExperiences.find(exp => exp.slug === slug) || null;
      }
      return api.getExperienceBySlug(slug);
    },
    enabled: !!slug,
    ...defaultQueryOptions,
  });
};

// ============================================
// HOOKS DE PAQUETES
// ============================================

/**
 * Hook para obtener todos los paquetes
 * @param {object} filters - Filtros (experienceSlug, season)
 */
export const usePackages = (filters = {}) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['packages', filters, locale],
    queryFn: async () => {
      if (!USE_STRAPI) {
        let data = staticPackages;
        if (filters.experienceSlug) {
          // Filtrar por experiencia (mock)
          // En real usamos relación, aquí hardcodeado podría ser complejo
        }
        if (filters.season) {
          data = data.filter(pkg => pkg.season === filters.season);
        }
        return data;
      }
      return api.getPackages(filters);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener un paquete por slug
 * @param {string} slug - Slug del paquete
 */
export const usePackage = (slug) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['package', slug, locale],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return staticPackages.find(pkg => pkg.slug === slug) || null;
      }
      return api.getPackageBySlug(slug);
    },
    enabled: !!slug,
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener paquetes por experiencia
 * @param {string} experienceSlug - Slug de la experiencia
 */
export const usePackagesByExperience = (experienceSlug) => {
  return usePackages({ experienceSlug });
};

// ============================================
// HOOKS DE CONTENIDO ÚNICO (Single Types)
// No requieren locale - el contenido está solo en español
// ============================================

/**
 * Hook para obtener el Hero Section
 */
export const useHeroSection = () => {
  return useQuery({
    queryKey: ['heroSection'],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return null; // Usar i18n existente
      }
      return api.getHeroSection();
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener la página About
 */
export const useAboutPage = () => {
  return useQuery({
    queryKey: ['aboutPage'],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return null; // Usar i18n existente
      }
      return api.getAboutPage();
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener Site Settings
 */
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      if (!USE_STRAPI) {
        // Configuración por defecto cuando no hay Strapi
        return {
          siteName: 'Dolovibes',
          location: 'Monterrey, México',
          phone: '+52 81 1234 5678',
          email: 'info@dolovibes.com',
          instagramUrl: 'https://instagram.com',
          facebookUrl: 'https://facebook.com',
          tiktokUrl: 'https://tiktok.com',
          defaultCurrency: 'MXN',
        };
      }
      return api.getSiteSettings();
    },
    ...defaultQueryOptions,
  });
};

// ============================================
// HOOKS DE GUÍAS Y TESTIMONIOS (Collection Types)
// ============================================

/**
 * Hook para obtener guías
 * @param {boolean} featured - Solo destacados
 */
export const useGuides = (featured = false) => {
  return useQuery({
    queryKey: ['guides', featured],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return []; // Sin datos estáticos para guías
      }
      return api.getGuides(featured);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener testimonios
 * @param {boolean} featured - Solo destacados
 */
export const useTestimonials = (featured = false) => {
  return useQuery({
    queryKey: ['testimonials', featured],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return []; // Sin datos estáticos para testimonios
      }
      return api.getTestimonials(featured);
    },
    ...defaultQueryOptions,
  });
};

export default {
  useExperiences,
  useExperience,
  usePackages,
  usePackage,
  usePackagesByExperience,
  useHeroSection,
  useAboutPage,
  useSiteSettings,
  useGuides,
  useTestimonials,
};
