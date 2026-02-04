import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, convertPathToLocale } from '../utils/localizedRoutes';

/**
 * Component that manages hreflang link tags for SEO
 * Tells search engines about alternative language versions of the current page
 * 
 * @param {Object} props
 * @param {Object} props.alternateUrls - Optional object with locale -> url mappings for content-specific URLs
 *                                       e.g., { es: '/es/experiencias/senderismo', en: '/en/experiences/hiking' }
 */
const Hreflang = ({ alternateUrls }) => {
  const location = useLocation();
  
  useEffect(() => {
    // Store original canonical href for cleanup
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    const originalCanonicalHref = existingCanonical?.href;
    
    // Remove any existing hreflang links
    const existingLinks = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingLinks.forEach(link => link.remove());
    
    // Get base URL from environment or window
    const baseUrl = import.meta.env.VITE_APP_URL || window.location.origin;
    
    // Generate URLs for each locale
    const hreflangUrls = {};
    
    if (alternateUrls) {
      // Use provided alternate URLs for content-specific pages (experiences, packages, legal)
      SUPPORTED_LOCALES.forEach(locale => {
        if (alternateUrls[locale]) {
          hreflangUrls[locale] = `${baseUrl}${alternateUrls[locale]}`;
        }
      });
    } else {
      // Generate URLs by converting current path to each locale
      SUPPORTED_LOCALES.forEach(locale => {
        const localizedPath = convertPathToLocale(location.pathname, locale);
        hreflangUrls[locale] = `${baseUrl}${localizedPath}`;
      });
    }
    
    // Add hreflang link tags
    Object.entries(hreflangUrls).forEach(([locale, url]) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = locale;
      link.href = url;
      document.head.appendChild(link);
    });
    
    // Add x-default (points to default locale version)
    if (hreflangUrls[DEFAULT_LOCALE]) {
      const xDefaultLink = document.createElement('link');
      xDefaultLink.rel = 'alternate';
      xDefaultLink.hreflang = 'x-default';
      xDefaultLink.href = hreflangUrls[DEFAULT_LOCALE];
      document.head.appendChild(xDefaultLink);
    }
    
    // Add or update canonical link for current page
    const canonicalElement = document.querySelector('link[rel="canonical"]');
    if (canonicalElement) {
      canonicalElement.href = `${baseUrl}${location.pathname}`;
    } else {
      const canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = `${baseUrl}${location.pathname}`;
      document.head.appendChild(canonicalLink);
    }
    
    // Cleanup function
    return () => {
      const links = document.querySelectorAll('link[rel="alternate"][hreflang]');
      links.forEach(link => link.remove());
      
      // Restore original canonical if it existed
      const currentCanonical = document.querySelector('link[rel="canonical"]');
      if (currentCanonical && originalCanonicalHref) {
        currentCanonical.href = originalCanonicalHref;
      } else if (currentCanonical && !originalCanonicalHref) {
        // Remove canonical we added if there wasn't one originally
        currentCanonical.remove();
      }
    };
  }, [location.pathname, alternateUrls]);
  
  return null; // This component doesn't render anything
};

export default Hreflang;
