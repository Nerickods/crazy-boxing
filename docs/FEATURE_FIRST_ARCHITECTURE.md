# 🏗️ Feature-First Architecture - Crazy Boxing

Documentación completa de la arquitectura Feature-First implementada, optimizada para desarrollo asistido por IA y mantenibilidad a escala.

## 📋 Overview

La arquitectura **Feature-First** organiza el código por funcionalidades de negocio en lugar de por capas técnicas. Cada feature contiene todo lo necesario para funcionar independientemente.

### 🎯 Beneficios Clave

- **Contexto completo**: Todo relacionado en un solo lugar
- **Independencia**: Features pueden desarrollarse en paralelo
- **Mantenibilidad**: Cambios localizados a una feature
- **IA-Optimized**: Los asistentes de IA entienden el contexto fácilmente
- **Escalabilidad**: Añadir features sin afectar código existente

## 🏛️ Estructura de Directorios

### Arquitectura Completa (IMPLEMENTADA)

```
src/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout con SEO optimizado
│   ├── page.tsx                   # Home page con Hero refactorizado
│   ├── page-complex.tsx           # Version avanzada
│   ├── page-with-motion.tsx       # Version con animaciones enhanced
│   └── globals.css                # CSS global con variables doradas
│
├── features/                      # 🎯 Features por funcionalidad
│   ├── hero/                      # Feature: Hero Section ✅
│   │   ├── components/
│   │   │   ├── HeroSection.tsx    # Componente principal (160 líneas)
│   │   │   └── HeroExample.tsx    # Ejemplo de implementación
│   │   ├── hooks/
│   │   │   ├── useHeroAnimations.ts # Animaciones centralizadas
│   │   │   └── useCarouselAnimation.ts # Animaciones carrusel
│   │   ├── services/
│   │   │   └── heroData.ts        # Datos y manejo de imágenes
│   │   ├── types/
│   │   │   └── hero.ts            # Interfaces TypeScript
│   │   └── index.ts               # Export público de feature
│   │
│   └── trainers/                  # Feature: Trainers Management ✅
│       ├── components/
│       │   ├── TrainersSection.tsx    # Sección principal
│       │   ├── TrainerCard.tsx        # Card premium (588 líneas)
│       │   ├── TrainerModal.tsx       # Modal de detalles
│       │   └── TrainerFilters.tsx     # Sistema de filtrado
│       ├── hooks/
│       │   ├── useTrainers.ts         # Lógica centralizada
│       │   ├── useTrainerModal.ts     # Manejo de modales
│       │   └── useFavoriteTrainers.ts # Estado de favoritos
│       ├── services/
│       │   ├── trainersData.ts        # Datos y utilidades
│       │   └── trainerApi.ts          # API calls (si aplica)
│       ├── types/
│       │   ├── trainers.ts            # Interfaces TypeScript
│       │   └── trainer-types.ts       # Tipos específicos
│       └── index.ts                   # Export público
│
└── shared/                        # 🚀 Código compartido ultra-optimizado
    ├── stores/
    │   └── appStore.ts           # Zustand global (273 líneas) ✅
    │
    ├── constants/
    │   └── visual.ts              # 🎨 Visual Design System (414 líneas) ✅
    │
    ├── animations/
    │   └── index.ts               # 🎬 Framer Motion presets (345 líneas) ✅
    │
    ├── components/
    │   └── LazyImage.tsx          # 🖼️ Performance image component (151 líneas) ✅
    │
    ├── types/                     # Tipos compartidos entre features
    │   ├── common.ts              # Tipos comunes
    │   └── api.ts                 # API response types
    │
    ├── utils/                     # Utilidades genéricas
    │   ├── format.ts              # Funciones de formato
    │   └── validation.ts          # Utilidades de validación
    │
    └── lib/                       # Configuraciones
        ├── api.ts                 # Configuración de API
        └── config.ts              # Configuraciones generales
```

## 🎯 Feature Structure Pattern

### Plantilla de Feature (Template)

Cada feature sigue esta estructura exacta:

