import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { SUPPORTED_LOCALES, generateLocalizedUrl } from '../utils/localizedRoutes';
import api from '../services/api';

/**
 * Hook to generate alternate URLs for hreflang tags
 * Fetches slugs for all locales based on documentId
 * 
 * @param {string} contentType - 'experience' | 'package' | 'legal'
 * @param {string} documentId - The documentId of the content
 * @param {string} currentSlug - The current slug (fallback)
 * @returns {Object} Object with locale -> URL mappings
 */
export const useAlternateUrls = (contentType, documentId, currentSlug) => {
  // Map content types to their fetch functions and route keys
  const config = useMemo(() => ({
    experience: {
      fetchFn: api.getExperienceSlugByDocumentId,
      routeKey: 'experiences'
    },
    package: {
      fetchFn: api.getPackageSlugByDocumentId,
      routeKey: 'packages'
    },
    legal: {
      fetchFn: api.getLegalPageSlugByDocumentId,
      routeKey: 'legal'
    }
  }), []);
  
  const { fetchFn, routeKey } = config[contentType] || {};
  
  // Use useQueries for parallel fetching (correct React hooks pattern)
  const slugQueries = useQueries({
    queries: SUPPORTED_LOCALES.map(locale => ({
      queryKey: [`${contentType}-slug`, documentId, locale],
      queryFn: () => fetchFn?.(documentId, locale),
      enabled: !!documentId && !!fetchFn,
      staleTime: 1000 * 60 * 30, // 30 minutes
      retry: false
    }))
  });
  
  // fix #50: Extract individual values for stable memo dependencies
  const isLoading = slugQueries.some(q => q.isLoading);

  // Build alternate URLs with stable dependencies using JSON.stringify
  const slugDataKey = JSON.stringify(slugQueries.map(q => q.data));
  const alternateUrls = useMemo(() => {
    const urls = {};
    const slugData = JSON.parse(slugDataKey);

    SUPPORTED_LOCALES.forEach((locale, index) => {
      const slug = slugData[index] || currentSlug;

      if (slug && routeKey) {
        urls[locale] = generateLocalizedUrl(routeKey, slug, locale);
      }
    });

    return urls;
  }, [slugDataKey, currentSlug, routeKey]);
  
  return { alternateUrls, isLoading };
};

/**
 * Hook for static pages (home, about) that don't have dynamic slugs
 * Simply generates the localized URLs based on route key
 * 
 * @param {string} routeKey - 'home' | 'about'
 * @returns {Object} Object with locale -> URL mappings
 */
export const useStaticAlternateUrls = (routeKey) => {
  return useMemo(() => {
    const urls = {};
    
    SUPPORTED_LOCALES.forEach(locale => {
      urls[locale] = generateLocalizedUrl(routeKey, null, locale);
    });
    
    return urls;
  }, [routeKey]);
};

export default useAlternateUrls;
