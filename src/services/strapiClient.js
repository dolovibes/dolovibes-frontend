/**
 * Cliente HTTP base para comunicación con Strapi
 * 
 * Este cliente está preparado para:
 * - Conectar con Strapi backend
 * - Manejar i18n automáticamente
 * - Soportar futuras funcionalidades de moneda
 */
import axios from 'axios';

// URL base del backend Strapi
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Cliente HTTP configurado
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor para logs en desarrollo
strapiClient.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[Strapi] ${config.method?.toUpperCase()} ${config.url}`, config.params);
    }
    return config;
  },
  (error) => {
    console.error('[Strapi] Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
strapiClient.interceptors.response.use(
  (response) => {
    // Strapi envuelve data en { data: { ... }, meta: { ... } }
    return response;
  },
  (error) => {
    if (import.meta.env.DEV) {
      console.error('[Strapi] Response error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Construye los parámetros de populate para Strapi
 * @param {string|string[]|object} populate - Campos a popular
 * @returns {object} Parámetros de query
 */
export const buildPopulateParams = (populate) => {
  if (typeof populate === 'string') {
    return { populate };
  }
  if (Array.isArray(populate)) {
    return { populate: populate.join(',') };
  }
  return { populate };
};

/**
 * Obtiene la URL base de Strapi para medios
 * @returns {string} URL base para imágenes/videos
 */
export const getStrapiMediaUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${STRAPI_URL}${path}`;
};

export default strapiClient;
