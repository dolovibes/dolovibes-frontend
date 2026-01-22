import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAboutPage } from '../services/hooks';
import Footer from '../components/Footer';

const AboutUsPage = ({ onOpenQuote }) => {
    const { t } = useTranslation('about');
    const { t: tCommon } = useTranslation('common');
    const { data: aboutData, isLoading } = useAboutPage();

    // Scroll al inicio cuando carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Datos de la página - priorizar Strapi (multiidioma), fallback a i18n
    const pageTitle = aboutData?.pageTitle || t('title');
    const mainPhoto = aboutData?.mainPhoto || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000";
    const photoAlt = aboutData?.photoAlt || t('photoAlt');

    const origin = {
        title: aboutData?.origin?.title || t('origin.title'),
        text: aboutData?.origin?.text || t('origin.text')
    };
    const essence = {
        title: aboutData?.essence?.title || t('essence.title'),
        text: aboutData?.essence?.text || t('essence.text')
    };
    const vision = {
        title: aboutData?.vision?.title || t('vision.title'),
        text: aboutData?.vision?.text || t('vision.text')
    };
    const mission = {
        title: aboutData?.mission?.title || t('mission.title'),
        text: aboutData?.mission?.text || t('mission.text')
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-pizarra text-lg">{tCommon('loading.generic')}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Espaciado para navbar */}
            <div className="pt-24"></div>

            {/* Título centrado */}
            <div className="text-center py-16 md:py-20">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-grafito">
                    {pageTitle}
                </h1>
            </div>

            {/* Contenido principal: 2 columnas */}
            <div className="container mx-auto px-6 pb-20">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                    {/* Columna izquierda: Textos */}
                    <div className="space-y-12">
                        {/* Cómo nació Dolovibes */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {origin.title}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {origin.text}
                            </p>
                        </section>

                        {/* Nuestra esencia */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {essence.title}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {essence.text}
                            </p>
                        </section>

                        {/* Visión */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {vision.title}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {vision.text}
                            </p>
                        </section>

                        {/* Misión */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {mission.title}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {mission.text}
                            </p>
                        </section>
                    </div>

                    {/* Columna derecha: Foto grande */}
                    <div className="lg:sticky lg:top-28">
                        <div className="relative">
                            <img
                                src={mainPhoto}
                                alt={photoAlt}
                                loading="lazy"
                                width="700"
                                height="700"
                                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                                style={{ minHeight: '600px', maxHeight: '700px', aspectRatio: '1/1' }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AboutUsPage;
