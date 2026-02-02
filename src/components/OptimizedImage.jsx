import { useState } from 'react';

/**
 * OptimizedImage - Componente de imagen optimizada para rendimiento
 *
 * Características:
 * - Previene CLS con aspectRatio explícito
 * - Lazy loading por defecto (excepto imágenes críticas)
 * - Placeholder mientras carga
 *
 * NOTA: Solo usar para imágenes con aspectRatio definido (cards).
 * Para hero images que usan absolute fill, usar <img> directamente.
 */
const OptimizedImage = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    objectFit = 'cover',
    aspectRatio,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);

    const loading = priority ? 'eager' : 'lazy';
    const fetchpriority = priority ? 'high' : 'auto';

    const imageStyle = {
        objectFit,
        ...(aspectRatio && { aspectRatio }),
    };

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
