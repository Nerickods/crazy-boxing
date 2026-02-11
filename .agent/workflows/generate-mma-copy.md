---
description: Generates specialized copywriting for MMA/Martial Arts landing pages using the local skill scripts.
---

# MMA Landing Page Copywriter Workflow

This workflow adapts the `.claude/skills/mma-landing-copywriter` skill for the Antigravity agent. It combines the execution of local Python scripts with AI-driven content generation for a complete landing page copy package.

## Prerequisites
- Ensure the following directory exists: `.claude/skills/mma-landing-copywriter`
- Python 3 must be installed.

## Workflow Steps

1. **Analyze Audience**
   - Ask the user for `persona` (beginner/competitor/hobbyist), `age` (e.g., 25-35), and `goal` (fitness/competition/etc.) if not provided.
   - Run the audience analyzer script:
     ```bash
     python3 .claude/skills/mma-landing-copywriter/scripts/analyze_audience.py --persona [PERSONA] --age [AGE] --goal [GOAL] --strategy
     ```
   - Save or note the output JSON and Strategy.

2. **Generate Hero Section**
   - Based on the audience analysis, choose a `style` and `emotion`.
   - Run the hero generator script:
     ```bash
     python3 .claude/skills/mma-landing-copywriter/scripts/generate_hero.py --style [STYLE] --emotion [EMOTION] --variations 3
     ```
   - Review the generated variations.

3. **Generate Additional Sections (AI-Assisted)**
   - The original skill scripts for testimonials and CTAs are missing, so use the `psychology_triggers.md` reference to generate them.
   - Read the reference file:
     ```bash
     cat .claude/skills/mma-landing-copywriter/references/psychology_triggers.md
     ```
   - **Task**: Generate 3 Testimonial placeholders and 3 CTA variations that align with the `analyze_audience.py` output strategy. Use the "Psychology Triggers" from the reference file.

4. **Compile Feature-Specific Copy**
   - For each feature in the landing page (Classes, About, Schedule), write copy that addresses the "Pain Points" identified in Step 1.
   - Use the "Objection Handlers" from the audience analysis.

5. **Final Review**
   - Present the comprehensive copy package to the user.
   - Ask for specific feedback on tone and alignment with the brand.
