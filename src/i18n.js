import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importar traducciones en español
import commonES from './locales/es/common.json';
import homeES from './locales/es/home.json';
import aboutES from './locales/es/about.json';
import experiencesES from './locales/es/experiences.json';

// Configuración para agregar nuevos idiomas en el futuro:
// 1. Crear carpeta src/locales/{codigo_idioma}/
// 2. Copiar y traducir los archivos JSON
// 3. Importar y agregar al objeto resources abajo

i18n
    .use(initReactI18next)
    .init({
        resources: {
            es: {
                common: commonES,
                home: homeES,
                about: aboutES,
                experiences: experiencesES,
            },
            // Ejemplo para agregar inglés en el futuro:
            // en: {
            //     common: commonEN,
            //     home: homeEN,
            //     about: aboutEN,
            //     experiences: experiencesEN,
            // }
        },
        lng: 'es', // Idioma por defecto
        fallbackLng: 'es', // Idioma de respaldo
        defaultNS: 'common', // Namespace por defecto
        interpolation: {
            escapeValue: false, // React ya escapa por defecto
        },
    });

export default i18n;
