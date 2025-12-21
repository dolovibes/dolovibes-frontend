import React from 'react';
import { useTranslation } from 'react-i18next';
import PackageCard from './PackageCard';

const PackageRecommendations = ({ packages, experienceTitle }) => {
    const { t } = useTranslation('common');

    if (!packages || packages.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-grafito">
                        {t('recommendations.title')}
                    </h2>
                    <p className="text-niebla mt-3 max-w-lg mx-auto">
                        {t('recommendations.subtitle', { experience: experienceTitle })}
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



