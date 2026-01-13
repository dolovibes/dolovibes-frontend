import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeroSection } from '../services/hooks';
import ExperienceSelector from './ExperienceSelector';

const VideoHero = ({ onExperienceSelect }) => {
    const { t } = useTranslation('home');
    const { data: heroData, isLoading } = useHeroSection();
    const [isMobile, setIsMobile] = useState(false);

    // Detectar si es móvil para usar el video correcto
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Videos del hero - usar Strapi solo para media, no para textos
    const videoDesktop = heroData?.videoDesktop || "/videos/hero-video.mp4";
    const videoMobile = heroData?.videoMobile || "/videos/hero-video-mobile-trecime.mp4";

    // Textos del hero - SIEMPRE usar traducciones i18n
    // El contenido de Strapi está solo en español, pero la UI soporta 6 idiomas
    const title = t('hero.title');
    const titleHighlight = t('hero.titleHighlight');
    const badge = t('hero.badge');

    if (isLoading) {
        return (
            <div className="relative min-h-[100svh] flex items-center justify-center bg-pizarra">
                <div className="text-white text-lg">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="relative min-h-[100svh] flex items-center justify-center">
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0">
                <video
                    key={isMobile ? 'mobile' : 'desktop'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                >
                    <source src={isMobile ? videoMobile : videoDesktop} type="video/mp4" />
                </video>

                {/* Overlay con gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-pizarra/40 via-transparent to-pizarra/60"></div>

                {/* Efecto de viñeta */}
                <div className="absolute inset-0 bg-radial-gradient"></div>
            </div>

            {/* Contenido central */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 md:py-20">
                <div className="text-center mb-8 md:mb-12 mt-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-3 md:mb-4 animate-fade-in-up drop-shadow-lg">
                        {title}
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        <span className="text-white">
                            {titleHighlight}
                        </span>
                    </h1>
                </div>

                {/* Selector de experiencias */}
                <ExperienceSelector onExperienceSelect={onExperienceSelect} />
            </div>
        </div>
    );
};

export default VideoHero;
