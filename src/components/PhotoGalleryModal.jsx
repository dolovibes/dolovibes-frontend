import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import useFocusTrap from '../hooks/useFocusTrap';
import { trackGalleryNavigate } from '../utils/dataLayer';

const PhotoGalleryModal = ({ isOpen, onClose, photos, packageTitle, packageSlug }) => {
    const { t } = useTranslation('packageInfo');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [imageError, setImageError] = useState(false);
    // fix #12 + #28: Focus trap, Escape handler, ARIA
    const focusTrapRef = useFocusTrap(isOpen, onClose);
    const touchStartX = useRef(null);

    // Reset to first photo when modal opens + scroll lock
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
            setImageError(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    if (!isOpen || !photos || photos.length === 0) return null;

    // Filtrar fotos válidas (con URL)
    const validPhotos = photos.filter(p => p?.url || (typeof p === 'string' && p));
    if (validPhotos.length === 0) return null;

    const goToNext = (method = 'button') => {
        const nextIndex = (currentIndex + 1) % validPhotos.length;
        trackGalleryNavigate({
            packageSlug,
            direction: 'next',
            method,
            photoIndex: nextIndex,
            totalPhotos: validPhotos.length,
        });
        setCurrentIndex(nextIndex);
        setImageError(false);
    };

    const goToPrevious = (method = 'button') => {
        const prevIndex = (currentIndex - 1 + validPhotos.length) % validPhotos.length;
        trackGalleryNavigate({
            packageSlug,
            direction: 'previous',
            method,
            photoIndex: prevIndex,
            totalPhotos: validPhotos.length,
        });
        setCurrentIndex(prevIndex);
        setImageError(false);
    };

    const handleKeyDown = (e) => {
        if (!isOpen) return;
        if (e.key === 'ArrowLeft') goToPrevious('keyboard');
        if (e.key === 'ArrowRight') goToNext('keyboard');
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (touchStartX.current === null) return;
        const deltaX = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        // Require at least 50px swipe to avoid accidental triggers
        if (Math.abs(deltaX) < 50) return;
        if (deltaX < 0) goToNext('swipe');
        else goToPrevious('swipe');
    };

    const currentPhoto = validPhotos[currentIndex];

    // Obtener caption traducido o usar el del CMS como fallback
    const getTranslatedCaption = () => {
        if (!packageSlug) return currentPhoto.caption;

        const translatedCaption = t(`galleryCaptions.${packageSlug}.${currentIndex + 1}`, {
            defaultValue: ''
        });

        // Si hay traducción, usarla; si no, usar la del CMS
        return translatedCaption || currentPhoto.caption;
    };

    const caption = getTranslatedCaption();

    return (
        <div
            ref={focusTrapRef}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label={t('gallery.title', { title: packageTitle })}
            onKeyDown={handleKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90"
                onClick={onClose}
                aria-hidden="true"
            ></div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label={t('gallery.close')}
            >
                <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {currentIndex + 1} / {validPhotos.length}
            </div>

            {/* Navigation arrows */}
            {validPhotos.length > 1 && (
                <>
                    <button
                        onClick={() => goToPrevious('button')}
                        className="absolute left-4 md:left-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label={t('gallery.previous')}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={() => goToNext('button')}
                        className="absolute right-4 md:right-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                        aria-label={t('gallery.next')}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Photo container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-16">
                {imageError ? (
                    <div className="text-white text-center">
                        <p className="text-lg mb-2">{t('gallery.imageError')}</p>
                        <button
                            onClick={() => setImageError(false)}
                            className="text-sm text-white/70 hover:text-white underline"
                        >
                            {t('gallery.retry')}
                        </button>
                    </div>
                ) : (
                    <img
                        src={currentPhoto.url || currentPhoto}
                        alt={currentPhoto.alt || t('gallery.photoAlt', { title: packageTitle, number: currentIndex + 1 })}
                        loading="eager"
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>

            {/* Caption (if available) */}
            {caption && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 bg-black/70 px-6 py-3 rounded-full text-white text-center max-w-2xl">
                    {caption}
                </div>
            )}
        </div>
    );
};

export default PhotoGalleryModal;
