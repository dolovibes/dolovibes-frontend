import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const PackageCard = ({ pkg }) => {
    const { t } = useTranslation('common');

    // Función para obtener el color del nivel de dificultad
    const getDifficultyColor = (difficulty) => {
        const level = difficulty?.toLowerCase();
        if (level?.includes('fácil') || level?.includes('easy') || level?.includes('bajo') || level?.includes('low')) {
            return 'text-green-600';
        } else if (level?.includes('intermedio') || level?.includes('intermediate') || level?.includes('moderado') || level?.includes('moderate')) {
            return 'text-amber-600';
        } else if (level?.includes('avanzado') || level?.includes('advanced') || level?.includes('alto') || level?.includes('high') || level?.includes('difícil')) {
            return 'text-red-600';
        }
        return 'text-pizarra';
    };

    return (
        <Link
            to={`/paquete/${pkg.slug}`}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-niebla"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra/60 via-transparent to-transparent"></div>

                {/* Discount badge */}
                {pkg.hasDiscount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {t('recommendations.offer')}
                    </div>
                )}

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                        {pkg.originalPrice && (
                            <p className="text-niebla text-xs line-through">{pkg.originalPrice}</p>
                        )}
                        <p className="text-alpino font-bold text-lg">{pkg.price}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-grafito group-hover:text-alpino transition-colors mb-2">
                    {pkg.title}
                </h3>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 text-sm text-niebla mb-4">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {pkg.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {pkg.duration}
                    </span>
                    <span className={`flex items-center gap-1 font-medium ${getDifficultyColor(pkg.difficulty)}`}>
                        {pkg.difficulty}
                    </span>
                </div>

                {/* Description */}
                <p className="text-pizarra text-sm line-clamp-2 mb-4">
                    {pkg.description}
                </p>

                {/* CTA */}
                <div className="flex items-center text-alpino font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    {t('recommendations.viewDetails')}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </Link>
    );
};

export default PackageCard;
