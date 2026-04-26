# PRP-020: BenefitsList — Pre-Loading Entry Scroll

## Objetivo
Optimizar la entrada de la sección "Resultados Tangibles" para que la Tarjeta 1 complete su carga de color *antes* de que la sección se bloquee (sticky). Al momento del bloqueo (cuando el contenedor llega al `top-0`), la Tarjeta 1 ya debe estar al 100% y la Tarjeta 2 debe empezar a cargar inmediatamente.

## Por Qué (Valor de Negocio)
- **Impacto Inmediato**: El usuario ya ve contenido "vivo" (colorido) apenas la sección termina de entrar en el viewport.
- **Transición Dinámica**: Elimina el estado estático al inicio del sticky. La animación de "carga" empieza en el área de pre-lectura, preparando el terreno para la Tarjeta 2.
- **Profesionalismo Audiovisual**: Imita el ritmo de los vídeos de producto donde la acción empieza un poco antes de que la cámara se detenga.

## Criterios de Éxito
- [ ] **Pre-Carga Tarjeta 1**: El llenado de la Tarjeta 1 ocurre entre que la sección entra al viewport y el momento del bloqueo.
- [ ] **Sincronización de Bloqueo**: Al llegar al sticky lock (`top-0`), la Tarjeta 1 está al 100%.
- [ ] **Inicio inmediato Tarjeta 2**: La Tarjeta 2 empieza su carga exactamente al iniciar el periodo sticky.
- [ ] **Título en posición**: El título "Resultados Tangibles" se asienta justo al momento del bloqueo.

## Comportamiento Esperado (Happy Path)
1. El usuario hace scroll hacia la sección.
2. Mientras la sección "sube" hacia el tope, la Tarjeta 1 se llena del 0% al 100%.
3. En el instante preciso en que la sección se detiene (sticky lock), la Tarjeta 1 brilla al 100% y el título está fijo.
4. Al seguir scrolleando (en estado sticky), la Tarjeta 2 empieza a llenarse.

## Contexto Técnico
- **Archivo**: `src/features/landing-page/components/BenefitsList.tsx`
- **Offset del useScroll**: Necesitamos ampliar el rango para detectar la entrada pre-sticky.
  - Actual: `offset: ["start start", "end end"]` (Solo detecta durante el sticky).
  - Propuesto: `offset: ["start 80%", "end end"]` o usar dos hooks separados.
- **Mapeo de Rangos**:
  - `Sticky point` ocurre cuando la sección ha avanzado un porcentaje inicial del nuevo rango.
  - Ejemplo con 3 beneficios:
    - Card 1: `[-0.1, 0.0]` (relativo al sticky point).
    - Card 2: `[0.0, 0.5]` (de la duración sticky).
    - Card 3: `[0.5, 1.0]` (de la duración sticky).

## Blueprint de Fases

### Fase 1: Reconfiguración del Hook useScroll
- Cambiar el offset de `sectionRef` para capturar la entrada desde que el `start` de la sección está al `80%` del viewport (o similar).
- Identificar matemáticamente el punto exacto donde la sección se bloquea en el nuevo `scrollYProgress`.

### Fase 2: Redefinición de los Rangos de CardBenefit
- Asignar la Tarjeta 1 al tramo "pre-bloqueo".
- Dividir las Tarjetas 2 y 3 en el tramo "sticky".

### Fase 3: Ajuste Atmosférico y Validación
- Sincronizar el título para que complete su `y` y `opacity` al final del tramo de la Tarjeta 1.
- Validar fluidez en mobile.

---

## Aprendizajes (Auto-Blindaje)
- *A completar tras la implementación*
