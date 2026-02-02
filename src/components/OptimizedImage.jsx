import { useState } from 'react';

/**
 * OptimizedImage - Componente de imagen optimizada para rendimiento
 *
 * Características:
 * - Previene CLS con dimensiones explícitas
 * - Lazy loading por defecto (excepto imágenes críticas)
 * - Placeholder mientras carga
 * - Soporte para múltiples formatos (WebP fallback)
 */
const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false, // true para imágenes above-the-fold
    objectFit = 'cover',
    aspectRatio,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    // Determinar si la imagen es prioritaria (LCP candidate)
    const loading = priority ? 'eager' : 'lazy';
    const fetchpriority = priority ? 'high' : 'auto';

    // Construir el style object
    const imageStyle = {
        objectFit,
        ...(aspectRatio && { aspectRatio }),
    };

    // Placeholder mientras carga
    const placeholderStyle = {
        backgroundColor: '#A3B5B6',
        transition: 'opacity 0.3s ease-in-out',
        opacity: isLoaded ? 0 : 1,
    };

    return (
        <div className="relative" style={{ width: '100%', aspectRatio }}>
            {/* Placeholder */}
            {!isLoaded && !hasError && (
                <div
                    className="absolute inset-0 animate-pulse"
                    style={placeholderStyle}
                    aria-hidden="true"
                />
            )}

            {/* Imagen principal */}
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                fetchPriority={fetchpriority}
                onLoad={() => setIsLoaded(true)}
                onError={() => setHasError(true)}
                className={`${className} transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                style={imageStyle}
                {...props}
            />

            {/* Error fallback */}
            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-niebla/20 text-pizarra text-sm">
                    Error al cargar imagen
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
