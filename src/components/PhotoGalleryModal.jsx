import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PhotoGalleryModal = ({ isOpen, onClose, photos, packageTitle, packageSlug }) => {
    const { t } = useTranslation('packageInfo');
    const [currentIndex, setCurrentIndex] = useState(0);

    // Reset to first photo when modal opens
    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;
            if (e.key === 'ArrowLeft') goToPrevious();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, currentIndex]);

    if (!isOpen || !photos || photos.length === 0) return null;

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const currentPhoto = photos[currentIndex];

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
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/90"
                onClick={onClose}
            ></div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Counter */}
            <div className="absolute top-4 left-4 z-20 bg-black/50 px-4 py-2 rounded-full text-white text-sm">
                {currentIndex + 1} / {photos.length}
            </div>

            {/* Navigation arrows */}
            {photos.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 md:left-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 md:right-8 z-20 w-14 h-14 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Photo container */}
            <div className="relative z-10 w-full h-full flex items-center justify-center p-4 md:p-16">
                <img
                    src={currentPhoto.url || currentPhoto}
                    alt={currentPhoto.alt || `${packageTitle} - Foto ${currentIndex + 1}`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                />
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
