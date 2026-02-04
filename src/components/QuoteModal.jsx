import React, { useState } from 'react';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { X, User, Mail, Phone, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useExperiences } from '../services/hooks';

const QuoteModal = ({ isOpen, onClose, initialInterest = "" }) => {
    const { texts: siteTexts } = useSiteTextsContext();
    const { data: experiences = [], isLoading: experiencesLoading } = useExperiences();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        contacto: "whatsapp",
        date: "",
        guests: "2",
        interest: initialInterest || siteTexts.quoteModal.customPlan,
        notes: ""
    });

    React.useEffect(() => {
        if (isOpen) {
            if (initialInterest) {
                setFormData(prev => ({ ...prev, interest: initialInterest }));
            }
            setStep(1);
            setError(null);
            setIsSubmitting(false);
            
            // Bloquear scroll del body
            document.body.style.overflow = 'hidden';
        } else {
            // Restaurar scroll del body
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialInterest]);
    
    // Cerrar con tecla ESC
    React.useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_STRAPI_URL}/api/quote-request`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'quote',
                    data: formData,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al enviar la solicitud');
            }

            setStep(3);
            setTimeout(() => {
                onClose();
                setStep(1);
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    contacto: "whatsapp",
                    date: "",
                    guests: "2",
                    interest: initialInterest || siteTexts.quoteModal.customPlan,
                    notes: ""
                });
            }, 3000);
        } catch (err) {
            setError(siteTexts.quoteModal?.errorMessage || 'Ocurrió un error al enviar la solicitud. Por favor, intenta nuevamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-modal-title"
        >
            <div 
                className="absolute inset-0 bg-pizarra/70 backdrop-blur-sm" 
                onClick={onClose}
                aria-hidden="true"
            ></div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] relative z-10 overflow-hidden animate-fade-in-up">

                {/* Header con diseño oscuro */}
                <div className="bg-gradient-to-r from-pizarra to-pizarra p-4 sm:p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 id="quote-modal-title" className="text-lg sm:text-xl font-bold">{siteTexts.quoteModal.title}</h3>
                        <p className="text-nieve text-xs sm:text-sm">{siteTexts.quoteModal.step} {step < 3 ? step : 2} {siteTexts.quoteModal.of} 2</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-grafito mb-4">{siteTexts.quoteModal.step1Title}</h4>

                            {/* Experiencia de interés */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">
                                    {siteTexts.quoteModal.interestLabel}
                                </label>
                                <select
                                    className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    value={formData.interest}
                                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                    disabled={experiencesLoading}
                                >
                                    <option value="Personalizado">{siteTexts.quoteModal.customPlan}</option>
                                    {experiences.map(exp => <option key={exp.id} value={exp.title}>{exp.title}</option>)}
                                </select>
                            </div>

                            {/* Fecha y Viajeros */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1 truncate">
                                        {siteTexts.quoteModal.dateLabel} <span className="text-niebla text-xs">{siteTexts.fieldOptional || '(Opcional)'}</span>
                                    </label>
                                    <input
                                        type="month"
                                        value={formData.date}
                                        className="w-full h-12 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino appearance-none bg-white text-pizarra"
                                        style={{ colorScheme: 'light' }}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1">{siteTexts.quoteModal.travelersLabel}</label>
                                    <select
                                        className="w-full h-12 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, "8+"].map(n => <option key={n} value={n}>{n} {siteTexts.labels.persons}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* ¿Cómo te gustaría ser contactado? - EN PASO 1 */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">
                                    {siteTexts.contactMethod.label}
                                </label>
                                <select
                                    className="w-full border border-niebla rounded-xl p-3 bg-white focus:ring-alpino focus:border-alpino"
                                    value={formData.contacto}
                                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                                >
                                    <option value="whatsapp">{siteTexts.contactMethod.whatsapp}</option>
                                    <option value="telefono">{siteTexts.contactMethod.phone}</option>
                                    <option value="correo">{siteTexts.contactMethod.email}</option>
                                </select>
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">
                                    {siteTexts.quoteModal.notesLabel} <span className="text-niebla text-xs">{siteTexts.fieldOptional || '(Opcional)'}</span>
                                </label>
                                <textarea
                                    className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino h-24"
                                    placeholder={siteTexts.quoteModal.notesPlaceholder}
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-pizarra text-white font-bold py-3 rounded-xl hover:bg-pizarra/90 transition-colors flex justify-center items-center gap-2 mt-4"
                            >
                                {siteTexts.buttons.next} <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h4 className="text-lg font-semibold text-grafito mb-4">{siteTexts.quoteModal.step2Title}</h4>

                            {/* Error message */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            )}

                            {/* Nombre */}
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="text"
                                    placeholder={siteTexts.quoteModal.namePlaceholder}
                                    value={formData.name}
                                    required
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino invalid:border-red-300 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="email"
                                    placeholder={siteTexts.quoteModal.emailPlaceholder}
                                    value={formData.email}
                                    required
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino invalid:border-red-300 focus:invalid:border-red-500 focus:invalid:ring-red-500"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="tel"
                                    placeholder={siteTexts.quoteModal.phonePlaceholder}
                                    value={formData.phone}
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    disabled={isSubmitting}
                                    className="flex-1 bg-nieve text-pizarra font-bold py-3 rounded-xl hover:bg-bruma transition-colors disabled:opacity-50"
                                >
                                    {siteTexts.buttons.back}
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-[2] bg-pizarra text-white font-bold py-3 rounded-xl hover:bg-pizarra/90 transition-colors shadow-lg shadow-pizarra/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            {siteTexts.quoteModal?.sending || 'Enviando...'}
                                        </>
                                    ) : (
                                        siteTexts.buttons.submit
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-bruma rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-alpino" />
                            </div>
                            <h3 className="text-2xl font-bold text-grafito mb-2">{siteTexts.quoteModal.successTitle}</h3>
                            <p className="text-pizarra">{siteTexts.quoteModal.successMessage}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteModal;
