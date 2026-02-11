# 🥋 MMA Landing Copywriter - Configuración para tu Proyecto

## 🚀 Instalación Completa

La skill ya está configurada en tu proyecto MMA en: `/home/nerick_ods/mma1/.claude/skills/mma-landing-copywriter/`

## 💻 Comandos para Usar Inmediatamente

### 1. Activar la Skill en Claude
```
skill: "mma-landing-copywriter"
```

### 2. Analizar tu Audiencia
```bash
cd .claude/skills/mma-landing-copywriter
python scripts/analyze_audience.py --persona="beginner" --age="25-35" --goal="fitness" --strategy
```

### 3. Generar Hero Copy
```bash
python scripts/generate_hero.py --style="transformation" --emotion="empowerment" --martial-art="MMA" --gym-name="Tu Nombre" --timeframe="90 days"
```

## 🎯 Ejemplos para tu Landing MMA

### Para generar copy completo:
```bash
# Hero section para principiantes:
python scripts/generate_hero.py --style="transformation" --emotion="empowerment" --gym-name="Elite MMA" --members=250

# Para competidores:
python scripts/generate_hero.py --style="competition" --emotion="achievement" --martial-art="MMA"

# Variaciones A/B testing:
python scripts/generate_hero.py --variations=3 --style="transformation"
```

### Para análisis de audiencia:
```bash
# Análisis completo para jóvenes fitness:
python scripts/analyze_audience.py --persona="beginner" --age="25-35" --goal="fitness" --strategy

# Para competidores serios:
python scripts/analyze_audience.py --persona="competitor" --age="18-25" --goal="competition"
```

## 📁 Recursos Disponibles

### Bases de Datos:
- `references/headlines_database.txt` - 200+ titulares probados
- `references/psychology_triggers.md` - Psicología del consumidor MMA

### Scripts:
- `analyze_audience.py` - Análisis profundo de audiencia
- `generate_hero.py` - Generador de hero sections

## 🔄 Flujo de Trabajo Recomendado

1. **Analiza tu audiencia actual**
2. **Genera hero copy personalizado**
3. **Crea variaciones A/B testing**
4. **Usa psychology triggers en todo el copy**

## 🎪 Todo está listo para usar!

La skill está completamente funcional y personalizada para tu proyecto MMA.