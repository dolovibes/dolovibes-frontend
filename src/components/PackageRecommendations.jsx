import React from 'react';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import PackageCard from './PackageCard';

const PackageRecommendations = ({ packages, experienceTitle, isLoading }) => {
    const { texts: siteTexts } = useSiteTextsContext();

    // Debug: Mostrar información en desarrollo
    if (import.meta.env.DEV) {
        console.log('[PackageRecommendations] Render con:', {
            packagesCount: packages?.length || 0,
            isLoading,
            experienceTitle,
            packages
        });
    }

    // Mostrar loading state
    if (isLoading) {
        return (
            <section className="py-16 md:py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <p className="text-niebla">{siteTexts?.loading?.generic || 'Loading...'}</p>
                </div>
            </section>
        );
    }

    // Si no hay paquetes, mostrar mensaje informativo en desarrollo
    if (!packages || packages.length === 0) {
        if (import.meta.env.DEV) {
            return (
                <section className="py-16 md:py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center p-8 bg-yellow-50 rounded-lg border border-yellow-200">
                            <h3 className="text-xl font-bold text-yellow-800 mb-2">⚠️ No hay paquetes para mostrar</h3>
                            <p className="text-yellow-700 mb-4">Verifica en el admin de Strapi:</p>
                            <ul className="text-left max-w-md mx-auto text-yellow-700 space-y-2">
                                <li>✓ Que existan paquetes publicados</li>
                                <li>✓ Que tengan <code className="bg-yellow-100 px-1">showInHome = true</code></li>
                                <li>✓ Que tengan una imagen thumbnail</li>
                                <li>✓ Que estén en estado Published</li>
                            </ul>
                            <p className="text-sm text-yellow-600 mt-4">Este mensaje solo aparece en desarrollo</p>
                        </div>
                    </div>
                </section>
            );
        }
        return null;
    }

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-grafito">
                        {siteTexts.recommendations.title}
                    </h2>
                    <p className="text-niebla mt-3 max-w-lg mx-auto">
                        {siteTexts.recommendations.subtitle.replace(/\{\{?experience\}\}?/g, experienceTitle)}
                    </p>
                </div>

                {/* Package Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <PackageCard key={pkg.id} pkg={pkg} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PackageRecommendations;



