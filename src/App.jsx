import React, { useState, useEffect } from 'react';
import { Mountain, MapPin, Calendar, Star, ArrowRight, Menu, X, ChevronRight, Phone, Mail, Instagram, Facebook, User, Users, CheckCircle, Clock, Award, Quote, Heart, Globe, Shield } from 'lucide-react';
import BookingForm from './components/BookingForm';
import PackageInfo from './components/PackageInfo';

// Datos extendidos para incluir detalles
const toursData = [
  {
    id: 1,
    title: "Trekking en las Dolomitas",
    location: "Cortina d'Ampezzo, Véneto",
    originalPrice: "MXN 23,500",
    price: "MXN 20,999",
    duration: "5 Días",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=800",
    tags: ["Senderismo", "Intermedio"],
    hasDiscount: true,
    description: "Una travesía inolvidable por los picos más icónicos de los Alpes Orientales. Caminarás a la sombra de las Tre Cime di Lavaredo y dormirás en refugios de alta montaña con gastronomía local.",
    itinerary: [
      "Día 1: Llegada a Cortina y briefing.",
      "Día 2: Ruta Tre Cime di Lavaredo.",
      "Día 3: Lago di Braies y senderos ocultos.",
      "Día 4: Paso Giau y Cinque Torri.",
      "Día 5: Descenso y despedida."
    ],
    includes: ["Guía UIAGM", "Alojamiento en refugios", "Desayunos y cenas", "Transporte de equipaje"]
  },
  {
    id: 2,
    title: "Cumbre del Gran Paradiso",
    location: "Valle de Aosta",
    price: "MXN 35,900",
    duration: "4 Días",
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1519681393798-38e43269d877?auto=format&fit=crop&q=80&w=800",
    tags: ["Alpinismo", "Avanzado"],
    hasDiscount: false,
    description: "Conquista el único cuatromil situado enteramente en territorio italiano. Una experiencia de alpinismo clásico ideal para quienes buscan su primera gran cumbre.",
    itinerary: [
      "Día 1: Encuentro en Pont y subida al Refugio Chabod.",
      "Día 2: Prácticas de glaciar y aclimatación.",
      "Día 3: Ascenso a la cumbre (4,061m) y descenso al Refugio Vittorio Emanuele.",
      "Día 4: Regreso al valle."
    ],
    includes: ["Guía de Alta Montaña (Ratio 1:3)", "Material técnico grupal", "Media pensión", "Seguro de accidentes"]
  },
  {
    id: 3,
    title: "Senderos del Lago de Como",
    location: "Lombardía",
    originalPrice: "MXN 18,000",
    price: "MXN 16,199",
    duration: "3 Días",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800",
    tags: ["Relax", "Principiante"],
    hasDiscount: true,
    description: "Descubre la elegancia del Lago de Como desde las alturas. Senderos panorámicos que conectan villas históricas con vistas espectaculares del lago y los Alpes.",
    itinerary: [
      "Día 1: Varenna y Castillo de Vezio.",
      "Día 2: Greenway del Lago y Villa Carlotta.",
      "Día 3: Bellagio y paseo en barco privado."
    ],
    includes: ["Guía local experto", "Entradas a Villas", "Paseos en barco", "Hotel Boutique 4*"]
  },
  {
    id: 4,
    title: "Tour del Monte Blanco",
    location: "Courmayeur",
    price: "MXN 40,500",
    duration: "7 Días",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800",
    tags: ["Expedición", "Experto"],
    hasDiscount: false,
    description: "La vuelta al macizo más impresionante de Europa. Una ruta exigente pero gratificante que cruza fronteras y ofrece las mejores vistas del techo de los Alpes.",
    itinerary: [
      "Día 1-2: Val Veny y Val Ferret.",
      "Día 3-4: Cruce a Suiza y Francia.",
      "Día 5-6: Pasos de altura y glaciares.",
      "Día 7: Regreso triunfal a Courmayeur."
    ],
    includes: ["Guía Internacional", "Transporte de equipaje", "Todos los refugios", "Cenas típicas"]
  },
  {
    id: 5,
    title: "Volcanes de Sicilia: Etna",
    location: "Sicilia",
    price: "MXN 15,500",
    duration: "2 Días",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1506477331477-33d5d8b3dc85?auto=format&fit=crop&q=80&w=800",
    tags: ["Aventura", "Todos los niveles"],
    hasDiscount: false,
    description: "Camina sobre lava solidificada y siente el calor de la tierra en el volcán activo más alto de Europa. Una experiencia geológica única.",
    itinerary: [
      "Día 1: Cráteres Silvestri y atardecer volcánico.",
      "Día 2: Ascenso a los cráteres somitales (sujeto a actividad)."
    ],
    includes: ["Vulcanólogo guía", "Equipo de seguridad (casco)", "Transporte 4x4", "Cena siciliana"]
  },
  {
    id: 6,
    title: "Cultura y Montaña en Tirol del Sur",
    location: "Bolzano",
    originalPrice: "MXN 21,000",
    price: "MXN 18,999",
    duration: "4 Días",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800",
    tags: ["Cultural", "Fácil"],
    hasDiscount: true,
    description: "Una inmersión en la cultura ladina y tirolesa. Combina caminatas suaves por alpages verdes con visitas a museos, castillos y viñedos.",
    itinerary: [
      "Día 1: Museo de Ötzi y centro de Bolzano.",
      "Día 2: Viñedos y Ruta del Vino.",
      "Día 3: Alpe di Siusi, el prado alpino más grande de Europa.",
      "Día 4: Castillo Roncolo y despedida."
    ],
    includes: ["Guía cultural", "Catas de vino", "Entradas a museos", "Hotel Spa"]
  }
];

