# PRP-036: LinkedIn Post Generator (Admin AI)

> **Estado**: APROBADO
> **Fecha**: 2026-04-03
> **Proyecto**: Kia Intelligence

---

## Objetivo

Implementar un generador de contenido AI en el panel de administrador que permita replicar estilos de posts de LinkedIn (a partir de posts de referencia) aplicando el tono de "Élite/Anti-Agencia" de Kia Intelligence y un objetivo de conversión específico.

## Por Qué

| Problema | Solución |
|----------|----------|
| Crear copys de alta conversión para LinkedIn tomando en cuenta el tono de marca y frameworks (PAS/AIDA) toma mucho tiempo manual. | Un sistema integrado en el Admin que recibe posts de referencia y un tema, y usa LLMs para estructurar el post perfecto instantáneamente. |

**Valor de negocio**: Ahorra horas semanales de creación de contenido, garantiza 100% de consistencia con el tono de voz élite de KIA y maximiza la adquisición de leads B2B desde LinkedIn (la fuente principal de tráfico de la landing). Implementa la regla 80/20 (20% esfuerzo = 80% resultados).

## Qué

### Criterios de Éxito
- [ ] UI en `/admin/linkedin` (o sección integrada) con inputs para 1-3 posts de referencia, tema central, y objetivo (ej. Autoridad, Agitación, Venta).
- [ ] Integración con Vercel AI SDK + OpenRouter para procesar el prompt con el sistema.
- [ ] El prompt del sistema enforcea el estilo de `BUSINESS_LOGIC.md` y `COPYWRITING.md` (Framework PAS, test de la amiga María, anti-status quo).
- [ ] Botón de "Generar" que devuelve la salida vía streaming.
- [ ] Posibilidad de copiar al portapapeles el resultado.

### Comportamiento Esperado
1. El admin entra a la sección de LinkedIn en el panel administrativo.
2. Pega el texto de 1 a 3 posts de LinkedIn que resultaron virales o que tienen un estilo a replicar.
3. Especifica el tema del cual quiere hablar (ej. "Los problemas de depender de programadores lentos").
4. Elige un framework u objetivo (ej. "Agitación de problema (PAS)").
5. Clica en "Generar Post AI".
6. El sistema llama a OpenRouter y muestra el post generado línea por línea.
7. El admin copia el resultado optimizado y listo para publicar.

---

## Contexto

### Referencias
- `BUSINESS_LOGIC.md` y `.docs/COPYWRITING.md` para el sistema de prompts.
- `src/app/api/chat/route.ts` para integración con OpenRouter.
- Base de UI existente en `src/app/admin/`.

### Arquitectura Propuesta (Feature-First)
```
src/features/admin-linkedin/
├── components/
│   ├── LinkedinPostGenerator.tsx  # Main UI
│   └── PromptConfig.ts            # Definición del system prompt y reglas lógicas
├── services/
│   └── linkedin-ai-service.ts     # Integración con `useCompletion` u API
└── types/
    └── index.ts                   # Types de Generador (Inputs)
```

### Modelo de Datos (si aplica)
*Para la meta inicial (20% de esfuerzo) NO se requiere base de datos (se usa el estado y clipboard). En fases posteriores se puede agregar persistencia si se solicitase guardar el histórico.*

---

## Blueprint (Assembly Line)

> IMPORTANTE: Solo definir FASES. Las subtareas se generan al entrar a cada fase
> siguiendo el bucle agéntico (mapear contexto → generar subtareas → ejecutar)

### Fase 1: Setup UI & Contexto
**Objetivo**: Crear la interfaz gráfica del generador de posts de LinkedIn en el Admin panel y configurar el layout.
**Validación**: La ruta `/admin/linkedin` existe, muestra el formulario (Posts de referencia, Tema, Objetivo) visualmente adaptado al Dark Glassmorphism del proyecto, y valida los campos con Zod/React Hook Form.

### Fase 2: Motor de AI & Prompts (El Core de Valor)
**Objetivo**: Construir el System Prompt basado en `COPYWRITING.md` y conectar con un server action o route handler (Vercel AI SDK).
**Validación**: Las pruebas de API devuelven streams de texto donde la IA respeta los posts de referencia, usa tono "Élite" y rechaza el AI Slop.

### Fase 3: Integración End-to-End
**Objetivo**: Conectar la UI de Fase 1 con la API de Fase 2, manejando estados de carga y streaming.
**Validación**: Al dar clic en "Generar", el post aparece gradualmente con streaming, se puede copiar al clipboard y no rompe el hilo principal de Node/Nextjs.

### Fase N: Validación Final
**Objetivo**: Sistema funcionando end-to-end listo para generar contenido.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] `npm run build` exitoso.
- [ ] Se genera un post de prueba satisfactorio desde la UI y se puede copiar.

---

## 🧠 Aprendizajes (Self-Annealing / Neural Network)

> Esta sección CRECE con cada error encontrado durante la implementación.
> El conocimiento persiste para futuros PRPs. El mismo error NUNCA ocurre dos veces.

### [YYYY-MM-DD]: [Título del aprendizaje]
- **Error**: [Qué falló]
- **Fix**: [Cómo se arregló]
- **Aplicar en**: [Dónde más aplica este conocimiento]

---

## Gotchas

> Cosas críticas a tener en cuenta ANTES de implementar

- [ ] Las APIs de Vercel AI SDK pueden entrar en Timeout si el prompt de referencia es absurdamente largo.
- [ ] Proteger la ruta bajo el layout de admin actual (`layout.tsx` the `/admin/`).

## Anti-Patrones

- NO añadir configuraciones de hiperparámetros de modelo (temperatura, Top_P) a la interfaz del Admin (agregar sólo fricción, hacer hardocde de los valores óptimos).
- NO guardar todo al instante en DB para no sobre-apabullar el requerimiento 20/80 inicial.

---

*PRP pendiente aprobación. No se ha modificado código.*
