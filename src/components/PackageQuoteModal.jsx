import React, { useState } from 'react';
import { CheckCircle, Send, X } from 'lucide-react';

const PackageQuoteModal = ({ isOpen, onClose, packageTitle }) => {
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

    if (!isOpen) return null;

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
            setTimeout(() => {
                onClose();
                setIsSubmitted(false);
                setFormData({
                    nombre: '', apellido: '', ciudad: '', estado: '', pais: '',
                    email: '', telefono: '', contacto: 'whatsapp', mesViaje: '',
                    pasajeros: '2', tipoViaje: 'guiado', serviciosAdicionales: ''
                });
            }, 3000);
        }, 1500);
    };

    const handleClose = () => {
        onClose();
        setIsSubmitted(false);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-pizarra/70 backdrop-blur-sm"
                onClick={handleClose}
            ></div>

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-fade-in-up">
                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-pizarra hover:text-grafito transition-colors shadow-lg"
                >
                    <X className="w-5 h-5" />
                </button>

                {isSubmitted ? (
                    <div className="bg-gradient-to-br from-alpino to-alpino p-12 text-center text-white min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            ¡Solicitud Enviada!
                        </h3>
                        <p className="text-white/80 text-lg">
                            Nos pondremos en contacto contigo muy pronto para planificar tu viaje.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pizarra to-pizarra p-6 md:p-8 text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {packageTitle}
                            </h3>
                            <p className="text-bruma text-base font-medium mb-1">
                                ¿Estás listo para el viaje más espectacular de tu vida?
                            </p>
                            <p className="text-white/60 text-sm">
                                Completa la información
                            </p>
                        </div>

                        {/* Form */}
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                                {/* Nombre y Apellido */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Nombre *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Apellido *
                                        </label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            required
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="Tu apellido"
                                        />
                                    </div>
                                </div>

                                {/* Ciudad, Estado, País */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Ciudad *
                                        </label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            required
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="Ciudad"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Estado *
                                        </label>
                                        <input
                                            type="text"
                                            name="estado"
                                            required
                                            value={formData.estado}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="Estado"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            País *
                                        </label>
                                        <input
                                            type="text"
                                            name="pais"
                                            required
                                            value={formData.pais}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="País"
                                        />
                                    </div>
                                </div>

                                {/* Email y Teléfono */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="tucorreo@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Teléfono *
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            required
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                            placeholder="+52 123 456 7890"
                                        />
                                    </div>
                                </div>

                                {/* Cómo te gustaría ser contactado */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        ¿Cómo te gustaría ser contactado? *
                                    </label>
                                    <select
                                        name="contacto"
                                        value={formData.contacto}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all bg-white text-sm"
                                    >
                                        <option value="whatsapp">WhatsApp</option>
                                        <option value="telefono">Llamada telefónica</option>
                                        <option value="correo">Correo electrónico</option>
                                    </select>
                                </div>

                                {/* Mes del viaje y Número de pasajeros */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Mes del viaje *
                                        </label>
                                        <input
                                            type="month"
                                            name="mesViaje"
                                            required
                                            value={formData.mesViaje}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            Número de pasajeros *
                                        </label>
                                        <select
                                            name="pasajeros"
                                            value={formData.pasajeros}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all bg-white text-sm"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => (
                                                <option key={n} value={n}>{n} {n === 1 ? 'persona' : 'personas'}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tipo de viaje */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        Tipo de viaje *
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'guiado' }))}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'guiado'
                                                    ? 'border-alpino bg-nieve text-alpino'
                                                    : 'border-niebla hover:border-bruma text-pizarra'
                                                }`}
                                        >
                                            <span className="font-semibold block text-sm">Guiado</span>
                                            <span className="text-xs opacity-70">Con guía experto</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'autoguiado' }))}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'autoguiado'
                                                    ? 'border-alpino bg-nieve text-alpino'
                                                    : 'border-niebla hover:border-bruma text-pizarra'
                                                }`}
                                        >
                                            <span className="font-semibold block text-sm">Autoguiado</span>
                                            <span className="text-xs opacity-70">Por tu cuenta</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Servicios adicionales */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        Servicios adicionales
                                    </label>
                                    <textarea
                                        name="serviciosAdicionales"
                                        value={formData.serviciosAdicionales}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all resize-none text-sm"
                                        placeholder="Carpool, cena especial, pick up en aeropuerto..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-alpino hover:bg-alpino disabled:bg-bruma text-white py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg shadow-alpino/30 flex items-center justify-center gap-2"
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

                                <p className="text-center text-niebla text-xs">
                                    Te responderemos en menos de 24 horas
                                </p>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PackageQuoteModal;
