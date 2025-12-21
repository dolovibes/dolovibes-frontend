import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    X
} from 'lucide-react';
import { getPackageBySlug } from '../data/packages';
import PackageQuoteModal from '../components/PackageQuoteModal';
import Footer from '../components/Footer';

const PackageInfoPage = ({ onOpenQuote }) => {
    const { t: tCommon } = useTranslation('common');
    const { slug } = useParams();
    const navigate = useNavigate();
    const pkg = getPackageBySlug(slug);

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

    // Referencia para la sección de itinerario (para swipe/wheel)
    const itineraryRef = React.useRef(null);

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-nieve">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-grafito mb-4">Paquete no encontrado</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-alpino text-white px-6 py-3 rounded-full font-semibold hover:bg-alpino transition-colors"
                    >
                        Volver al inicio
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

    // Soporte para swipe/wheel en trackpad
    React.useEffect(() => {
        const section = itineraryRef.current;
        if (!section || !pkg) return;

        let isScrolling = false;
        let lastScrollTime = 0;
        const scrollThreshold = 50;
        const scrollDebounce = 500; // ms entre cambios de día

        const handleWheel = (e) => {
            // Solo procesar scroll horizontal o vertical significativo
            const deltaX = Math.abs(e.deltaX);
            const deltaY = Math.abs(e.deltaY);
            const now = Date.now();

            // Debounce para evitar cambios muy rápidos
            if (now - lastScrollTime < scrollDebounce) return;

            // Usar deltaX para scroll horizontal (trackpad) o deltaY para scroll vertical
            const delta = deltaX > deltaY ? e.deltaX : e.deltaY;

            if (Math.abs(delta) > scrollThreshold) {
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

    const toggleInclude = (index) => {
        setExpandedInclude(expandedInclude === index ? null : index);
    };

    const currentItinerary = pkg.itinerary[currentDay];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero - Pantalla completa */}
            <div className="relative min-h-screen flex items-end">
                <img
                    src={pkg.heroImage || pkg.image}
                    alt={pkg.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pizarra via-pizarra/40 to-transparent"></div>

                {/* Info superpuesta */}
                <div className="relative z-10 p-6 md:p-12 pb-16 md:pb-24 w-full">
                    <div className="container mx-auto">
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                            {pkg.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-6">
                            {pkg.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-white/90">
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <MapPin className="w-4 h-4" />
                                {pkg.location}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Clock className="w-4 h-4" />
                                {pkg.duration}
                            </span>
                            <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium ${pkg.difficulty?.toLowerCase().includes('bajo') || pkg.difficulty?.toLowerCase().includes('fácil')
                                ? 'bg-green-500/80 text-white'
                                : pkg.difficulty?.toLowerCase().includes('intermedio') || pkg.difficulty?.toLowerCase().includes('moderado')
                                    ? 'bg-amber-500/80 text-white'
                                    : 'bg-red-500/80 text-white'
                                }`}>
                                {pkg.difficulty}
                            </span>
                            <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                <Users className="w-4 h-4" />
                                {pkg.groupSize}
                            </span>
                            {pkg.guideType && (
                                <span className="flex items-center gap-2 bg-alpino/80 px-4 py-2 rounded-full font-medium text-white">
                                    {pkg.guideType}
                                </span>
                            )}
                            {pkg.availableDates && (
                                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                                    {pkg.availableDates}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Separador visual */}
            <div className="bg-white py-10 md:py-12">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-alpino font-semibold tracking-wider uppercase text-sm">
                        Tu aventura día a día
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-grafito mt-2">
                        Itinerario
                    </h2>
                </div>
            </div>

            {/* Sección de Itinerario - Layout lado a lado */}
            <section ref={itineraryRef} className="bg-nieve">
                <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
                    {/* Imagen izquierda */}
                    <div className="w-full md:w-1/2 h-[250px] md:h-full relative overflow-hidden">
                        <img
                            src={pkg.itinerary[currentDay].image}
                            alt={`Día ${pkg.itinerary[currentDay].day}`}
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                    </div>

                    {/* Contenido derecha */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-full bg-white p-6 md:p-10 flex flex-col justify-between">
                        <div>
                            {/* Badge del día */}
                            <div className="inline-flex items-center gap-2 mb-3">
                                <div className="w-9 h-9 bg-alpino rounded-lg flex items-center justify-center shadow shadow-alpino/20">
                                    <span className="text-base font-bold text-white">{pkg.itinerary[currentDay].day}</span>
                                </div>
                                <span className="text-alpino font-semibold text-sm">
                                    Día {pkg.itinerary[currentDay].day} de {pkg.itinerary.length}
                                </span>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl md:text-2xl font-bold text-grafito mb-3 leading-tight">
                                {pkg.itinerary[currentDay].title}
                            </h3>

                            {/* Descripción - altura fija */}
                            <p className="text-pizarra text-sm md:text-base leading-relaxed line-clamp-4">
                                {pkg.itinerary[currentDay].description}
                            </p>
                        </div>

                        {/* Navegación */}
                        <div className="flex items-center justify-between pt-6 border-t border-niebla">
                            {/* Flechas */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.preventDefault(); handlePrevDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === 0
                                        ? 'bg-nieve text-niebla cursor-not-allowed'
                                        : 'bg-nieve text-pizarra hover:bg-alpino hover:text-white'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleNextDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === pkg.itinerary.length - 1
                                        ? 'bg-nieve text-niebla cursor-not-allowed'
                                        : 'bg-nieve text-pizarra hover:bg-alpino hover:text-white'
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
                                            ? 'w-8 bg-alpino'
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

            {/* Sección de Detalles - Texto izquierda, Imagen derecha */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Columna izquierda - Detalles */}
                        <div>
                            {/* Precio destacado */}
                            <div className="mb-8">
                                <p className="text-niebla text-sm uppercase tracking-wider mb-1">
                                    Precio por persona
                                </p>
                                <div className="flex items-baseline gap-3">
                                    {pkg.originalPrice && (
                                        <span className="text-niebla line-through text-xl">
                                            {pkg.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-4xl md:text-5xl font-bold text-alpino">
                                        {pkg.price}
                                    </span>
                                </div>
                            </div>

                            {/* Descripción breve */}
                            <p className="text-lg text-pizarra leading-relaxed mb-8">
                                {pkg.description}
                            </p>

                            {/* Incluye - Desplegables */}
                            <div className="space-y-3 mb-6">
                                {pkg.includes.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-nieve rounded-xl overflow-hidden border border-niebla"
                                    >
                                        <button
                                            onClick={() => toggleInclude(index)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-alpino rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-grafito">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-niebla transition-transform duration-300 ${expandedInclude === index ? 'rotate-180' : ''
                                                }`} />
                                        </button>

                                        {/* Contenido expandible */}
                                        <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div className="px-4 pb-4 pt-0">
                                                <p className="text-pizarra pl-11">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Botones adicionales */}
                            <div className="space-y-3">
                                {/* Additional Photos */}
                                <button
                                    onClick={() => setIsPhotosModalOpen(true)}
                                    className="w-full flex items-center justify-between p-4 bg-nieve rounded-xl border border-niebla hover:bg-nieve transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center">
                                            <span className="text-white text-sm">📷</span>
                                        </div>
                                        <span className="font-semibold text-grafito">Additional Photos</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-niebla" />
                                </button>

                                {/* How to get here */}
                                <button
                                    onClick={() => setIsMapModalOpen(true)}
                                    className="w-full flex items-center justify-between p-4 bg-nieve rounded-xl border border-niebla hover:bg-nieve transition-colors text-left"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center">
                                            <MapPin className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="font-semibold text-grafito">How to get here</span>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-niebla" />
                                </button>
                            </div>
                        </div>

                        {/* Columna derecha - Imagen con Book Now */}
                        <div className="lg:sticky lg:top-28">
                            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src={pkg.heroImage || pkg.image}
                                    alt={pkg.title}
                                    className="w-full h-[400px] md:h-[500px] object-cover"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-pizarra/80 via-transparent to-transparent"></div>

                                {/* Book Now Button */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                    <button
                                        onClick={() => setIsQuoteModalOpen(true)}
                                        className="w-full bg-alpino hover:bg-alpino text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-alpino/30"
                                    >
                                        Cotizar
                                    </button>
                                    <p className="text-center text-white/70 text-sm mt-3">
                                        Te responderemos en menos de 24 horas
                                    </p>
                                </div>
                            </div>


                        </div>
                    </div>
                </div>
            </section>

            {/* Modal de Fotos Adicionales */}
            {isPhotosModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsPhotosModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-niebla">
                            <h3 className="text-xl font-bold text-grafito">Additional Photos</h3>
                            <button onClick={() => setIsPhotosModalOpen(false)} className="p-2 hover:bg-nieve rounded-full">
                                <X className="w-5 h-5 text-pizarra" />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[70vh]">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {pkg.itinerary?.map((day, index) => (
                                    <img
                                        key={index}
                                        src={day.image}
                                        alt={`Foto ${index + 1}`}
                                        className="w-full h-40 object-cover rounded-xl hover:scale-105 transition-transform cursor-pointer"
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Mapa */}
            {isMapModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setIsMapModalOpen(false)}>
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-niebla">
                            <h3 className="text-xl font-bold text-grafito">How to get here</h3>
                            <button onClick={() => setIsMapModalOpen(false)} className="p-2 hover:bg-nieve rounded-full">
                                <X className="w-5 h-5 text-pizarra" />
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="bg-nieve rounded-xl h-80 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-niebla mx-auto mb-4" />
                                    <p className="text-pizarra">Mapa próximamente</p>
                                    <p className="text-niebla text-sm mt-2">{pkg.location}</p>
                                </div>
                            </div>
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

            <Footer />
        </div>
    );
};

export default PackageInfoPage;
