import React, { useState } from 'react';
import { CheckCircle, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PackageQuoteForm = ({ packageTitle }) => {
    const { t } = useTranslation('quoteForm');
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
            <div className="bg-gradient-to-br from-alpino to-alpino rounded-3xl p-8 md:p-12 text-center text-white">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    {t('requestSent')}
                </h3>
                <p className="text-white/80 text-lg">
                    {t('contactSoon')} <strong>{packageTitle}</strong>.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-pizarra to-pizarra p-8 text-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    {packageTitle}
                </h3>
                <p className="text-bruma text-lg font-medium mb-1">
                    {t('readyForTrip')}
                </p>
                <p className="text-white/60 text-sm">
                    {t('completeInfo')}
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {/* Nombre y Apellido */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('firstName')} *
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            required
                            value={formData.nombre}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder={t('yourName')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('lastName')} *
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            required
                            value={formData.apellido}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder={t('yourLastName')}
                        />
                    </div>
                </div>

                {/* Ciudad, Estado, País */}
                <div className="grid md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('city')} *
                        </label>
                        <input
                            type="text"
                            name="ciudad"
                            required
                            value={formData.ciudad}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder={t('city')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('state')} *
                        </label>
                        <input
                            type="text"
                            name="estado"
                            required
                            value={formData.estado}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder={t('state')}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('country')} *
                        </label>
                        <input
                            type="text"
                            name="pais"
                            required
                            value={formData.pais}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder={t('country')}
                        />
                    </div>
                </div>

                {/* Email y Teléfono */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('email')} *
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder="email@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('phone')} *
                        </label>
                        <input
                            type="tel"
                            name="telefono"
                            required
                            value={formData.telefono}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                            placeholder="+1 123 456 7890"
                        />
                    </div>
                </div>

                {/* Cómo te gustaría ser contactado */}
                <div>
                    <label className="block text-sm font-medium text-pizarra mb-2">
                        {t('howContact')} *
                    </label>
                    <select
                        name="contacto"
                        value={formData.contacto}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all bg-white"
                    >
                        <option value="whatsapp">{t('whatsapp')}</option>
                        <option value="telefono">{t('phoneCall')}</option>
                        <option value="correo">{t('emailOption')}</option>
                    </select>
                </div>

                {/* Mes del viaje y Número de pasajeros */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('travelMonth')} *
                        </label>
                        <input
                            type="month"
                            name="mesViaje"
                            required
                            value={formData.mesViaje}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pizarra mb-2">
                            {t('passengers')} *
                        </label>
                        <select
                            name="pasajeros"
                            value={formData.pasajeros}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all bg-white"
                        >
                            {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => (
                                <option key={n} value={n}>{n} {n === 1 ? t('person') : t('persons')}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Tipo de viaje */}
                <div>
                    <label className="block text-sm font-medium text-pizarra mb-2">
                        {t('tripType')} *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'guiado' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'guiado'
                                ? 'border-alpino bg-nieve text-alpino'
                                : 'border-niebla hover:border-bruma text-pizarra'
                                }`}
                        >
                            <span className="font-semibold block">{t('guided')}</span>
                            <span className="text-xs opacity-70">{t('withExpert')}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, tipoViaje: 'autoguiado' }))}
                            className={`p-4 rounded-xl border-2 transition-all text-center ${formData.tipoViaje === 'autoguiado'
                                ? 'border-alpino bg-nieve text-alpino'
                                : 'border-niebla hover:border-bruma text-pizarra'
                                }`}
                        >
                            <span className="font-semibold block">{t('selfGuided')}</span>
                            <span className="text-xs opacity-70">{t('onYourOwn')}</span>
                        </button>
                    </div>
                </div>

                {/* Servicios adicionales */}
                <div>
                    <label className="block text-sm font-medium text-pizarra mb-2">
                        {t('additionalServices')}
                    </label>
                    <textarea
                        name="serviciosAdicionales"
                        value={formData.serviciosAdicionales}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-niebla rounded-xl focus:ring-2 focus:ring-alpino focus:border-alpino transition-all resize-none"
                        placeholder={t('servicesPlaceholder')}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-alpino hover:bg-alpino disabled:bg-bruma text-white py-4 rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg shadow-alpino/30 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            {t('sending')}
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5" />
                            {t('requestQuote')}
                        </>
                    )}
                </button>

                <p className="text-center text-niebla text-sm">
                    {t('responseTime')}
                </p>
            </form>
        </div>
    );
};

export default PackageQuoteForm;
