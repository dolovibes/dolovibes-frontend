import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import VideoHero from '../components/VideoHero';
import PackageRecommendations from '../components/PackageRecommendations';
import Footer from '../components/Footer';
import Hreflang from '../components/Hreflang';
import { useFeaturedPackages } from '../services/hooks';
import { prefetchHomeData } from '../utils/dataPrefetch';
import { useStaticAlternateUrls } from '../hooks/useAlternateUrls';
import usePageMeta from '../hooks/usePageMeta';

const HomePage = () => {
    const { t, i18n } = useTranslation('common');

    // SEO meta tags (fix #8)
    usePageMeta('DoloVibes', t('meta.homeDescription', { defaultValue: 'Discover unique outdoor experiences in the Dolomites' }));
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [selectedPackages, setSelectedPackages] = useState([]);
    const recommendationsRef = useRef(null);
    const hasRestoredRef = useRef(false);

    // Read initial selection from URL search params
    const seasonParam = searchParams.get('season');
    const experienceParam = searchParams.get('experience');

    // Paquetes destacados desde Strapi (solo los que tienen showInHome=true)
    const { data: featuredPackages = [], isLoading, error } = useFeaturedPackages();

    // Debug: Verificar si los paquetes se están cargando correctamente
    useEffect(() => {
        if (import.meta.env.DEV && !isLoading) {
            if (featuredPackages.length === 0 && !error) {
                console.warn('[WARNING] No hay paquetes con showInHome=true en Strapi.');
            }
        }
    }, [featuredPackages, isLoading, error]);

    // Prefetch de datos críticos en background
    useEffect(() => {
        // Esperar 2 segundos para que el hero cargue primero
        const timer = setTimeout(() => {
            prefetchHomeData(queryClient, i18n.language);
        }, 2000);

        return () => clearTimeout(timer);
    }, [queryClient, i18n.language]);

    // Scroll to top only on fresh navigation (no search params = no restoration)
    useEffect(() => {
        if (!seasonParam && !experienceParam) {
            window.scrollTo(0, 0);
        }
        hasRestoredRef.current = false;
    }, [location.key]);

    const handleExperienceSelect = useCallback((experience, pkgs) => {
        setSelectedExperience(experience);
        setSelectedPackages(pkgs || []);

        // Update URL search params (replace to avoid extra history entries)
        if (experience && seasonParam) {
            setSearchParams(
                { season: seasonParam, experience: experience.slug },
                { replace: true }
            );
        }

        // Scroll hacia las recomendaciones cuando se selecciona una experiencia
        if (experience && pkgs && pkgs.length > 0) {
            setTimeout(() => {
                recommendationsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }, [seasonParam, setSearchParams]);

    const handleSeasonSelect = useCallback((season) => {
        if (season) {
            setSearchParams({ season }, { replace: true });
        } else {
            setSearchParams({}, { replace: true });
        }
        setSelectedExperience(null);
        setSelectedPackages([]);
    }, [setSearchParams]);

    // Scroll to recommendations when restoring from URL params (back button)
    useEffect(() => {
        if (experienceParam && selectedExperience && selectedPackages.length > 0 && !hasRestoredRef.current) {
            hasRestoredRef.current = true;
            setTimeout(() => {
                recommendationsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        }
    }, [experienceParam, selectedExperience, selectedPackages]);

    // Determinar qué paquetes mostrar
    const displayPackages = selectedPackages.length > 0 ? selectedPackages : featuredPackages;
    const displayTitle = selectedExperience?.title || t('recommendations.title');

    // Hreflang para SEO
    const homeAlternateUrls = useStaticAlternateUrls('home');

    return (
        <div className="min-h-screen">
            <Hreflang alternateUrls={homeAlternateUrls} />
            <VideoHero
                onExperienceSelect={handleExperienceSelect}
                onSeasonSelect={handleSeasonSelect}
                initialSeason={seasonParam}
                initialExperienceSlug={experienceParam}
            />

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
