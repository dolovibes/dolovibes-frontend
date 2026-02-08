import { useState, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';

/**
 * OptimizedImage - Componente de imagen optimizada para rendimiento
 *
 * Características:
 * - Previene CLS con aspectRatio explícito
 * - Lazy loading por defecto (excepto imágenes críticas)
 * - Placeholder mientras carga
 * - Botón de reintentar si falla la carga
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
    showRetry = true,
    ...props
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    const [isRetrying, setIsRetrying] = useState(false);

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

    // Función para reintentar la carga de la imagen
    const handleRetry = useCallback(() => {
        setIsRetrying(true);
        setHasError(false);
        setIsLoaded(false);
        setRetryCount(prev => prev + 1);
        
        // Pequeño delay para dar feedback visual
        setTimeout(() => {
            setIsRetrying(false);
        }, 300);
    }, []);

    // Generar src con cache buster para reintentos
    const imageSrc = retryCount > 0 
        ? `${src}${src.includes('?') ? '&' : '?'}_retry=${retryCount}` 
        : src;

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
            {!hasError && (
                <img
                    key={retryCount} // Forzar remount en retry
                    src={imageSrc}
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
            )}

            {/* Error fallback con botón de reintentar */}
            {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-niebla/20 text-pizarra text-sm gap-3">
                    <span className="text-center px-2">Image load error</span>
                    {showRetry && (
                        <button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg shadow-sm transition-all text-xs font-medium text-pizarra hover:shadow-md disabled:opacity-50"
                            aria-label="Retry image load"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                            Retry
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OptimizedImage;
