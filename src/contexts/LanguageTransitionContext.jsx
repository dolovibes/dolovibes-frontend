/**
 * Contexto de Transición de Idioma
 *
 * Maneja el estado global de cambio de idioma para evitar
 * que se muestren textos mezclados durante la transición.
 */
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { convertPathToLocale } from '../utils/localizedRoutes';

const LanguageTransitionContext = createContext(null);

// Locales soportados
const SUPPORTED_LOCALES = ['es', 'en', 'it', 'de'];

// Queries críticas que deben cargarse antes de mostrar contenido
const CRITICAL_QUERY_KEYS = ['siteTexts', 'heroSection', 'siteSettings'];

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

            // 1. Cancelar queries en progreso
            await queryClient.cancelQueries();

            // 2. Remover todas las queries que dependen del locale del caché
            //    Esto fuerza a que se muestren estados de loading en lugar de datos viejos
            queryClient.removeQueries({
                predicate: (query) => {
                    const queryKey = query.queryKey;
                    const lastKey = queryKey[queryKey.length - 1];
                    return typeof lastKey === 'string' && SUPPORTED_LOCALES.includes(lastKey);
                }
            });

            // 3. Cambiar idioma en i18n
            await i18n.changeLanguage(newLocale);

            // 4. Guardar preferencia
            try {
                localStorage.setItem('preferredLanguage', newLocale);
            } catch (e) {
                // localStorage no disponible
            }

            // 5. Navegar a la nueva URL
            const currentPath = location.pathname;
            const newPath = convertPathToLocale(currentPath, newLocale);
            navigate(newPath, { replace: true });

            // 6. Esperar a que las queries críticas se carguen
            //    Esto previene que el usuario vea contenido parcialmente cargado
            const criticalPromises = CRITICAL_QUERY_KEYS.map(key =>
                queryClient.fetchQuery({
                    queryKey: [key, newLocale],
                    staleTime: 0, // Forzar fetch fresco
                }).catch(() => null) // No fallar si una query falla
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
