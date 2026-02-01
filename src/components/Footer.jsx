import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSiteSettings, useFooterExperiences, useFooterLegalPages } from '../services/hooks';
import { useSiteTextsContext } from '../contexts/SiteTextsContext';
import { MapPin, Mail, Instagram, Facebook, FileText } from 'lucide-react';

// TikTok icon component (not in lucide-react)
const TikTokIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

// WhatsApp icon component (not in lucide-react)
const WhatsAppIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
    </svg>
);

const Footer = () => {
    const { t } = useTranslation('common');
    // SiteTextsContext para textos globales de Strapi
    const { texts: siteTexts } = useSiteTextsContext();
    const { data: siteSettings, isLoading } = useSiteSettings();
    // Usar useFooterExperiences para obtener solo las experiencias marcadas para el footer
    const { data: footerExperiences = [] } = useFooterExperiences();
    // Usar useFooterLegalPages para obtener las páginas legales del footer
    const { data: legalPages = [] } = useFooterLegalPages();

    // Datos desde Strapi con fallbacks
    const logoUrl = siteSettings?.logo || '/logo-dark.svg';
    const location = siteSettings?.location || 'Monterrey, México';
    const whatsappNumber = siteSettings?.whatsappNumber || '+5218112345678';
    const email = siteSettings?.email || 'info@dolo-vibes.com';
    const instagramUrl = siteSettings?.instagramUrl || 'https://instagram.com';
    const facebookUrl = siteSettings?.facebookUrl || 'https://facebook.com';
    const tiktokUrl = siteSettings?.tiktokUrl || 'https://tiktok.com';

    // Textos de i18n con fallback - priorizar Strapi
    const footerDescription = siteSettings?.footerDescription || t('footer.description');


    if (isLoading) {
        return (
            <footer className="bg-pizarra text-white">
                <div className="container mx-auto px-6 py-16">
                    <div className="text-center text-niebla">{t('loading.generic')}</div>
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
                            src={logoUrl}
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

                    {/* Experiencias - Todas ordenadas */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t('footer.experiences')}</h4>
                        <ul className="space-y-3">
                            {footerExperiences.map((exp) => (
                                <li key={exp.id || exp.slug}>
                                    <Link
                                        to={`/experiencias/${exp.slug}`}
                                        className="text-niebla hover:text-bruma transition-colors"
                                    >
                                        {exp.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Información Legal dinámica desde Strapi */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">{t('footer.information')}</h4>
                        <ul className="space-y-3">
                            {legalPages.map((page) => (
                                <li key={page.slug}>
                                    <Link to={`/legales/${page.slug}`} className="text-niebla hover:text-bruma transition-colors">
                                        {page.title}
                                    </Link>
                                </li>
                            ))}
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
                                <a
                                    href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-niebla hover:text-bruma transition-colors"
                                >
                                    <WhatsAppIcon className="w-5 h-5 text-bruma flex-shrink-0" />
                                    <span>{whatsappNumber}</span>
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
                            <Link to="/nosotros" className="text-niebla hover:text-white transition-colors">
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

