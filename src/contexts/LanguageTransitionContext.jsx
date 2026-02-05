/**
 * Contexto de Transición de Idioma
 *
 * Maneja el estado global de cambio de idioma para evitar
 * que se muestren textos mezclados durante la transición.
 *
 * IMPORTANTE: Para páginas de detalle (experiencias, paquetes, legales),
 * obtiene el slug localizado de Strapi ANTES de limpiar el cache.
 */
import { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertPathToLocale, parseLocalizedPath } from '../utils/localizedRoutes';
import api from '../services/api';

const LanguageTransitionContext = createContext(null);

// Locales soportados
const SUPPORTED_LOCALES = ['es', 'en', 'it', 'de'];

// Queries críticas que deben cargarse antes de mostrar contenido
const CRITICAL_QUERY_KEYS = ['siteTexts', 'heroSection', 'siteSettings'];

/**
 * Obtiene el documentId del cache de React Query para una entidad
 * @param {object} queryClient - React Query client
 * @param {string} type - 'experience' | 'package' | 'legal'
 * @param {string} slug - Slug actual
 * @param {string} locale - Locale actual
 * @returns {string|null} documentId o null
 */
const getDocumentIdFromCache = (queryClient, type, slug, locale) => {
    // Intentar obtener del cache de la entidad individual
    const queryKey = type === 'experience' ? ['experience', slug, locale] :
                     type === 'package' ? ['package', slug, locale] :
                     ['legalPage', slug, locale];

    const cachedData = queryClient.getQueryData(queryKey);
    if (cachedData?.documentId) {
        return cachedData.documentId;
    }

    // Intentar obtener del cache de la lista
    const listKey = type === 'experience' ? ['experiences'] :
                    type === 'package' ? ['packages'] :
                    ['legalPages'];

    // Buscar en todas las queries que empiecen con ese key
    const queries = queryClient.getQueriesData({ queryKey: listKey });
    for (const [, data] of queries) {
        if (Array.isArray(data)) {
            const item = data.find(item => item.slug === slug);
            if (item?.documentId) {
                return item.documentId;
            }
        }
    }

    return null;
};

/**
 * Obtiene el slug localizado para el nuevo idioma
 * @param {string} type - 'experience' | 'package' | 'legal'
 * @param {string} documentId - Document ID de la entidad
 * @param {string} targetLocale - Idioma destino
 * @returns {Promise<string|null>} Slug localizado o null
 */
const getLocalizedSlug = async (type, documentId, targetLocale) => {
    try {
        if (type === 'experience') {
            return await api.getExperienceSlugByDocumentId(documentId, targetLocale);
        } else if (type === 'package') {
            return await api.getPackageSlugByDocumentId(documentId, targetLocale);
        } else if (type === 'legal') {
            return await api.getLegalPageSlugByDocumentId(documentId, targetLocale);
        }
    } catch (error) {
        console.warn('[LanguageTransition] Error fetching localized slug:', error.message);
    }
    return null;
};

export const LanguageTransitionProvider = ({ children }) => {
    const [isTransitioning, setIsTransitioning] = useState(false);
    const { i18n } = useTranslation();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const abortControllerRef = useRef(null);

    /**
     * Cambia el idioma de forma segura, esperando a que todas las
     * queries se actualicen antes de mostrar el nuevo contenido.
     */
    const changeLanguage = useCallback(async (newLocale) => {
        // Validar locale
        if (!SUPPORTED_LOCALES.includes(newLocale)) {
            console.error(`Locale no soportado: ${newLocale}`);
            return false;
        }

        // No hacer nada si ya estamos en ese idioma
        if (i18n.language === newLocale) {
            return true;
        }

        // Cancelar transición anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            setIsTransitioning(true);

            const currentPath = location.pathname;
            const { routeKey, slug, locale: currentLocale } = parseLocalizedPath(currentPath);

            // ═══════════════════════════════════════════════════════════════
            // PASO 1: Obtener slug localizado ANTES de limpiar cache
            // ═══════════════════════════════════════════════════════════════
            let localizedSlug = null;

            // Solo para páginas de detalle (con slug)
            if (slug && (routeKey === 'experiences' || routeKey === 'packages' || routeKey === 'legal')) {
                const type = routeKey === 'experiences' ? 'experience' :
                             routeKey === 'packages' ? 'package' : 'legal';

                // Obtener documentId del cache actual
                const documentId = getDocumentIdFromCache(queryClient, type, slug, currentLocale);

                if (documentId) {
                    // Obtener slug en el nuevo idioma
                    localizedSlug = await getLocalizedSlug(type, documentId, newLocale);

                    // Fallback a español si no existe en el idioma destino
                    if (!localizedSlug && newLocale !== 'es') {
                        console.info(`[LanguageTransition] No existe ${type} en ${newLocale}, usando fallback a español`);
                        localizedSlug = await getLocalizedSlug(type, documentId, 'es');
                    }
                }
            }

            // ═══════════════════════════════════════════════════════════════
            // PASO 2: Cancelar queries en progreso
            // ═══════════════════════════════════════════════════════════════
            await queryClient.cancelQueries();

            // ═══════════════════════════════════════════════════════════════
            // PASO 3: Remover queries que dependen del locale del caché
            // ═══════════════════════════════════════════════════════════════
            queryClient.removeQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    const lastKey = queryKey[queryKey.length - 1];
                    return typeof lastKey === 'string' && SUPPORTED_LOCALES.includes(lastKey);
                }
            });

            // ═══════════════════════════════════════════════════════════════
            // PASO 4: Cambiar idioma en i18n
            // ═══════════════════════════════════════════════════════════════
            await i18n.changeLanguage(newLocale);

            // ═══════════════════════════════════════════════════════════════
            // PASO 5: Guardar preferencia
            // ═══════════════════════════════════════════════════════════════
            try {
                localStorage.setItem('preferredLanguage', newLocale);
            } catch (e) {
                // localStorage no disponible
            }

            // ═══════════════════════════════════════════════════════════════
            // PASO 6: Navegar a la nueva URL (con slug localizado si aplica)
            // ═══════════════════════════════════════════════════════════════
            const newPath = convertPathToLocale(currentPath, newLocale, localizedSlug);
            navigate(newPath, { replace: true });

            // ═══════════════════════════════════════════════════════════════
            // PASO 7: Esperar queries críticas
            // ═══════════════════════════════════════════════════════════════
            const criticalPromises = CRITICAL_QUERY_KEYS.map(key =>
                queryClient.fetchQuery({
                    queryKey: [key, newLocale],
                    staleTime: 0,
                }).catch(() => null)
            );

            await Promise.all(criticalPromises);

            return true;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.info('[LanguageTransition] Cambio de idioma cancelado');
                return false;
            }
            console.error('[LanguageTransition] Error al cambiar idioma:', error);
            return false;
        } finally {
            setIsTransitioning(false);
            abortControllerRef.current = null;
        }
    }, [i18n, queryClient, navigate, location.pathname]);

    return (
        <LanguageTransitionContext.Provider value={{ isTransitioning, changeLanguage }}>
            {children}
        </LanguageTransitionContext.Provider>
    );
};

/**
 * Hook para usar el contexto de transición de idioma
 */
export const useLanguageTransition = () => {
    const context = useContext(LanguageTransitionContext);
    if (!context) {
        throw new Error('useLanguageTransition must be used within LanguageTransitionProvider');
    }
    return context;
};

export default LanguageTransitionContext;
