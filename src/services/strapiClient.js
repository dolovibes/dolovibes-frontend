/**
 * Cliente HTTP base para comunicación con Strapi
 *
 * Este cliente está preparado para:
 * - Conectar con Strapi backend
 * - Manejar i18n automáticamente
 * - Soportar futuras funcionalidades de moneda
 * - Serializar correctamente parámetros complejos (populate) para Strapi 5
 */
import axios from 'axios';
import qs from 'qs';

// URL base del backend Strapi
const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

// Cliente HTTP configurado
const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 segundos
  // CRÍTICO: Strapi 5 requiere serialización correcta de parámetros complejos (populate con objetos anidados)
  paramsSerializer: params => qs.stringify(params, { encode: false }),
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
    // En desarrollo, solo logear errores que NO son 404
    // Los 404 son esperados cuando un Single Type no tiene localización
    if (import.meta.env.DEV && error.response?.status !== 404) {
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
 * Obtiene la URL completa de un archivo media de Strapi
 * Maneja diferentes formatos:
 * - String path: '/uploads/image.jpg'
 * - URL completa: 'http://localhost:1337/uploads/image.jpg'
 * - Objeto media de Strapi: { url: '/uploads/image.jpg', ... }
 * @param {string|object} media - Path o objeto media de Strapi
 * @returns {string|null} URL completa del archivo
 */
export const getStrapiMediaUrl = (media) => {
  if (!media) return null;

  // Si es un string (path o URL completa)
  if (typeof media === 'string') {
    if (media.startsWith('http')) return media;
    return `${STRAPI_URL}${media}`;
  }

  // Si es un objeto con propiedad url
  if (typeof media === 'object' && media.url) {
    if (media.url.startsWith('http')) return media.url;
    return `${STRAPI_URL}${media.url}`;
  }

  // Fallback: si no hay URL válida
  console.warn('[Strapi] Invalid media format:', media);
  return null;
};

export default strapiClient;
