import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useExperience, usePackagesByExperience, useSiteTexts } from '../services/hooks';
import Footer from '../components/Footer';
import PackageCard from '../components/PackageCard';

const ExperiencePage = ({ onOpenQuote }) => {
    const { t: tCommon } = useTranslation('common');
    const { slug } = useParams();
    const navigate = useNavigate();

    // Usar hooks de React Query para datos dinámicos
    const { data: experience, isLoading: loadingExperience } = useExperience(slug);
    const { data: relatedPackages = [], isLoading: loadingPackages } = usePackagesByExperience(slug);
    const { data: siteTexts } = useSiteTexts();

    // Textos con fallback: Strapi > i18n
    const loadingText = siteTexts?.loadingExperience || tCommon('loading.experience');
    const packagesTitle = siteTexts?.availablePackagesTitle || tCommon('availablePackages.title');
    const packagesSubtitle = siteTexts?.availablePackagesSubtitle || tCommon('availablePackages.subtitle');
    // Scroll al inicio cuando carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Estado de carga
    if (loadingExperience || loadingPackages) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nieve">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 border-4 border-alpino border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-pizarra">{loadingText}</p>
                </div>
            </div>
        );
    }

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nieve">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-grafito mb-4">{tCommon('experiences.notFound')}</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-alpino text-white px-6 py-3 rounded-full font-semibold hover:bg-alpino transition-colors"
                    >
                        {tCommon('buttons.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero - Pantalla completa como página de inicio */}
            <div className="relative min-h-screen flex items-end">
                <img
                    src={experience.heroImage || experience.image}
                    alt={experience.title}
                    fetchpriority="high"
                    loading="eager"
                    width="1920"
                    height="1080"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra via-pizarra/40 to-transparent"></div>

                {/* Info superpuesta */}
                <div className="relative z-10 p-6 md:p-12 pb-16 md:pb-24 w-full">
                    <div className="container mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                            {experience.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 max-w-5xl">
                            {experience.longDescription || experience.shortDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Paquetes disponibles */}
            <section className="py-16 md:py-24 bg-nieve">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-grafito mb-4">
                            {packagesTitle}
                        </h2>
                        <p className="text-pizarra max-w-2xl mx-auto">
                            {packagesSubtitle}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPackages.map((pkg) => (
                            <PackageCard key={pkg.id} pkg={pkg} />
                        ))}
                    </div>

                    {relatedPackages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-niebla mb-4">{tCommon('experiences.noPackages')}</p>
                            <button
                                onClick={() => onOpenQuote(experience.title)}
                                className="bg-alpino hover:bg-alpino text-white px-6 py-3 rounded-full font-semibold transition-colors"
                            >
                                {tCommon('buttons.quoteCustomTrip')}
                            </button>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ExperiencePage;
