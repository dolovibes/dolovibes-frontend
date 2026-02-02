import React, { useState } from 'react';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { CheckCircle, Send, X, AlertCircle } from 'lucide-react';

const PackageQuoteModal = ({ isOpen, onClose, packageTitle }) => {
    const { texts: siteTexts } = useSiteTextsContext();
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
        viajeros: '2',
        tipoViaje: 'guiado',
        serviciosAdicionales: '',
        packageTitle: packageTitle || ''
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        if (isOpen && packageTitle) {
            setFormData(prev => ({ ...prev, packageTitle }));
        }
        
        if (isOpen) {
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll del body
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, packageTitle]);
    
    // Cerrar con tecla ESC
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen && !isSubmitting) {
                handleClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, isSubmitting]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setValidationError(false);
        setError(null);
        setIsSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/quote-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'package',
                    data: formData,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la solicitud');
            }

            setIsSubmitting(false);
            setIsSubmitted(true);
            setTimeout(() => {
                onClose();
                setIsSubmitted(false);
                setValidationError(false);
                setFormData({
                    nombre: '', apellido: '', ciudad: '', estado: '', pais: '',
                    email: '', telefono: '', contacto: 'whatsapp', mesViaje: '',
                    viajeros: '2', tipoViaje: 'guiado', serviciosAdicionales: '',
                    packageTitle: packageTitle || ''
                });
            }, 3000);
        } catch (err) {
            setError(siteTexts.packageQuoteModal?.errorMessage || 'Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.');
            setIsSubmitting(false);
        }
    };

    // Cuando el usuario intenta enviar pero el formulario es inválido (native HTML validation)
    const handleInvalid = (e) => {
        e.preventDefault();
        setValidationError(true);
        // Scroll hacia arriba para ver el mensaje de error
        e.target.closest('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    const handleClose = () => {
        onClose();
        setIsSubmitted(false);
        setValidationError(false);
        setError(null);
    };

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="package-quote-modal-title"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-pizarra/70 backdrop-blur-sm"
                aria-hidden="true"
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
                    <div className="bg-gradient-to-br from-pizarra to-pizarra p-12 text-center text-white min-h-[400px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-white" />
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">
                            {siteTexts.packageQuoteModal?.successTitle || '¡Solicitud enviada!'}
                        </h3>
                        <p className="text-white/80 text-lg">
                            {siteTexts.packageQuoteModal?.successMessage || 'Te contactaremos pronto con tu cotización'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-pizarra to-pizarra p-6 md:p-8 text-center">
                            <h3 id="package-quote-modal-title" className="text-xl md:text-2xl font-bold text-white mb-2">
                                {packageTitle}
                            </h3>
                            <p className="text-white text-base font-medium mb-1">
                                {siteTexts.packageQuoteModal?.subtitle || 'Solicitar Cotización'}
                            </p>
                            <p className="text-white/60 text-sm">
                                {siteTexts.packageQuoteModal?.completeInfo || 'Completa la información'}
                            </p>
                        </div>

                        {/* Form */}
                        <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
                            {/* Mensaje de error de validación */}
                            {validationError && (
                                <div className="mx-6 md:mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-pulse">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-500 font-bold">!</span>
                                    </div>
                                    <p className="text-red-700 text-sm font-medium">
                                        {siteTexts.packageQuoteModal?.validationError || 'Por favor completa todos los campos obligatorios'}
                                    </p>
                                </div>
                            )}

                            {/* Mensaje de error de API */}
                            {error && (
                                <div className="mx-6 md:mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} onInvalid={handleInvalid} className="p-6 md:p-8 space-y-5">
                                {/* Nombre y Apellido */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.firstName || 'Nombre'} *
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            required
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm invalid:border-red-300 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderFirstName || 'Tu nombre'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.lastName || 'Apellido'}
                                        </label>
                                        <input
                                            type="text"
                                            name="apellido"
                                            value={formData.apellido}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderLastName || 'Tu apellido'}
                                        />
                                    </div>
                                </div>

                                {/* Ciudad, Estado, País */}
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.city || 'Ciudad'}
                                        </label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderCity || 'Ciudad'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.state || 'Estado'}
                                        </label>
                                        <input
                                            type="text"
                                            name="estado"
                                            value={formData.estado}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderState || 'Estado'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.country || 'País'}
                                        </label>
                                        <input
                                            type="text"
                                            name="pais"
                                            value={formData.pais}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderCountry || 'País'}
                                        />
                                    </div>
                                </div>

                                {/* Email y Teléfono */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.email || 'Email'} *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm invalid:border-red-300 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderEmail || 'tu@email.com'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.phone || 'Teléfono'}
                                        </label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                            placeholder={siteTexts.packageQuoteModal?.placeholderPhone || '+52 123 456 7890'}
                                        />
                                    </div>
                                </div>

                                {/* Cómo te gustaría ser contactado */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        {siteTexts.contactMethod?.label || '¿Cómo te gustaría ser contactado?'}
                                    </label>
                                    <select
                                        name="contacto"
                                        value={formData.contacto}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all bg-white text-sm"
                                    >
                                        <option value="whatsapp">{siteTexts.contactMethod?.whatsapp || 'WhatsApp'}</option>
                                        <option value="telefono">{siteTexts.contactMethod?.phone || 'Teléfono'}</option>
                                        <option value="correo">{siteTexts.contactMethod?.email || 'Correo Electrónico'}</option>
                                    </select>
                                </div>

                                {/* Mes del viaje y Número de viajeros */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.travelMonth || 'Mes del viaje'}
                                        </label>
                                        <input
                                            type="month"
                                            name="mesViaje"
                                            value={formData.mesViaje}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-pizarra mb-1.5">
                                            {siteTexts.packageQuoteModal?.travelers || 'Número de viajeros'}
                                        </label>
                                        <select
                                            name="viajeros"
                                            value={formData.viajeros}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all bg-white text-sm"
                                        >
                                            {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tipo de viaje */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        {siteTexts.packageQuoteModal?.tripType || 'Tipo de viaje'}
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'guiado' }))}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'guiado'
                                                ? 'border-pizarra bg-nieve text-pizarra'
                                                : 'border-pizarra hover:border-bruma text-pizarra'
                                                }`}
                                        >
                                            <span className="font-semibold block text-sm">{siteTexts.packageQuoteModal?.tripTypeGuided || 'Guiado'}</span>
                                            <span className="text-xs opacity-70">{siteTexts.packageQuoteModal?.tripTypeGuidedDesc || 'Con guía experto'}</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'autoguiado' }))}
                                            className={`p-3 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'autoguiado'
                                                ? 'border-pizarra bg-nieve text-pizarra'
                                                : 'border-pizarra hover:border-bruma text-pizarra'
                                                }`}
                                        >
                                            <span className="font-semibold block text-sm">{siteTexts.packageQuoteModal?.tripTypeSelfGuided || 'Autoguiado'}</span>
                                            <span className="text-xs opacity-70">{siteTexts.packageQuoteModal?.tripTypeSelfGuidedDesc || 'Por tu cuenta'}</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Servicios adicionales */}
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1.5">
                                        {siteTexts.packageQuoteModal?.additionalServices || 'Servicios adicionales'} <span className="text-niebla text-xs">{siteTexts.optional || '(Opcional)'}</span>
                                    </label>
                                    <textarea
                                        name="serviciosAdicionales"
                                        value={formData.serviciosAdicionales}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-2.5 border border-niebla rounded-xl focus:ring-2 focus:ring-pizarra focus:border-pizarra transition-all resize-none text-sm invalid:border-red-300 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                                        placeholder={siteTexts.packageQuoteModal?.additionalServicesPlaceholder || 'Carpool, cena especial, pick up en aeropuerto, necesidades dietéticas, etc.'}
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-pizarra hover:bg-pizarra/90 disabled:bg-bruma disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] shadow-lg shadow-pizarra/30 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {siteTexts.packageQuoteModal?.buttonSending || 'Enviando...'}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {siteTexts.packageQuoteModal?.buttonSubmit || 'Solicitar Cotización'}
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PackageQuoteModal;
