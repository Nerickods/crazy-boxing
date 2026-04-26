# PRP-067: Corrección del Bug de Scroll y Visibilidad del Footer en Móviles

## 1. Problema Identificado (User Context)
En dispositivos móviles (especialmente Safari en iOS y Chrome en Android), la landing page presenta un problema visual y de experiencia de usuario al llegar a la sección final de "Call to Action" y el pie de página (`LandingCta.tsx` y `Footer.tsx`). 

Cuando el usuario llega al final natural del scroll de la página, el Footer y la parte inferior del CTA quedan parcial o totalmente ocultos detrás de la interfaz del navegador (la barra de direcciones o navegación inferior). Para poder visualizar el contenido completo (como los enlaces del pie de página y el copyright), el usuario se ve obligado a realizar un "sobre-scroll" (overscroll) forzado para retraer la barra del navegador.

## 2. Investigación y Causa Raíz
El origen del problema se encuentra en la gestión de la altura del contenedor principal de la animación final en `src/features/landing-page/components/LandingCta.tsx`.

Actualmente, el contenedor utiliza la clase de Tailwind `h-screen`:
```tsx
<motion.div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
```

### Por qué falla `h-screen` en móviles:
- `h-screen` se compila a la regla CSS `height: 100vh`.
- En los navegadores móviles modernos, `100vh` representa el alto de la pantalla **asumiendo que la barra dinámica del navegador está retraída u oculta**.
- Cuando la barra del navegador está visible (lo cual suele suceder al hacer scroll hacia arriba o al detenerse de cierta forma), el viewport *real visible* es menor a `100vh`. 
- Como el contenedor `sticky` mide `100vh` pero el espacio real es menor, la parte inferior del contenedor (donde está anclado el `Footer` con `absolute bottom-0`) es empujada debajo del área visible de la pantalla, quedando escondida detrás de la UI del navegador.

## 3. Blueprint de la Solución
Para solucionar de raíz este problema, debemos migrar del uso de Unidades de Viewport Estáticas (`vh`) a **Unidades de Viewport Dinámicas (`dvh`)** o **Pequeñas (`svh`)**.

### Solución Principal:
Reemplazar `h-screen` por `h-[100dvh]` en el contenedor "sticky" de `LandingCta.tsx`.
- **`dvh` (Dynamic Viewport Height):** Esta unidad se adapta dinámicamente: es más pequeña cuando la barra del navegador está visible y se expande cuando la barra se oculta. Esto garantiza que el contenido absoluto pegado al fondo (`bottom-0`) siempre esté exactamente al borde del área visible real del dispositivo.

*Nota adicional:* Durante la investigación de este bug, también se detectó que componentes como `HeroSection.tsx` y `PasSection.tsx` hacen uso de `h-screen`. Aunque en esas secciones el impacto puede ser menor, sería recomendable en un futuro reemplazarlos por `min-h-[100dvh]` para maximizar la consistencia en la experiencia móvil. Para este PRP, nos enfocaremos estrictamente en el Footer / LandingCta.

## 4. Specs de Implementación (Paso a Paso)

**Archivo objetivo:**
`src/features/landing-page/components/LandingCta.tsx`

**Modificación requerida:**
Localizar el `motion.div` que envuelve toda la sección del CTA y sirve de anclaje `sticky`.

**De (código actual):**
```tsx
<motion.div 
  style={{
    backgroundColor: containerBg,
    willChange: "transform, opacity",
  }}
  className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden"
>
```

**A (código refactorizado):**
```tsx
<motion.div 
  style={{
    backgroundColor: containerBg,
    willChange: "transform, opacity",
  }}
  className="sticky top-0 h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden"
>
```

Con este cambio, la altura se adaptará correctamente y el `<Footer />` integrado dentro del `motion.div` con clase `absolute bottom-0` nunca quedará oculto por el navegador.

## 5. Plan de Verificación (Testing)
1. **Despliegue Local:** Ejecutar `npm run dev` y acceder desde un dispositivo móvil real (iOS Safari recomendado) o emular la vista con comportamiento de móvil en Chrome DevTools (asegurándose de habilitar o simular la barra de direcciones dinámica).
2. **Prueba de Scroll Normal:** Deslizarse hasta el fondo de la landing page de manera natural (sin arrastrar exageradamente hacia arriba).
3. **Verificación Visual:** Comprobar que el texto legal del pie de página ("© 2026 KIA Intelligence...") sea visible inmediatamente, sin necesidad de hacer overscroll.
4. **Validación de la Animación:** Asegurar que las animaciones manejadas por Framer Motion (`smoothProgress` / `scrollYProgress`) no presenten saltos (jank) al cambiar la altura del navegador de forma dinámica (`dvh`). Si `dvh` generase un recálculo molesto al retraer la barra en iOS, la alternativa secundaria (y validada como segura) es usar `h-[100svh]`.
