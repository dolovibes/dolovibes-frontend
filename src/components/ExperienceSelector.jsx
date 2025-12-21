import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { getExperiencesBySeason, getExperienceBySlug } from '../data/experiences';
import { getPackagesByExperience } from '../data/packages';

const ExperienceSelector = ({ onExperienceSelect }) => {
    const { t } = useTranslation('home');
    const { t: tCommon } = useTranslation('common');
    const [step, setStep] = useState(1);
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [selectedExperience, setSelectedExperience] = useState(null);
    const [filteredExperiences, setFilteredExperiences] = useState([]);
    const [isExperienceDropdownOpen, setIsExperienceDropdownOpen] = useState(false);

    useEffect(() => {
        if (selectedSeason) {
            const experiences = getExperiencesBySeason(selectedSeason);
            setFilteredExperiences(experiences);
        }
    }, [selectedSeason]);

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

        // Get packages for this experience
        const packages = getPackagesByExperience(experience.slug);

        // Notify parent with selected experience and packages
        if (onExperienceSelect) {
            onExperienceSelect(experience, packages);
        }
    };

    const handleReset = () => {
        setStep(1);
        setSelectedSeason(null);
        setSelectedExperience(null);
        setFilteredExperiences([]);
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
                    {t('selector.whenQuestion')}
                </h2>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => handleSeasonSelect('verano')}
                        className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedSeason === 'verano'
                            ? 'bg-alpino text-white scale-105 shadow-xl shadow-alpino/30'
                            : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-nieve/20 hover:border-niebla/50'
                            }`}
                    >
                        {tCommon('seasons.summer')}
                    </button>

                    <button
                        onClick={() => handleSeasonSelect('invierno')}
                        className={`group relative px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${selectedSeason === 'invierno'
                            ? 'bg-alpino text-white scale-105 shadow-xl shadow-alpino/30'
                            : 'bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-nieve/20 hover:border-niebla/50'
                            }`}
                    >
                        {tCommon('seasons.winter')}
                    </button>
                </div>
            </div>

            {/* Pregunta 2: ¿Qué experiencia? */}
            <div className={`transition-all duration-500 delay-200 ${step >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                <h2 className="text-white text-2xl md:text-4xl font-bold text-center mb-6 drop-shadow-lg">
                    {t('selector.whatQuestion')}
                </h2>

                <div className="relative w-full max-w-md mx-auto">
                    <button
                        onClick={() => setIsExperienceDropdownOpen(!isExperienceDropdownOpen)}
                        className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl text-white font-semibold text-left flex items-center justify-between hover:bg-white/20 transition-all"
                    >
                        <span>
                            {selectedExperience ? selectedExperience.title : t('selector.selectExperience')}
                        </span>
                        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isExperienceDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isExperienceDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl z-50 animate-fade-in-up max-h-80 overflow-y-auto">
                            {filteredExperiences.length > 0 ? (
                                filteredExperiences.map((experience) => (
                                    <button
                                        key={experience.id}
                                        onClick={() => handleExperienceSelect(experience)}
                                        className={`w-full px-6 py-4 text-left hover:bg-nieve transition-colors border-b border-niebla last:border-b-0 group ${selectedExperience?.id === experience.id ? 'bg-nieve' : ''
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={experience.image}
                                                alt={experience.title}
                                                className="w-16 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-bold text-grafito group-hover:text-alpino transition-colors">
                                                    {experience.title}
                                                </h3>
                                                <p className="text-sm text-niebla truncate">{experience.shortDescription}</p>
                                            </div>
                                            <span className="text-alpino font-bold text-xs">
                                                {experience.difficulty}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="px-6 py-8 text-center text-niebla">
                                    {t('selector.noExperiences')}
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
