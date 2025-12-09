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

    // Referencia para la sección de itinerario (para swipe/wheel)
    const itineraryRef = React.useRef(null);

    if (!pkg) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-800 mb-4">Paquete no encontrado</h1>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
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
            {/* Hero de paquete */}
            <div className="relative h-[60vh] md:h-[70vh]">
                <img
                    src={pkg.heroImage || pkg.image}
                    alt={pkg.title}
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
                            {pkg.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${pkg.season === 'verano'
                                ? 'bg-amber-500 text-white'
                                : 'bg-blue-500 text-white'
                                }`}>
                                {pkg.season === 'verano' ? `☀️ ${tCommon('seasons.summer')}` : `❄️ ${tCommon('seasons.winter')}`}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
                            {pkg.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-white/80">
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
                            <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {pkg.groupSize}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Separador visual */}
            <div className="bg-white py-10 md:py-12">
                <div className="container mx-auto px-6 text-center">
                    <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
                        Tu aventura día a día
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
                        Itinerario
                    </h2>
                </div>
            </div>

            {/* Sección de Itinerario - Layout lado a lado */}
            <section ref={itineraryRef} className="bg-slate-50">
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
                                <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shadow shadow-emerald-500/20">
                                    <span className="text-base font-bold text-white">{pkg.itinerary[currentDay].day}</span>
                                </div>
                                <span className="text-emerald-600 font-semibold text-sm">
                                    Día {pkg.itinerary[currentDay].day} de {pkg.itinerary.length}
                                </span>
                            </div>

                            {/* Título */}
                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">
                                {pkg.itinerary[currentDay].title}
                            </h3>

                            {/* Descripción - altura fija */}
                            <p className="text-slate-600 text-sm md:text-base leading-relaxed line-clamp-4">
                                {pkg.itinerary[currentDay].description}
                            </p>
                        </div>

                        {/* Navegación */}
                        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                            {/* Flechas */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.preventDefault(); handlePrevDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === 0
                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleNextDay(); }}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === pkg.itinerary.length - 1
                                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                        : 'bg-slate-100 text-slate-600 hover:bg-emerald-500 hover:text-white'
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
                                            ? 'w-8 bg-emerald-500'
                                            : 'w-2 bg-slate-200 hover:bg-slate-300'
                                            }`}
                                    />
                                ))}
                            </div>

                            {/* Contador */}
                            <div className="text-slate-400 font-medium text-sm">
                                <span className="text-slate-900 font-bold text-lg">{String(currentDay + 1).padStart(2, '0')}</span>
                                <span className="mx-1">/</span>
                                <span>{String(pkg.itinerary.length).padStart(2, '0')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de Costos */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        {/* Columna izquierda - Incluye / No incluye */}
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                                ¿Qué incluye?
                            </h2>

                            {/* Incluye - Desplegables */}
                            <div className="space-y-3 mb-10">
                                {pkg.includes.map((item, index) => (
                                    <div
                                        key={index}
                                        className="bg-emerald-50 rounded-xl overflow-hidden border border-emerald-100"
                                    >
                                        <button
                                            onClick={() => toggleInclude(index)}
                                            className="w-full flex items-center justify-between p-4 text-left hover:bg-emerald-100/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <Check className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="font-semibold text-slate-800">
                                                    {item.label}
                                                </span>
                                            </div>
                                            <ChevronDown className={`w-5 h-5 text-emerald-600 transition-transform duration-300 ${expandedInclude === index ? 'rotate-180' : ''
                                                }`} />
                                        </button>

                                        {/* Contenido expandible */}
                                        <div className={`overflow-hidden transition-all duration-300 ${expandedInclude === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                                            }`}>
                                            <div className="px-4 pb-4 pt-0">
                                                <p className="text-slate-600 pl-11">
                                                    {item.detail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* No incluye */}
                            <h3 className="text-xl font-bold text-slate-900 mb-4">
                                No incluye
                            </h3>
                            <div className="space-y-2">
                                {pkg.notIncludes.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3 text-slate-600">
                                        <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
                                            <X className="w-3 h-3 text-slate-500" />
                                        </div>
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Columna derecha - Precio y CTA */}
                        <div className="lg:sticky lg:top-28">
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-2xl">
                                <div className="text-center mb-8">
                                    <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">
                                        Precio por persona
                                    </p>
                                    {pkg.originalPrice && (
                                        <p className="text-slate-500 line-through text-lg">
                                            {pkg.originalPrice}
                                        </p>
                                    )}
                                    <p className="text-4xl md:text-5xl font-bold text-white">
                                        {pkg.price}
                                    </p>
                                </div>

                                {/* Info rápida */}
                                <div className="space-y-4 mb-8 pb-8 border-b border-white/10">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Duración</span>
                                        <span className="font-semibold">{pkg.duration}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Grupo</span>
                                        <span className="font-semibold">{pkg.groupSize}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Dificultad</span>
                                        <span className="font-semibold">{pkg.difficulty}</span>
                                    </div>
                                </div>

                                {/* Fechas disponibles */}
                                <div className="mb-8">
                                    <p className="text-slate-400 text-sm mb-3">Próximas salidas:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {pkg.startDates.slice(0, 3).map((date, index) => (
                                            <span
                                                key={index}
                                                className="bg-white/10 px-3 py-1 rounded-full text-sm"
                                            >
                                                {date}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Botón Cotizar */}
                                <button
                                    onClick={() => setIsQuoteModalOpen(true)}
                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-600/30"
                                >
                                    {tCommon('navbar.quote')}
                                </button>

                                <p className="text-center text-slate-500 text-sm mt-4">
                                    Te responderemos en menos de 24 horas
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
