/**
 * React Query Hooks para datos de Strapi
 * 
 * Proporciona hooks personalizados con:
 * - Caching automático
 * - Revalidación inteligente
 * - Estados de loading/error
 * - Fallback a datos estáticos cuando Strapi no está disponible
 */
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  const locale = i18n.language;

  return useQuery({
    queryKey: ['experiences', locale, season],
    queryFn: async () => {
      if (!USE_STRAPI) {
        // Usar datos estáticos
        let data = staticExperiences;
        if (season) {
          const seasonMap = { summer: 'verano', winter: 'invierno' };
          data = data.filter(exp => exp.season === (seasonMap[season] || season));
        }
        return data;
      }
      return api.getExperiences(locale, season);
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
      return api.getExperienceBySlug(slug, locale);
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
    queryKey: ['packages', locale, filters],
    queryFn: async () => {
      if (!USE_STRAPI) {
        let data = staticPackages;
        if (filters.experienceSlug) {
          data = data.filter(pkg => pkg.experienceSlug === filters.experienceSlug);
        }
        if (filters.season) {
          const seasonMap = { summer: 'verano', winter: 'invierno' };
          data = data.filter(pkg => pkg.season === (seasonMap[filters.season] || filters.season));
        }
        return data;
      }
      return api.getPackages(locale, filters);
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
      return api.getPackageBySlug(slug, locale);
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
// HOOKS DE CONTENIDO ÚNICO
// ============================================

/**
 * Hook para obtener el Hero Section
 */
export const useHeroSection = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['heroSection', locale],
    queryFn: async () => {
      if (!USE_STRAPI) {
        // Retornar null para usar i18n existente
        return null;
      }
      return api.getHeroSection(locale);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener la página About
 */
export const useAboutPage = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['aboutPage', locale],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return null; // Usar i18n existente
      }
      return api.getAboutPage(locale);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener Site Settings
 */
export const useSiteSettings = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['siteSettings', locale],
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
      return api.getSiteSettings(locale);
    },
    ...defaultQueryOptions,
  });
};

// ============================================
// HOOKS DE GUÍAS Y TESTIMONIOS
// ============================================

/**
 * Hook para obtener guías
 * @param {boolean} featured - Solo destacados
 */
export const useGuides = (featured = false) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['guides', locale, featured],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return []; // Sin datos estáticos para guías
      }
      return api.getGuides(locale, featured);
    },
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener testimonios
 * @param {boolean} featured - Solo destacados
 */
export const useTestimonials = (featured = false) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['testimonials', locale, featured],
    queryFn: async () => {
      if (!USE_STRAPI) {
        return []; // Sin datos estáticos para testimonios
      }
      return api.getTestimonials(locale, featured);
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
