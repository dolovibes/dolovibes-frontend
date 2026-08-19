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
 * Configuración por defecto para queries (colecciones)
 */
const defaultQueryOptions = {
  staleTime: 2 * 60 * 1000, // 2 minutos
  gcTime: 10 * 60 * 1000, // 10 minutos (fix #53: renamed from cacheTime)
  retry: 2,
  refetchOnWindowFocus: false,
};

/**
 * Configuración para Single Types (contenido que se edita frecuentemente)
 * Cache más corto para reflejar cambios del admin rápidamente
 */
const singleTypeQueryOptions = {
  staleTime: 30 * 1000, // 30 segundos
  gcTime: 2 * 60 * 1000, // 2 minutos (fix #53: renamed from cacheTime)
  retry: 0, // No reintentar - usar fallbacks
  refetchOnWindowFocus: true, // Refrescar al volver a la pestaña
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

/**
 * Hook para obtener páginas legales para el footer
 * Solo retorna legal pages con showInFooter=true, ordenadas por footerDisplayOrder
 */
export const useFooterLegalPages = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['footerLegalPages', locale],
    queryFn: () => api.getFooterLegalPages(),
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
 * - Cache corto (30s) para reflejar cambios del admin rápidamente
 */
export const useHeroSection = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['heroSection', locale],
    queryFn: () => api.getHeroSection({ locale }),
    ...singleTypeQueryOptions,
    // No mostrar errores en consola por 404
    meta: {
      errorMessage: null
    }
  });
};

/**
 * Hook para obtener la página About
 * Cache corto (30s) para reflejar cambios del admin rápidamente
 */
export const useAboutPage = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['aboutPage', locale],
    queryFn: () => api.getAboutPage(),
    ...singleTypeQueryOptions,
  });
};

/**
 * Hook para obtener Site Settings
 * Cache corto (30s) para reflejar cambios del admin rápidamente
 */
export const useSiteSettings = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['siteSettings', locale],
    queryFn: () => api.getSiteSettings({ locale }),
    ...singleTypeQueryOptions,
  });
};

/**
 * Hook para obtener Site Texts (textos globales)
 * Prioriza Strapi, componentes usan fallback a i18n si no hay datos
 * Cache corto (30s) para reflejar cambios del admin rápidamente
 */
export const useSiteTexts = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['siteTexts', locale],
    queryFn: () => api.getSiteTexts({ locale }),
    ...singleTypeQueryOptions,
  });
};

/**
 * Hook para obtener una página legal por slug
 */
export const useLegalPage = (slug) => {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useQuery({
    queryKey: ['legalPage', slug, locale],
    queryFn: () => api.getLegalPageBySlug(slug),
    enabled: !!slug,
    ...defaultQueryOptions,
  });
};

// ============================================
// HOOK DE REDIRECCIÓN INTELIGENTE POR IDIOMA
// ============================================

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { generateLocalizedUrl } from '../utils/localizedRoutes';

/**
 * Hook para manejar redirección inteligente al cambiar idioma en páginas de detalle
 * 
 * PROBLEMA: Los slugs en Strapi son diferentes por idioma:
 * - ES: /es/experiencias/senderismo
 * - EN: /en/experiences/hiking-experiences
 * 
 * SOLUCIÓN: Cuando el idioma cambia (vía URL), usa documentId para obtener el slug correcto
 * en el nuevo idioma y redirige automáticamente.
 * 
 * FALLBACK: Si no existe contenido en el idioma destino, usa el slug en español.
 * 
 * NOTA: Con la nueva arquitectura de rutas localizadas, este hook se activa cuando
 * el usuario cambia idioma via LanguageSwitcher, que ya redirige a la nueva URL.
 * El hook ahora solo necesita verificar si el slug existe en el nuevo idioma.
 *
 * TAMBIÉN corrige el caso de navegación directa/enlace con el slug equivocado
 * para el idioma de la URL (ej. `/en/paquetes/alto-adige-imperdible`, un slug
 * que solo existe en español — cada locale tiene su propio slug traducido).
 * `fetchFromStrapi` no encuentra ese slug en `en` y cae a un fallback completo
 * a español para no dejar la página vacía, pero eso deja contenido en español
 * bajo una URL que dice `/en/`, sin corregir nada (hallazgo real, reproducido
 * en vivo: `/en/paquetes/alto-adige-imperdible` y `/en/paquetes/travesia-carezza`
 * ambos muestran el título en español). `dataLocale` (el locale real de los
 * datos que llegaron, no el de la URL) permite distinguir ese fallback
 * silencioso de una carga legítima, y dispara la misma redirección que ya
 * usa el cambio de idioma manual — si existe una traducción real para el
 * locale de la URL, redirige a su slug correcto; si genuinamente no existe
 * ninguna traducción, no hace nada y el fallback a español queda como está
 * (ese caso SÍ es el comportamiento intencional).
 *
 * @param {object} options
 * @param {string} options.documentId - Document ID del recurso actual
 * @param {string} options.currentSlug - Slug actual en la URL
 * @param {string} options.resourceType - 'experience' | 'package' | 'legal'
 * @param {string} [options.dataLocale] - Locale real de los datos cargados (item.locale transformado)
 */
