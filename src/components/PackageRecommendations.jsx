import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react';

const PackageRecommendations = ({ packages, experienceTitle }) => {
    if (!packages || packages.length === 0) return null;

    return (
        <section className="py-16 md:py-24 bg-white">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
                        Basado en tu selección
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3">
                        Nuestras Recomendaciones
                    </h2>
                    <p className="text-slate-500 mt-3 max-w-lg mx-auto">
                        Los mejores viajes de {experienceTitle} para ti
                    </p>
                </div>

                {/* Package Cards Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <Link
                            key={pkg.id}
                            to={`/paquete/${pkg.slug}`}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-100"
                        >
                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                                <img
                                    src={pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                                {/* Tags */}
                                <div className="absolute top-4 left-4 flex gap-2">
                                    {pkg.tags?.slice(0, 2).map((tag, i) => (
                                        <span
                                            key={i}
                                            className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Discount badge */}
                                {pkg.hasDiscount && (
                                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        OFERTA
                                    </div>
                                )}

                                {/* Price */}
                                <div className="absolute bottom-4 right-4">
                                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                                        {pkg.originalPrice && (
                                            <p className="text-slate-400 text-xs line-through">{pkg.originalPrice}</p>
                                        )}
                                        <p className="text-emerald-600 font-bold text-lg">{pkg.price}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">
                                    {pkg.title}
                                </h3>

                                {/* Meta info */}
                                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {pkg.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {pkg.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Star className="w-4 h-4 text-amber-400" />
                                        {pkg.rating}
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                    {pkg.description}
                                </p>

                                {/* CTA */}
                                <div className="flex items-center text-emerald-600 font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                                    Ver detalles
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PackageRecommendations;
