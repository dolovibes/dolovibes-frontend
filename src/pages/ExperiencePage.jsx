import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    ArrowLeft,
    Mountain,
    Clock,
    Users,
    Star,
    Check,
    ArrowRight
} from 'lucide-react';
import { getExperienceBySlug } from '../data/experiences';
import { getPackagesByExperience } from '../data/packages';
import Footer from '../components/Footer';

const ExperiencePage = ({ onOpenQuote }) => {
    const { t: tCommon } = useTranslation('common');
    const { slug } = useParams();
    const navigate = useNavigate();
    const experience = getExperienceBySlug(slug);
    const relatedPackages = getPackagesByExperience(slug);

    if (!experience) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Experiencia no encontrada</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        {tCommon('buttons.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="relative h-[60vh] md:h-[70vh]">
                <img
                    src={experience.heroImage || experience.image}
                    alt={experience.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                {/* Botón volver */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-24 left-6 md:left-12 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">{tCommon('buttons.goBack')}</span>
                </button>

                {/* Info superpuesta */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                    <div className="container mx-auto">
                        <div className="flex flex-wrap gap-2 mb-4">
                            {experience.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${experience.season === 'verano'
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-500 text-white'
                                }`}>
                                {experience.season === 'verano' ? `☀️ ${tCommon('seasons.summer')}` : `❄️ ${tCommon('seasons.winter')}`}
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {experience.title}
                        </h1>

                        <p className="text-xl text-white/80 max-w-2xl">
                            {experience.shortDescription}
                        </p>
                    </div>
                </div>
            </div>

            {/* Descripción */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                ¿Qué es {experience.title}?
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-8">
                                {experience.longDescription}
                            </p>

                            {/* Info rápida */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <Mountain className="w-6 h-6 text-emerald-600 mb-2" />
                                    <p className="text-sm text-slate-500">Dificultad</p>
                                    <p className="font-semibold text-slate-800">{experience.difficulty}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <Users className="w-6 h-6 text-emerald-600 mb-2" />
                                    <p className="text-sm text-slate-500">Ideal para</p>
                                    <p className="font-semibold text-slate-800 text-sm">{experience.bestFor}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            {/* Highlights */}
                            <div className="bg-emerald-50 rounded-2xl p-8">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">
                                    Lo que incluye esta experiencia
                                </h3>
                                <div className="space-y-4">
                                    {experience.highlights.map((highlight, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                            <p className="text-slate-700">{highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* What to expect */}
                            <div className="mt-8 bg-slate-900 rounded-2xl p-8 text-white">
                                <h3 className="text-xl font-bold mb-4">
                                    ¿Qué esperar?
                                </h3>
                                <p className="text-white/80 leading-relaxed">
                                    {experience.whatToExpect}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Paquetes disponibles */}
            <section className="py-16 md:py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Paquetes Disponibles
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Elige el viaje que mejor se adapte a tus fechas y preferencias
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {relatedPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group"
                            >
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={pkg.image}
                                        alt={pkg.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {pkg.hasDiscount && (
                                        <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            OFERTA
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                                        {pkg.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4">
                                        {pkg.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {pkg.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star className="w-4 h-4 text-amber-400" />
                                            {pkg.rating}
                                        </span>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                        <div>
                                            {pkg.originalPrice && (
                                                <p className="text-slate-400 line-through text-sm">
                                                    {pkg.originalPrice}
                                                </p>
                                            )}
                                            <p className="text-xl font-bold text-emerald-600">
                                                {pkg.price}
                                            </p>
                                        </div>
                                        <Link
                                            to={`/paquete/${pkg.slug}`}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 transition-colors"
                                        >
                                            Ver Paquete
                                            <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {relatedPackages.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">No hay paquetes disponibles para esta experiencia aún.</p>
                            <button
                                onClick={() => onOpenQuote(experience.title)}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-semibold transition-colors"
                            >
                                Cotizar viaje personalizado
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16 md:py-24 bg-slate-900">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        ¿No encuentras lo que buscas?
                    </h2>
                    <p className="text-white/70 max-w-2xl mx-auto mb-8">
                        Diseñamos viajes a medida según tus fechas, grupo y preferencias.
                    </p>
                    <button
                        onClick={() => onOpenQuote(experience.title)}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-emerald-600/30"
                    >
                        Solicitar Cotización Personalizada
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default ExperiencePage;