```
src/features/[feature-name]/
├── components/           # 🧩 UI Components específicos
├── hooks/               # 🎣 Custom hooks de lógica
├── services/            # 🔌 API calls y data fetching
├── types/               # 📝 TypeScript interfaces
├── utils/               # 🛠️ Utilidades específicas de la feature
└── index.ts             # 📤 Export público
```

### 1. Components - UI Layer

**Propósito**: Componentes React específicos de la feature

**Ejemplo - TrainerCard.tsx**:
```typescript
// src/features/trainers/components/TrainerCard.tsx
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { TrainerCardProps } from '../types/trainers';
import { useTrainerModal } from '../hooks/useTrainers';
import { cardEntrance, cardHover } from '@/shared/animations';
import { colors, shadows } from '@/shared/constants/visual';

export const TrainerCard: React.FC<TrainerCardProps> = memo(({
  trainer,
  variant = 'default',
  onClick
}) => {
  const { openTrainerDetails } = useTrainerModal();

  return (
    <motion.div
      variants={cardEntrance}
      initial="initial"
      animate="animate"
      whileHover={cardHover.whileHover}
      onClick={() => onClick?.(trainer)}
      style={{
        background: gradients.dark.card,
        boxShadow: shadows.lg
      }}
    >
      {/* Component implementation */}
    </motion.div>
  );
});

TrainerCard.displayName = 'TrainerCard';
```

**Rules**:
- ✅ SIEMPRE usar `memo()` para performance
- ✅ SIEMPRO tipar interfaces con `types/` de la feature
- ✅ SIEMPRE importar sistemas compartidos primero
- ✅ SIEMPRE usar animaciones de `@/shared/animations`
- ✅ SIEMPRE usar visual system de `@/shared/constants/visual`

### 2. Hooks - Logic Layer

**Propósito**: Lógica de negocio y estado local de la feature

**Ejemplo - useTrainers.ts**:
```typescript
// src/features/trainers/hooks/useTrainers.ts
import { useState, useCallback, useMemo } from 'react';
import { Trainer, TrainerFilters } from '../types/trainers';
import { trainersData } from '../services/trainersData';
import { useAppStore } from '@/shared/stores/appStore';

export const useTrainers = () => {
  const [trainers, setTrainers] = useState<Trainer[]>(trainersData);
  const [filters, setFilters] = useState<TrainerFilters>({});
  const loading = useAppStore((state) => state.ui.loading);

  const filteredTrainers = useMemo(() => {
    return trainers.filter(trainer => {
      // Filter logic
      return true;
    });
  }, [trainers, filters]);

  const handleFilterChange = useCallback((newFilters: Partial<TrainerFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    trainers: filteredTrainers,
    filters,
    loading,
    handleFilterChange
  };
};
```

**Rules**:
- ✅ SIEMPRE usar `useCallback` y `useMemo` para performance
- ✅ SIEMPRE tipar return values
- ✅ SIEMPRE usar estado global cuando aplica
- ✅ SIEMPRO manejar loading y error states

### 3. Services - Data Layer

**Propósito**: API calls, data fetching y transformación de datos

**Ejemplo - trainersData.ts**:
```typescript
// src/features/trainers/services/trainersData.ts
import { Trainer, Discipline, ExperienceLevel } from '../types/trainers';

// Static data (can be replaced with API calls)
export const trainersData: Trainer[] = [
  {
    id: '1',
    name: 'John Smith',
    role: 'Head MMA Coach',
    bio: 'Professional fighter with 15+ years experience...',
    disciplines: [Discipline.MMA, Discipline.BOXING],
    experience: ExperienceLevel.ELITE,
    rating: 4.9,
    reviewCount: 127,
    // ... rest of trainer data
  }
  // ... more trainers
];

// Utility functions
export const getDisciplineDisplayName = (discipline: Discipline): string => {
  const disciplineNames = {
    [Discipline.MMA]: 'MMA',
    [Discipline.BOXING]: 'Boxeo',
    // ... other disciplines
  };
  return disciplineNames[discipline] || discipline;
};

export const formatPrice = (price: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price);
};
```

