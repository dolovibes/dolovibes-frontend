import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { useQueryClient } from '@tanstack/react-query';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCurrencyContext } from '../utils/currency';
import { generateLocalizedUrl } from '../utils/localizedRoutes';
import { prefetchPackage } from '../utils/dataPrefetch';
import { extractTextFromBlocks } from '../utils/BlocksRenderer';
import { isModalityUsable } from '../services/api';
import OptimizedImage from './OptimizedImage';

const PackageCard = ({ pkg }) => {
    const { texts: siteTexts } = useSiteTextsContext();
    const { i18n } = useTranslation();
    const currentLocale = i18n.language || 'es';
    const { formatPriceFromEUR } = useCurrencyContext();
    const queryClient = useQueryClient();

    // Prefetch de datos del paquete en hover para carga instantánea
    const handleMouseEnter = () => {
        prefetchPackage(queryClient, pkg.slug, i18n.language);
    };

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

    // ── Precio: modo LEGACY vs modo MODALIDAD ──
    // Decisión deliberadamente conservadora para esta primera integración:
    //
    // 1. Sin modalidades habilitadas (el caso de la enorme mayoría de los
    //    paquetes hoy) el comportamiento es IDÉNTICO al anterior: precio
    //    legacy, precio tachado y badge de oferta tal cual estaban.
    // 2. Con alguna modalidad habilitada mostramos `fromPriceEUR` (el mínimo
    //    entre las modalidades habilitadas) prefijado con el label "desde",
    //    y NO mostramos ni badge de descuento ni precio tachado. Motivo:
    //    `hasDiscount`/`originalPriceEUR` son campos del paquete legacy y el
    //    descuento por modalidad vive dentro de cada modalidad, así que no
    //    sabemos de forma confiable si el descuento corresponde justo a la
    //    modalidad que ganó el mínimo. Pintar un tachado que quizá pertenece
    //    a la otra modalidad sería información de precio engañosa en una
    //    tarjeta de venta, y eso pesa más que perder el badge de oferta.
    //    Si el negocio quiere el badge aquí, hace falta que la capa de datos
    //    exponga a qué modalidad pertenece `fromPriceEUR`.
    //
    // Corrección tras QA adversarial (Grok): este chequeo antes solo miraba
    // `enabled`, no si la modalidad era realmente "usable" (enabled + precio
    // numérico) — divergía del criterio que ya usa PackageInfoPage.jsx y
    // fromPriceEUR en api.js. Con una modalidad enabled-sin-precio, la
    // tarjeta entraba en modo "Desde" pero mostraba el precio LEGACY (porque
    // fromPriceEUR cae ahí), mientras el detalle mostraba la página legacy
    // completa — inconsistente entre ambas superficies. Unificado con el
    // mismo helper `isModalityUsable` que usa el resto del feature.
    const hasModalityPricing =
        isModalityUsable(pkg.autoGuidedModality) || isModalityUsable(pkg.guidedModality);

    const formattedPrice = hasModalityPricing
        ? formatPriceFromEUR(pkg.fromPriceEUR)
        : formatPriceFromEUR(pkg.priceEUR);
    const formattedOriginalPrice = !hasModalityPricing && pkg.hasDiscount && pkg.originalPriceEUR
        ? formatPriceFromEUR(pkg.originalPriceEUR)
        : null;
    // Sin texto de site-text disponible no se pinta el prefijo (evita
    // hardcodear "Desde" en un idioma cuando el usuario navega en otro).
    const fromPriceLabel = hasModalityPricing ? siteTexts.packageInfo?.fromPrice : null;

    return (
        <Link
            to={generateLocalizedUrl('packages', pkg.slug, currentLocale)}
            onMouseEnter={handleMouseEnter}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-niebla"
        >
            {/* Image */}
            <div className="relative aspect-video overflow-hidden bg-niebla/20">
                <img
                    src={pkg.image}
                    alt={pkg.title}
                    loading="lazy"
                    decoding="async"
                    width="640"
                    height="360"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra/60 via-transparent to-transparent"></div>

                {/* Discount badge — solo en modo legacy (ver nota de precio arriba) */}
                {!hasModalityPricing && pkg.hasDiscount && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        {siteTexts.recommendations.offer}
                    </div>
                )}

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                    <div className="bg-white rounded-xl px-4 py-2 shadow-lg">
                        {formattedOriginalPrice && (
                            <p className="text-niebla text-xs line-through">{formattedOriginalPrice}</p>
                        )}
                        {fromPriceLabel && (
                            <p className="text-niebla text-[10px] uppercase tracking-wider leading-none">
                                {fromPriceLabel}
                            </p>
                        )}
                        <p className="text-pizarra font-bold text-lg">{formattedPrice}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-grafito group-hover:text-pizarra transition-colors mb-2">
                    {pkg.title}
                </h3>

                {/* Meta info */}
                <div className="flex flex-wrap gap-4 text-sm text-niebla mb-4">
                    <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        {pkg.location}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {pkg.duration}
                    </span>
                    {pkg.difficulty && (
                        <span className="flex items-center gap-1">
                            {pkg.difficulty}
                        </span>
                    )}
                </div>

                {/* Description */}
                <p className="text-pizarra text-sm line-clamp-2 mb-4">
                    {extractTextFromBlocks(pkg.description)}
                </p>

                {/* CTA */}
                <div className="flex items-center text-pizarra font-semibold text-sm group-hover:gap-3 gap-2 transition-all">
                    {siteTexts.recommendations.viewDetails}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
            </div>
        </Link>
    );
};

export default PackageCard;
