import React, { useState, useEffect, useRef } from 'react';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { useHeroSection } from '../services/hooks';
import ExperienceSelector from './ExperienceSelector';

const VideoHero = ({ onExperienceSelect, onSeasonSelect, initialSeason, initialExperienceSlug }) => {
    const { texts: siteTexts } = useSiteTextsContext();

    // Hook de Strapi - NO bloqueamos el render si falla o tarda
    const { data: heroData } = useHeroSection();

    const [isMobile, setIsMobile] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
    const videoRef = useRef(null);
    const containerRef = useRef(null);

    // Media del hero - SOLO si están configurados en Strapi
    // IMPORTANTE: Definir antes de los useEffects que lo usan
    const videoDesktop = heroData?.videoDesktop;
    const imageMobile = heroData?.imageMobile;

    // En móvil: usar imagen estática (mejor rendimiento y consumo de datos)
    // En desktop: usar video
    const showMobileImage = isMobile && imageMobile;
    const showDesktopVideo = !isMobile && videoDesktop;

    // Detectar si es móvil
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Cargar el video inmediatamente (sin delay artificial)
    useEffect(() => {
        // Cargar inmediatamente para evitar parpadeo
        setShouldLoadVideo(true);
    }, []);

    // Safety timeout: asegurar que el video se muestre eventualmente
    useEffect(() => {
        if (shouldLoadVideo) {
            // Mostrar el video después de 3.5s si los eventos no se dispararon
            // Timeout más largo para conexiones lentas en mobile
            const timer = setTimeout(() => {
                setVideoLoaded(true);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [shouldLoadVideo]);

    // Intentar reproducir el video explícitamente (fix para algunos navegadores)
    // fix #63: Track play promise to handle abort on unmount
    useEffect(() => {
        let cancelled = false;
        if (videoRef.current && shouldLoadVideo && showDesktopVideo) {
            const video = videoRef.current;

            // Intentar reproducir explícitamente
            const playPromise = video.play();

            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        if (!cancelled) setVideoLoaded(true);
                    })
                    .catch((error) => {
                        if (cancelled) return;
                        if (import.meta.env.DEV && error.name !== 'AbortError') {
                            console.warn('[VideoHero] Autoplay blocked:', error.message);
                        }
                        setVideoLoaded(true);
                    });
            }
        }
        return () => { cancelled = true; };
    }, [shouldLoadVideo, showDesktopVideo]);

    // Textos del hero - priorizar Strapi, fallback a i18n
    const title = heroData?.title || siteTexts.hero.title;
    const titleHighlight = heroData?.titleHighlight || siteTexts.hero.titleHighlight;

    // IMPORTANTE: NO hay loading state - siempre renderizamos con fallbacks
    return (
        <div ref={containerRef} className="relative min-h-[100svh] flex items-center justify-center bg-pizarra">
            {/* Fondo sólido como LCP - se muestra inmediatamente */}
            <div className="absolute inset-0 z-0 bg-pizarra">
                {/* Imagen de fondo para móvil - mejor rendimiento y menor consumo de datos */}
                {showMobileImage && (
                    <img
                        src={imageMobile}
                        alt=""
                        loading="eager"
                        fetchPriority="high"
                        onLoad={() => setVideoLoaded(true)}
                        onError={() => setVideoLoaded(true)}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                {/* Video de fondo para desktop */}
                {showDesktopVideo && shouldLoadVideo && (
                    <video
                        ref={videoRef}
                        key="desktop"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="auto"
                        onCanPlay={() => setVideoLoaded(true)}
                        onCanPlayThrough={() => setVideoLoaded(true)}
                        onLoadedData={() => setVideoLoaded(true)}
                        onPlaying={() => setVideoLoaded(true)}
                        onError={(e) => {
                            if (import.meta.env.DEV) {
                                console.error('[VideoHero] Video loading error:', e);
                            }
                            setVideoLoaded(true);
                        }}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <source src={videoDesktop} type="video/mp4" />
                    </video>
                )}

                {/* Overlay con gradiente para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-pizarra/40 via-transparent to-pizarra/60 z-10"></div>
            </div>

            {/* Contenido central - Este es el LCP real */}
            <div className="container mx-auto px-4 sm:px-6 relative z-20 py-8 md:py-20">
                <div className="text-center mb-4 md:mb-12 mt-6 md:mt-10">
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
                <ExperienceSelector
                    onExperienceSelect={onExperienceSelect}
                    onSeasonSelect={onSeasonSelect}
                    initialSeason={initialSeason}
                    initialExperienceSlug={initialExperienceSlug}
                />
            </div>
        </div>
    );
};

export default VideoHero;
