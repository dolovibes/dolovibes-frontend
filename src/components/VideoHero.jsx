import React from 'react';
import { useTranslation } from 'react-i18next';
import ExperienceSelector from './ExperienceSelector';

const VideoHero = ({ onExperienceSelect }) => {
    const { t } = useTranslation('home');

    // Video del hero - archivo local en public/videos/
    const videoUrl = "/videos/hero-video.mp4";

    // Fallback image en caso de que el video no cargue
    const fallbackImage = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920";

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Video de fondo */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster={fallbackImage}
                >
                    <source src={videoUrl} type="video/mp4" />
                    {/* Fallback para navegadores que no soportan video */}
                    <img
                        src={fallbackImage}
                        alt="Montañas"
                        className="w-full h-full object-cover"
                    />
                </video>

                {/* Overlay con gradiente para mejor legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900/80"></div>

                {/* Efecto de viñeta */}
                <div className="absolute inset-0 bg-radial-gradient"></div>
            </div>

            {/* Contenido central */}
            <div className="container mx-auto px-6 relative z-10 py-20">
                <div className="text-center mb-12">
                    <span className="inline-block py-2 px-4 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm animate-fade-in">
                        {t('hero.badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
                        {t('hero.title')}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                            {t('hero.titleHighlight')}
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200/80 max-w-2xl mx-auto mb-12 animate-fade-in-up delay-200">
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

