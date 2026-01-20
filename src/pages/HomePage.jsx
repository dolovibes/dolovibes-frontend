import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import VideoHero from '../components/VideoHero';
import PackageRecommendations from '../components/PackageRecommendations';
import Footer from '../components/Footer';
import { useFeaturedPackages } from '../services/hooks';

const HomePage = () => {
    const { t } = useTranslation('common');
    const location = useLocation();
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const recommendationsRef = useRef(null);

    // 🔄 Paquetes destacados desde Strapi (solo los que tienen showInHome=true)
    const { data: featuredPackages = [], isLoading } = useFeaturedPackages();

    // Key para forzar re-mount del VideoHero cuando navegamos al home
    const [heroKey, setHeroKey] = useState(Date.now());

    // Reset cuando navegamos de vuelta al home
    useEffect(() => {
        // Scroll al inicio
        window.scrollTo(0, 0);
        // Reset las selecciones
        setSelectedExperience(null);
        setSelectedPackages([]);
        // Cambiar key para forzar re-mount
        setHeroKey(Date.now());
    }, [location.key]);

    const handleExperienceSelect = (experience, pkgs) => {
        setSelectedExperience(experience);
        setSelectedPackages(pkgs || []);

        // Scroll hacia las recomendaciones cuando se selecciona una experiencia
        if (experience && pkgs && pkgs.length > 0) {
            setTimeout(() => {
                recommendationsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    };

    // Determinar qué paquetes mostrar
    const displayPackages = selectedPackages.length > 0 ? selectedPackages : featuredPackages;
    const displayTitle = selectedExperience?.title || t('recommendations.title');

    return (
        <div className="min-h-screen">
            <VideoHero key={heroKey} onExperienceSelect={handleExperienceSelect} />

            {/* Package Recommendations - siempre visible con paquetes destacados o seleccionados */}
            <div ref={recommendationsRef}>
                <PackageRecommendations
                    packages={displayPackages}
                    experienceTitle={displayTitle}
                    isLoading={isLoading}
                />
            </div>
            <Footer />
        </div>
    );
};

export default HomePage;
