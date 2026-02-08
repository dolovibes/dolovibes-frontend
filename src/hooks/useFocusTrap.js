import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook para atrapar el focus dentro de un modal (fix #12)
 * - Mueve el focus al modal al abrir
 * - Atrapa Tab/Shift+Tab dentro del modal
 * - Cierra el modal con Escape
 * - Restaura el focus al cerrar
 *
 * @param {boolean} isOpen - Si el modal está abierto
 * @param {function} onClose - Función para cerrar el modal
 * @returns {React.RefObject} ref para asignar al contenedor del modal
 */
const useFocusTrap = (isOpen, onClose) => {
    const containerRef = useRef(null);
    const previousFocusRef = useRef(null);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            e.stopPropagation();
            onClose?.();
            return;
        }

        if (e.key !== 'Tab') return;

        const container = containerRef.current;
        if (!container) return;

        const focusableElements = container.querySelectorAll(
            'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const first = focusableElements[0];
        const last = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
            if (document.activeElement === first) {
                e.preventDefault();
                last.focus();
            }
        } else {
            if (document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return;

        // Guardar el elemento con focus actual
        previousFocusRef.current = document.activeElement;

        // Mover focus al contenedor del modal
        const timer = setTimeout(() => {
            const container = containerRef.current;
            if (!container) return;

            const firstFocusable = container.querySelector(
                'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (firstFocusable) {
                firstFocusable.focus();
            } else {
                container.focus();
            }
        }, 50);

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(timer);
            document.removeEventListener('keydown', handleKeyDown);
            // Restaurar focus al cerrar
            if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
                previousFocusRef.current.focus();
            }
        };
    }, [isOpen, handleKeyDown]);

    return containerRef;
};

export default useFocusTrap;
