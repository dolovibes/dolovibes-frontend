import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Shield, Database, Share2, Key, Lock, FileText, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

import DynamicLegalPage from './DynamicLegalPage';

const PrivacyPageContent = () => {
    const { t } = useTranslation('legal');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* ... (Existing Content Structure) ... */}
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
                        {t('privacy.title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {t('privacy.intro')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* 1. Datos Personales que Recabamos */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Database className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                1. {t('privacy.dataTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">{t('privacy.dataIntro')}</p>

                        <ul className="ml-14 space-y-2 mb-4">
                            {t('privacy.dataList', { returnObjects: true }).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-pizarra">
                                    <span className="w-1.5 h-1.5 bg-pizarra rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="ml-14 p-4 bg-white rounded-xl border border-niebla">
                            <p className="text-niebla text-sm italic">
                                {t('privacy.dataNote')}
                            </p>
                        </div>
                    </div>

                    {/* 2. Finalidades del Tratamiento */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                2. {t('privacy.purposeTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">{t('privacy.dataIntro')}</p>

                        <ul className="ml-14 space-y-2 mb-6">
                            {t('privacy.purposeList', { returnObjects: true }).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-pizarra">
                                    <span className="w-1.5 h-1.5 bg-pizarra rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-pizarra mb-4 ml-14">{t('privacy.additionalPurpose')}</p>

                        <p className="text-niebla text-sm ml-14 italic">
                            {t('privacy.cancelNote')}
                        </p>
                    </div>

                    {/* 3. Transferencia de Datos */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Share2 className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                3. {t('privacy.transferTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">{t('privacy.transferIntro')}</p>

                        <ul className="ml-14 space-y-2 mb-4">
                            {t('privacy.transferList', { returnObjects: true }).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-pizarra">
                                    <span className="w-1.5 h-1.5 bg-pizarra rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-niebla text-sm ml-14 italic">
                            {t('privacy.transferNote')}
                        </p>
                    </div>

                    {/* 4. Derechos ARCO */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Key className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                4. {t('privacy.arcoTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">{t('privacy.arcoIntro')}</p>

                        <div className="ml-14 grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                            {t('privacy.arcoRights', { returnObjects: true }).map((item, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-4 border border-niebla text-center">
                                    <span className="text-2xl font-bold text-pizarra">{item.charAt(0)}</span>
                                    <p className="text-sm text-niebla mt-1">{item}</p>
                                </div>
                            ))}
                        </div>

                        <p className="text-pizarra ml-14">{t('privacy.arcoNote')}</p>

                        <div className="ml-14 mt-4 p-4 bg-pizarra/5 rounded-xl border border-pizarra/20">
                            <p className="text-pizarra text-sm">
                                {t('privacy.arcoEmail')}
                            </p>
                            <a href="mailto:info@dolo-vibes.com" className="flex items-center gap-2 mt-2 text-pizarra font-semibold hover:underline">
                                <Mail className="w-4 h-4" />
                                info@dolo-vibes.com
                            </a>
                        </div>
                    </div>

                    {/* 5. Medidas de Seguridad */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                5. {t('privacy.securityTitle')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('privacy.securityDesc')}
                        </p>
                    </div>

                    {/* 6. Cambios al Aviso */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <Shield className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                6. {t('privacy.changesTitle')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('privacy.changesDesc')}
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
const PrivacyPage = () => {
    const { t } = useTranslation('legal');
    return (
        <DynamicLegalPage
            slug="privacidad"
            fallbackTitle={t('privacy.title')}
            fallbackContent={<PrivacyPageContent />}
        />
    );
};

export default PrivacyPage;
