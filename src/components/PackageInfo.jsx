import React from 'react';
import { Mountain, Clock, Tag, UtensilsCrossed, Hotel, Languages, Star, Calendar, Bed, MapPin, ArrowLeft, ChevronRight, Download, MessageCircle, Plane } from 'lucide-react';

const PackageInfo = ({ tour, onClose }) => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Datos del itinerario
    const itinerary = [
        {
            day: 1,
            title: "Llegada a Val Badia",
            icon: Plane,
            description: "Recepción privada en el aeropuerto de Venecia. Traslado escénico de 2.5 horas hacia los Dolomitas. Check-in en el Hotel Rosa Alpina y cóctel de bienvenida.",
            image: "https://images.unsplash.com/photo-1543788303-a265691d1791?q=80&w=300&auto=format&fit=crop",
            tags: ["Hotel Incluido", "Cena Incluida"]
        },
        {
            day: 2,
            title: "Senderismo en Santa Croce",
            icon: Mountain,
            description: "Comenzamos con una caminata panorámica. Un día para explorar las pistas soleadas. Almuerzo en el refugio local con gastronomía típica.",
            tags: ["5 Horas"]
        },
        {
            day: 3,
            title: "La Marmolada",
            icon: Mountain,
            description: "Subida a la 'Reina de las Dolomitas'. Vista panorámica a 3,343 metros de altura con vistas increíbles.",
            tags: []
        }
    ];

    const highlights = [
        { icon: UtensilsCrossed, title: "Gastronomía Michelin", description: "Cenas en refugios premiados." },
        { icon: Mountain, title: "Rutas Exclusivas", description: "Acceso a senderos únicos." },
        { icon: Hotel, title: "Hoteles Boutique", description: "Alojamiento de lujo." },
        { icon: Languages, title: "Guía en Español", description: "Acompañamiento 24/7." }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-sm h-20 flex items-center justify-between px-8 sticky top-0 z-50">
                <span className="font-serif text-2xl font-bold text-emerald-700 tracking-wider">VETTA ITALIA</span>
                <button
                    onClick={onClose}
                    className="text-sm font-bold text-slate-500 hover:text-emerald-600 uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                    <ArrowLeft size={16} /> Volver al Inicio
                </button>
            </nav>

            {/* Header Section */}
            <header className="relative h-[60vh] flex items-end pb-12 justify-center">
                <div className="absolute inset-0">
                    <img
                        src={tour?.image || "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=2000"}
                        alt="Dolomitas"
                        className="w-full h-full object-cover brightness-75"
                    />
                </div>

                <div className="relative z-10 text-center text-white px-4 max-w-4xl">
                    <span className="bg-emerald-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block rounded-sm">
                        Invierno 2025
                    </span>
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4">
                        {tour?.title || "Ski Safari: Alta Badia"}
                    </h1>
                    <p className="text-xl font-light mb-6 opacity-90">
                        Una travesía culinaria y deportiva por el corazón de la UNESCO.
                    </p>

                    {/* Quick Stats */}
                    <div className="flex flex-wrap justify-center gap-4 text-slate-800">
                        <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-lg shadow-lg flex items-center gap-3">
                            <Clock className="text-emerald-600" size={18} />
                            <span className="font-bold text-sm">{tour?.duration || "7 Días / 6 Noches"}</span>
                        </div>
                        <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-lg shadow-lg flex items-center gap-3">
                            <Mountain className="text-emerald-600" size={18} />
                            <span className="font-bold text-sm">Nivel: Intermedio</span>
                        </div>
                        <div className="bg-white/95 backdrop-blur px-6 py-2 rounded-lg shadow-lg flex items-center gap-3">
                            <Tag className="text-emerald-600" size={18} />
                            <span className="font-bold text-sm">{tour?.price || "Desde €2,800"}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content with Sidebar */}
            <main className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">

                {/* Left Column - Main Content */}
                <div className="lg:col-span-8 space-y-16">

                    {/* Highlights Section */}
                    <section id="highlights" className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-serif text-3xl font-bold text-emerald-700 mb-6">Highlights del Viaje</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {highlights.map((item, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 text-emerald-600">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">{item.title}</h4>
                                        <p className="text-sm text-slate-600">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Day by Day Itinerary */}
                    <section id="daybyday" className="relative">
                        <h2 className="font-serif text-3xl font-bold text-emerald-700 mb-10">Itinerario Día a Día</h2>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[2.2rem] top-4 bottom-8 w-0.5 bg-slate-200 -z-10"></div>

                            {itinerary.map((day) => (
                                <div key={day.day} className="flex gap-6 items-start">
                                    {/* Day Number Box */}
                                    <div className="w-20 h-20 bg-emerald-600 text-white flex flex-col items-center justify-center rounded-lg shadow-md flex-shrink-0 z-10">
                                        <span className="text-xs font-light uppercase tracking-wide">Día</span>
                                        <span className="text-2xl font-bold font-serif">{day.day.toString().padStart(2, '0')}</span>
                                    </div>

                                    {/* Day Content Card */}
                                    <div className="flex-1 bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                        <div className="p-6 flex justify-between items-center bg-slate-50 border-b border-slate-100">
                                            <h3 className="font-bold text-lg text-emerald-700 flex items-center gap-3">
                                                <day.icon size={20} className="text-emerald-600" />
                                                {day.title}
                                            </h3>
                                        </div>
                                        <div className="p-6">
                                            {day.image && (
                                                <div className="flex flex-col md:flex-row gap-6">
                                                    <img
                                                        src={day.image}
                                                        alt={day.title}
                                                        className="w-full md:w-32 h-24 object-cover rounded-md"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                            {day.description}
                                                        </p>
                                                        {day.tags.length > 0 && (
                                                            <div className="flex gap-3 text-xs font-bold text-slate-500 uppercase flex-wrap">
                                                                {day.tags.map((tag, idx) => (
                                                                    <span key={idx} className="bg-slate-100 px-2 py-1 rounded">
                                                                        {tag}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                            {!day.image && (
                                                <>
                                                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                                                        {day.description}
                                                    </p>
                                                    {day.tags.length > 0 && (
                                                        <div className="flex gap-3 text-xs font-bold text-slate-500 uppercase">
                                                            {day.tags.map((tag, idx) => (
                                                                <span key={idx} className="bg-slate-100 px-2 py-1 rounded">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Map Section */}
                    <section id="map" className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                        <h2 className="font-serif text-2xl font-bold text-emerald-700 mb-4">Mapa del Área</h2>
                        <div className="w-full h-64 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400">
                            <MapPin size={48} className="mr-2" />
                            <span className="text-lg">Vista de Google Maps Interactiva</span>
                        </div>
                    </section>

                </div>

                {/* Right Column - Sticky Sidebar */}
                <aside className="lg:col-span-4">
                    <div className="sticky top-28 space-y-6">

                        {/* Navigation Box */}
                        <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-emerald-600">
                            <h3 className="font-bold text-white bg-emerald-600 -mx-6 -mt-6 p-4 rounded-t-lg mb-6 text-center uppercase tracking-widest text-sm">
                                Sobre este Viaje
                            </h3>

                            <nav className="space-y-3">
                                {[
                                    { id: 'highlights', icon: Star, label: 'Highlights' },
                                    { id: 'daybyday', icon: Calendar, label: 'Día a Día' },
                                    { id: 'accommodation', icon: Bed, label: 'Alojamiento' },
                                    { id: 'cost', icon: Tag, label: 'Costos' },
                                    { id: 'map', icon: MapPin, label: 'Mapa de Ruta' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className="flex items-center justify-between w-full px-4 py-3 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-full border border-slate-200 transition-colors group text-left"
                                    >
                                        <span className="font-medium text-sm flex items-center gap-2">
                                            <item.icon size={16} className="text-emerald-600" />
                                            {item.label}
                                        </span>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-600" />
                                    </button>
                                ))}
                            </nav>

                            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                <p className="text-slate-500 text-xs mb-2 uppercase font-bold">¿Listo para ir?</p>
                                <button className="w-full bg-emerald-600 text-white font-bold py-3 rounded-full hover:bg-emerald-700 transition shadow-md uppercase tracking-widest text-sm mb-3">
                                    Planear mi Viaje
                                </button>
                                <button className="w-full bg-white text-emerald-600 border border-emerald-600 font-bold py-3 rounded-full hover:bg-emerald-600 hover:text-white transition text-sm flex items-center justify-center gap-2">
                                    <Download size={16} />
                                    Descargar PDF
                                </button>
                            </div>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-emerald-600 p-6 rounded-xl shadow-md text-white flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl">
                                <MessageCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs opacity-70 uppercase tracking-wide">¿Dudas?</p>
                                <p className="font-bold text-lg">Hablemos ahora</p>
                            </div>
                        </div>

                    </div>
                </aside>

            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-8 text-center text-sm">
                <p>© 2025 Vetta Italia. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default PackageInfo;
