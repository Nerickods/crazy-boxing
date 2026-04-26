"use client";

/**
 * Utilitario de bloqueo de scroll centralizado para KIA Intelligence.
 * Maneja el bloqueo tanto en <html> como en <body> para compatibilidad cross-browser (Safari/Firefox).
 * Implementa un sistema de "owners" para evitar que múltiples componentes interfieran entre sí.
 */

let lockCount = 0;
const owners = new Set<string>();

/**
 * Bloquea el scroll de la página.
 * @param owner Identificador único del componente que solicita el bloqueo.
 */
export const lockScroll = (owner: string) => {
  if (typeof document === "undefined") return;

  owners.add(owner);
  
  if (owners.size > 0) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.scrollLocked = "true";
    document.documentElement.dataset.scrollLockedBy = Array.from(owners).join(",");
  }
};

/**
 * Libera el scroll de la página.
 * @param owner Identificador único del componente que solicita la liberación.
 */
export const unlockScroll = (owner: string) => {
  if (typeof document === "undefined") return;

  owners.delete(owner);

  if (owners.size === 0) {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    delete document.documentElement.dataset.scrollLocked;
    delete document.documentElement.dataset.scrollLockedBy;
  }
};

/**
 * Verifica si el scroll está bloqueado.
 */
export const isScrollLocked = (): boolean => {
  if (typeof document === "undefined") return false;
  return !!document.documentElement.dataset.scrollLocked;
};

/**
 * Verifica si el scroll está bloqueado por alguien que NO sea el owner indicado.
 * Útil para que un componente que ya tiene el lock no se bloquee a sí mismo.
 *
 * Ejemplo: ScrollExpandMedia usa 'scroll-expand-hero'. Al verificar si debe
 * ignorar eventos de scroll, no quiere ignorarlos cuando ÉL MISMO tiene el lock
 * (que es el caso normal durante la animación). Solo debe ignorarlos cuando
 * un overlay externo (ChatDrawer, EnrollmentModal, etc.) tiene el lock.
 *
 * @param ownOwner Identificador del componente que hace la consulta.
 * @returns true si hay OTRO componente (además de ownOwner) que tiene el lock.
 */
export const isScrollLockedByOther = (ownOwner: string): boolean => {
  if (typeof document === "undefined") return false;
  return Array.from(owners).some((o) => o !== ownOwner);
};


/**
 * Obtiene la posición de scroll actual de forma segura para SSR.
 */
export const getSafeScrollY = (): number => {
  if (typeof window === "undefined") return 0;
  return window.scrollY;
};

/**
 * Fuerza el scroll a la parte superior de la página de forma instantánea.
 */
export const scrollToTop = () => {
  if (typeof window === "undefined") return;
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
};
