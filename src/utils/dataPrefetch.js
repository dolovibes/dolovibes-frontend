/**
 * Data Prefetching Utilities
 * 
 * Este módulo proporciona funciones para hacer prefetch de datos críticos
 * y mejorar la percepción de velocidad de la aplicación.
 */

import api from '../services/api';

/**
 * Prefetch de datos críticos para el HomePage
 * Se ejecuta en background mientras el usuario ve el hero
 */
export const prefetchHomeData = async (queryClient, locale) => {
  try {
    // Prefetch de experiencias para el selector
    await queryClient.prefetchQuery({
      queryKey: ['experiences', null, locale],
      queryFn: () => api.getExperiences(),
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch de paquetes destacados
    await queryClient.prefetchQuery({
      queryKey: ['featuredPackages', locale],
      queryFn: () => api.getFeaturedPackages(),
      staleTime: 5 * 60 * 1000,
    });

    // Prefetch de footer experiences (usado en Footer)
    queryClient.prefetchQuery({
      queryKey: ['footerExperiences', locale],
      queryFn: () => api.getFooterExperiences(),
      staleTime: 5 * 60 * 1000,
    });
  } catch (error) {
    // Silenciar errores de prefetch - no son críticos
    console.debug('Prefetch failed:', error);
  }
};

/**
 * Prefetch de datos de una experiencia específica
 * Útil cuando el usuario hace hover sobre un link
 */
export const prefetchExperience = async (queryClient, slug, locale) => {
  if (!slug) return;

  try {
    await queryClient.prefetchQuery({
      queryKey: ['experience', slug, locale],
      queryFn: () => api.getExperienceBySlug(slug),
      staleTime: 5 * 60 * 1000,
    });

    // También prefetch los paquetes de esa experiencia
    queryClient.prefetchQuery({
      queryKey: ['packages', { experienceSlug: slug }, locale],
      queryFn: () => api.getPackages({ experienceSlug: slug }),
      staleTime: 5 * 60 * 1000,
    });
  } catch (error) {
    console.debug('Experience prefetch failed:', error);
  }
};

/**
 * Prefetch de datos de un paquete específico
 * Útil cuando el usuario hace hover sobre una PackageCard
 */
export const prefetchPackage = async (queryClient, slug, locale) => {
  if (!slug) return;

  try {
    await queryClient.prefetchQuery({
      queryKey: ['package', slug, locale],
      queryFn: () => api.getPackageBySlug(slug),
      staleTime: 5 * 60 * 1000,
    });
  } catch (error) {
    console.debug('Package prefetch failed:', error);
  }
};

/**
 * Prefetch inteligente basado en la ruta actual
 * Predice qué datos necesitará el usuario a continuación
 */
export const smartPrefetch = (queryClient, currentPath, locale) => {
  // En el home, prefetch de datos comunes
  // fix #49: Match home with or without locale prefix
  if (currentPath === '/' || /^\/[a-z]{2}\/?$/.test(currentPath)) {
    prefetchHomeData(queryClient, locale);
  }
  
  // fix #49: Match localized experience routes (/:lang/experiencias|experiences|esperienze|erlebnisse/:slug)
  const expMatch = currentPath.match(/^\/[a-z]{2}\/(experiencias|experiences|esperienze|erlebnisse)\/([^/]+)/);
  if (expMatch) {
    const slug = expMatch[2];
    if (slug) {
      queryClient.prefetchQuery({
        queryKey: ['packages', { experienceSlug: slug }, locale],
        queryFn: () => api.getPackages({ experienceSlug: slug }),
        staleTime: 5 * 60 * 1000,
      });
    }
  }
};

/**
 * Hook React para usar prefetch de manera declarativa
 */
export const usePrefetch = (queryClient) => {
  return {
    prefetchExperience: (slug, locale) => prefetchExperience(queryClient, slug, locale),
    prefetchPackage: (slug, locale) => prefetchPackage(queryClient, slug, locale),
    prefetchHome: (locale) => prefetchHomeData(queryClient, locale),
  };
};
