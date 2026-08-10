import React, { useId, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { BlocksRenderer } from '../utils/BlocksRenderer';

/**
 * PackageAccordionSection
 *
 * Generaliza el patrón de acordeón usado originalmente en PackageInfoPage
 * para `pkg.includes` / `pkg.notIncludes`.
 *
 * Diferencia deliberada de comportamiento respecto al original (Gate Fase 5,
 * Codex): el legacy compartía un ÚNICO estado `expandedInclude` en TODA la
 * página (con keys prefijadas `inc-`/`notinc-`/`info-`/`svc-`), por lo que
 * abrir un item en cualquier sección cerraba el que estuviera abierto en
 * cualquier OTRA sección de la página. Este componente NO replica esa
 * exclusión global: cada instancia maneja su propio estado interno, así que
 * puede haber un item abierto en "incluye" Y otro abierto en "no incluye"
 * simultáneamente. Es un cambio de UX intencional (no un descuido), elegido
 * porque cada instancia representa una sección/modalidad independiente. Si
 * en algún momento el producto exige exclusión global de nuevo, el estado
 * tendría que subirse al componente padre.
 *
 * Props:
 * - items: [{ label, detail }] — si es null/undefined/vacío, no renderiza
 *   nada (return null), igual que el `.length > 0 &&` del patrón original.
 * - icon: componente de lucide-react para el círculo (default: Check).
 *   El padre pasa `X` para la sección de "no incluye", por ejemplo.
 * - title: heading opcional encima de la lista. El patrón legacy no tenía
 *   heading (era obvio por contexto en la página); aquí es opcional
 *   porque, al usarse una instancia por sección/modalidad, hace falta
 *   distinguir "incluye" de "no incluye". Si es null/undefined, no se
 *   renderiza ningún heading.
 */
const PackageAccordionSection = ({ items, icon, title }) => {
  const [expandedKey, setExpandedKey] = useState(null);
  const baseId = useId();

  if (!items || items.length === 0) return null;

  // Nota: se reasigna a una const local en vez de desestructurar
  // directamente con alias (`icon: Icon`) porque, con la config de
  // ESLint de este repo (sin eslint-plugin-react), `no-unused-vars`
  // no reconoce el uso de un parámetro de función solo dentro de JSX
  // como <Icon />, y lo marca como falso positivo "unused". Asignarlo
  // a una variable local evita el falso positivo sin tocar la config.
  const Icon = icon || Check;

  const toggleItem = (key) => {
    setExpandedKey((current) => (current === key ? null : key));
  };

  return (
    <div className="mb-6">
      {title && (
        <h3 className="text-lg font-bold text-grafito mb-3 font-heading">{title}</h3>
      )}
      <div className="space-y-3">
        {items.map((item, index) => {
          const key = `item-${index}`;
          const isExpanded = expandedKey === key;
          const hasDetail = Boolean(item.detail);
          const panelId = `${baseId}-panel-${index}`;

          return (
            <div
              key={key}
              className="bg-nieve rounded-xl overflow-hidden border border-niebla w-full"
            >
              {hasDetail ? (
                <button
                  type="button"
                  onClick={() => toggleItem(key)}
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-nieve transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-grafito">{item.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-niebla transition-transform duration-300 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              ) : (
                // Sin `detail` no hay nada que expandir: fila estática, no
                // interactiva (Gate Fase 5, Codex) — un <button> sin efecto
                // perceptible al activarlo es una trampa de accesibilidad.
                <div className="w-full flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-pizarra rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-grafito">{item.label}</span>
                  </div>
                </div>
              )}
              {hasDetail && (
                <div
                  id={panelId}
                  // aria-hidden cuando está colapsado (hallazgo QA adversarial,
                  // Grok): el panel sigue en el DOM con max-h-0/opacity-0 para
                  // animar la transición, pero sin esto algunos lectores de
                  // pantalla leen contenido "cerrado" como si fuera visible.
                  aria-hidden={!isExpanded}
                  className={`overflow-hidden transition-all duration-300 ${
                    isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-4 pb-4 pt-0 pl-11">
                    <div className="text-pizarra prose prose-sm max-w-none">
                      <BlocksRenderer content={item.detail} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PackageAccordionSection;
