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

/**
 * Hook para obtener experiencias para el footer
 * Solo retorna experiencias con showInFooter=true, ordenadas por footerDisplayOrder
 */
export const useFooterExperiences = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['footerExperiences', locale],
    queryFn: () => api.getFooterExperiences(),
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

/**
 * Hook para obtener paquetes destacados para el home
 * Solo retorna paquetes con showInHome=true, ordenados por homeDisplayOrder
 */
export const useFeaturedPackages = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['featuredPackages', locale],
    queryFn: () => api.getFeaturedPackages(),
    ...defaultQueryOptions,
  });
};

// ============================================
// HOOKS DE CONTENIDO ÚNICO (Single Types)
// ============================================

/**
 * Hook para obtener el Hero Section
 * NOTA: Este hook NUNCA debe bloquear el render
 * - retry: 0 para fallar rápido si hay 404
 * - Los componentes deben usar fallbacks
 */
export const useHeroSection = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['heroSection', locale],
    queryFn: () => api.getHeroSection(),
    ...defaultQueryOptions,
    // Override: No reintentar en hero - debe fallar rápido
    retry: 0,
    // No mostrar errores en consola por 404
    meta: {
      errorMessage: null
    }
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
 * NOTA: retry: 0 para fallar rápido si no está configurado en Strapi
 */
export const useSiteSettings = () => {
  return useQuery({
    queryKey: ['siteSettings'],
    queryFn: () => api.getSiteSettings(),
    ...defaultQueryOptions,
    retry: 0, // No reintentar - usar fallbacks
  });
};

/**
 * Hook para obtener Site Texts (textos globales)
 * Prioriza Strapi, componentes usan fallback a i18n si no hay datos
 * NOTA: retry: 0 para fallar rápido si no está configurado en Strapi
 */
export const useSiteTexts = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['siteTexts', locale],
    queryFn: () => api.getSiteTexts(),
    ...defaultQueryOptions,
    retry: 0, // No reintentar - usar fallbacks i18n
  });
};

// ============================================
export default {
  useExperiences,
  useExperience,
  useFooterExperiences,
  usePackages,
  usePackage,
  usePackagesByExperience,
  useFeaturedPackages,
  useHeroSection,
  useAboutPage,
  useSiteSettings,
  useSiteTexts,
};

