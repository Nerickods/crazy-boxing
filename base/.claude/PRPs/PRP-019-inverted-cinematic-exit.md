# PRP-019: Inverted Cinematic Exit for ProcessSection

## 🎯 Objetivo
Replicar el efecto de transición simétrica al final de la `ProcessSection`, creando una cápsula visual completa ("Pod-style"). Esto implica redondear la parte inferior, rellenar los huecos laterales con negro sólido y asegurar una salida fluida hacia la siguiente sección.

## 🛠️ Tecnologías y Metodología
- **Tailwind CSS**: `rounded-b`, `border-b`.
- **CSS Alpha Masks**: `radial-gradient` invertido para los "Bottom Corner Fillers".
- **Framer Motion**: (Opcional) para suavizar la visibilidad de la salida.

## 🏗️ Cambios Propuestos

### Componente: [ProcessSection.tsx](file:///home/nerick_ods/solutions/landing-linkedin/src/features/landing-page/components/ProcessSection.tsx)

#### 1. Configuración de Cápsula
- Cambiar `rounded-t-[...]` por `rounded-[...]` completo en el contenedor principal.
- Añadir `border-b` para cerrar el marco visual.

#### 2. Implementación de Bottom Fillers
- **Mobile (2.5rem)**:
    - Esquina Inferior Izquierda: `mask-image: radial-gradient(circle at 100% 0%, transparent 2.5rem, black 2.5rem)`
    - Esquina Inferior Derecha: `mask-image: radial-gradient(circle at 0% 0%, transparent 2.5rem, black 2.5rem)`
- **Desktop (4rem)**:
    - Esquina Inferior Izquierda: `mask-image: radial-gradient(circle at 100% 0%, transparent 4rem, black 4rem)`
    - Esquina Inferior Derecha: `mask-image: radial-gradient(circle at 0% 0%, transparent 4rem, black 4rem)`

#### 3. Zona de Salida (Exit Zone)
- Inyectar un `div` de `bg-black` al final de la sección para conectar con el footer o la siguiente sección, eliminando cualquier "stuttering" de fondo en el scroll.

## 🧪 Plan de Verificación
1. **Inspección de Esquinas**: Verificar que no hay "triángulos de estrellas" en la parte inferior.
2. **Build Test**: `npm run build` para asegurar estabilidad.
3. **Responsive Check**: Validar que el radio de curvatura cambia correctamente entre mobile y desktop.

---
¿Le damos fuego a esta "cápsula" cinemática, hermano?
