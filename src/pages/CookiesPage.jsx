import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Cookie, Settings, BarChart3, Megaphone, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import DynamicLegalPage from './DynamicLegalPage';

const CookiesPageContent = () => {
    const { t } = useTranslation('legal');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* ... (Existing Content Structure moved inside here) ... */}
            {/* Header */}
            <div className="bg-gradient-to-r from-pizarra to-pizarra pt-28 pb-16">
                <div className="container mx-auto px-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('common.back')}
                    </button>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {t('cookies.title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {t('cookies.intro')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* 1. ¿Qué son las cookies? */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Cookie className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                1. {t('cookies.whatTitle')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('cookies.whatDesc')}
                        </p>
                    </div>

                    {/* 2. Tipos de Cookies */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                2. {t('cookies.typesTitle')}
                            </h2>
                        </div>

                        <div className="ml-14 space-y-4">
                            {/* Cookies necesarias */}
                            <div className="bg-white rounded-xl p-5 border border-niebla">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Settings className="w-4 h-4 text-green-600" />
                                    </div>
                                    <h3 className="font-semibold text-grafito">{t('cookies.necessary')}</h3>
                                </div>
                                <p className="text-pizarra text-sm pl-11">
                                    {t('cookies.necessaryDesc')}
                                </p>
                            </div>

                            {/* Cookies de análisis */}
                            <div className="bg-white rounded-xl p-5 border border-niebla">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <h3 className="font-semibold text-grafito">{t('cookies.analytics')}</h3>
                                </div>
                                <p className="text-pizarra text-sm pl-11">
                                    {t('cookies.analyticsDesc')}
                                </p>
                            </div>

                            {/* Cookies de marketing */}
                            <div className="bg-white rounded-xl p-5 border border-niebla">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Megaphone className="w-4 h-4 text-purple-600" />
                                    </div>
                                    <h3 className="font-semibold text-grafito">{t('cookies.marketing')}</h3>
                                </div>
                                <p className="text-pizarra text-sm pl-11">
                                    {t('cookies.marketingDesc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 3. Gestión de Cookies */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Settings className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                3. {t('cookies.managementTitle')}
                            </h2>
                        </div>
                        <div className="ml-14 space-y-3">
                            <p className="text-pizarra">
                                {t('cookies.managementDesc1')}
                            </p>
                            <p className="text-pizarra">
                                {t('cookies.managementDesc2')}
                            </p>
                        </div>
                    </div>

                    {/* 4. Cambios en la Política */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                4. {t('cookies.changesTitle')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('cookies.changesDesc')}
                        </p>
                    </div>

                </div>

                {/* Call to action */}
                <div className="max-w-4xl mx-auto mt-12 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-pizarra text-white px-8 py-3 rounded-full font-semibold hover:bg-pizarra/90 transition-colors"
                    >
                        {t('common.backToHome')}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Wrapper dinámico
const CookiesPage = () => {
    const { t } = useTranslation('legal');
    return (
        <DynamicLegalPage
            slug="politica-de-cookies"
            fallbackTitle={t('cookies.title')}
            fallbackContent={<CookiesPageContent />}
        />
    );
};

export default CookiesPage;
