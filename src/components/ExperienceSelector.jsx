import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown } from 'lucide-react';
import { useExperiences, usePackagesByExperience } from '../services/hooks';
import { prefetchExperience } from '../utils/dataPrefetch';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';

const ExperienceSelector = ({ onExperienceSelect }) => {
    const { i18n } = useTranslation();
    const { texts } = useSiteTextsContext();
    const queryClient = useQueryClient();
    const [step, setStep] = useState(1);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);

    // Mapeo de temporadas para el filtro
    const seasonMap = { verano: ['verano', 'summer'], invierno: ['invierno', 'winter'] };

    // Obtener experiencias de Strapi
    const { data: allExperiences = [], isLoading } = useExperiences();

    // Filtrar por temporada seleccionada (soporta ambos formatos)
    const filteredExperiences = useMemo(() => {
        if (!selectedSeason) return [];
        const validSeasons = seasonMap[selectedSeason] || [];
        return allExperiences.filter(exp => validSeasons.includes(exp.season));
    }, [allExperiences, selectedSeason]);

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
        // Reset parent state
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
        // Reset parent state
        if (onExperienceSelect) {
            onExperienceSelect(null, null);
        }
    };

    return (
        <div className="flex flex-col items-center gap-8">
            {/* Pregunta 1: Tu próxima aventura */}
            <div className={`transition-all duration-500 ${step >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-6 drop-shadow-lg">
                    {texts.selector.whenQuestion}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleSeasonSelect('verano')}
                        className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedSeason === 'verano'
                            ? 'bg-pizarra text-white scale-105 shadow-xl shadow-pizarra/30'
                            : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-nieve/20 hover:border-niebla/50'
                            }`}
                    >
                        {texts.seasons.summer}
                    </button>

                    <button
                        onClick={() => handleSeasonSelect('invierno')}
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

                <div className="relative w-full max-w-md mx-auto">
                    <button
                        onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white font-semibold text-left flex items-center justify-between hover:bg-white/20 transition-all"
                    >
                        <span>
                            {selectedExperience ? selectedExperience.title : texts.selector.selectExperience}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExperienceDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 animate-fade-in-up">
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
                        Desliza para ver los viajes
                    </div>
                    <ChevronDown className="w-8 h-8 text-white/60 mx-auto" />
                </div>
            )}
        </div>
    );
};

export default ExperienceSelector;