**Rules**:
- ✅ SIEMPRE exportar data y utilidades por separado
- ✅ SIEMPRE tipar todas las funciones
- ✅ SIEMPRE incluir fallback data
- ✅ SIEMPRE manejar errores en API calls

### 4. Types - Type System

**Propósito**: Interfaces TypeScript específicas de la feature

**Ejemplo - trainers.ts**:
```typescript
// src/features/trainers/types/trainers.ts
export enum Discipline {
  MMA = 'mma',
  BOXING = 'boxing',
  MUAY_THAI = 'muay-thai',
  JIU_JITSU = 'jiu-jitsu',
  GRAPPLING = 'grappling',
  KICKBOXING = 'kickboxing'
}

export enum ExperienceLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  PROFESSIONAL = 'professional',
  ELITE = 'elite'
}

export interface Trainer {
  id: string;
  name: string;
  nickname?: string;
  role: string;
  bio: string;
  disciplines: Discipline[];
  experience: ExperienceLevel;
  rating: number;
  reviewCount: number;
  featured: boolean;
  image: string;
  socialMedia: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
  stats: {
    studentsCount: number;
    championsTrained: number;
    yearsActive: number;
  };
  pricing: {
    privateSession: Array<{
      duration: number; // in minutes
      price: number;
      currency: string;
    }>;
    groupSession?: Array<{
      duration: number;
      price: number;
      maxParticipants: number;
    }>;
  };
}

export interface TrainerFilters {
  disciplines?: Discipline[];
  experience?: ExperienceLevel[];
  priceRange?: {
    min: number;
    max: number;
  };
  featured?: boolean;
}

export interface TrainerCardProps {
  trainer: Trainer;
  variant?: 'default' | 'compact' | 'featured';
  showQuickActions?: boolean;
  animationDelay?: number;
  onClick?: (trainer: Trainer) => void;
  className?: string;
}
```

**Rules**:
- ✅ SIEMPRE usar interfaces para object shapes
- ✅ SIEMPRE usar enums para valores fijos
- ✅ SIEMPRE hacer propiedades opcionales con `?`
- ✅ SIEMPRE exportar todos los tipos usados por components

### 5. Index File - Public API

**Propósito**: Export público limpio de la feature

**Ejemplo - index.ts**:
```typescript
// src/features/trainers/index.ts

// Components
export { TrainerCard } from './components/TrainerCard';
export { TrainerModal } from './components/TrainerModal';
export { TrainerFilters } from './components/TrainerFilters';
export { TrainersSection } from './components/TrainersSection';

// Hooks
export { useTrainers } from './hooks/useTrainers';
export { useTrainerModal } from './hooks/useTrainerModal';
export { useFavoriteTrainers } from './hooks/useFavoriteTrainers';

// Types
export type {
  Trainer,
  TrainerFilters,
  TrainerCardProps
} from './types/trainers';

export {
  Discipline,
  ExperienceLevel
} from './types/trainers';

// Services
export { trainersData, getDisciplineDisplayName, formatPrice } from './services/trainersData';
```

**Rules**:
- ✅ SIEMPRE exportar components, hooks, types y services
- ✅ SIEMPRE mantener imports limpios y específicos
- ✅ NO exportar implementaciones internas
- ✅ SIEMPRE usar `export type` para types-only exports

## 🔄 Shared Dependencies

### Visual System
Ubicación: `src/shared/constants/visual.ts`

**Import en Features**:
```typescript
import { colors, typography, spacing, shadows, goldTheme } from '@/shared/constants/visual';
```

### Animation System
Ubicación: `src/shared/animations/index.ts`

**Import en Features**:
```typescript
import { fadeInUp, scaleIn, cardHover, goldenPulse } from '@/shared/animations';
```

### State Management
Ubicación: `src/shared/stores/appStore.ts`

**Import en Features**:
```typescript
import { useAppStore, useUIState, useIsAuthenticated } from '@/shared/stores/appStore';
```

