import React, { useState } from 'react';
import { X, Mountain, TentTree, Send } from 'lucide-react';

const BookingForm = ({ isOpen, onClose, initialTour = null }) => {
    const [formData, setFormData] = useState({
        interests: [],
        travelers: '2',
        date: '',
        name: '',
        email: '',
        phone: '',
        notes: ''
    });

    const [submitted, setSubmitted] = useState(false);

    if (!isOpen) return null;

    const handleInterestToggle = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
        setSubmitted(true);

        setTimeout(() => {
            setSubmitted(false);
            onClose();
            setFormData({
                interests: [],
                travelers: '2',
                date: '',
                name: '',
                email: '',
                phone: '',
                notes: ''
            });
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>

            <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden z-10 relative max-h-[90vh] overflow-y-auto animate-scale-in">

                {/* Left Column - Inspirational Image */}
                <div className="relative hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop"
                        className="absolute inset-0 w-full h-full object-cover"
                        alt="Montañas"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/40 to-transparent flex flex-col justify-end p-12 text-white">
                        <h2 className="font-serif text-4xl mb-4 italic">"El viaje comienza al imaginarlo."</h2>
                        <p className="text-sm uppercase tracking-widest opacity-90 border-l-2 border-emerald-400 pl-4">
                            Tu asesor personal te contactará en menos de 24h.
                        </p>
                    </div>
                </div>

                {/* Right Column - Form */}
                <div className="p-10 md:p-14">
                    {!submitted ? (
                        <>
                            <div className="mb-8">
                                <button
                                    onClick={onClose}
                                    className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                                >
                                    <X size={24} />
                                </button>

                                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Paso 1 de 1</span>
                                <h1 className="text-3xl font-serif text-slate-800 font-bold mt-2">Diseña tu Experiencia</h1>
                                <p className="text-slate-600 text-sm mt-2">
                                    Cuéntanos brevemente qué buscas y nosotros nos encargamos del resto.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">

                                {/* Interests Selection */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-700 uppercase tracking-wide">
                                        ¿Qué te interesa?
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleInterestToggle('skiing')}
                                            className={`p-4 border-2 rounded-lg text-center transition-all ${formData.interests.includes('skiing')
                                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : 'border-slate-200 hover:border-emerald-500 text-slate-700'
                                                }`}
                                        >
                                            <Mountain className="mx-auto mb-2" size={24} />
                                            <span className="text-sm font-medium">Esquí / Invierno</span>
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleInterestToggle('hiking')}
                                            className={`p-4 border-2 rounded-lg text-center transition-all ${formData.interests.includes('hiking')
                                                    ? 'bg-emerald-600 text-white border-emerald-600'
                                                    : 'border-slate-200 hover:border-emerald-500 text-slate-700'
                                                }`}
                                        >
                                            <TentTree className="mx-auto mb-2" size={24} />
                                            <span className="text-sm font-medium">Trekking / Verano</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Travelers and Date */}
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                            Viajeros
                                        </label>
                                        <select
                                            value={formData.travelers}
                                            onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
                                            className="w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 focus:ring-0 focus:border-emerald-500 transition-colors text-lg font-medium text-slate-800"
                                        >
                                            <option value="1">Solo yo</option>
                                            <option value="2">2 Personas</option>
                                            <option value="3-4">Familia (3-4)</option>
                                            <option value="5+">Grupo (5+)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-600 uppercase mb-2">
                                            Fecha aprox.
                                        </label>
                                        <input
                                            type="month"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full border-0 border-b-2 border-slate-200 bg-transparent py-2 focus:ring-0 focus:border-emerald-500 transition-colors text-slate-700"
                                        />
                                    </div>
                                </div>

                                {/* Contact Information */}
                                <div className="pt-6 mt-6 border-t border-slate-100">
                                    <h3 className="text-slate-800 font-serif font-bold text-lg mb-4">Tus Datos</h3>

                                    <div className="space-y-4">
                                        <div>
                                            <input
                                                type="text"
                                                placeholder="Tu Nombre Completo"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="email"
                                                placeholder="Correo Electrónico"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                            />
                                            <input
                                                type="tel"
                                                placeholder="WhatsApp (Opcional)"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                                            />
                                        </div>

                                        <div>
                                            <textarea
                                                placeholder="¿Algún deseo especial? (Ej. 'Quiero un hotel con spa', 'Somos vegetarianos'...)"
                                                rows="2"
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors text-sm"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-lg shadow-lg transform hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest flex justify-center items-center gap-2"
                                    >
                                        <span>Solicitar Propuesta Gratis</span>
                                        <Send size={18} />
                                    </button>
                                    <p className="text-center text-xs text-slate-400 mt-4">
                                        Respetamos tu privacidad. No enviamos spam.
                                    </p>
                                </div>

                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                <Send className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">¡Solicitud Enviada!</h3>
                            <p className="text-slate-600 max-w-sm">
                                Tu asesor personal te contactará en menos de 24 horas para diseñar tu experiencia perfecta en los Alpes Italianos.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingForm;
