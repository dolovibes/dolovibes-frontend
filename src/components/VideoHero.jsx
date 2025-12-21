import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ExperienceSelector from './ExperienceSelector';

const VideoHero = ({ onExperienceSelect }) => {
    const { t } = useTranslation('home');
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);

    // Detectar si es móvil para usar el video correcto
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Videos del hero - versión desktop (16:9) y móvil (9:16)
    const videoDesktop = "/videos/hero-video.mp4";
    const videoMobile = "/videos/hero-video-mobile.mp4";

    // Fallback images
    const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920";

    return (
        <div className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0">
                <video
                    key={isMobile ? 'mobile' : 'desktop'}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    className={`
                        w-full h-full object-cover
                        transition-opacity duration-1000
                        ${videoLoaded ? 'opacity-100' : 'opacity-0'}
                    `}
                    poster={fallbackImage}
                    onLoadedData={() => setVideoLoaded(true)}
                >
                    <source src={isMobile ? videoMobile : videoDesktop} type="video/mp4" />
                </video>

                {/* Imagen de fallback mientras carga el video */}
                {!videoLoaded && (
                    <img
                        src={fallbackImage}
                        alt="Dolomitas"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                )}

                {/* Overlay con gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-pizarra/40 via-transparent to-pizarra/60"></div>

                {/* Efecto de viñeta */}
                <div className="absolute inset-0 bg-radial-gradient"></div>
            </div>

            {/* Contenido central */}
            <div className="container mx-auto px-4 sm:px-6 relative z-10 py-16 md:py-20">
                <div className="text-center mb-8 md:mb-12">
                    <span className="inline-block py-2 px-4 rounded-full bg-alpino/20 border border-bruma/30 text-bruma text-xs sm:text-sm font-semibold mb-4 md:mb-6 backdrop-blur-sm animate-fade-in">
                        {t('hero.badge')}
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-3 md:mb-4 animate-fade-in-up drop-shadow-lg">
                        {t('hero.title')}
                        <br className="hidden sm:block" />
                        <span className="sm:hidden"> </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-bruma to-teal-300">
                            {t('hero.titleHighlight')}
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-nieve/90 max-w-xl md:max-w-2xl mx-auto mb-8 md:mb-12 animate-fade-in-up delay-200 px-2 drop-shadow-md">
                        {t('hero.subtitle')}
                    </p>
                </div>

                {/* Selector de experiencias */}
                <ExperienceSelector onExperienceSelect={onExperienceSelect} />
            </div>
        </div>
    );
};

export default VideoHero;
