import { useEffect } from 'react';

/**
 * Hook para establecer meta tags de SEO en cada página (fix #8)
 *
 * @param {string} title - Título de la página (se agrega " | DoloVibes")
 * @param {string} [description] - Meta description (truncada a 160 chars)
 */
const usePageMeta = (title, description) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} | DoloVibes`;
        }
    }, [title]);

    useEffect(() => {
        if (description) {
            const trimmed = description.substring(0, 160);
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', trimmed);
        }
    }, [description]);
};

export default usePageMeta;
