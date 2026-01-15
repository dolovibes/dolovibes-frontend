/**
 * React Query Hooks para datos de Strapi
 * 
 * ARQUITECTURA:
 * ─────────────────────────────────────────────────────────────
 * - El contenido de Strapi soporta 4 locales: es, en, it, de
 * - React Query maneja caching y revalidación por locale
 * - La UI soporta los mismos 4 idiomas via i18n
 * - Invalidación de cache al cambiar idioma
 */
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import api from './api';

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
    queryKey: ['experiences', season, locale],
    queryFn: () => api.getExperiences(season),
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
    queryFn: () => api.getExperienceBySlug(slug),
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
    queryFn: () => api.getPackages(filters),
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
    queryFn: () => api.getPackageBySlug(slug),
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
// ============================================

/**
 * Hook para obtener el Hero Section
 */
export const useHeroSection = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['heroSection', locale],
    queryFn: () => api.getHeroSection(),
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
    queryFn: () => api.getAboutPage(),
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener Site Settings
 */
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => api.getSiteSettings(),
    ...defaultQueryOptions,
  });
};

/**
 * Hook para obtener Site Texts (textos globales)
 * Prioriza Strapi, componentes usan fallback a i18n si no hay datos
 */
export const useSiteTexts = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['siteTexts', locale],
    queryFn: () => api.getSiteTexts(),
    ...defaultQueryOptions,
  });
};

// ============================================
export default {
  useExperiences,
  useExperience,
  usePackages,
  usePackage,
  usePackagesByExperience,
  useHeroSection,
  useAboutPage,
  useSiteSettings,
  useSiteTexts,
};

