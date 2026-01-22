import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeroSection } from '../services/hooks';
import ExperienceSelector from './ExperienceSelector';

const VideoHero = ({ onExperienceSelect }) => {
    const { t } = useTranslation('home');
    const { t: tCommon } = useTranslation('common');
    const { data: heroData, isLoading } = useHeroSection();
    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Detectar si es móvil para usar el video correcto
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Retrasar la carga del video para priorizar el LCP (contenido de texto)
    // El video se carga después de que la página esté interactiva
    useEffect(() => {
        // Esperar a que el contenido principal se renderice primero
        const timer = setTimeout(() => {
            setShouldLoadVideo(true);
        }, 100); // Pequeño delay para priorizar el render del texto

        return () => clearTimeout(timer);
    }, []);

    // Cargar video cuando esté listo
    useEffect(() => {
        if (shouldLoadVideo && videoRef.current) {
            // Usar requestIdleCallback si está disponible para no bloquear
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => {
                    videoRef.current?.load();
                });
            } else {
                videoRef.current.load();
            }
        }
    }, [shouldLoadVideo]);

    // Videos del hero - usar Strapi o fallback a archivos locales
    const videoDesktop = heroData?.videoDesktop || "/videos/hero-video.mp4";
    const videoMobile = heroData?.videoMobile || "/videos/hero-video-mobile-trecime.mp4";
    const videoSrc = isMobile ? videoMobile : videoDesktop;

    // Textos del hero - priorizar Strapi (multiidioma), fallback a i18n
    const title = heroData?.title || t('hero.title');
    const titleHighlight = heroData?.titleHighlight || t('hero.titleHighlight');

    // No mostrar loading state para evitar flash - renderizar directamente con fallbacks
    return (
        <div ref={containerRef} className="relative min-h-[100svh] flex items-center justify-center bg-pizarra">
            {/* Fondo sólido como LCP - se muestra inmediatamente */}
            <div className="absolute inset-0 z-0 bg-pizarra">
                {/* Video de fondo - carga después del contenido principal */}
                {shouldLoadVideo && (
                    <video
                        ref={videoRef}
                        key={isMobile ? 'mobile' : 'desktop'}
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onCanPlayThrough={() => setVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <source src={videoSrc} type="video/mp4" />
                    </video>
                )}

                {/* Overlay con gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-pizarra/40 via-transparent to-pizarra/60 z-10"></div>
            </div>

            {/* Contenido central - Este es el LCP real */}
            <div className="container mx-auto px-4 sm:px-6 relative z-20 py-16 md:py-20">
                <div className="text-center mb-8 md:mb-12 mt-10">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-3 md:mb-4 drop-shadow-lg">
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
