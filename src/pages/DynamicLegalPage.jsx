import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { BlocksRenderer } from '../utils/BlocksRenderer';
import Footer from '../components/Footer';
import Hreflang from '../components/Hreflang';
import { useLegalPage, useLanguageAwareNavigation } from '../services/hooks';
import { useAlternateUrls } from '../hooks/useAlternateUrls';
import usePageMeta from '../hooks/usePageMeta';

// Componente para renderizar la página legal
// Si hay contenido en Strapi (data), lo usa. Si no, usa el fallback (children).
const DynamicLegalPage = ({ slug: slugProp, fallbackTitle, fallbackContent }) => {
    const { t, i18n } = useTranslation('common');
    const navigate = useNavigate();
    const { slug: slugParam } = useParams();
    const currentLocale = i18n.language || 'es';

    // Usar slug del parámetro de URL si existe, sino usar el prop
    const slug = slugParam || slugProp;

    // Obtener datos desde Strapi
    const { data: pageData, isLoading } = useLegalPage(slug);

    // Hook para redirección inteligente al cambiar idioma
    useLanguageAwareNavigation({
        documentId: pageData?.documentId,
        currentSlug: slug,
        resourceType: 'legal',
    });

    // Hreflang para SEO - URLs alternativas por idioma (DEBE estar antes de early returns)
    const { alternateUrls } = useAlternateUrls('legal', pageData?.documentId, slug);

    // Título: Strapi > Prop > i18n fallback (DEBE estar antes de usePageMeta)
    const title = pageData?.title || fallbackTitle;

    // SEO meta tags (fix #8)
    usePageMeta(title);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Contenido: Strapi (Markdown) > Fallback (Componente existente)
    const hasStrapiContent = pageData && pageData.content && (Array.isArray(pageData.content) ? pageData.content.length > 0 : true);


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-pizarra border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-niebla">{t('loading.generic')}</p>
                </div>
            </div>
        );
    }

    // Si NO hay contenido de Strapi y se proveyó un fallbackContent (el diseño viejo), renderizar eso
    if (!hasStrapiContent && fallbackContent) {
        return fallbackContent;
    }

    // Renderizar versión de Strapi (Markdown limpio)
    return (
        <div className="min-h-screen bg-white">
            <Hreflang alternateUrls={alternateUrls} />
            {/* Header */}
            <div className="bg-gradient-to-r from-pizarra to-pizarra pt-16 md:pt-20 pb-16">
                <div className="container mx-auto px-6">
                    <button
                        onClick={() => window.history.length > 1 ? navigate(-1) : navigate(`/${currentLocale}`)}
                        className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        {t('buttons.back') || 'Volver'}
                    </button>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        {title}
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto bg-nieve rounded-2xl p-6 md:p-8 border border-niebla">
                    {hasStrapiContent ? (
                        <div className="prose prose-lg max-w-none text-pizarra prose-headings:text-grafito prose-a:text-alpino">
                            <BlocksRenderer content={pageData.content} />
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-niebla mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-grafito mb-2">{t('legal.contentUnavailable', 'Content unavailable')}</h2>
                            <p className="text-pizarra">{t('legal.updatingSection', 'We are updating this legal section.')}</p>
                        </div>
                    )}
                </div>

                {/* Call to action */}
                <div className="max-w-4xl mx-auto mt-12 text-center">
                    <button
                        onClick={() => navigate(`/${currentLocale}`)}
                        className="bg-pizarra text-white px-8 py-3 rounded-full font-semibold hover:bg-pizarra/90 transition-colors"
                    >
                        {t('buttons.backToHome') || 'Volver al Inicio'}
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default DynamicLegalPage;
