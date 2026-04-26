# Product Requirements Proposal (PRP): Subpágina de Servicios

Este documento define las especificaciones para la construcción de la subpágina `/services`, alineando los requerimientos de diseño visual inspirados en un estilo "Dark Theme/Premium" con el stack de *SaaS Factory* y el flujo del *Bucle Agéntico*.

---

## 1. Diseño de Producto y Lógica de Negocio

### Objetivo
Construir una subpágina de "Servicios" (`/services`) que consolide la oferta comercial, exponga los 4 módulos existentes de la plataforma utilizando diseño interactivo y convierta el flujo hacia la acción ("Get in touch").

### Por qué (Valor de Negocio)
Permitir a los prospectos corporativos y posibles clientes entender rápidamente el ecosistema que se ofrece ("De probar IA a confiar en ella"), sin tener que saltar entre el home y los módulos detallados uno a uno. Centraliza el valor en una sola pieza de "Alta Conversión".

### Criterios de Éxito
1. **Lógica de Datos Integrada**: Uso nativo de `modulos-data.ts` (1: Vendedor IA, 2: Landing, 3: Dashboard, 4: Conectividad).
2. **Visual Fidelity**: Replicar la estética premium: fondos oscuros, tipografía moderna, acentos minimalistas en verde esmeralda, y gradientes tenues al final del sitio.
3. **Sección Interactiva Activa**: Implementación de un selector interactivo (ej. "1. Módulo", "2. Módulo") que cambia la visualización (círculos interconectados/assets e info lateral).
4. **Listado de Expertise ("What we do")**: Reordenamiento visual para mostrar los features y diferenciadores específicos de forma sobria, emulando la lista analítica de la referencia.
5. **CTA Final Gradiente**: Sección de remate full screen (Gradient verde oscuro a negro) incitando a contactar con tipografía robusta ("We build for those few").

### Comportamiento Esperado (Happy Path)
1. El lead entra a `/services`. 
2. Observa un Hero masivo: *"Transformamos IA en Ventas"* (o frase inspirada en "From Trying AI to Trusting it").
3. Hace scroll y ve una interfaz de Tabs (o similar interactivo) con 4 pasos (Los módulos de la BD local). Interactúa con ellos.
4. Sigue haciendo scroll hacia los detalles minuciosos ("What we do").
5. Llega al hero CTA final, convenciéndose del mensaje de liderazgo y pulsando el botón final de contacto.

---

## 2. Contexto de Implementación

- **Datos Localizados**: Se utilizará el archivo existente `src/shared/lib/modulos-data.ts` donde viven los 4 módulos.
- **Ruta Objetivo**: `src/app/(main)/services/page.tsx` (Se asumirá `/services` alojado bajo el layout `main`).
- **Framework**: Next.js 16 (App Router), Tailwind CSS y React.
- **Flujo**: **Bucle Agéntico (Modo Blueprint)**. Las tareas exactas se definirán "Just in Time" durante la ejecución de la fase tras mapear el contexto real de los componentes.

---

## 3. Blueprint de Fases (Sin Subtareas)

Siguiendo el rigor del `bucle-agentico` (SKILL.md), estas son las fases macro a implementar.

### Fase 1: Arquitectura de Ruta e Integración Hero Central
Creación de la página base, mapeo de estructura e implementación del Hero section inspirado en estética Dark/Terminal con copy de valor.

### Fase 2: Componente Central de Módulos (Tabs Interactivos)
Construcción del componente UI interactivo que consuma `modulos` y los exponga en el layout horizontal imitando la visualización activa de la imagen (Identify -> Vendedor IA, etc.).

### Fase 3: Sección Detallada ("What we do") + Case Studies / Diferenciadores
Estructura y renderizado de la lista detallada y vertical del expertise profundo usando los diferenciadores guardados en los módulos. Mención a casos de estudio hipotéticos o layout adaptable si se proveen imágenes.

### Fase 4: Hero CTA Final & Ensamblado (Visual Polish)
Componente de gradiente verde oscuro de salida masiva de retención, uniendo todas las partes en la página destino `/services` y validando responsiveness (Mobile First dinámico).

---

## 4. Aprendizajes (Auto-Blindaje)
_Se llenará durante el desarrollo si se detectan errores o anomalías._
