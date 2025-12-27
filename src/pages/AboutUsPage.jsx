import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

const AboutUsPage = ({ onOpenQuote }) => {
    const { t } = useTranslation('about');

    // Scroll al inicio cuando carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // URL de imagen placeholder - reemplazar con foto real del cliente
    const clientPhoto = "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1000";

    return (
        <div className="min-h-screen bg-white">
            {/* Espaciado para navbar */}
            <div className="pt-24"></div>

            {/* Título centrado */}
            <div className="text-center py-16 md:py-20">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-grafito">
                    {t('title')}
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
                                {t('origin.title')}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {t('origin.text')}
                            </p>
                        </section>

                        {/* Nuestra esencia */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {t('essence.title')}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {t('essence.text')}
                            </p>
                        </section>

                        {/* Visión */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {t('vision.title')}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {t('vision.text')}
                            </p>
                        </section>

                        {/* Misión */}
                        <section>
                            <h2 className="text-2xl md:text-3xl font-bold text-grafito mb-4">
                                {t('mission.title')}
                            </h2>
                            <p className="text-pizarra text-lg leading-relaxed">
                                {t('mission.text')}
                            </p>
                        </section>
                    </div>

                    {/* Columna derecha: Foto grande */}
                    <div className="lg:sticky lg:top-28">
                        <div className="relative">
                            <img
                                src={clientPhoto}
                                alt={t('photoAlt')}
                                className="w-full h-auto rounded-2xl shadow-2xl object-cover"
                                style={{ minHeight: '600px', maxHeight: '700px' }}
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
