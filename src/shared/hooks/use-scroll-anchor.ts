import { useEffect, useRef } from 'react';

/**
 * useScrollAnchor
 * 
 * Este hook ayuda a mantener el scroll en una posición coherente cuando se colapsa contenido.
 * Útil para evitar que el usuario se pierda visualmente cuando una sección larga se cierra.
 * 
 * @param isExpanded - Booleano que indica si la sección está abierta
 * @param offset - Píxeles de separación desde el tope (default: 100)
 */
export function useScrollAnchor(isExpanded: boolean, offset: number = 100) {
    const elementRef = useRef<HTMLDivElement>(null);
    const wasExpanded = useRef(isExpanded);

    useEffect(() => {
        // No ejecutamos anclaje en móviles para evitar conflictos de UX (momentum)
        if (typeof window !== 'undefined' && window.innerWidth < 768) return;

        // Detectamos el momento exacto del colapso (de true a false)
        if (wasExpanded.current && !isExpanded) {
            if (elementRef.current) {
                const rect = elementRef.current.getBoundingClientRect();

                // Solo ejecutamos el scroll si el elemento NO está completamente visible
                // o si su cabecera se ha desplazado fuera del viewport (scroll abrupto)
                if (rect.top < 0 || rect.top > window.innerHeight * 0.8) {
                    const top = rect.top + window.scrollY - offset;
                    window.scrollTo({
                        top,
                        behavior: 'smooth'
                    });
                }
            }
        }
        wasExpanded.current = isExpanded;
    }, [isExpanded, offset]);

    return elementRef;
}
