import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, XCircle, RefreshCw, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import Footer from '../components/Footer';

import DynamicLegalPage from './DynamicLegalPage';

const CancellationPageContent = () => {
    const { t } = useTranslation('legal');
    const { t: tCommon } = useTranslation('common');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
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
                        {t('cancellation.title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {t('cancellation.intro')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Cancelaciones por parte del cliente */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                {t('cancellation.clientTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">{t('cancellation.clientGeneral')}</p>

                        <div className="ml-14 space-y-4">
                            <div className="bg-white rounded-xl p-4 border border-niebla">
                                <h3 className="font-semibold text-grafito mb-2">
                                    {t('cancellation.moreThan45')}
                                </h3>
                                <p className="text-pizarra">
                                    {t('cancellation.moreThan45Desc')}
                                </p>
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-niebla">
                                <h3 className="font-semibold text-grafito mb-2">
                                    {t('cancellation.lessThan45')}
                                </h3>
                                <p className="text-red-600 font-medium">{t('cancellation.lessThan45Desc')}</p>
                            </div>
                        </div>

                        <div className="ml-14 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                            <p className="text-amber-800 text-sm font-medium">
                                ⚠️ {t('cancellation.nonRefundable')}
                            </p>
                        </div>
                    </div>

                    {/* Cancelaciones por parte de la Empresa */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                {t('cancellation.companyTitle')}
                            </h2>
                        </div>

                        <p className="text-pizarra mb-4 ml-14">
                            {t('cancellation.companyIntro')}
                        </p>

                        <ul className="ml-14 mb-6 space-y-2">
                            {t('cancellation.companyReasons', { returnObjects: true }).map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3 text-pizarra">
                                    <span className="w-1.5 h-1.5 bg-pizarra rounded-full"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-pizarra mb-4 ml-14">{t('cancellation.clientOptions')}</p>

                        <div className="ml-14 space-y-2">
                            {t('cancellation.options', { returnObjects: true }).map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-pizarra">
                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* No-Show */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                {t('cancellation.noShow')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('cancellation.noShowDesc')}
                        </p>
                    </div>

                    {/* Reembolsos */}
                    <div className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                {t('cancellation.refunds')}
                            </h2>
                        </div>
                        <p className="text-pizarra ml-14">
                            {t('cancellation.refundsDesc')}
                        </p>
                    </div>

                    {/* Nota importante */}
                    <div className="bg-gradient-to-r from-pizarra/5 to-pizarra/10 rounded-2xl p-6 md:p-8 border border-pizarra/20">
                        <h3 className="text-lg font-bold text-grafito mb-3 flex items-center gap-2">
                            📌 {t('cancellation.importantNote')}
                        </h3>
                        <p className="text-pizarra">
                            {t('cancellation.importantNoteDesc')}
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
const CancellationPage = () => {
    const { t } = useTranslation('legal');
    return (
        <DynamicLegalPage
            slug="politica-de-cancelacion"
            fallbackTitle={t('cancellation.title')}
            fallbackContent={<CancellationPageContent />}
        />
    );
};

export default CancellationPage;