// --- Componentes Modales ---

const InfoModal = ({ isOpen, onClose, activeTab }) => {
  const [tab, setTab] = useState(activeTab || 'about');

  useEffect(() => {
    if (isOpen && activeTab) {
      setTab(activeTab);
    }
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden animate-fade-in-up max-h-[90vh] overflow-y-auto">

        <div className="absolute top-4 right-4 z-20">
          <button onClick={onClose} className="bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors text-slate-500 hover:text-slate-800">
            <X size={20} />
          </button>
        </div>

        <div className="flex border-b border-slate-100">
          <button
            className={`flex-1 py-6 font-bold text-center transition-colors ${tab === 'about' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setTab('about')}
          >
            Sobre Nosotros
          </button>
          <button
            className={`flex-1 py-6 font-bold text-center transition-colors ${tab === 'mission' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-800'}`}
            onClick={() => setTab('mission')}
          >
            Nuestra Misión
          </button>
        </div>

        <div className="p-8 md:p-12">
          {tab === 'about' && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <Mountain className="w-8 h-8 text-emerald-600" />
                <h3 className="text-2xl font-bold text-slate-900">Vetta Italia: Pasión por la Altura</h3>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Fundada en 2015 por un grupo de guías alpinos y amantes de la cultura italiana, Vetta Italia nació con un propósito simple:
                mostrar la Italia que no aparece en las postales turísticas habituales.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Creemos que la montaña es más que un desafío físico; es un lugar de encuentro, silencio y belleza.
                Nuestra base está en Milán, pero nuestro corazón late en cada refugio de los Dolomitas y en cada sendero volcánico de Sicilia.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-lg mb-1">10+</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Años de Experiencia</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="font-bold text-slate-900 text-lg mb-1">2,500+</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">Viajeros Felices</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'mission' && (
            <div className="animate-fade-in space-y-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-900">Turismo Sostenible</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Nos comprometemos a minimizar nuestra huella. Priorizamos el transporte compartido, eliminamos plásticos de un solo uso en nuestros picnics
                  y colaboramos exclusivamente con alojamientos que respetan el medio ambiente.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-900">Impacto Local Real</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  No somos solo visitantes. Trabajamos directamente con familias locales, guías residentes y pequeños productores de vino y alimentos.
                  Tu viaje apoya directamente la economía de los pueblos alpinos.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  <h3 className="text-xl font-bold text-slate-900">Seguridad sin Compromisos</h3>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  La aventura no debe ser peligrosa. Todos nuestros tours siguen los protocolos más estrictos de la UIAGM y monitoreamos las condiciones
                  meteorológicas 24/7 para garantizar tu bienestar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose, initialInterest = "" }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: "2",
    interest: initialInterest || "Personalizado",
    notes: ""
  });

  useEffect(() => {
    if (isOpen) {
      if (initialInterest) {
        setFormData(prev => ({ ...prev, interest: initialInterest }));
      }
      setStep(1);
    }
  }, [isOpen, initialInterest]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    setTimeout(() => {
      onClose();
      setStep(1);
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden animate-fade-in-up">

        <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Diseña tu Aventura</h3>
            <p className="text-emerald-100 text-sm">Paso {step < 3 ? step : 2} de 2</p>
          </div>
          <button onClick={onClose} className="hover:bg-emerald-700 p-2 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <div className="p-8">
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">¿Qué tienes en mente?</h4>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interés Principal</label>
                <select
                  className="w-full border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.interest}
                  onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                >
                  <option value="Personalizado">Planificar a Medida</option>
                  {toursData.map(t => <option key={t.id} value={t.title}>{t.title}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha Aproximada</label>
                  <input type="month" className="w-full border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Viajeros</label>
                  <select className="w-full border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, "8+"].map(n => <option key={n} value={n}>{n} Pers.</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas o Deseos Especiales</label>
                <textarea
                  className="w-full border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 h-24"
                  placeholder="Ej: Quiero ver el atardecer en los Dolomitas, nivel físico medio..."
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>
              <button
                onClick={() => setStep(2)}
                className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex justify-center items-center gap-2 mt-4"
              >
                Siguiente Paso <ArrowRight size={18} />
              </button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Tus Datos de Contacto</h4>
              <div className="relative">
                <User className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Nombre Completo"
                  required
                  className="w-full pl-10 border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Correo Electrónico"
                  required
                  className="w-full pl-10 border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  type="tel"
                  placeholder="Teléfono (WhatsApp)"
                  required
                  className="w-full pl-10 border-slate-200 rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  className="flex-[2] bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Solicitud Recibida!</h3>
              <p className="text-slate-600">Un experto de Vetta Italia te contactará pronto para planificar tu viaje.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TourDetailModal = ({ tour, isOpen, onClose, onBook, onViewFull }) => {
  if (!isOpen || !tour) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 animate-scale-in flex flex-col md:flex-row">

        <button onClick={onClose} className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full md:hidden">
          <X size={20} />
        </button>

        <div className="md:w-2/5 h-64 md:h-auto relative">
          <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <span className="text-emerald-300 font-bold text-sm mb-1">{tour.location}</span>
            <h2 className="text-white text-2xl font-bold leading-tight">{tour.title}</h2>
          </div>
        </div>

        <div className="md:w-3/5 p-8 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className="flex gap-4 text-sm text-slate-600">
              <span className="flex items-center gap-1"><Clock size={16} className="text-emerald-600" /> {tour.duration}</span>
              <span className="flex items-center gap-1"><Star size={16} className="text-amber-500" /> {tour.rating}</span>
              <span className="flex items-center gap-1"><Users size={16} className="text-blue-500" /> Grupos Pequeños</span>
            </div>
            <button onClick={onClose} className="hidden md:block hover:bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sobre la experiencia</h3>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base">
              {tour.description}
            </p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Itinerario Resumido</h3>
            <ul className="space-y-2">
              {tour.itinerary.map((day, idx) => (
                <li key={idx} className="flex gap-3 text-sm text-slate-700">
                  <div className="min-w-[6px] mt-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  {day}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-slate-900 mb-3">Incluye</h3>
            <div className="flex flex-wrap gap-2">
              {tour.includes.map((inc, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200">
                  {inc}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto border-t border-slate-100 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-slate-500">Precio por persona</p>
                <div className="flex items-baseline gap-2">
                  {tour.hasDiscount && (
                    <span className="text-sm line-through text-slate-400">{tour.originalPrice}</span>
                  )}
                  <span className={`text-2xl font-bold ${tour.hasDiscount ? 'text-red-600' : 'text-slate-900'}`}>{tour.price}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onViewFull && onViewFull(tour)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl font-bold transition-all"
              >
                Ver Itinerario Completo
              </button>
              <button
                onClick={() => onBook(tour.title)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Solicitar Info
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


// --- Componentes Principales ---

const Navbar = ({ onOpenContact }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const menuItems = [
    { label: 'Destinos', id: 'tours' },
    { label: 'Experiencias', id: 'features' },
    { label: 'Guías', id: 'guides' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Mountain className={`w-8 h-8 ${scrolled ? 'text-emerald-700' : 'text-emerald-500'}`} />
          <span className={`text-2xl font-bold tracking-tighter ${scrolled ? 'text-slate-800' : 'text-white'}`}>
            VETTA ITALIA
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => scrollToSection(item.id)}
              className={`font-medium hover:text-emerald-500 transition-colors bg-transparent border-none cursor-pointer ${scrolled ? 'text-slate-600' : 'text-slate-200'}`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => onOpenContact()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105"
          >
            Reservar Ahora
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className={scrolled ? 'text-slate-800' : 'text-white'}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white absolute w-full shadow-xl">
          <div className="flex flex-col px-6 py-4 gap-4">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.id)}
                className="text-slate-600 font-medium py-2 border-b border-slate-100 text-left"
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setIsOpen(false); onOpenContact(); }}
              className="bg-emerald-600 text-white w-full py-3 rounded-lg font-bold mt-2"
            >
              Reservar Ahora
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = ({ onOpenContact, onScrollToTours }) => {
  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920"
          alt="Alpes Italianos"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/80"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center md:text-left mt-16">
        <span className="inline-block py-1 px-3 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-6 backdrop-blur-sm animate-fade-in-up">
          DESCUBRE LA ALTURA 2025
        </span>
        <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl">
          Explora el Alma de los <br />
          <span className="text-emerald-400">Alpes Italianos</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl">
          Desde las cumbres escarpadas de las Dolomitas hasta los lagos serenos del norte.
          Experiencias guiadas de lujo para el aventurero moderno.
        </p>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={onScrollToTours}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group"
          >
            Ver Tours Disponibles
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onOpenContact("Planificar a Medida")}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            Planificar a Medida
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 w-full z-10 hidden md:block">
        <div className="container mx-auto px-6 flex justify-between text-white/60 text-sm">
          <div className="flex gap-8">
            <span className="flex items-center gap-2"><Star className="w-4 h-4 text-emerald-400" /> 4.9/5 Promedio</span>
            <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> 20+ Destinos</span>
          </div>
          <div>Scroll para explorar</div>
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  const features = [
    { title: "Guías Certificados", desc: "Expertos UIAGM locales con años de experiencia en terreno alpino.", icon: <Mountain className="w-6 h-6" /> },
    { title: "Grupos Pequeños", desc: "Máximo 8 personas para garantizar una experiencia íntima y segura.", icon: <Users className="w-6 h-6" /> },
    { title: "Alojamiento Premium", desc: "Descansa en los mejores refugios y hoteles boutique de montaña.", icon: <Calendar className="w-6 h-6" /> },
  ];

  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Experiencias de Alto Nivel</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">Cuidamos cada detalle de tu viaje, desde la seguridad técnica hasta el confort después de la aventura.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow border border-slate-100">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{f.title}</h3>
              <p className="text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Guides = () => {
  const guides = [
    {
      name: "Marco Rossi",
      role: "Guía UIAGM - Dolomitas",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=400",
      bio: "Nacido en Cortina, Marco lleva 15 años guiando escaladas y treks en sus amadas Dolomitas."
    },
    {
      name: "Elena Ricci",
      role: "Vulcanóloga - Sicilia",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400",
      bio: "Apasionada por el Etna y Stromboli, Elena combina ciencia y aventura en cada expedición."
    },
    {
      name: "Thomas Gruber",
      role: "Alpinista - Tirol del Sur",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400",
      bio: "Especialista en rutas de alta cota y glaciares. Su prioridad es tu seguridad en la cima."
    }
  ];

  return (
    <section id="guides" className="py-20 bg-emerald-900 text-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros Guías</h2>
            <p className="text-emerald-100 max-w-xl">Conoce a los profesionales que harán de tu viaje una experiencia segura e inolvidable.</p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {guides.map((guide, idx) => (
            <div key={idx} className="bg-emerald-800/50 rounded-2xl p-6 border border-emerald-700 hover:bg-emerald-800 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <img src={guide.image} alt={guide.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-400" />
                <div>
                  <h3 className="font-bold text-lg">{guide.name}</h3>
                  <p className="text-emerald-300 text-sm">{guide.role}</p>
                </div>
              </div>
              <p className="text-emerald-100 text-sm leading-relaxed mb-4">{guide.bio}</p>
              <div className="flex gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-emerald-200">Certificado Oficial</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "La expedición a Gran Paradiso fue la cumbre más épica de mi vida. La organización, la seguridad y la calidez del equipo Vetta Italia son insuperables.",
      name: "Alejandro M.",
      location: "Ciudad de México, MX"
    },
    {
      quote: "Los senderos del Lago de Como fueron el equilibrio perfecto entre lujo y naturaleza. Los hoteles boutique eran increíbles y las vistas espectaculares.",
      name: "Isabella V.",
      location: "Bogotá, CO"
    },
    {
      quote: "Me sentí completamente seguro en el Etna. El guía vulcanólogo era un experto y nos enseñó muchísimo. Una aventura que todos deberían vivir.",
      name: "Ricardo L.",
      location: "Madrid, ES"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <Quote className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Lo que Dicen Nuestros Clientes</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">La mejor prueba de nuestra excelencia son las experiencias inolvidables de quienes ya viajaron con nosotros.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-50 p-8 rounded-2xl shadow-md border-t-4 border-emerald-600 flex flex-col h-full">
              <p className="text-slate-700 italic leading-relaxed mb-6 flex-grow">"{t.quote}"</p>
              <div className="text-right">
                <p className="font-bold text-slate-900">- {t.name}</p>
                <p className="text-sm text-slate-500">{t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const TourGrid = ({ onOpenDetail, onScrollTo }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <section className="py-24 bg-white" id="tours">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Nuestras Expediciones 2025</h2>
            <p className="text-slate-600 max-w-xl">Seleccionamos las rutas más escénicas y desafiantes para que vivas Italia desde una nueva perspectiva.</p>
          </div>
          <button
            onClick={() => onScrollTo('tours')}
            className="hidden md:flex items-center text-emerald-600 font-bold hover:text-emerald-700 bg-transparent border-none cursor-pointer"
          >
            Ver todo el catálogo <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {toursData.map((tour) => (
            <div key={tour.id}
              onClick={() => onOpenDetail(tour)}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  {tour.tags.map(tag => (
                    <span key={tag} className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center text-emerald-600 text-sm font-medium mb-2">
                    <MapPin className="w-4 h-4 mr-1" /> {tour.location}
                  </div>
                  <div className="flex items-center text-amber-500 text-sm font-bold">
                    <Star className="w-4 h-4 mr-1 fill-current" /> {tour.rating}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                  {tour.title}
                </h3>

                <div className="flex items-center text-slate-500 text-sm mb-6">
                  <Calendar className="w-4 h-4 mr-2" /> {tour.duration}
                </div>

                <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-100">
                  <div>
                    <span className="text-xs text-slate-500 block">Desde</span>
                    <div className="flex items-baseline">
                      {tour.hasDiscount && (
                        <span className="text-sm font-medium text-slate-400 line-through mr-2">
                          {tour.originalPrice}
                        </span>
                      )}
                      <span className={`text-xl font-bold ${tour.hasDiscount ? 'text-red-600' : 'text-slate-900'}`}>
                        {tour.price}
                      </span>
                    </div>
                  </div>
                  <button className="text-emerald-600 font-bold hover:bg-emerald-50 px-4 py-2 rounded-lg transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <button className="border-2 border-slate-200 text-slate-800 font-bold py-3 px-8 rounded-full hover:border-emerald-600 hover:text-emerald-600 transition-colors">
            Cargar más tours
          </button>
        </div>
      </div>
    </section>
  );
};

const CTA = ({ onOpenContact, onScrollToTestimonials }) => {
  return (
    <section className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <img src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Background" />
      </div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">¿Listo para tu próxima aventura?</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto mb-10">
          Nuestros expertos en montaña están listos para diseñar el itinerario perfecto para ti y tu grupo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => onOpenContact()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-emerald-900/50"
          >
            Contactar un Experto
          </button>
          <button
            onClick={onScrollToTestimonials}
            className="bg-transparent border border-white/30 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
          >
            Ver Testimonios de Clientes
          </button>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ onOpenInfo, onScrollToGuides, onOpenContact }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Mountain className="w-6 h-6 text-emerald-500" />
              <span className="text-xl font-bold text-white">VETTA ITALIA</span>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Especialistas en turismo de montaña sostenible y de lujo en las regiones más espectaculares de Italia.
            </p>
            <div className="flex gap-4">
              <Instagram className="w-5 h-5 hover:text-white cursor-pointer" />
              <Facebook className="w-5 h-5 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Explorar</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-emerald-500">Dolomitas</a></li>
              <li><a href="#" className="hover:text-emerald-500">Alpes Occidentales</a></li>
              <li><a href="#" className="hover:text-emerald-500">Volcanes</a></li>
              <li><a href="#" className="hover:text-emerald-500">Tours Privados</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Compañía</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button onClick={() => onOpenInfo('about')} className="hover:text-emerald-500 text-left bg-transparent border-none p-0 cursor-pointer">
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button onClick={onScrollToGuides} className="hover:text-emerald-500 text-left bg-transparent border-none p-0 cursor-pointer">
                  Nuestros Guías
                </button>
              </li>
              <li>
                <button onClick={() => onOpenInfo('mission')} className="hover:text-emerald-500 text-left bg-transparent border-none p-0 cursor-pointer">
                  Nuestra Misión
                </button>
              </li>
              <li>
                <button onClick={() => onOpenContact()} className="hover:text-emerald-500 text-left bg-transparent border-none p-0 cursor-pointer">
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>+39 02 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>ciao@vettaitalia.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Via Montenapoleone, Milán</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
          <p>&copy; 2025 Vetta Italia Tours. Todos los derechos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const App = () => {
  const [selectedTour, setSelectedTour] = useState(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [initialInterest, setInitialInterest] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoTab, setInfoTab] = useState('about');
  const [viewPackageInfo, setViewPackageInfo] = useState(null);

  const handleOpenContact = (interest = "") => {
    setInitialInterest(interest);
    setIsContactOpen(true);
    if (selectedTour) setSelectedTour(null);
  };

  const handleOpenBooking = (interest = "") => {
    setInitialInterest(interest);
    setIsBookingOpen(true);
    if (selectedTour) setSelectedTour(null);
  };

  const handleOpenInfo = (tab) => {
    setInfoTab(tab);
    setIsInfoOpen(true);
  };

  const handleViewPackageInfo = (tour) => {
    setViewPackageInfo(tour);
    setSelectedTour(null);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTours = () => scrollToSection('tours');
  const scrollToTestimonials = () => scrollToSection('testimonials');
  const scrollToGuides = () => scrollToSection('guides');

  // If viewPackageInfo is active, show only PackageInfo
  if (viewPackageInfo) {
    return (
      <PackageInfo
        tour={viewPackageInfo}
        onClose={() => setViewPackageInfo(null)}
      />
    );
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-white">
      <Navbar onOpenContact={() => handleOpenBooking()} />
      <Hero onOpenContact={handleOpenBooking} onScrollToTours={scrollToTours} />
      <Features />
      <TourGrid onOpenDetail={setSelectedTour} onScrollTo={scrollToSection} />
      <Guides />
      <Testimonials />
      <CTA onOpenContact={() => handleOpenBooking()} onScrollToTestimonials={scrollToTestimonials} />
      <Footer
        onOpenInfo={handleOpenInfo}
        onScrollToGuides={scrollToGuides}
        onOpenContact={() => handleOpenBooking()}
      />

      {/* Modals */}
      <TourDetailModal
        tour={selectedTour}
        isOpen={!!selectedTour}
        onClose={() => setSelectedTour(null)}
        onBook={(title) => handleOpenBooking(title)}
        onViewFull={handleViewPackageInfo}
      />
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        initialInterest={initialInterest}
      />
      <BookingForm
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialTour={initialInterest}
      />
      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        activeTab={infoTab}
      />
    </div>
  );
};

export default App;
