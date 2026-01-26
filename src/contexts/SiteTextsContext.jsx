/**
 * Contexto de Textos del Sitio
 * 
 * Prioriza textos de Strapi, con fallback a i18n.
 * Permite al usuario de Strapi editar cualquier texto del sitio.
 */
import React, { createContext, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSiteTexts } from '../services/hooks';

const SiteTextsContext = createContext(null);

/**
 * Provider que combina textos de Strapi con fallback a i18n
 */
export const SiteTextsProvider = ({ children }) => {
    const { data: strapiTexts, isLoading } = useSiteTexts();
    const { t: tCommon } = useTranslation('common');
    const { t: tHome } = useTranslation('home');
    const { t: tPackageInfo } = useTranslation('packageInfo');
    const { t: tExperiences } = useTranslation('experiences');

    // Función helper que prioriza Strapi sobre i18n
    const getText = useMemo(() => {
        return (strapiPath, i18nKey, namespace = 'common') => {
            // Intentar obtener de Strapi primero
            if (strapiTexts) {
                const value = strapiPath.split('.').reduce((obj, key) => obj?.[key], strapiTexts);
                if (value) return value;
            }

            // Fallback a i18n
            switch (namespace) {
                case 'home':
                    return tHome(i18nKey);
                case 'packageInfo':
                    return tPackageInfo(i18nKey);
                case 'experiences':
                    return tExperiences(i18nKey);
                default:
                    return tCommon(i18nKey);
            }
        };
    }, [strapiTexts, tCommon, tHome, tPackageInfo, tExperiences]);

    // Objeto de textos con fallback automático
    const texts = useMemo(() => ({
        // Navegación
        navbar: {
            experiences: getText('navbar.experiences', 'navbar.experiences'),
            aboutUs: getText('navbar.aboutUs', 'navbar.aboutUs'),
            quote: getText('navbar.quote', 'navbar.quote'),
        },
        // Temporadas
        seasons: {
            summer: getText('seasons.summer', 'seasons.summer'),
            winter: getText('seasons.winter', 'seasons.winter'),
        },
        // Botones
        buttons: {
            next: getText('buttons.next', 'buttons.next'),
            back: getText('buttons.back', 'buttons.back'),
            submit: getText('buttons.submit', 'buttons.submit'),
            close: getText('buttons.close', 'buttons.close'),
            quoteCustomTrip: getText('buttons.quoteCustomTrip', 'buttons.quoteCustomTrip'),
        },
        // Etiquetas
        labels: {
            perPerson: getText('labels.perPerson', 'labels.perPerson'),
            days: getText('labels.days', 'labels.days'),
        },
        // Estados de carga
        loading: {
            generic: getText('loading.generic', 'loading.generic'),
        },
        // Selector de experiencias (textos reutilizables)
        selector: {
            whatQuestion: getText('selector.whatQuestion', 'selector.whatQuestion', 'home'),
            selectExperience: getText('selector.selectExperience', 'selector.selectExperience', 'home'),
            noExperiences: getText('selector.noExperiences', 'selector.noExperiences', 'home'),
        },
        // Footer (textos globales y mensaje de páginas legales)
        footer: {
            allRightsReserved: getText('footer.allRightsReserved', 'footer.allRightsReserved'),
            noLegalPages: getText('footer.noLegalPages', 'footer.noLegalPages'),
        },
        // Booking / Packages
        booking: {
            requestQuote: getText('booking.requestQuote', 'booking.requestQuote', 'experiences'),
            noCommitment: getText('booking.noCommitment', 'booking.noCommitment', 'experiences'),
        },
        packageInfo: {
            packageNotFound: getText('packageInfo.packageNotFound', 'packageNotFound', 'packageInfo'),
            itinerary: getText('packageInfo.itinerary', 'itinerary', 'packageInfo'),
            includes: getText('packageInfo.includes', 'includes', 'packageInfo'),
            notIncludes: getText('packageInfo.notIncludes', 'notIncludes', 'packageInfo'),
        },
    }), [getText]);

    return (
        <SiteTextsContext.Provider value={{ texts, isLoading, getText }}>
            {children}
        </SiteTextsContext.Provider>
    );
};

/**
 * Hook para consumir los textos del sitio
 * @returns {{ texts: object, isLoading: boolean, getText: function }}
 */
export const useSiteTextsContext = () => {
    const context = useContext(SiteTextsContext);
    if (!context) {
        throw new Error('useSiteTextsContext must be used within SiteTextsProvider');
    }
    return context;
};

export default SiteTextsContext;
