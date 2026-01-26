import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText, CreditCard, Calendar, AlertTriangle, Shield, Scale, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

// Mapeo de iconos a componentes
const iconMap = {
    FileText,
    CreditCard,
    Calendar,
    AlertTriangle,
    Shield,
    Scale,
    CheckCircle
};

import DynamicLegalPage from './DynamicLegalPage';

const TermsPageContent = () => {
    const { t } = useTranslation('legal');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Obtener secciones desde i18n
    const sections = t('terms.sections', { returnObjects: true }) || [];

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
                        {t('terms.back')}
                    </button>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {t('terms.title')}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {t('terms.intro')}
                    </p>
                    <p className="text-white/60 text-sm mt-4">
                        {t('terms.acceptance')}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto space-y-8">
                    {Array.isArray(sections) && sections.map((section) => {
                        const IconComponent = iconMap[section.icon] || FileText;

                        return (
                            <div
                                key={section.id}
                                className="bg-nieve rounded-2xl p-6 md:p-8 border border-niebla"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 bg-pizarra rounded-xl flex items-center justify-center flex-shrink-0">
                                        <IconComponent className="w-5 h-5 text-white" />
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-grafito">
                                        {section.id}. {section.title}
                                    </h2>
                                </div>

                                {/* Contenido con definiciones */}
                                {section.content && (
                                    <div className="ml-14 space-y-3">
                                        {section.content.map((item, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="font-semibold text-pizarra">{item.term}:</span>
                                                <span className="text-pizarra">{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Texto simple */}
                                {section.text && (
                                    <p className="ml-14 text-pizarra leading-relaxed">
                                        {section.text}
                                    </p>
                                )}

                                {/* Subsecciones */}
                                {section.subsections && (
                                    <div className="ml-14 space-y-4 mt-4">
                                        {section.subsections.map((sub, idx) => (
                                            <div key={idx}>
                                                <h3 className="font-semibold text-grafito mb-1">{sub.subtitle}</h3>
                                                <p className="text-pizarra">{sub.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Lista de puntos */}
                                {section.bullets && (
                                    <ul className="ml-14 mt-4 space-y-2">
                                        {section.bullets.map((bullet, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-pizarra">
                                                <span className="w-1.5 h-1.5 bg-pizarra rounded-full mt-2 flex-shrink-0"></span>
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                {/* Nota */}
                                {section.note && (
                                    <div className="ml-14 mt-4 p-4 bg-white rounded-xl border border-niebla">
                                        <p className="text-niebla text-sm italic">{section.note}</p>
                                    </div>
                                )}

                                {/* Advertencia */}
                                {section.warning && (
                                    <div className="ml-14 mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                                        <p className="text-amber-800 text-sm font-medium">⚠️ {section.warning}</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Call to action */}
                <div className="max-w-4xl mx-auto mt-12 text-center">
                    <div className="bg-gradient-to-r from-pizarra/5 to-pizarra/10 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-grafito mb-3">{t('terms.questions')}</h3>
                        <p className="text-pizarra mb-6">
                            {t('terms.questionsDesc')}
                        </p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-pizarra text-white px-8 py-3 rounded-full font-semibold hover:bg-pizarra/90 transition-colors"
                        >
                            {t('terms.backToHome')}
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

// Wrapper dinámico
const TermsPage = () => {
    const { t } = useTranslation('legal');
    return (
        <DynamicLegalPage
            slug="terminos-y-condiciones"
            fallbackTitle={t('terms.title')}
            fallbackContent={<TermsPageContent />}
        />
    );
};

export default TermsPage;
