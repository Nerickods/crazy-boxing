# PRP-062: Estrategia de Urgencia Crítica y Roadmap de Precios

> **Estado**: PENDIENTE
> **Fecha**: 2026-04-14
> **Proyecto**: KIA Intelligence

---

## Objetivo

Implementar una narrativa de **urgencia extrema y exclusividad** en todo el ecosistema de KIA Intelligence, estableciendo una limitación estricta de 2 proyectos por mes e introduciendo una garantía de "tarifa bloqueada" ante un inminente aumento de precios por alta demanda y especialización.

## Por Qué

| Problema | Solución |
|----------|----------|
| Falta de presión para la toma de decisiones inmediata. | Anclaje de precio actual como una "oportunidad limitada" que expirará. |
| El prospecto puede procastinar el contacto. | Escasez real (2 cupos) + Advertencia de aumento de precios futuro. |
| Percepción de servicio "commodity". | Posicionamiento como servicio de élite artesanal con roadmaps de precios crecientes. |

**Valor de negocio**: Aumento de la tasa de conversión en la landing page mediante el uso de disparadores psicológicos de escasez (Scarcity) y urgencia (Urgency).

## Qué

### Criterios de Éxito
- [ ] Modificación de `BUSINESS_LOGIC.md` para reflejar la nueva política de precios y cupos.
- [ ] Actualización de copies en 5 puntos estratégicos de la landing page (Hero, CTA, Garantía, Chat).
- [ ] Creación de la subpágina `/transparencia` con diseño minimalista premium.
- [ ] El asistente de IA responde con la nueva lógica de urgencia y bloqueo de precios.

### Comportamiento Esperado
1. El usuario entra a la landing y ve "Solo 2 cupos disponibles" en el Hero.
2. Al llegar a los CTAs, lee una nota densa: "Respetamos el precio actual si solicitas tu auditoría hoy. Próximo aumento por demanda: +30%".
3. Si el usuario tiene dudas, va a la subpágina de transparencia donde se explica el porqué de los 2 cupos (calidad) y el roadmap de precios (experiencia).
4. El chat refuerza que si se registran ahora, se les mantiene la oferta del sistema.

---

## Contexto

### Referencias
- `src/features/landing-page/components/HeroSection.tsx` - Ubicación de escasez inicial.
- `src/features/services/components/ServicesCta.tsx` - Punto de conversión principal.
- `BUSINESS_LOGIC.md` - Fuente de verdad.

### Arquitectura Propuesta (Feature-First)
```
src/app/(main)/transparencia/
└── page.tsx                 # Página de transparencia/ROADMAP
src/features/transparencia/
├── components/              # Componentes específicos de la explicación
└── data/                    # Textos de los términos y roadmap
```

---

## Blueprint (Assembly Line)

### Fase 1: Sincronización de Fuente de Verdad
**Objetivo**: Establecer la nueva base legal y de negocio en el documento maestro.
**Validación**: Verificación de `BUSINESS_LOGIC.md`.

### Fase 2: Inyección de Urgencia en UI (Landing)
**Objetivo**: Modificar Hero, Secciones de Garantía y CTAs con el nuevo mensaje de escasez y garantía de precio.
**Validación**: Inspección visual de componentes modificados.

### Fase 3: Construcción de Subpágina "Transparencia"
**Objetivo**: Crear una página dedicada a explicar el valor del servicio, la limitación de cupos y el aumento gradual de precios.
**Validación**: Ruta `/transparencia` accesible y responsive.

### Fase 4: Actualización del Cerebro de Ventas (IA)
**Objetivo**: Entrenar al chat para que sea proactivo con la oferta de "proteger el precio actual".
**Validación**: Test de conversación con el ChatBot.

### Fase 5: Validación Final
**Objetivo**: Sistema funcionando end-to-end con coherencia en todos los mensajes.
**Validación**:
- [ ] `npm run typecheck` pasa.
- [ ] Consistencia de mensajes (no hay contradicciones de 2 vs N cupos).

---

## 🧠 Aprendizajes (Self-Annealing)

### [2026-04-14]: Diseño de Urgencia Minimalista
- **Error**: Añadir demasiada urgencia puede parecer "spammy".
- **Fix**: Usar tipografía pequeña, bold y colores de acento (Emerald/Cyan) pero en áreas de "micro-copy" para mantener la autoridad.

---

## Gotchas
- [ ] La nueva subpágina debe heredar el `ShaderBackground` para coherencia visual.
- [ ] Los enlaces en el Footer deben actualizarse para incluir la nueva página.

## Anti-Patrones
- NO usar contadores regresivos falsos. La urgencia debe ser declarativa y de autoridad.
- NO cambiar el precio en el código todavía, solo anunciar el aumento futuro.

---

*PRP pendiente aprobación. No se ha modificado código.*
