import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useExperiences, usePackagesByExperience, useHeroSection } from '../services/hooks';
import { prefetchExperience } from '../utils/dataPrefetch';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';

const ExperienceSelector = ({ onExperienceSelect, onSeasonSelect, initialSeason, initialExperienceSlug }) => {
    const { i18n, t } = useTranslation('home');
    const { texts } = useSiteTextsContext();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(initialSeason ? 2 : 1);
    const [selectedSeason, setSelectedSeason] = useState(initialSeason || null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hasInitializedRef = useRef(false);

    // Obtener datos del Hero Section
    const { data: heroData } = useHeroSection();

    // fix #59: Close dropdown when clicking outside
    useEffect(() => {
        if (!isExperienceDropdownOpen) return;
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsExperienceDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isExperienceDropdownOpen]);

    // Mapeo de temporadas para el filtro
    const seasonMap = { verano: ['verano', 'summer'], invierno: ['invierno', 'winter'] };

    // Obtener experiencias de Strapi
    const { data: allExperiences = [] } = useExperiences();

    // Filtrar por temporada seleccionada (soporta ambos formatos)
    const filteredExperiences = useMemo(() => {
        if (!selectedSeason) return [];
        const validSeasons = seasonMap[selectedSeason] || [];
        return allExperiences.filter(exp => validSeasons.includes(exp.season));
    }, [allExperiences, selectedSeason]);

    // Resolve initialExperienceSlug to experience object from cached data (back button restoration)
    useEffect(() => {
        if (initialExperienceSlug && !hasInitializedRef.current && filteredExperiences.length > 0) {
            const match = filteredExperiences.find(exp => exp.slug === initialExperienceSlug);
            if (match) {
                setSelectedExperience(match);
                hasInitializedRef.current = true;
            }
        }
    }, [initialExperienceSlug, filteredExperiences]);

    // Obtener paquetes de la experiencia seleccionada
    const { data: relatedPackages = [] } = usePackagesByExperience(
        selectedExperience?.slug
    );

    // Notificar al padre cuando cambian los paquetes
    useEffect(() => {
        if (selectedExperience && relatedPackages.length > 0 && onExperienceSelect) {
            onExperienceSelect(selectedExperience, relatedPackages);
        }
    }, [selectedExperience, relatedPackages, onExperienceSelect]);

    const handleSeasonSelect = (season) => {
        setSelectedSeason(season);
        setStep(2);
        setSelectedExperience(null);
        setIsExperienceDropdownOpen(false);
        hasInitializedRef.current = false;
        // Notify parent to update search params
        if (onSeasonSelect) {
            onSeasonSelect(season);
        }
        // Reset parent packages
        if (onExperienceSelect) {
            onExperienceSelect(null, null);
        }
    };

    const handleExperienceSelect = (experience) => {
        setSelectedExperience(experience);
        setIsExperienceDropdownOpen(false);
        // Los paquetes se cargarán automáticamente via usePackagesByExperience
    };

    const handleReset = () => {
        setStep(1);
        setSelectedSeason(null);
        setSelectedExperience(null);
        setIsExperienceDropdownOpen(false);
        hasInitializedRef.current = false;
        // Notify parent to clear search params
        if (onSeasonSelect) {
            onSeasonSelect(null);
        }
        if (onExperienceSelect) {
            onExperienceSelect(null, null);
        }
    };

    // Texto principal - priorizar Hero Section, fallback a i18n
    const mainQuestion = heroData?.subtitle || t('selector.whenQuestion');

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Pregunta 1: Tu próxima aventura */}
            <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-6 drop-shadow-lg">
                    {mainQuestion}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleSeasonSelect('verano')}
                        aria-pressed={selectedSeason === 'verano'}
                        className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedSeason === 'verano'
                            ? 'bg-pizarra text-white scale-105 shadow-xl shadow-pizarra/30'
                            : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-nieve/20 hover:border-niebla/50'
                            }`}
                    >
                        {texts.seasons.summer}
                    </button>

                    <button
                        onClick={() => handleSeasonSelect('invierno')}
                        aria-pressed={selectedSeason === 'invierno'}
                        className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedSeason === 'invierno'
                            ? 'bg-pizarra text-white scale-105 shadow-xl shadow-pizarra/30'
                            : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-nieve/20 hover:border-niebla/50'
                            }`}
                    >
                        {texts.seasons.winter}
                    </button>
                </div>
            </div>

            {/* Pregunta 2: ¿Qué experiencia? */}
            <div className={`transition-all duration-500 delay-200 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-6 drop-shadow-lg">
                    {texts.selector.whatQuestion}
                </h2>

                <div ref={dropdownRef} className="relative w-full max-w-md mx-auto">
                    <button
                        onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                        aria-haspopup="listbox"
                        aria-expanded={isExperienceDropdownOpen}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white font-semibold text-left flex items-center justify-between hover:bg-white/20 transition-all"
                    >
                        <span>
                            {selectedExperience ? selectedExperience.title : texts.selector.selectExperience}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>

                    {isExperienceDropdownOpen && (
                        <div role="listbox" className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 animate-fade-in-up">
                            {filteredExperiences.length > 0 ? (
                                filteredExperiences.map((experience) => (
                                    <button
                                        key={experience.id}
                                        onClick={() => handleExperienceSelect(experience)}
                                        onMouseEnter={() => prefetchExperience(queryClient, experience.slug, i18n.language)}
                                        className={`w-full px-6 py-4 text-left hover:bg-nieve transition-colors border-b border-niebla last:border-b-0 group ${selectedExperience?.id === experience.id ? 'bg-nieve' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={experience.image}
                                                alt={experience.title}
                                                loading="lazy"
                                                width="56"
                                                height="40"
                                                className="w-14 h-10 object-cover rounded-lg"
                                            />
                                            <h3 className="font-bold text-grafito group-hover:text-pizarra transition-colors">
                                                {experience.title}
                                            </h3>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center text-niebla">
                                    {texts.selector.noExperiences}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Indicador de scroll cuando hay experiencia seleccionada */}
            {selectedExperience && (
                <div className="mt-8 animate-bounce">
                    <div className="text-white/60 text-sm text-center mb-2">
                        {texts.selector.scrollToSeeTrips}
                    </div>
                    <ChevronDown className="w-8 h-8 text-white/60 mx-auto" aria-hidden="true" />
                </div>
            )}
        </div>
    );
};

export default ExperienceSelector;
