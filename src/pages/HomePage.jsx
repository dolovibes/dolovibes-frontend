import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import VideoHero from '../components/VideoHero';
import PackageRecommendations from '../components/PackageRecommendations';
import Footer from '../components/Footer';
import Hreflang from '../components/Hreflang';
import { useFeaturedPackages } from '../services/hooks';
import { prefetchHomeData } from '../utils/dataPrefetch';
import { useStaticAlternateUrls } from '../hooks/useAlternateUrls';

const HomePage = () => {
    const { t, i18n } = useTranslation('common');
    const location = useLocation();
    const queryClient = useQueryClient();
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const recommendationsRef = useRef(null);

    // 🔄 Paquetes destacados desde Strapi (solo los que tienen showInHome=true)
    const { data: featuredPackages = [], isLoading, error } = useFeaturedPackages();

    // Debug: Verificar si los paquetes se están cargando correctamente
    useEffect(() => {
        if (!isLoading) {
            if (featuredPackages.length === 0 && !error) {
                console.warn('[WARNING] No hay paquetes con showInHome=true en Strapi. Verifica:');
                console.warn('1. Que existan paquetes en el admin de Strapi');
                console.warn('2. Que tengan el campo showInHome marcado como true');
                console.warn('3. Que estén publicados (botón Publish en el admin)');
            }
        }
    }, [featuredPackages, isLoading, error]);

    // Key para forzar re-mount del VideoHero cuando navegamos al home
    const [heroKey, setHeroKey] = useState(Date.now());

    // Prefetch de datos críticos en background
    useEffect(() => {
        // Esperar 2 segundos para que el hero cargue primero
        const timer = setTimeout(() => {
            prefetchHomeData(queryClient, i18n.language);
        }, 2000);

        return () => clearTimeout(timer);
    }, [queryClient, i18n.language]);

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
    // Usamos selectedPackages.length para asegurar que solo mostramos paquetes de experiencia si hay al menos uno
    // Si la experiencia seleccionada no tiene paquetes, mostramos los featured como fallback
    const displayPackages = selectedPackages.length > 0 ? selectedPackages : featuredPackages;
    const displayTitle = selectedExperience?.title || t('recommendations.title');

    // Hreflang para SEO
    const homeAlternateUrls = useStaticAlternateUrls('home');

    return (
        <div className="min-h-screen">
            <Hreflang alternateUrls={homeAlternateUrls} />
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
