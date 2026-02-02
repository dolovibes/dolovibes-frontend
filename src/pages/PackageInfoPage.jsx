import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BlocksRenderer, extractTextFromBlocks } from '../utils/BlocksRenderer';
import {
    ArrowLeft,
    MapPin,
    Clock,
    Star,
    Users,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Check,
    X,
    Calendar,
    Info,
    Camera
} from 'lucide-react';
import { usePackage, useSiteTexts } from '../services/hooks';
import { useCurrencyContext } from '../utils/currency';
import PackageQuoteModal from '../components/PackageQuoteModal';
import PhotoGalleryModal from '../components/PhotoGalleryModal';
import HikingLevelModal from '../components/HikingLevelModal';
import Footer from '../components/Footer';

const PackageInfoPage = ({ onOpenQuote }) => {
    const { t: tCommon } = useTranslation('common');
    const { t: tPackage } = useTranslation('packageInfo');
    const { slug } = useParams();
    const navigate = useNavigate();

    // Usar hook de React Query para datos dinámicos
    const { data: pkg, isLoading, error } = usePackage(slug);
    const { data: siteTexts } = useSiteTexts();

    // Textos con fallback: Strapi > i18n
    const loadingText = siteTexts?.loadingPackage || tCommon('loading.package');

    // Contexto de moneda para conversión de precios
    const { formatPriceFromEUR, currency } = useCurrencyContext();

    // Estado para el carrusel de itinerario
    const [currentDay, setCurrentDay] = useState(0);

    // Estado para los includes expandibles
    const [expandedInclude, setExpandedInclude] = useState(null);

    // Estado para el modal de cotización
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

    // Estado para el modal de fotos adicionales
    const [isPhotosModalOpen, setIsPhotosModalOpen] = useState(false);

    // Estado para el modal de mapa
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Estado para el modal de evaluación de hiking
    const [isHikingLevelModalOpen, setIsHikingLevelModalOpen] = useState(false);

    // Referencia para la sección de itinerario (para swipe/wheel)
    const itineraryRef = React.useRef(null);

    // Scroll al inicio cuando carga la página
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Soporte para swipe/wheel en trackpad - DEBE estar antes de early returns
    useEffect(() => {
        const section = itineraryRef.current;
        if (!section || !pkg) return;

        let lastScrollTime = 0;
        const scrollThreshold = 50;
        const scrollDebounce = 500;

        const handleWheel = (e) => {
            const deltaX = Math.abs(e.deltaX);
            const deltaY = Math.abs(e.deltaY);
            const now = Date.now();

            if (now - lastScrollTime < scrollDebounce) return;

            const delta = deltaX > deltaY ? e.deltaX : e.deltaY;

            if (Math.abs(delta) > scrollThreshold && pkg.itinerary) {
                if (delta > 0 && currentDay < pkg.itinerary.length - 1) {
                    setCurrentDay(prev => prev + 1);
                    lastScrollTime = now;
                } else if (delta < 0 && currentDay > 0) {
                    setCurrentDay(prev => prev - 1);
                    lastScrollTime = now;
                }
            }
        };

        section.addEventListener('wheel', handleWheel, { passive: true });
        return () => section.removeEventListener('wheel', handleWheel);
    }, [currentDay, pkg]);

    // Estado de carga
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nieve">
                <div className="animate-pulse text-center">
                    <div className="w-16 h-16 border-4 border-alpino border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-pizarra">{loadingText}</p>
                </div>
            </div>
        );
    }

    if (!pkg || error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nieve">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-grafito mb-4">{tPackage('packageNotFound')}</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-pizarra text-white px-6 py-3 rounded-full font-semibold hover:bg-pizarra transition-colors"
                    >
                        {tCommon('buttons.backToHome')}
                    </button>
                </div>
            </div>
        );
    }

    const handlePrevDay = () => {
        setCurrentDay(prev => Math.max(0, prev - 1));
    };

    const handleNextDay = () => {
        if (pkg) {
            setCurrentDay(prev => Math.min(pkg.itinerary.length - 1, prev + 1));
        }
    };

    const toggleInclude = (index) => {
        setExpandedInclude(expandedInclude === index ? null : index);
    };

    const currentItinerary = pkg.itinerary?.[currentDay];

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            {/* Hero - Pantalla completa */}
            <div className="relative min-h-screen flex items-end">
                <img
                    src={pkg.heroImage || pkg.image}
                    alt={pkg.title}
                    fetchPriority="high"
                    loading="eager"
                    width="1920"
                    height="1080"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra via-pizarra/40 to-transparent"></div>

                {/* Info superpuesta */}
                <div className="relative z-10 p-4 sm:p-6 md:p-12 pb-16 md:pb-24 w-full">
                    <div className="container mx-auto max-w-full px-0">
                        <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 break-words">
                            {pkg.title}
                        </h1>

                        <p className="text-base sm:text-xl md:text-2xl text-white/80 max-w-5xl mb-6">
                            {extractTextFromBlocks(pkg.description)}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-white/90">
                            <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                <span className="truncate max-w-[120px] sm:max-w-none">{pkg.location}</span>
                            </span>
                            <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                {pkg.duration}
                            </span>
                            {pkg.difficulty && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                    {pkg.difficulty}
                                </span>
                            )}
                            {pkg.groupSize && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    {pkg.groupSize}
                                </span>
                            )}
                            {pkg.guideType && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                    {pkg.guideType}
                                </span>
                            )}
                            {pkg.availableDates && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30 text-sm sm:text-base">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="font-medium">{pkg.availableDates}</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Separador visual */}
            <div className="bg-white py-10 md:py-12">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-pizarra font-semibold tracking-wider uppercase text-sm">
                        {tPackage('yourAdventure')}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-grafito mt-2">
                        {tPackage('itinerary')}
                    </h2>
                </div>
            </div>

            {/* Sección de Itinerario - Layout lado a lado */}
            <section ref={itineraryRef} className="bg-nieve">
                <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
                    {/* Imagen izquierda */}
                    <div className="w-full md:w-1/2 h-[250px] md:h-full relative overflow-hidden">
                        <img
                            src={pkg.itinerary[currentDay].image || pkg.heroImage || pkg.image}
                            alt={tPackage('day', { number: pkg.itinerary[currentDay].day })}
                            loading="lazy"
                            width="800"
                            height="450"
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                    </div>

                    {/* Contenido derecha */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-full bg-white p-6 md:p-10 flex flex-col justify-between">
                        <div>
                            {/* Badge del día */}
                            <div className="inline-flex items-center gap-2 mb-3">
                                <div className="w-9 h-9 bg-pizarra rounded-lg flex items-center justify-center shadow shadow-pizarra/20">
                                    <span className="text-base font-bold text-white">{pkg.itinerary[currentDay].day}</span>
                                </div>
                                <span className="text-pizarra font-semibold text-sm">
                                    {tPackage('dayOf', { current: pkg.itinerary[currentDay].day, total: pkg.itinerary.length })}
                                </span>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl md:text-2xl font-bold text-grafito mb-3 leading-tight">
                                {pkg.itinerary[currentDay].title}
                            </h3>

                            {/* Descripción - altura fija con scroll en móvil y gradiente indicador */}
                            <div className="relative">
                                <div className="text-pizarra text-sm md:text-base leading-relaxed prose prose-sm max-w-none max-h-[180px] sm:max-h-[200px] md:max-h-none overflow-y-auto pr-1 pb-10 scrollbar-thin scrollbar-thumb-niebla scrollbar-track-transparent">
                                    <BlocksRenderer content={pkg.itinerary[currentDay].description} />
                                </div>
                                {/* Gradiente indicador de scroll para móvil */}
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none md:hidden transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="flex items-center justify-between pt-2 border-t border-niebla">
                            {/* Flechas */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.preventDefault(); handlePrevDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === 0
                                        ? 'bg-nieve text-niebla cursor-not-allowed'
                                        : 'bg-nieve text-pizarra hover:bg-pizarra hover:text-white'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleNextDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === pkg.itinerary.length - 1
                                        ? 'bg-nieve text-niebla cursor-not-allowed'
                                        : 'bg-nieve text-pizarra hover:bg-pizarra hover:text-white'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Indicadores de puntos */}
                            <div className="flex items-center gap-2">
                                {pkg.itinerary.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentDay(index)}
                                        className={`h-2 rounded-full transition-all duration-300 ${index === currentDay
                                            ? 'w-8 bg-pizarra'
                                            : 'w-2 bg-niebla hover:bg-niebla'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Contador */}
                            <div className="text-niebla font-medium text-sm">
                                <span className="text-grafito font-bold text-lg">{String(currentDay + 1).padStart(2, '0')}</span>
                                <span className="mx-1">/</span>
                                <span>{String(pkg.itinerary.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Espaciador entre itinerario y detalles */}
            <div className="h-8 sm:h-10 md:h-0"></div>

            {/* Sección de Detalles - Texto izquierda, Imagen derecha */}
            <section className="py-8 sm:py-12 md:py-24 overflow-hidden">
                <div className="container mx-auto px-4 pt-2 sm:pt-0 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start w-full">
                        {/* Columna izquierda - Detalles */}
                        <div className="w-full overflow-hidden">
                            {/* Precio destacado */}
                            <div className="mb-8">
                                <p className="text-niebla text-sm uppercase tracking-wider mb-1">
                                    {tPackage('pricePerPerson')}
                                </p>
                                <div className="flex items-baseline gap-3">
                                    {pkg.hasDiscount === true && pkg.originalPriceEUR && pkg.originalPriceEUR > pkg.priceEUR && (
                                        <span className="text-niebla line-through text-lg sm:text-xl">
                                            {formatPriceFromEUR(pkg.originalPriceEUR)}
                                        </span>
                                    )}
                                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-pizarra">
                                        {formatPriceFromEUR(pkg.priceEUR)}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción breve */}
                            <p className="text-base sm:text-lg text-pizarra leading-relaxed mb-4 break-words">
                                {extractTextFromBlocks(pkg.description)}
                            </p>

                            {/* Enlace para evaluación de nivel */}
                            <button
                                onClick={() => setIsHikingLevelModalOpen(true)}
                                className="flex items-center gap-2 text-pizarra hover:text-pizarra/70 text-sm font-medium mb-8 group transition-colors"
                            >
                                <span className="underline underline-offset-2 group-hover:no-underline">
                                    {tPackage('notSureLevel')}
                                </span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Incluye - Desplegables */}
                            {pkg.includes && pkg.includes.length > 0 && (
                                <div className="mb-6">
                                    <div className="space-y-3">
                                        {pkg.includes.map((item, index) => (
                                            <div
                                                key={`inc-${index}`}
                                                className="bg-nieve rounded-xl overflow-hidden border border-niebla w-full"
                                            >
                                                <button
                                                    onClick={() => toggleInclude(`inc-${index}`)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Check className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-grafito">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {item.detail && (
                                                        <ChevronDown className={`w-5 h-5 text-niebla transition-transform duration-300 ${expandedInclude === `inc-${index}` ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>
                                                {item.detail && (
                                                    <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === `inc-${index}` ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-4 pb-4 pt-0 pl-11">
                                                            <div className="text-pizarra prose prose-sm max-w-none">
                                                                <BlocksRenderer content={item.detail} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* No Incluye - Desplegables */}
                            {pkg.notIncludes && pkg.notIncludes.length > 0 && (
                                <div className="mb-6">
                                    <div className="space-y-3">
                                        {pkg.notIncludes.map((item, index) => (
                                            <div
                                                key={`notinc-${index}`}
                                                className="bg-nieve rounded-xl overflow-hidden border border-niebla"
                                            >
                                                <button
                                                    onClick={() => toggleInclude(`notinc-${index}`)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                                                            <X className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-grafito">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {item.detail && (
                                                        <ChevronDown className={`w-5 h-5 text-niebla transition-transform duration-300 ${expandedInclude === `notinc-${index}` ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>
                                                {item.detail && (
                                                    <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === `notinc-${index}` ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-4 pb-4 pt-0 pl-11">
                                                            <div className="text-pizarra prose prose-sm max-w-none">
                                                                <BlocksRenderer content={item.detail} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Información Adicional - Desplegables */}
                            {pkg.additionalInfo && pkg.additionalInfo.length > 0 && (
                                <div className="mb-6">
                                    <div className="space-y-3">
                                        {pkg.additionalInfo.map((item, index) => (
                                            <div
                                                key={`info-${index}`}
                                                className="bg-nieve rounded-xl overflow-hidden border border-niebla"
                                            >
                                                <button
                                                    onClick={() => toggleInclude(`info-${index}`)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Info className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-grafito">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {item.detail && (
                                                        <ChevronDown className={`w-5 h-5 text-niebla transition-transform duration-300 ${expandedInclude === `info-${index}` ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>
                                                {item.detail && (
                                                    <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === `info-${index}` ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-4 pb-4 pt-0 pl-11">
                                                            <div className="text-pizarra prose prose-sm max-w-none">
                                                                <BlocksRenderer content={item.detail} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Servicios a Solicitud - Desplegables */}
                            {pkg.additionalServices && pkg.additionalServices.length > 0 && (
                                <div className="mb-6">
                                    <div className="space-y-3">
                                        {pkg.additionalServices.map((item, index) => (
                                            <div
                                                key={`svc-${index}`}
                                                className="bg-nieve rounded-xl overflow-hidden border border-niebla"
                                            >
                                                <button
                                                    onClick={() => toggleInclude(`svc-${index}`)}
                                                    className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                                                            <Star className="w-4 h-4 text-white" />
                                                        </div>
                                                        <span className="font-semibold text-grafito">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    {item.detail && (
                                                        <ChevronDown className={`w-5 h-5 text-niebla transition-transform duration-300 ${expandedInclude === `svc-${index}` ? 'rotate-180' : ''}`} />
                                                    )}
                                                </button>
                                                {item.detail && (
                                                    <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === `svc-${index}` ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                                        <div className="px-4 pb-4 pt-0 pl-11">
                                                            <div className="text-pizarra prose prose-sm max-w-none">
                                                                <BlocksRenderer content={item.detail} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botones adicionales */}
                            {/* Additional Photos - Solo mostrar si hay galería */}
                            {pkg.gallery && pkg.gallery.length > 0 && pkg.gallery.some(g => g.url) && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => setIsPhotosModalOpen(true)}
                                        className="w-full flex items-center justify-between p-4 bg-nieve rounded-xl border border-niebla hover:bg-nieve transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center">
                                                <Camera className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-grafito">{tPackage('additionalPhotos')}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-niebla" />
                                    </button>
                                </div>
                            )}

                            {/* How to get here - Solo mostrar si hay mapImage */}
                            {pkg.mapImage && (
                                <div className="mb-6">
                                    <button
                                        onClick={() => setIsMapModalOpen(true)}
                                        className="w-full flex items-center justify-between p-4 bg-nieve rounded-xl border border-niebla hover:bg-nieve transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-grafito">{tPackage('howToGetHere')}</span>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-niebla" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Columna derecha - Imagen con Book Now */}
                        <div className="mt-8 lg:mt-0 lg:sticky lg:top-28 w-full overflow-hidden">
                            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={pkg.heroImage || pkg.image}
                                    alt={pkg.title}
                                    loading="lazy"
                                    width="600"
                                    height="500"
                                    className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-pizarra/80 via-transparent to-transparent"></div>

                                {/* Book Now Button */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <button
                                        onClick={() => setIsQuoteModalOpen(true)}
                                        className="w-full bg-pizarra hover:bg-pizarra/90 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-pizarra/30"
                                    >
                                        {tPackage('quote')}
                                    </button>
                                    <p className="text-center text-white/70 text-sm mt-3">
                                        {tPackage('quoteResponse')}
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Fotos Adicionales */}
            <PhotoGalleryModal
                isOpen={isPhotosModalOpen}
                onClose={() => setIsPhotosModalOpen(false)}
                photos={pkg.gallery || []}
                packageTitle={pkg.title}
                packageSlug={pkg.slug}
            />

            {/* Modal de Mapa */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsMapModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-niebla">
                            <h3 className="text-xl font-bold text-grafito">{tPackage('howToGetHere')}</h3>
                            <button onClick={() => setIsMapModalOpen(false)} className="p-2 hover:bg-nieve rounded-full">
                                <X className="w-5 h-5 text-pizarra" />
                            </button>
                        </div>
                        <div className="p-6">
                            {pkg.mapImage ? (
                                <img
                                    src={pkg.mapImage}
                                    alt={`Mapa de ${pkg.title}`}
                                    loading="lazy"
                                    className="w-full h-auto max-h-[70vh] object-contain rounded-xl"
                                />
                            ) : (
                                <div className="bg-nieve rounded-xl h-80 flex items-center justify-center">
                                    <div className="text-center">
                                        <MapPin className="w-12 h-12 text-niebla mx-auto mb-4" />
                                        <p className="text-pizarra">{tPackage('mapComingSoon')}</p>
                                        <p className="text-niebla text-sm mt-2">{pkg.location}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Cotización */}
            <PackageQuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
                packageTitle={pkg.title}
            />

            {/* Modal de Evaluación de Nivel de Hiking */}
            <HikingLevelModal
                isOpen={isHikingLevelModalOpen}
                onClose={() => setIsHikingLevelModalOpen(false)}
            />

            <Footer />
        </div>
    );
};

export default PackageInfoPage;
