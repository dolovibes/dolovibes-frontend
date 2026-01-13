import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings, useExperiences } from '../services/hooks';
import { MapPin, Phone, Mail, Instagram, Facebook, FileText } from 'lucide-react';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

const Footer = () => {
    const { t } = useTranslation('common');
    const { data: siteSettings, isLoading } = useSiteSettings();
    const { data: experiences = [] } = useExperiences();

    // Tomar las primeras 4 experiencias para mostrar en el footer
    const footerExperiences = experiences.slice(0, 4);

    // Datos de contacto de Strapi (no requieren traducción)
    const location = siteSettings?.location || 'Monterrey, México';
    const phone = siteSettings?.phone || '+52 81 1234 5678';
    const email = siteSettings?.email || 'info@dolovibes.com';
    const instagramUrl = siteSettings?.instagramUrl || 'https://instagram.com';
    const facebookUrl = siteSettings?.facebookUrl || 'https://facebook.com';
    const tiktokUrl = siteSettings?.tiktokUrl || 'https://tiktok.com';
    // Textos: siempre de i18n
    const footerDescription = t('footer.description');

    if (isLoading) {
        return (
            <footer className="bg-pizarra text-white">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center text-niebla">Cargando...</div>
                </div>
            </footer>
        );
    }

    return (
        <footer className="bg-pizarra text-white">
            {/* Main Footer */}
            <div className="container mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12">
                    {/* Logo y descripción */}
                    <div className="lg:col-span-2">
                        <img
                            src="/logo-dark.svg"
                            alt="DoloVibes"
                            className="h-20 w-auto brightness-0 invert"
                        />
                        <p className="text-niebla leading-relaxed max-w-md mb-6">
                            {footerDescription}
                        </p>
                        <div className="flex gap-4">
                            <a
                                href={instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-alpino transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href={facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-alpino transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href={tiktokUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-alpino transition-colors"
                                aria-label="TikTok"
                            >
                                <TikTokIcon className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Experiencias */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t('footer.experiences')}</h4>
                        <ul className="space-y-3">
                            {footerExperiences.map((exp) => (
                                <li key={exp.id || exp.slug}>
                                    <Link
                                        to={`/experiencia/${exp.slug}`}
                                        className="text-niebla hover:text-bruma transition-colors"
                                    >
                                        {exp.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t('footer.information')}</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/terminos" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.bookingConditions')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/cancelaciones" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.cancellationPolicy')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.contractInfo')}
                                </a>
                            </li>
                            <li>
                                <Link to="/privacidad" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.privacyPolicy')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/cookies" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.cookiePolicy')}
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-niebla hover:text-bruma transition-colors">
                                    {t('footer.copyrights')}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t('footer.contact')}</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-niebla">
                                <MapPin className="w-5 h-5 text-bruma flex-shrink-0" />
                                <span>{location}</span>
                            </li>
                            <li>
                                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-3 text-niebla hover:text-bruma transition-colors">
                                    <Phone className="w-5 h-5 text-bruma flex-shrink-0" />
                                    <span>{phone}</span>
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${email}`} className="flex items-center gap-3 text-niebla hover:text-bruma transition-colors">
                                    <Mail className="w-5 h-5 text-bruma flex-shrink-0" />
                                    <span>{email}</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10">
                <div className="container mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-niebla text-sm">
                            © {new Date().getFullYear()} DoloVibes. {t('footer.allRightsReserved')}
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link to="/about" className="text-niebla hover:text-white transition-colors">
                                {t('navbar.aboutUs')}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

