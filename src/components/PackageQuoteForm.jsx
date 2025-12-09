import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';

const PackageQuoteForm = ({ packageTitle }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        ciudad: '',
        estado: '',
        pais: '',
        email: '',
        telefono: '',
        contacto: 'whatsapp',
        mesViaje: '',
        pasajeros: '2',
        tipoViaje: 'guiado',
        serviciosAdicionales: ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simular envío
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    if (isSubmitted) {
        return (
            <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-3xl p-8 md:p-12 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    ¡Solicitud Enviada!
                </h3>
                <p className="text-white/80 text-lg">
                    Nos pondremos en contacto contigo muy pronto para planificar tu viaje a <strong>{packageTitle}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {packageTitle}
                </h3>
                <p className="text-emerald-400 text-lg font-medium mb-1">
                    ¿Estás listo para el viaje más espectacular de tu vida?
                </p>
                <p className="text-white/60 text-sm">
                    Completa la información
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Nombre *
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="Tu nombre"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Apellido *
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            required
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="Tu apellido"
                        />
                    </div>
                </div>

                {/* Ciudad, Estado, País */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Ciudad *
                        </label>
                        <input
                            type="text"
                            name="ciudad"
                            required
                            value={formData.ciudad}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="Ciudad"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Estado *
                        </label>
                        <input
                            type="text"
                            name="estado"
                            required
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="Estado"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            País *
                        </label>
                        <input
                            type="text"
                            name="pais"
                            required
                            value={formData.pais}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="País"
                        />
                    </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="tucorreo@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Teléfono *
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                            placeholder="+52 123 456 7890"
                        />
                    </div>
                </div>

                {/* Cómo te gustaría ser contactado */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        ¿Cómo te gustaría ser contactado? *
                    </label>
                    <select
                        name="contacto"
                        value={formData.contacto}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                    >
                        <option value="whatsapp">WhatsApp</option>
                        <option value="telefono">Llamada telefónica</option>
                        <option value="correo">Correo electrónico</option>
                    </select>
                </div>

                {/* Mes del viaje y Número de pasajeros */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Mes del viaje *
                        </label>
                        <input
                            type="month"
                            name="mesViaje"
                            required
                            value={formData.mesViaje}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Número de pasajeros *
                        </label>
                        <select
                            name="pasajeros"
                            value={formData.pasajeros}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tipo de viaje */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Tipo de viaje *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'guiado' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'guiado'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                        >
                            <span className="font-semibold block">Guiado</span>
                            <span className="text-xs opacity-70">Con guía experto</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'autoguiado' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'autoguiado'
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                        >
                            <span className="font-semibold block">Autoguiado</span>
                            <span className="text-xs opacity-70">Por tu cuenta</span>
                        </button>
                    </div>
                </div>

                {/* Servicios adicionales */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Servicios adicionales
                    </label>
                    <textarea
                        name="serviciosAdicionales"
                        value={formData.serviciosAdicionales}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                        placeholder="Carpool, cena especial, pick up en aeropuerto, necesidades dietéticas, etc."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Enviando...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            Solicitar Cotización
                        </>
                    )}
                </button>

                <p className="text-center text-slate-500 text-sm">
                    Te responderemos en menos de 24 horas
                </p>
            </form>
        </div>
    );
};

export default PackageQuoteForm;
