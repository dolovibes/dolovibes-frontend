/**
 * Cloudinary Image Optimizer
 *
 * Optimiza URLs de Cloudinary con transformaciones responsive
 * para mejorar el rendimiento en mobile, tablet y desktop.
 *
 * Transformaciones aplicadas:
 * - f_auto: Formato automático (WebP en navegadores compatibles)
 * - q_auto: Calidad automática optimizada
 * - dpr_auto: Device Pixel Ratio automático (Retina support)
 * - c_scale: Escalado responsive
 * - w_auto: Ancho automático basado en el contenedor
 */

/**
 * Detecta si una URL es de Cloudinary
 * @param {string} url - URL de la imagen
 * @returns {boolean}
 */
export const isCloudinaryUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return url.includes('res.cloudinary.com') || url.includes('cloudinary.com');
};

/**
 * Extrae las partes de una URL de Cloudinary
 * @param {string} url - URL de Cloudinary
 * @returns {object|null} - { base, version, publicId, extension }
 */
const parseCloudinaryUrl = (url) => {
  if (!isCloudinaryUrl(url)) return null;

  // Formato típico: https://res.cloudinary.com/{cloud_name}/{resource_type}/{type}/{transformations}/{version}/{public_id}.{format}
  // Ejemplo: https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg
  const match = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/[^\/]+\/[^\/]+)\/(.*?)\/([^\/]+)\.([^.]+)$/);

  if (!match) {
    // Intentar formato sin versión
    const matchNoVersion = url.match(/^(https?:\/\/res\.cloudinary\.com\/[^\/]+\/[^\/]+\/[^\/]+)\/([^\/]+)\.([^.]+)$/);
    if (matchNoVersion) {
      return {
        base: matchNoVersion[1],
        version: '',
        publicId: matchNoVersion[2],
        extension: matchNoVersion[3],
      };
    }
    // Si no coincide con ningún formato, devolver null
    return null;
  }

  return {
    base: match[1], // Base URL hasta /upload
    version: match[2], // v1234567890 o vacío
    publicId: match[3], // sample
    extension: match[4], // jpg
  };
};

/**
 * Optimiza una URL de Cloudinary con transformaciones responsive
 *
 * @param {string} url - URL original de Cloudinary
 * @param {object} options - Opciones de optimización
 * @param {number} options.width - Ancho máximo (default: auto)
 * @param {number} options.height - Alto máximo (default: null)
 * @param {string} options.crop - Modo de crop (default: 'scale')
 * @param {string} options.gravity - Punto focal del crop (default: 'auto')
 * @param {string} options.quality - Calidad (default: 'auto')
 * @param {string} options.format - Formato (default: 'auto')
 * @param {boolean} options.dpr - DPR automático (default: true)
 * @param {string} options.fetchFormat - Formato de fetch (default: 'auto')
 * @returns {string} - URL optimizada
 */
export const optimizeCloudinaryUrl = (url, options = {}) => {
  // Si no es una URL de Cloudinary, devolverla sin modificar
  if (!isCloudinaryUrl(url)) {
    return url;
  }

  const parsed = parseCloudinaryUrl(url);
  if (!parsed) {
    console.warn('[CloudinaryOptimizer] Could not parse URL:', url);
    return url;
  }

  const {
    width = 'auto',
    height = null,
    crop = 'scale',
    gravity = 'auto',
    quality = 'auto',
    format = 'auto',
    dpr = true,
    fetchFormat = 'auto',
  } = options;

  // Construir transformaciones
  const transformations = [];

  // Formato y calidad automáticos
  if (format === 'auto') {
    transformations.push('f_auto');
  } else if (format) {
    transformations.push(`f_${format}`);
  }

  if (quality === 'auto') {
    transformations.push('q_auto:good'); // :good es un buen balance entre calidad y tamaño
  } else if (quality) {
    transformations.push(`q_${quality}`);
  }

  // DPR automático para Retina displays
  if (dpr) {
    transformations.push('dpr_auto');
  }

  // Dimensiones y crop
  const sizeParams = [];
  if (width) {
    sizeParams.push(`w_${width}`);
  }
  if (height) {
    sizeParams.push(`h_${height}`);
  }
  if (crop) {
    sizeParams.push(`c_${crop}`);
  }
  if (gravity && crop !== 'scale') {
    sizeParams.push(`g_${gravity}`);
  }

  if (sizeParams.length > 0) {
    transformations.push(sizeParams.join(','));
  }

  // Fetch format (para compatibilidad adicional)
  if (fetchFormat === 'auto') {
    transformations.push('fl_lossy'); // Compresión lossy para mejor performance
  }

  // Construir URL final
  const transformString = transformations.join(',');
  const versionPart = parsed.version ? `/${parsed.version}` : '';

  return `${parsed.base}/${transformString}${versionPart}/${parsed.publicId}.${parsed.extension}`;
};

/**
 * Genera un conjunto de URLs responsive para srcset
 * @param {string} url - URL original de Cloudinary
 * @param {number[]} widths - Array de anchos (default: [320, 640, 768, 1024, 1280, 1536, 1920])
 * @param {object} options - Opciones adicionales para optimizeCloudinaryUrl
 * @returns {string} - String de srcset
 */
export const generateCloudinarySrcSet = (url, widths = [320, 640, 768, 1024, 1280, 1536, 1920], options = {}) => {
  if (!isCloudinaryUrl(url)) {
    return '';
  }

  return widths
    .map((width) => {
      const optimizedUrl = optimizeCloudinaryUrl(url, { ...options, width });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Presets comunes de optimización
 */
export const CLOUDINARY_PRESETS = {
  // Hero images - Alta calidad, carga prioritaria
  hero: {
    quality: 'auto:best',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },

  // Thumbnails - Calidad reducida para velocidad
  thumbnail: {
    width: 400,
    quality: 'auto:low',
    crop: 'fill',
    gravity: 'auto:subject',
    format: 'auto',
  },

  // Cards - Balance entre calidad y velocidad
  card: {
    width: 600,
    quality: 'auto:good',
    crop: 'fill',
    gravity: 'auto',
    format: 'auto',
  },

  // Gallery - Optimizado para modal
  gallery: {
    width: 1920,
    quality: 'auto:best',
    crop: 'scale',
    format: 'auto',
  },

  // Mobile optimized
  mobile: {
    width: 768,
    quality: 'auto:good',
    crop: 'scale',
    format: 'auto',
  },
};

/**
 * Aplica un preset a una URL de Cloudinary
 * @param {string} url - URL original
 * @param {string} presetName - Nombre del preset
 * @returns {string} - URL optimizada
 */
export const applyCloudinaryPreset = (url, presetName) => {
  const preset = CLOUDINARY_PRESETS[presetName];
  if (!preset) {
    console.warn(`[CloudinaryOptimizer] Unknown preset: ${presetName}`);
    return url;
  }
  return optimizeCloudinaryUrl(url, preset);
};

export default {
  isCloudinaryUrl,
  optimizeCloudinaryUrl,
  generateCloudinarySrcSet,
  applyCloudinaryPreset,
  CLOUDINARY_PRESETS,
};