export const useLanguageAwareNavigation = ({ documentId, currentSlug, resourceType, dataLocale }) => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const previousLocale = useRef(i18n.language);
  const isRedirecting = useRef(false);
  // Evita repetir el chequeo de fallback silencioso para el mismo documento
  // en cada re-render (solo se necesita una vez por documentId).
  const checkedMismatchFor = useRef(null);

  // Devuelve `true` si el chequeo se resolvió (haya redirigido o no — "no
  // existe traducción" también es una resolución válida), `false` si se
  // saltó (ya había una redirección en curso) o falló por error de red — en
  // ambos casos el llamador NO debe marcar el documento como ya revisado,
  // para poder reintentar en el siguiente render (hallazgo de revisión
  // adversarial, Codex y Grok: marcar el guard antes de confirmar éxito deja
  // el fallback en español pegado para siempre si la consulta de slug falla
  // transitoriamente).
  const handleLanguageChange = useCallback(async (newLocale) => {
    // Evitar redirecciones recursivas
    if (isRedirecting.current || !documentId) return false;

    isRedirecting.current = true;

    try {
      let newSlug = null;
      const DEFAULT_LOCALE = 'es';
      
      // Intentar obtener el slug en el nuevo idioma
      if (resourceType === 'experience') {
        newSlug = await api.getExperienceSlugByDocumentId(documentId, newLocale);
        
        // Fallback a español si no existe en el idioma destino
        if (!newSlug && newLocale !== DEFAULT_LOCALE) {
          console.info(`[useLanguageAwareNavigation] No existe experiencia en ${newLocale}, usando fallback a español`);
          newSlug = await api.getExperienceSlugByDocumentId(documentId, DEFAULT_LOCALE);
        }
      } else if (resourceType === 'package') {
        newSlug = await api.getPackageSlugByDocumentId(documentId, newLocale);
        
        // Fallback a español si no existe en el idioma destino
        if (!newSlug && newLocale !== DEFAULT_LOCALE) {
          console.info(`[useLanguageAwareNavigation] No existe paquete en ${newLocale}, usando fallback a español`);
          newSlug = await api.getPackageSlugByDocumentId(documentId, DEFAULT_LOCALE);
        }
      } else if (resourceType === 'legal') {
        newSlug = await api.getLegalPageSlugByDocumentId(documentId, newLocale);
        
        // Fallback a español si no existe en el idioma destino
        if (!newSlug && newLocale !== DEFAULT_LOCALE) {
          console.info(`[useLanguageAwareNavigation] No existe página legal en ${newLocale}, usando fallback a español`);
          newSlug = await api.getLegalPageSlugByDocumentId(documentId, DEFAULT_LOCALE);
        }
      }
      
      // Solo redirigir si el slug cambió
      if (newSlug && newSlug !== currentSlug) {
        const routeKey = resourceType === 'experience' ? 'experiences' :
                         resourceType === 'package' ? 'packages' : 'legal';
        const newPath = generateLocalizedUrl(routeKey, newSlug, newLocale);
        navigate(newPath, { replace: true });
      }
      return true;
    } catch (error) {
      console.warn('[useLanguageAwareNavigation] Error redirecting:', error);
      return false;
    } finally {
      isRedirecting.current = false;
    }
  }, [documentId, currentSlug, resourceType, navigate]);

  useEffect(() => {
    const currentLocale = i18n.language;

    // Solo redirigir si el idioma cambió (no en carga inicial)
    if (previousLocale.current !== currentLocale && documentId) {
      handleLanguageChange(currentLocale);
    }

    previousLocale.current = currentLocale;
  }, [i18n.language, documentId, handleLanguageChange]);

  // Corrige el caso de carga inicial (URL directa / enlace) con slug
  // equivocado para el locale de la URL — ver nota arriba. Se dispara una
  // sola vez por documentId, independiente del efecto de "cambio de idioma"
  // de arriba (ese requiere que el idioma cambie DESPUÉS del mount; este
  // cubre el mismatch que ya viene desde el primer render).
  useEffect(() => {
    if (!documentId || !dataLocale) return;
    if (checkedMismatchFor.current === documentId) return;

    const currentLocale = i18n.language;
    if (dataLocale !== currentLocale) {
      // Marcar el guard SOLO si la resolución terminó bien (redirigió, o
      // confirmó que no hay traducción y el fallback es intencional) — si
      // falla (red caída, etc.) no se marca, así un siguiente render de este
      // mismo documentId puede reintentarlo en vez de quedar pegado en
      // español para siempre.
      handleLanguageChange(currentLocale).then((resolved) => {
        if (resolved) {
          checkedMismatchFor.current = documentId;
        }
      });
    }
  }, [documentId, dataLocale, i18n.language, handleLanguageChange]);

  return { isRedirecting: isRedirecting.current };
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
  useLegalPage,
  useFooterLegalPages,
  useLanguageAwareNavigation,
};

