import React, { useRef } from 'react';

/**
 * ModalityToggle
 *
 * Selector tipo segmented-control para elegir entre dos modalidades
 * (p.ej. "Autoguiada" / "Guiada"). Puramente presentacional: no conoce
 * site-texts, no hace fetch, no decide fallbacks de labels — todo eso
 * lo resuelve el componente padre y se lo pasa ya resuelto vía props.
 *
 * Props:
 * - labelA, labelB (string): textos ya resueltos de cada opción.
 * - selected ('A' | 'B'): opción actualmente seleccionada.
 * - onChange (next: 'A' | 'B') => void: se invoca al elegir una opción habilitada.
 * - disabledA, disabledB (boolean): deshabilita la opción correspondiente
 *   (p.ej. cuando `enabled === false` en esa modalidad).
 * - unavailableLabel (string, opcional): texto ya resuelto (p.ej. "No disponible"),
 *   usado como tooltip nativo (title) y como texto visible bajo el label cuando
 *   esa opción está deshabilitada. Sin default hardcodeado en español (Gate
 *   Fase 5, Codex): si el padre no lo pasa, simplemente no se muestra texto
 *   secundario ni tooltip — mejor omitir que mostrar el idioma equivocado.
 * - ariaLabel (string, opcional): label del `role="tablist"` para lectores de
 *   pantalla. Sin default hardcodeado — el padre debe resolverlo desde
 *   site-texts. Si se omite, el atributo `aria-label` simplemente no se aplica.
 *
 * Nota: si ambas opciones llegan deshabilitadas (caso raro pero posible
 * si un paquete no tiene NINGUNA modalidad configurada), el componente
 * igual renderiza sin crashear — no asume que al menos una está habilitada.
 *
 * Accesibilidad (Gate Fase 5, Codex — corregido tras NO-GO inicial):
 * - Foco itinerante real: solo la opción seleccionada tiene tabIndex 0;
 *   la otra tiene -1. Flechas izquierda/derecha (y Home/End) mueven el
 *   foco Y activan la opción (patrón de activación automática, apropiado
 *   para un toggle binario). Las flechas nunca mueven el foco a una
 *   opción deshabilitada.
 * - El estilo de "deshabilitado" tiene precedencia visual sobre el de
 *   "seleccionado": si `selected` apunta a una opción con `disabled=true`
 *   (estado que el padre no debería producir, pero que el componente no
 *   asume imposible), se ve deshabilitada, no activa.
 * - Se removió `aria-current` (redundante con `aria-selected` en un tab).
 */
const ModalityToggle = ({
  labelA,
  labelB,
  selected,
  onChange,
  disabledA = false,
  disabledB = false,
  unavailableLabel,
  ariaLabel,
}) => {
  const buttonRefs = useRef({ A: null, B: null });

  const options = [
    { key: 'A', label: labelA, disabled: disabledA },
    { key: 'B', label: labelB, disabled: disabledB },
  ];

  // Ambos guardan también contra "seleccionar lo ya seleccionado" (hallazgo
  // de revisión adversarial, Codex): sin esto, un click sobre la opción
  // activa, o Home/End cuando esa opción ya tiene el foco, disparaban
  // onChange igual — generando "cambios de modalidad" falsos en analytics
  // que en realidad son solo reselecciones sin cambio real de estado.
  const handleSelect = (option, isDisabled) => {
    if (isDisabled || option === selected) return;
    if (onChange) onChange(option);
  };

  const focusAndSelect = (option) => {
    const target = options.find((o) => o.key === option);
    if (!target || target.disabled) return;
    buttonRefs.current[option]?.focus();
    if (option === selected) return;
    if (onChange) onChange(option);
  };

  const handleKeyDown = (event, currentKey) => {
    const otherKey = currentKey === 'A' ? 'B' : 'A';
    switch (event.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        // Toggle binario: la "siguiente"/"anterior" opción es siempre la otra.
        // Si la otra está deshabilitada, no hay a dónde moverse; el foco se queda.
        focusAndSelect(otherKey);
        break;
      case 'Home':
        event.preventDefault();
        focusAndSelect('A');
        break;
      case 'End':
        event.preventDefault();
        focusAndSelect('B');
        break;
      default:
        break;
    }
  };

  // Tab stop efectivo (Gate Fase 5, Codex — corrige regresión de la ronda
  // anterior): si `selected` apunta a una opción deshabilitada, el tablist
  // completo quedaba inalcanzable por Tab. Regla: la opción seleccionada
  // recibe el tab stop SOLO si está habilitada; si no, cae a la primera
  // opción habilitada; si ambas están deshabilitadas, ninguna es alcanzable
  // (aceptable — no hay nada que enfocar).
  const selectedOption = options.find((o) => o.key === selected);
  const tabStopKey = selectedOption && !selectedOption.disabled
    ? selectedOption.key
    : options.find((o) => !o.disabled)?.key ?? null;

  const renderOption = ({ key, label, disabled }) => {
    const isSelected = selected === key;

    // El estado deshabilitado siempre gana visualmente sobre el seleccionado
    // (ver nota de accesibilidad arriba): un botón inconsistente (selected
    // pero disabled) debe verse deshabilitado, no activo.
    const visualState = disabled ? 'disabled' : isSelected ? 'selected' : 'idle';

    return (
      <button
        key={key}
        ref={(el) => { buttonRefs.current[key] = el; }}
        type="button"
        role="tab"
        aria-selected={isSelected}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : (key === tabStopKey ? 0 : -1)}
        title={disabled ? unavailableLabel : undefined}
        onClick={() => handleSelect(key, disabled)}
        onKeyDown={(e) => handleKeyDown(e, key)}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 ${
          visualState === 'disabled'
            ? 'text-niebla cursor-not-allowed opacity-60'
            : visualState === 'selected'
            ? 'bg-pizarra text-white shadow-sm'
            : 'text-grafito hover:bg-white/60 cursor-pointer'
        }`}
      >
        <span>{label}</span>
        {disabled && unavailableLabel && (
          <span className="text-[11px] font-normal leading-none">
            {unavailableLabel}
          </span>
        )}
      </button>
    );
  };

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="w-full flex items-center gap-1 bg-nieve border border-niebla rounded-full p-1"
    >
      {options.map(renderOption)}
    </div>
  );
};

export default ModalityToggle;
