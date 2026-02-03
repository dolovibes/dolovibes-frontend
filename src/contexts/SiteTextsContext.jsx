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
            experiences: getText('navbarExperiences', 'navbar.experiences'),
            aboutUs: getText('navbarAboutUs', 'navbar.aboutUs'),
            quote: getText('navbarQuote', 'navbar.quote'),
        },
        // Temporadas
        seasons: {
            summer: getText('seasonsSummer', 'seasons.summer'),
            winter: getText('seasonsWinter', 'seasons.winter'),
        },
        // Botones
        buttons: {
            next: getText('buttonsNext', 'buttons.next'),
            back: getText('buttonsBack', 'buttons.back'),
            submit: getText('buttonsSubmit', 'buttons.submit'),
            close: getText('buttonsClose', 'buttons.close'),
            quoteCustomTrip: getText('buttonsQuoteCustomTrip', 'buttons.quoteCustomTrip'),
        },
        // Etiquetas
        labels: {
            perPerson: getText('labelsPerPerson', 'labels.perPerson'),
            days: getText('labelsDays', 'labels.days'),
            persons: getText('labelsPersons', 'labels.persons'),
        },
        // Campos genéricos
        optional: getText('fieldOptional', 'optional'),
        // Estados de carga
        loading: {
            generic: getText('loadingGeneric', 'loading.generic'),
        },
        // Selector de experiencias (textos reutilizables)
        selector: {
            whatQuestion: getText('selectorWhatQuestion', 'selector.whatQuestion', 'home'),
            selectExperience: getText('selectorSelectExperience', 'selector.selectExperience', 'home'),
            noExperiences: getText('selectorNoExperiences', 'selector.noExperiences', 'home'),
        },
        // Footer (textos globales y mensaje de páginas legales)
        footer: {
            allRightsReserved: getText('footerAllRightsReserved', 'footer.allRightsReserved'),
            noLegalPages: getText('footerNoLegalPages', 'footer.noLegalPages'),
        },
        // Booking / Packages
        booking: {
            requestQuote: getText('bookingRequestQuote', 'booking.requestQuote', 'experiences'),
            noCommitment: getText('bookingNoCommitment', 'booking.noCommitment', 'experiences'),
        },
        packageInfo: {
            packageNotFound: getText('packageInfoPackageNotFound', 'packageNotFound', 'packageInfo'),
            itinerary: getText('packageInfoItinerary', 'itinerary', 'packageInfo'),
            includes: getText('packageInfoIncludes', 'includes', 'packageInfo'),
            notIncludes: getText('packageInfoNotIncludes', 'notIncludes', 'packageInfo'),
        },
        // Quote Modal
        quoteModal: {
            title: getText('quoteModalTitle', 'quoteModal.title'),
            step: getText('quoteModalStep', 'quoteModal.step'),
            of: getText('quoteModalOf', 'quoteModal.of'),
            step1Title: getText('quoteModalStep1Title', 'quoteModal.step1Title'),
            interestLabel: getText('quoteModalInterestLabel', 'quoteModal.interestLabel'),
            customPlan: getText('quoteModalCustomPlan', 'quoteModal.customPlan'),
            dateLabel: getText('quoteModalDateLabel', 'quoteModal.dateLabel'),
            travelersLabel: getText('quoteModalTravelersLabel', 'quoteModal.travelersLabel'),
            notesLabel: getText('quoteModalNotesLabel', 'quoteModal.notesLabel'),
            notesPlaceholder: getText('quoteModalNotesPlaceholder', 'quoteModal.notesPlaceholder'),
            step2Title: getText('quoteModalStep2Title', 'quoteModal.step2Title'),
            namePlaceholder: getText('quoteModalNamePlaceholder', 'quoteModal.namePlaceholder'),
            emailPlaceholder: getText('quoteModalEmailPlaceholder', 'quoteModal.emailPlaceholder'),
            phonePlaceholder: getText('quoteModalPhonePlaceholder', 'quoteModal.phonePlaceholder'),
            successTitle: getText('quoteModalSuccessTitle', 'quoteModal.successTitle'),
            successMessage: getText('quoteModalSuccessMessage', 'quoteModal.successMessage'),
            validationError: getText('quoteModalValidationError', 'quoteModal.validationError'),
            sending: getText('quoteModalSending', 'quoteModal.sending'),
            errorTitle: getText('quoteModalErrorTitle', 'quoteModal.errorTitle'),
            errorMessage: getText('quoteModalErrorMessage', 'quoteModal.errorMessage'),
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
            title: getText('recommendationsTitle', 'recommendations.title'),
            subtitle: getText('recommendationsSubtitle', 'recommendations.subtitle'),
            offer: getText('recommendationsOffer', 'recommendations.offer'),
            viewDetails: getText('recommendationsViewDetails', 'recommendations.viewDetails'),
        },
        // Contact Method
        contactMethod: {
            label: getText('contactMethodLabel', 'form.contactMethod', 'quoteForm'),
            whatsapp: getText('contactMethodWhatsapp', 'contactOptions.whatsapp', 'quoteForm'),
            phone: getText('contactMethodPhone', 'contactOptions.phone', 'quoteForm'),
            email: getText('contactMethodEmail', 'contactOptions.email', 'quoteForm'),
        },
        // Hero section
        hero: {
            title: getText('heroTitle', 'hero.title', 'home'),
            titleHighlight: getText('heroTitleHighlight', 'hero.titleHighlight', 'home'),
        },
        // Currency selector
        currency: {
            loading: getText('currencyLoading', 'currency.loading'),
            currentLabel: getText('currencyCurrentLabel', 'currency.currentLabel'),
            selectLabel: getText('currencySelectLabel', 'currency.selectLabel'),
        },
        // Hiking level questions
        questions: {
            q1: getText('questionsQ1', 'questions.q1', 'hikingLevel'),
            q2: getText('questionsQ2', 'questions.q2', 'hikingLevel'),
            q3: getText('questionsQ3', 'questions.q3', 'hikingLevel'),
            q4: getText('questionsQ4', 'questions.q4', 'hikingLevel'),
            q5: getText('questionsQ5', 'questions.q5', 'hikingLevel'),
        },
        // Hiking level answers
        answers: {
            q1a: getText('answersQ1a', 'answers.q1a', 'hikingLevel'),
            q1b: getText('answersQ1b', 'answers.q1b', 'hikingLevel'),
            q1c: getText('answersQ1c', 'answers.q1c', 'hikingLevel'),
            q2a: getText('answersQ2a', 'answers.q2a', 'hikingLevel'),
            q2b: getText('answersQ2b', 'answers.q2b', 'hikingLevel'),
            q2c: getText('answersQ2c', 'answers.q2c', 'hikingLevel'),
            q3a: getText('answersQ3a', 'answers.q3a', 'hikingLevel'),
            q3b: getText('answersQ3b', 'answers.q3b', 'hikingLevel'),
            q3c: getText('answersQ3c', 'answers.q3c', 'hikingLevel'),
            q4a: getText('answersQ4a', 'answers.q4a', 'hikingLevel'),
            q4b: getText('answersQ4b', 'answers.q4b', 'hikingLevel'),
            q4c: getText('answersQ4c', 'answers.q4c', 'hikingLevel'),
            q5a: getText('answersQ5a', 'answers.q5a', 'hikingLevel'),
            q5b: getText('answersQ5b', 'answers.q5b', 'hikingLevel'),
            q5c: getText('answersQ5c', 'answers.q5c', 'hikingLevel'),
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