### Performance Components
Ubicación: `src/shared/components/`

**Import en Features**:
```typescript
import LazyImage from '@/shared/components/LazyImage';
```

## 🚀 Crear Nueva Feature

### Paso 1: Crear Estructura

```bash
# Crear directorios
mkdir -p src/features/my-awesome-feature/{components,hooks,services,types,utils}

# Crear archivos base
touch src/features/my-awesome-feature/components/index.ts
touch src/features/my-awesome-feature/hooks/index.ts
touch src/features/my-awesome-feature/services/index.ts
touch src/features/my-awesome-feature/types/index.ts
touch src/features/my-awesome-feature/index.ts
```

### Paso 2: Implementar Types

```typescript
// src/features/my-awesome-feature/types/my-feature.ts
export interface MyFeatureProps {
  // Define props
}

export interface MyFeatureState {
  // Define state shape
}
```

### Paso 3: Implementar Component

```typescript
// src/features/my-awesome-feature/components/MyFeature.tsx
import React, { memo } from 'react';
import { MyFeatureProps } from '../types/my-feature';
import { fadeInUp } from '@/shared/animations';

export const MyFeature: React.FC<MyFeatureProps> = memo((props) => {
  return (
    <motion.div variants={fadeInUp}>
      {/* Component implementation */}
    </motion.div>
  );
});
```

### Paso 4: Implementar Hook

```typescript
// src/features/my-awesome-feature/hooks/useMyFeature.ts
import { useState, useCallback } from 'react';

export const useMyFeature = () => {
  // Hook implementation
  return {};
};
```

### Paso 5: Export Público

```typescript
// src/features/my-awesome-feature/index.ts
export { MyFeature } from './components/MyFeature';
export { useMyFeature } from './hooks/useMyFeature';
export type { MyFeatureProps } from './types/my-feature';
```

## 🎯 Best Practices

### ✅ SIEMPRE HACER

1. **Seguir estructura exacta** de directorios
2. **Importar sistemas compartidos primero**
3. **Usar tipos de la feature para components**
4. **Implementar memo() en components pesados**
5. **Usar useCallback/useMemo en hooks**
6. **Exportar API limpia en index.ts**
7. **Manejar loading y error states**
8. **Usar animaciones del sistema centralizado**

### ❌ NUNCA HACER

1. **Crear features sin estructura definida**
2. **Hardcodear valores (usar visual system)**
3. **Imports relativos profundos**
4. **Tipos `any` sin justificación**
5. **Componentes sin memoización**
6. **Exports desorganizados en index.ts**
7. **Manejo de estados inconsistentes**
8. **Animaciones inline sin sistema centralizado**

## 🔀 Comunicación entre Features

### 1. Shared State (Global)

```typescript
// Para estado global usar appStore
const userState = useAppStore((state) => state.user);
const globalLoading = useAppStore((state) => state.ui.loading);
```

### 2. Props Drilling

```typescript
// Para comunicación padre-hijo directa
<ParentFeature>
  <ChildFeature onData={handleData} />
</ParentFeature>
```

### 3. Custom Events

```typescript
// Para comunicación desacoplada
const useFeatureEvents = () => {
  const emitFeatureEvent = useCallback((event: string, data: any) => {
    // Custom event implementation
  }, []);

  return { emitFeatureEvent };
};
```

## 📏 Métricas y Monitoreo

### Feature Performance Metrics

- **Bundle Size**: Cada feature debe ser < 50KB gzipped
- **Load Time**: Components deben cargar en < 100ms
- **Interaction Time**: Interacciones < 16ms (60fps)
- **Memory Usage**: Sin memory leaks en features

### Code Quality Metrics

- **Test Coverage**: > 80% por feature
- **TypeScript Strict**: Cero errores `any`
- **Cyclomatic Complexity**: < 10 por función
- **Lines per Component**: < 500 líneas

---

**Feature-First Architecture v1.0** | Crazy Boxing 🥊✨

*Esta arquitectura está diseñada para maximizar productividad, mantenibilidad y optimización para desarrollo asistido por IA.*