import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, User, Mail, Phone, ArrowRight, CheckCircle } from 'lucide-react';
import { experiences } from '../data/experiences';

const QuoteModal = ({ isOpen, onClose, initialInterest = "" }) => {
    const { t } = useTranslation('common');
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        contacto: "whatsapp",
        date: "",
        guests: "2",
        interest: initialInterest || t('quoteModal.customPlan'),
        notes: ""
    });

    React.useEffect(() => {
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
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4">
            <div className="absolute inset-0 bg-pizarra/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] relative z-10 overflow-hidden animate-fade-in-up">

                {/* Header con diseño oscuro */}
                <div className="bg-gradient-to-r from-pizarra to-pizarra p-4 sm:p-6 text-white flex justify-between items-center">
                    <div>
                        <h3 className="text-lg sm:text-xl font-bold">{t('quoteModal.title')}</h3>
                        <p className="text-nieve text-xs sm:text-sm">{t('quoteModal.step')} {step < 3 ? step : 2} {t('quoteModal.of')} 2</p>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors"><X size={24} /></button>
                </div>

                <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(90vh-100px)]">
                    {step === 1 && (
                        <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-grafito mb-4">{t('quoteModal.step1Title')}</h4>

                            {/* Experiencia de interés */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">{t('quoteModal.interestLabel')}</label>
                                <select
                                    className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    value={formData.interest}
                                    onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                                >
                                    <option value="Personalizado">{t('quoteModal.customPlan')}</option>
                                    {experiences.map(exp => <option key={exp.id} value={exp.title}>{exp.title}</option>)}
                                </select>
                            </div>

                            {/* Fecha y Viajeros */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1">{t('quoteModal.dateLabel')}</label>
                                    <input
                                        type="month"
                                        className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-pizarra mb-1">{t('quoteModal.travelersLabel')}</label>
                                    <select
                                        className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                        value={formData.guests}
                                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, "8+"].map(n => <option key={n} value={n}>{n} {t('labels.persons')}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* ¿Cómo te gustaría ser contactado? - EN PASO 1 */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">
                                    ¿Cómo te gustaría ser contactado? *
                                </label>
                                <select
                                    className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    value={formData.contacto}
                                    onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                                >
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="telefono">Llamada telefónica</option>
                                    <option value="correo">Correo electrónico</option>
                                </select>
                            </div>

                            {/* Notas */}
                            <div>
                                <label className="block text-sm font-medium text-pizarra mb-1">{t('quoteModal.notesLabel')}</label>
                                <textarea
                                    className="w-full border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino h-24"
                                    placeholder={t('quoteModal.notesPlaceholder')}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full bg-pizarra text-white font-bold py-3 rounded-xl hover:bg-pizarra/90 transition-colors flex justify-center items-center gap-2 mt-4"
                            >
                                {t('buttons.next')} <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h4 className="text-lg font-semibold text-grafito mb-4">{t('quoteModal.step2Title')}</h4>

                            {/* Nombre */}
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="text"
                                    placeholder={t('quoteModal.namePlaceholder')}
                                    required
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="email"
                                    placeholder={t('quoteModal.emailPlaceholder')}
                                    required
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            {/* Teléfono */}
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 text-niebla" size={18} />
                                <input
                                    type="tel"
                                    placeholder={t('quoteModal.phonePlaceholder')}
                                    required
                                    className="w-full pl-10 border border-niebla rounded-xl p-3 focus:ring-alpino focus:border-alpino"
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="flex-1 bg-nieve text-pizarra font-bold py-3 rounded-xl hover:bg-bruma transition-colors"
                                >
                                    {t('buttons.back')}
                                </button>
                                <button
                                    type="submit"
                                    className="flex-[2] bg-pizarra text-white font-bold py-3 rounded-xl hover:bg-pizarra/90 transition-colors shadow-lg shadow-pizarra/30"
                                >
                                    {t('buttons.submit')}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-8 animate-fade-in">
                            <div className="w-16 h-16 bg-bruma rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-8 h-8 text-alpino" />
                            </div>
                            <h3 className="text-2xl font-bold text-grafito mb-2">{t('quoteModal.successTitle')}</h3>
                            <p className="text-pizarra">{t('quoteModal.successMessage')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QuoteModal;
