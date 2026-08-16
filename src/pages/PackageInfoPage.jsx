import React, { useState, useEffect, useRef } from 'react';
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
import { usePackage, useLanguageAwareNavigation } from '../services/hooks';
import { isModalityUsable } from '../services/api';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { useCurrencyContext } from '../utils/currency';
import ModalityToggle from '../components/ModalityToggle';
import PackageAccordionSection from '../components/PackageAccordionSection';
import PackageQuoteModal from '../components/PackageQuoteModal';
import PhotoGalleryModal from '../components/PhotoGalleryModal';
import HikingLevelModal from '../components/HikingLevelModal';
import Footer from '../components/Footer';
import Hreflang from '../components/Hreflang';
import { useAlternateUrls } from '../hooks/useAlternateUrls';
import usePageMeta from '../hooks/usePageMeta';
import { trackPackageView, trackGalleryOpen, trackModalitySwitch } from '../utils/dataLayer';
import { convertFromEUR } from '../utils/currency';

const PackageInfoPage = ({ onOpenQuote }) => {
    const { t: tCommon, i18n } = useTranslation('common');
    const { slug } = useParams();
    const navigate = useNavigate();
    const currentLocale = i18n.language || 'es';

    // Usar hook de React Query para datos dinámicos
    const { data: pkg, isLoading, error } = usePackage(slug);
    const { texts: siteTexts } = useSiteTextsContext();

    // Hook para redirección inteligente al cambiar idioma
    useLanguageAwareNavigation({
        documentId: pkg?.documentId,
        currentSlug: slug,
        resourceType: 'package',
    });

    // Hreflang para SEO - URLs alternativas por idioma (DEBE estar antes de early returns)
    const { alternateUrls } = useAlternateUrls('package', pkg?.documentId, slug);

    // SEO meta tags (fix #8) - extraer texto de los bloques de descripción
    const descriptionText = pkg?.description ? extractTextFromBlocks(pkg.description) : '';
    usePageMeta(pkg?.title, descriptionText);

    // Textos con fallback: contexto ya tiene fallback integrado
    const loadingText = tCommon('loading.package');

    // Contexto de moneda para conversión de precios
    const { formatPriceFromEUR, currency, loading: currencyLoading } = useCurrencyContext();

    // Estado para el carrusel de itinerario
    const [currentDay, setCurrentDay] = useState(0);

    // Estado para los includes expandibles
    const [expandedInclude, setExpandedInclude] = useState(null);

    // Modalidad seleccionada en el toggle Autoguiada ('A') / Guiada ('B').
    // Se guarda junto al documentId al que pertenece la elección para que, al
    // navegar a OTRO paquete, la selección no se arrastre: si el documentId
    // guardado no coincide con el del paquete actual, la selección se ignora y
    // se recalcula la modalidad por defecto durante el render (ver
    // `selectedModalityKey` más abajo). Se resuelve así, por derivación, en vez
    // de con un useEffect de reset, por tres razones concretas:
    //   1. Un useEffect corre DESPUÉS del primer pintado, así que un paquete
    //      que solo tiene la modalidad Guiada habilitada alcanzaría a pintar un
    //      frame con los datos (vacíos) de la Autoguiada antes de corregirse.
    //   2. Evita introducir warnings nuevos de `react-hooks/set-state-in-effect`
    //      y `exhaustive-deps`, que este repo tiene activos.
    //   3. No hay estado que pueda quedar desincronizado: la fuente de verdad
    //      es el paquete actual, no un efecto que debe alcanzarlo.
    const [modalitySelection, setModalitySelection] = useState({ documentId: null, key: 'A' });

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

    // Track package view when data is loaded (useRef guard prevents StrictMode duplicates).
    // Incluye currency en deps para re-trackear si el usuario cambia moneda (priceConverted cambia).
    const trackedPkgRef = useRef(null);
    useEffect(() => {
        if (currencyLoading) return; // esperar a que se resuelva moneda detectada/guardada
        if (pkg && !currency) return;
        if (pkg && trackedPkgRef.current !== `${slug}_${currency}`) {
            trackedPkgRef.current = `${slug}_${currency}`;
            // fromPriceEUR (no priceEUR legacy) — hallazgo de QA adversarial
            // (Grok): con modalidades, priceEUR legacy puede quedar desfasado
            // del precio "desde" que el usuario realmente ve en la página.
            // fromPriceEUR ya resuelve esto en api.js (cae a priceEUR legacy
            // cuando no hay modalidades usables, así que no cambia nada para
            // los paquetes sin modalidad).
            trackPackageView({
                title: pkg.title,
                slug,
                priceEUR: pkg.fromPriceEUR,
                priceConverted: convertFromEUR(pkg.fromPriceEUR, currency),
                displayCurrency: currency,
                location: pkg.location,
                duration: pkg.duration,
            });
        }
    }, [pkg?.documentId, slug, currency, currencyLoading]);

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
                    <h1 className="text-2xl font-bold text-grafito mb-4">{siteTexts.packageInfo.packageNotFound}</h1>
                    <button
                        onClick={() => navigate(`/${currentLocale}`)}
                        className="bg-pizarra text-white px-6 py-3 rounded-full font-semibold hover:bg-pizarra/90 transition-colors"
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

    // ── Modalidades Autoguiada/Guiada ──
    //
    // `hasModalityData` es el interruptor central de esta integración: cuando es
    // false (hoy, la enorme mayoría de los paquetes, y cualquier paquete futuro
    // que no se configure) la página renderiza EXACTAMENTE los mismos bloques
    // legacy que antes de esta fase, sin una sola clase ni condición cambiada.
    // Los bloques nuevos se agregan AL LADO de los legacy, nunca fusionados con
    // ellos, precisamente para que el riesgo de regresión visual sobre los
    // paquetes ya publicados sea nulo y auditable línea por línea.
    //
    // "Usable" (Gate D, Codex — corrige bug bloqueante de la ronda anterior):
    // una modalidad solo cuenta si además de `enabled === true` tiene un
    // `priceEUR` numérico real. `enabled` sin precio es un dato incompleto del
    // CMS (el mismo caso que `fromPriceEUR` en api.js ya excluye al calcular
    // el mínimo, cayendo al legacy). Antes, esta página solo miraba `enabled`,
    // así que una modalidad habilitada-pero-sin-precio activaba la rama nueva
    // y dejaba el bloque de precio completamente vacío, contradiciendo el
    // propio fallback que `api.js` ya documenta. Ahora ambos lados usan el
    // mismo criterio (`isModalityUsable`, importado de api.js — antes vivía
    // duplicado localmente aquí y con un chequeo distinto en PackageCard.jsx,
    // corregido tras QA adversarial): si ninguna modalidad es usable,
    // `hasModalityData` es false y la página cae 100% al bloque legacy.
    const hasModalityData =
        isModalityUsable(pkg.autoGuidedModality) || isModalityUsable(pkg.guidedModality);

    const modalitiesByKey = { A: pkg.autoGuidedModality, B: pkg.guidedModality };

    // Modalidad por defecto: la primera USABLE (no solo habilitada). Si
    // ninguna lo es, `hasModalityData` es false y nada de esto se renderiza.
    const defaultModalityKey = isModalityUsable(pkg.autoGuidedModality) ? 'A' : 'B';

    // La selección solo vale para el paquete en el que se hizo; para cualquier
    // otro documentId se vuelve a la modalidad por defecto.
    const storedModalityKey = modalitySelection.documentId === pkg.documentId
        ? modalitySelection.key
        : defaultModalityKey;

    // Guarda final: nunca mostramos una modalidad no usable (deshabilitada O
    // sin precio), aunque el estado guardado apunte a ella. Con esto el
    // toggle y el contenido siempre coinciden (se le pasa esta misma clave
    // ya saneada), y el precio nunca queda vacío mientras `hasModalityData`
    // sea true.
    const selectedModalityKey = isModalityUsable(modalitiesByKey[storedModalityKey])
        ? storedModalityKey
        : defaultModalityKey;

    const activeModality = modalitiesByKey[selectedModalityKey];

    // Resueltas una sola vez, reusadas por el ModalityToggle Y por
    // PackageQuoteModal — antes el modal de cotización no las recibía y
    // mostraba "Guiado"/"Autoguiado" fijo sin importar la etiqueta real del
    // tour (hallazgo de revisión adversarial, Codex + Grok).
    const resolvedToggleLabelA = pkg.toggleLabelA || siteTexts.packageInfo.modalityDefaultLabelA;
    const resolvedToggleLabelB = pkg.toggleLabelB || siteTexts.packageInfo.modalityDefaultLabelB;

    const handleModalityChange = (nextKey) => {
        setModalitySelection({ documentId: pkg.documentId, key: nextKey });
        // Sin este evento no había forma de saber qué modalidad mira/prefiere
        // la gente antes de cotizar (hallazgo de revisión adversarial, ver
        // dataLayer.js). Se dispara con el precio/label de la modalidad a la
        // que se está cambiando, no la que se deja.
        const nextModality = modalitiesByKey[nextKey];
        const nextLabel = nextKey === 'A' ? resolvedToggleLabelA : resolvedToggleLabelB;
        trackModalitySwitch({
            packageTitle: pkg.title,
            packageDocumentId: pkg.documentId,
            packageSlug: pkg.slug,
            modalityKey: nextKey,
            modalityLabel: nextLabel,
            priceEUR: nextModality?.priceEUR,
        });
    };

    return (
        <div className="min-h-screen bg-white overflow-x-hidden">
            <Hreflang alternateUrls={alternateUrls} />
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
                            {/* Badges legacy de guía y fechas: solo para paquetes SIN
                                modalidades configuradas. El contenido interno queda
                                idéntico; únicamente se antepone el guard. */}
                            {!hasModalityData && pkg.guideType && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base">
                                    {pkg.guideType}
                                </span>
                            )}
                            {!hasModalityData && pkg.availableDates && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30 text-sm sm:text-base">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="font-medium">{pkg.availableDates}</span>
                                </span>
                            )}

                            {/* "Guía incluido" se movió junto al precio (ver más abajo) —
                                la spec lo pide como chip pegado al precio, no en el hero,
                                para que cambiar el toggle y ver el precio actualizarse sea
                                la misma acción que ver si trae guía (hallazgo de revisión
                                adversarial, Codex/Grok: estaban visualmente desconectados,
                                el usuario podía cambiar el toggle y no notar el badge de
                                arriba, fuera del viewport). */}
                            {/* El rango abierto de fechas solo aplica a Autoguiada (A) —
                                Guiada (B) usa exclusivamente las salidas fijas (chips más
                                abajo), nunca ambas superficies a la vez (mismo hallazgo:
                                la spec pide UNA superficie de fechas que cambia según
                                modalidad, no dos que pueden contradecirse). */}
                            {hasModalityData && selectedModalityKey === 'A' && activeModality?.availableDatesText && (
                                <span className="flex items-center gap-1.5 sm:gap-2 bg-emerald-500/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-emerald-400/30 text-sm sm:text-base">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                                    <span className="font-medium">{activeModality.availableDatesText}</span>
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
                        {siteTexts.packageInfo.yourAdventure}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-bold text-grafito mt-2">
                        {siteTexts.packageInfo.itinerary}
                    </h2>
                </div>
            </div>

            {/* Sección de Itinerario - Layout lado a lado (fix #9: null check) */}
            {pkg.itinerary?.length > 0 && pkg.itinerary[currentDay] && (
            <section ref={itineraryRef} className="bg-nieve">
                <div className="flex flex-col md:flex-row h-auto md:h-[450px]">
                    {/* Imagen izquierda */}
                    <div className="w-full md:w-1/2 h-[250px] md:h-full relative overflow-hidden">
                        <img
                            src={pkg.itinerary[currentDay]?.image || pkg.heroImage || pkg.image}
                            alt={`${siteTexts.packageInfo.day} ${pkg.itinerary[currentDay]?.day}`}
                            loading="lazy"
                            width="800"
                            height="450"
                            className="w-full h-full object-cover transition-all duration-500"
                        />
                    </div>

                    {/* Contenido derecha */}
                    <div className="w-full md:w-1/2 h-[300px] md:h-full bg-white p-6 md:p-10 flex flex-col">
                        {/* min-h-0 en un flex-col es necesario para que este hijo pueda
                            encogerse por debajo de su contenido intrínseco — sin esto, un
                            hijo flex nunca se achica más allá de lo que su contenido pide, y
                            el max-h-full/overflow-y-auto de abajo no tendría ningún límite
                            real del que partir (se seguiría desbordando el flex-col padre).
                            flex-1 le da exactamente el espacio que sobra después de la
                            navegación de abajo, sea cual sea la altura real de esta tarjeta
                            (h-[300px]/h-[450px]) y el tamaño de fuente del breakpoint activo
                            — no depende de un número de píxeles calculado a mano por
                            breakpoint, que ya se rompió dos veces (768px y luego lg:+,
                            hallazgo de revisión adversarial, Codex, ronda 2). */}
                        <div className="flex flex-col min-h-0 flex-1">
                            <div className="shrink-0">
                                {/* Badge del día */}
                                <div className="inline-flex items-center gap-2 mb-3">
                                    <div className="w-9 h-9 bg-pizarra rounded-lg flex items-center justify-center shadow shadow-pizarra/20">
                                        <span className="text-base font-bold text-white">{pkg.itinerary[currentDay].day}</span>
                                    </div>
                                    <span className="text-pizarra font-semibold text-sm">
                                        {siteTexts.packageInfo.day} {pkg.itinerary[currentDay].day} {siteTexts.packageInfo.dayOf} {pkg.itinerary.length}
                                    </span>
                                </div>

                                {/* Título */}
                                <h3 className="text-xl md:text-2xl font-bold text-grafito mb-3 leading-tight">
                                    {pkg.itinerary[currentDay].title}
                                </h3>
                            </div>

                            {/* Descripción - toma el espacio remanente real del flex-col
                                (ver comentario arriba) y hace scroll interno dentro de eso,
                                nunca desborda la tarjeta sin importar el breakpoint, el
                                tamaño de fuente, o cuánto escriba el equipo editorial. */}
                            <div className="relative flex-1 min-h-0">
                                <div className="text-pizarra text-sm md:text-base leading-relaxed prose prose-sm max-w-none h-full overflow-y-auto pr-1 pb-10 scrollbar-thin scrollbar-thumb-niebla scrollbar-track-transparent">
                                    <BlocksRenderer content={pkg.itinerary[currentDay].description} />
                                </div>
                                {/* Gradiente indicador de scroll (se ve inofensivo aunque el
                                    texto no llegue a desbordar; consistente en todos los anchos) */}
                                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white via-white/70 to-transparent pointer-events-none transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Navegación */}
                        <div className="flex items-center justify-between pt-2 border-t border-niebla shrink-0">
                            {/* Flechas */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => { e.preventDefault(); handlePrevDay(); }}
                                    disabled={currentDay === 0}
                                    aria-label="Previous day"
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${currentDay === 0
                                        ? 'bg-nieve text-niebla cursor-not-allowed'
                                        : 'bg-nieve text-pizarra hover:bg-pizarra hover:text-white'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={(e) => { e.preventDefault(); handleNextDay(); }}
                                    disabled={currentDay === pkg.itinerary.length - 1}
                                    aria-label="Next day"
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
                                        aria-label={`Day ${index + 1}`}
                                        aria-current={index === currentDay ? 'step' : undefined}
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
            )}

            {/* Espaciador entre itinerario y detalles */}
            <div className="h-8 sm:h-10 md:h-0"></div>

            {/* Sección de Detalles - Texto izquierda, Imagen derecha */}
            <section className="py-8 sm:py-12 md:py-24 overflow-hidden">
                <div className="container mx-auto px-4 pt-2 sm:pt-0 sm:px-6">
                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start w-full">
                        {/* Columna izquierda - Detalles */}
                        <div className="w-full overflow-hidden">
                            {/* Precio destacado (legacy, sin modalidades) */}
                            {!hasModalityData && (
                                <div className="mb-8">
                                    <p className="text-niebla text-sm uppercase tracking-wider mb-1">
                                        {siteTexts.packageInfo.pricePerPerson}
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
                            )}

                            {/* Selector de modalidad + precio de la modalidad activa.
                                El toggle va ARRIBA del precio a propósito: el usuario
                                elige modalidad y ve el precio (y el contenido de más
                                abajo) actualizarse debajo de su elección. */}
                            {hasModalityData && (
                                <div className="mb-8">
                                    <ModalityToggle
                                        labelA={resolvedToggleLabelA}
                                        labelB={resolvedToggleLabelB}
                                        selected={selectedModalityKey}
                                        onChange={handleModalityChange}
                                        disabledA={!isModalityUsable(pkg.autoGuidedModality)}
                                        disabledB={!isModalityUsable(pkg.guidedModality)}
                                        unavailableLabel={siteTexts.packageInfo.modalityUnavailable}
                                        ariaLabel={siteTexts.packageInfo.modalitySelectorAriaLabel}
                                    />

                                    {/* Aclaración de la modalidad elegida: texto sutil entre
                                        el toggle y el precio, para que se lea como contexto de
                                        lo recién seleccionado sin competir con la cifra. */}
                                    {activeModality?.hint && (
                                        <p className="text-niebla text-sm leading-snug mt-3">
                                            {activeModality.hint}
                                        </p>
                                    )}

                                    <div className="mt-5">
                                        <p className="text-niebla text-sm uppercase tracking-wider mb-1">
                                            {siteTexts.packageInfo.fromPrice
                                                ? `${siteTexts.packageInfo.fromPrice} · ${siteTexts.packageInfo.pricePerPerson}`
                                                : siteTexts.packageInfo.pricePerPerson}
                                        </p>
                                        {/* flex-wrap (hallazgo QA, Codex): precio + tachado + badge
                                            "Guía incluido" pueden exceder el ancho en móvil con
                                            precios convertidos largos o labels en alemán/italiano. */}
                                        <div className="flex flex-wrap items-baseline gap-3">
                                            {activeModality?.hasDiscount === true
                                                && activeModality.originalPriceEUR > 0
                                                && activeModality.originalPriceEUR > activeModality.priceEUR && (
                                                <span className="text-niebla line-through text-lg sm:text-xl">
                                                    {formatPriceFromEUR(activeModality.originalPriceEUR)}
                                                </span>
                                            )}
                                            {typeof activeModality?.priceEUR === 'number' && (
                                                <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-pizarra">
                                                    {formatPriceFromEUR(activeModality.priceEUR)}
                                                </span>
                                            )}
                                            {/* "Guía incluido" pegado al precio a propósito — ver
                                                nota más arriba, junto al badge del hero que se quitó. */}
                                            {selectedModalityKey === 'B' && siteTexts.packageInfo.guideIncludedLabel && (
                                                <span className="bg-niebla/40 text-grafito px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-center">
                                                    {siteTexts.packageInfo.guideIncludedLabel}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

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
                                    {siteTexts.packageInfo.notSureLevel}
                                </span>
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Incluye - Desplegables (legacy, sin modalidades) */}
                            {!hasModalityData && pkg.includes && pkg.includes.length > 0 && (
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

                            {/* No Incluye - Desplegables (legacy, sin modalidades) */}
                            {!hasModalityData && pkg.notIncludes && pkg.notIncludes.length > 0 && (
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

                            {/* Fechas de salida: existen solo en la modalidad Guiada (la
                                Autoguiada se realiza en fechas libres). Se ubican junto a
                                los desplegables de la modalidad —y no pegadas al precio—
                                para que TODO el contenido que cambia con el toggle quede
                                agrupado en la misma zona de la página. */}
                            {(() => {
                                const allDepartures = activeModality?.departures || [];
                                if (!hasModalityData || selectedModalityKey !== 'B' || allDepartures.length === 0) {
                                    return null;
                                }
                                // Solo salidas disponibles: una fecha con available:false
                                // (agotada, apagada por Paty en el CMS) no debe aparecer
                                // en absoluto, no solo perder el resaltado.
                                const availableDepartures = allDepartures.filter(d => d.available);
                                return (
                                    <div className="mb-6">
                                        {siteTexts.packageInfo.availableDatesHeading && (
                                            <h3 className="text-lg font-bold text-grafito mb-3 font-heading">
                                                {siteTexts.packageInfo.availableDatesHeading}
                                            </h3>
                                        )}
                                        {availableDepartures.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {availableDepartures.map((departure, index) => (
                                                    <span
                                                        key={`departure-${index}`}
                                                        className="flex items-center gap-2 bg-nieve border border-niebla text-grafito px-3 py-1.5 rounded-full text-sm font-medium"
                                                    >
                                                        <Calendar className="w-3.5 h-3.5 text-pizarra flex-shrink-0" aria-hidden="true" />
                                                        {departure.text}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            // Hay salidas cargadas en el CMS pero todas agotadas —
                                            // decirlo explícitamente en vez de desaparecer en
                                            // silencio (hallazgo de revisión adversarial, Grok: el
                                            // usuario veía precio e "incluye" de un tour guiado sin
                                            // ninguna fecha ni explicación de por qué).
                                            siteTexts.packageInfo.noDatesAvailable && (
                                                <p className="text-niebla text-sm">
                                                    {siteTexts.packageInfo.noDatesAvailable}
                                                </p>
                                            )
                                        )}
                                    </div>
                                );
                            })()}

                            {/* Incluye / No incluye de la modalidad activa.
                                El `key` incluye la modalidad a propósito: fuerza el remonte
                                del acordeón al cambiar de modalidad para que no quede
                                expandido, por índice, un item que el usuario nunca abrió
                                (cada modalidad tiene su propia lista y su propio orden). */}
                            {hasModalityData && (
                                <>
                                    <PackageAccordionSection
                                        key={`includes-${selectedModalityKey}`}
                                        items={activeModality?.includes}
                                        icon={Check}
                                        title={siteTexts.packageInfo.includes}
                                    />
                                    <PackageAccordionSection
                                        key={`not-includes-${selectedModalityKey}`}
                                        items={activeModality?.notIncludes}
                                        icon={X}
                                        title={siteTexts.packageInfo.notIncludes}
                                    />
                                </>
                            )}

                            {/* Información Adicional - Desplegables.
                                Sin equivalente por modalidad: se muestra siempre, en ambas
                                ramas, porque no forma parte de este feature. */}
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
                                        onClick={() => {
                                            trackGalleryOpen({
                                                packageTitle: pkg.title,
                                                packageSlug: pkg.slug ?? slug,
                                                photoCount: pkg.gallery?.filter(g => g.url)?.length || 0,
                                            });
                                            setIsPhotosModalOpen(true);
                                        }}
                                        className="w-full flex items-center justify-between p-4 bg-nieve rounded-xl border border-niebla hover:bg-nieve transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center">
                                                <Camera className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-semibold text-grafito">{siteTexts.packageInfo.additionalPhotos}</span>
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
                                            <span className="font-semibold text-grafito">{siteTexts.packageInfo.howToGetHere}</span>
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
                                        {siteTexts.packageInfo.quote}
                                    </button>
                                    <p className="text-center text-white/70 text-sm mt-3">
                                        {siteTexts.packageInfo.quoteResponse}
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

            {/* Modal de Mapa (fix #29: ARIA semantics) */}
            {isMapModalOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                    onClick={() => setIsMapModalOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label={siteTexts.packageInfo?.howToGetHere || 'Map'}
                >
                    <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between p-6 border-b border-niebla">
                            <h3 className="text-xl font-bold text-grafito">{siteTexts.packageInfo.howToGetHere}</h3>
                            <button
                                onClick={() => setIsMapModalOpen(false)}
                                className="p-2 hover:bg-nieve rounded-full"
                                aria-label="Close map"
                            >
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
                                        <p className="text-pizarra">{siteTexts.packageInfo.mapComingSoon}</p>
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
                packageDocumentId={pkg.documentId}
                packageSlug={pkg.slug}
                // Hallazgo de QA adversarial (Grok): antes el modal siempre
                // abría con "Guiado" fijo, sin importar qué modalidad eligió
                // el usuario en el toggle de arriba. Solo se pasa un valor
                // explícito cuando hay modalidad activa (hasModalityData) —
                // para paquetes legacy sin modalidades, se omite el prop y el
                // modal usa su propio default ('guiado'), sin cambiar nada.
                preselectedTripType={hasModalityData
                    ? (selectedModalityKey === 'A' ? 'autoguiado' : 'guiado')
                    : undefined}
                // Mismas etiquetas reales que ve en el toggle de arriba — para
                // paquetes legacy sin modalidad, se omiten y el modal usa sus
                // defaults ("Autoguiado"/"Guiado"), sin cambiar nada.
                labelA={hasModalityData ? resolvedToggleLabelA : undefined}
                labelB={hasModalityData ? resolvedToggleLabelB : undefined}
                // Precio por modalidad, para que el evento de analytics del
                // envío lleve el precio que el usuario realmente vio.
                priceA={hasModalityData ? pkg.autoGuidedModality?.priceEUR : undefined}
                priceB={hasModalityData ? pkg.guidedModality?.priceEUR : undefined}
                // Mismo cálculo que el toggle principal (hallazgo de revisión
                // adversarial, Codex): antes el modal dejaba elegir una
                // modalidad que el toggle ya mostraba como "No disponible".
                disabledA={hasModalityData && !isModalityUsable(pkg.autoGuidedModality)}
                disabledB={hasModalityData && !isModalityUsable(pkg.guidedModality)}
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
