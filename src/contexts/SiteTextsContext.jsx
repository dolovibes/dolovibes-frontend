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
    const { t: tHikingLevel } = useTranslation('hikingLevel');
    const { t: tQuoteForm } = useTranslation('quoteForm');

    // Función helper que prioriza Strapi sobre i18n
    const getText = useMemo(() => {
        return (strapiPath, i18nKey, namespace = 'common') => {
            // Intentar obtener de Strapi primero
            if (strapiTexts) {
                const value = strapiPath.split('.').reduce((obj, key) => obj?.[key], strapiTexts);
                // Validar que el valor no sea solo una cadena vacía o null
                if (value && value.trim && value.trim() !== '') return value;
                if (value && typeof value !== 'string') return value;
            }

            // Fallback a i18n
            switch (namespace) {
                case 'home':
                    return tHome(i18nKey);
                case 'packageInfo':
                    return tPackageInfo(i18nKey);
                case 'experiences':
                    return tExperiences(i18nKey);
                case 'hikingLevel':
                    return tHikingLevel(i18nKey);
                case 'quoteForm':
                    return tQuoteForm(i18nKey);
                default:
                    return tCommon(i18nKey);
            }
        };
    }, [strapiTexts, tCommon, tHome, tPackageInfo, tExperiences, tHikingLevel, tQuoteForm]);

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
            persons: getText('labels.persons', 'labels.persons'),
        },
        // Campos genéricos
        fieldOptional: getText('fieldOptional', 'fieldOptional'),
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
        // Quote Modal
        quoteModal: {
            title: getText('quoteModal.title', 'quoteModal.title'),
            step: getText('quoteModal.step', 'quoteModal.step'),
            of: getText('quoteModal.of', 'quoteModal.of'),
            step1Title: getText('quoteModal.step1Title', 'quoteModal.step1Title'),
            interestLabel: getText('quoteModal.interestLabel', 'quoteModal.interestLabel'),
            customPlan: getText('quoteModal.customPlan', 'quoteModal.customPlan'),
            dateLabel: getText('quoteModal.dateLabel', 'quoteModal.dateLabel'),
            travelersLabel: getText('quoteModal.travelersLabel', 'quoteModal.travelersLabel'),
            notesLabel: getText('quoteModal.notesLabel', 'quoteModal.notesLabel'),
            notesPlaceholder: getText('quoteModal.notesPlaceholder', 'quoteModal.notesPlaceholder'),
            step2Title: getText('quoteModal.step2Title', 'quoteModal.step2Title'),
            namePlaceholder: getText('quoteModal.namePlaceholder', 'quoteModal.namePlaceholder'),
            emailPlaceholder: getText('quoteModal.emailPlaceholder', 'quoteModal.emailPlaceholder'),
            phonePlaceholder: getText('quoteModal.phonePlaceholder', 'quoteModal.phonePlaceholder'),
            successTitle: getText('quoteModal.successTitle', 'quoteModal.successTitle'),
            successMessage: getText('quoteModal.successMessage', 'quoteModal.successMessage'),
            validationError: getText('quoteModal.validationError', 'quoteModal.validationError'),
            sending: getText('quoteModal.sending', 'quoteModal.sending'),
            errorTitle: getText('quoteModal.errorTitle', 'quoteModal.errorTitle'),
            errorMessage: getText('quoteModal.errorMessage', 'quoteModal.errorMessage'),
        },
        // Package Quote Modal
        packageQuoteModal: {
            subtitle: getText('packageQuoteModal.subtitle', 'subtitle', 'quoteForm'),
            completeInfo: getText('packageQuoteModal.completeInfo', 'completeInfo', 'quoteForm'),
            firstName: getText('packageQuoteModal.firstName', 'form.firstName', 'quoteForm'),
            lastName: getText('packageQuoteModal.lastName', 'form.lastName', 'quoteForm'),
            city: getText('packageQuoteModal.city', 'form.city', 'quoteForm'),
            state: getText('packageQuoteModal.state', 'form.state', 'quoteForm'),
            country: getText('packageQuoteModal.country', 'form.country', 'quoteForm'),
            email: getText('packageQuoteModal.email', 'form.email', 'quoteForm'),
            phone: getText('packageQuoteModal.phone', 'form.phone', 'quoteForm'),
            travelMonth: getText('packageQuoteModal.travelMonth', 'form.travelMonth', 'quoteForm'),
            travelers: getText('packageQuoteModal.travelers', 'form.travelers', 'quoteForm'),
            tripType: getText('packageQuoteModal.tripType', 'form.tripType', 'quoteForm'),
            tripTypeGuided: getText('packageQuoteModal.tripTypeGuided', 'tripTypes.guided', 'quoteForm'),
            tripTypeGuidedDesc: getText('packageQuoteModal.tripTypeGuidedDesc', 'tripTypes.guidedDesc', 'quoteForm'),
            tripTypeSelfGuided: getText('packageQuoteModal.tripTypeSelfGuided', 'tripTypes.selfGuided', 'quoteForm'),
            tripTypeSelfGuidedDesc: getText('packageQuoteModal.tripTypeSelfGuidedDesc', 'tripTypes.selfGuidedDesc', 'quoteForm'),
            additionalServices: getText('packageQuoteModal.additionalServices', 'form.additionalServices', 'quoteForm'),
            additionalServicesPlaceholder: getText('packageQuoteModal.additionalServicesPlaceholder', 'form.additionalServicesPlaceholder', 'quoteForm'),
            buttonSubmit: getText('packageQuoteModal.buttonSubmit', 'buttons.submit', 'quoteForm'),
            buttonSending: getText('packageQuoteModal.buttonSending', 'buttons.sending', 'quoteForm'),
            successTitle: getText('packageQuoteModal.successTitle', 'success.title', 'quoteForm'),
            successMessage: getText('packageQuoteModal.successMessage', 'success.message', 'quoteForm'),
            validationError: getText('packageQuoteModal.validationError', 'validation.requiredFields', 'quoteForm'),
            errorMessage: getText('packageQuoteModal.errorMessage', 'error.message', 'quoteForm'),
            placeholderFirstName: getText('packageQuoteModal.placeholderFirstName', 'placeholders.firstName', 'quoteForm'),
            placeholderLastName: getText('packageQuoteModal.placeholderLastName', 'placeholders.lastName', 'quoteForm'),
            placeholderCity: getText('packageQuoteModal.placeholderCity', 'placeholders.city', 'quoteForm'),
            placeholderState: getText('packageQuoteModal.placeholderState', 'placeholders.state', 'quoteForm'),
            placeholderCountry: getText('packageQuoteModal.placeholderCountry', 'placeholders.country', 'quoteForm'),
            placeholderEmail: getText('packageQuoteModal.placeholderEmail', 'placeholders.email', 'quoteForm'),
            placeholderPhone: getText('packageQuoteModal.placeholderPhone', 'placeholders.phone', 'quoteForm'),
        },
        // Recommendations
        recommendations: {
            title: getText('recommendations.title', 'recommendations.title'),
            subtitle: getText('recommendations.subtitle', 'recommendations.subtitle'),
            offer: getText('recommendations.offer', 'recommendations.offer'),
            viewDetails: getText('recommendations.viewDetails', 'recommendations.viewDetails'),
        },
        // Contact Method
        contactMethod: {
            label: getText('contactMethod.label', 'form.contactMethod', 'quoteForm'),
            whatsapp: getText('contactMethod.whatsapp', 'contactOptions.whatsapp', 'quoteForm'),
            phone: getText('contactMethod.phone', 'contactOptions.phone', 'quoteForm'),
            email: getText('contactMethod.email', 'contactOptions.email', 'quoteForm'),
        },
        // Hero section
        hero: {
            title: getText('hero.title', 'hero.title', 'home'),
            titleHighlight: getText('hero.titleHighlight', 'hero.titleHighlight', 'home'),
        },
        // Currency selector
        currency: {
            loading: getText('currency.loading', 'currency.loading'),
            currentLabel: getText('currency.currentLabel', 'currency.currentLabel'),
            selectLabel: getText('currency.selectLabel', 'currency.selectLabel'),
        },
        // Hiking level questions
        questions: {
            q1: getText('questions.q1', 'questions.q1', 'hikingLevel'),
            q2: getText('questions.q2', 'questions.q2', 'hikingLevel'),
            q3: getText('questions.q3', 'questions.q3', 'hikingLevel'),
            q4: getText('questions.q4', 'questions.q4', 'hikingLevel'),
            q5: getText('questions.q5', 'questions.q5', 'hikingLevel'),
        },
        // Hiking level answers
        answers: {
            q1a: getText('answers.q1a', 'answers.q1a', 'hikingLevel'),
            q1b: getText('answers.q1b', 'answers.q1b', 'hikingLevel'),
            q1c: getText('answers.q1c', 'answers.q1c', 'hikingLevel'),
            q2a: getText('answers.q2a', 'answers.q2a', 'hikingLevel'),
            q2b: getText('answers.q2b', 'answers.q2b', 'hikingLevel'),
            q2c: getText('answers.q2c', 'answers.q2c', 'hikingLevel'),
            q3a: getText('answers.q3a', 'answers.q3a', 'hikingLevel'),
            q3b: getText('answers.q3b', 'answers.q3b', 'hikingLevel'),
            q3c: getText('answers.q3c', 'answers.q3c', 'hikingLevel'),
            q4a: getText('answers.q4a', 'answers.q4a', 'hikingLevel'),
            q4b: getText('answers.q4b', 'answers.q4b', 'hikingLevel'),
            q4c: getText('answers.q4c', 'answers.q4c', 'hikingLevel'),
            q5a: getText('answers.q5a', 'answers.q5a', 'hikingLevel'),
            q5b: getText('answers.q5b', 'answers.q5b', 'hikingLevel'),
            q5c: getText('answers.q5c', 'answers.q5c', 'hikingLevel'),
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
