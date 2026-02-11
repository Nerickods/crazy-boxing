---
name: mma-landing-copywriter
description: Specialized copywriting skill for MMA gym landing pages. Creates compelling, conversion-focused copy using proven martial arts marketing psychology. Use when writing landing page copy for MMA, BJJ, boxing, or martial arts gyms.
license: MIT
---

# 🥋 MMA Landing Copywriter

## Purpose

Domain-specific copywriting skill designed exclusively for MMA and martial arts landing pages. This skill combines proven direct response marketing techniques with fight psychology to create compelling copy that converts visitors into members. It understands the unique mindset of martial arts practitioners and uses emotional triggers specific to combat sports.

## When to Use

Use this skill when:
- Writing landing page copy for MMA, BJJ, Muay Thai, or boxing gyms
- Creating hero sections, testimonials, or call-to-action sections
- Developing headlines, subheadlines, and body copy for martial arts websites
- Crafting email marketing copy for martial arts schools
- Writing social media ad copy for fitness studios focused on combat sports

## How to Use

### Step 1: Analyze Target Audience
Execute `scripts/analyze_audience.py` to identify the specific martial arts demographic:

```bash
# Primary MMA audience personas:
python scripts/analyze_audience.py --persona="beginner" --age="25-35" --goal="fitness"
python scripts/analyze_audience.py --persona="competitor" --age="18-25" --goal="competition"
python scripts/analyze_audience.py --persona="hobbyist" --age="30-45" --goal="stress-relief"
```

### Step 2: Choose Copy Framework
Select from `references/copy_frameworks.md`:
- **AIDA**: Attention → Interest → Desire → Action
- **PAS**: Problem → Agitation → Solution
- **FAB**: Features → Advantages → Benefits
- **Hero's Journey**: Transformation narrative

### Step 3: Generate Copy Components

#### Hero Section Copy
```bash
python scripts/generate_hero.py --style="transformation" --emotion="empowerment"
```

#### Social Proof Section
```bash
python scripts/generate_testimonials.py --authentic="true" --results="specific"
```

#### Call-to-Action Copy
```bash
python scripts/generate_cta.py --urgency="medium" --offer="free-class"
```

### Step 4: Optimize for Conversions
Use psychological triggers from `references/psychology_triggers.md`:
- **Scarcity**: "Only 5 spots left in beginner's program"
- **Authority**: "Coach John - 15x MMA Champion"
- **Social Proof**: "Join 500+ transformed members"
- **Commitment**: Start with free trial, build momentum

## Copy Templates

### Hero Section Templates

#### Template 1: Transformation Focus
```
HEADLINE: Transform Your Body & Mind in 90 Days
SUBHEADLINE: From Zero to Warrior - No Experience Needed
BODY: Stop scrolling fitness apps. Step onto the mat and discover the fighter within you. Our proven system has transformed 1,000+ everyday people into confident, disciplined martial artists.
CTA: Start Your Free Trial Today
```

#### Template 2: Competition Focus
```
HEADLINE: The Fight Doesn't Start in the Cage - It Starts Here
SUBHEADLINE: Elite Training for Aspiring Champions
BODY: Where champions are forged. Train with the best, compete with the best, become the best. Our competitive program has produced 25+ amateur and pro fighters.
CTA: Book Your Assessment Call
```

#### Template 3: Community Focus
```
HEADLINE: More Than a Gym - It's Your Fight Family
SUBHEADLINE: Join the Brotherhood/Sisterhood of Warriors
BODY: In a world of isolation, find your tribe. Train, grow, and conquer alongside people who push you to be better every single day.
CTA: Meet Your Team - Free Week Pass
```

## Psychology Triggers

### Core MMA Motivations
- **Identity Transformation**: "I am a fighter" mindset
- **Overcoming Fear**: Confronting comfort zones
- **Discipline & Control**: Gaining life mastery through training
- **Respect & Recognition**: Earning belt ranks and achievements
- **Physical Empowerment**: Self-defense confidence

### Emotional Levers
- **Pain Points**: Feeling weak, unsafe, undisciplined, stuck
- **Desire States**: Confidence, respect, fitness, community
- **Social Proof**: "If they can do it, I can too"
- **Urgency**: Limited classes, new belt cycles starting
- **Exclusivity**: Elite programs, invitation-only training

## Conversion Optimization

### Headline Formulas
- **Benefit + Timeframe**: "Get Fight-Ready in 12 Weeks"
- **Transformation + Identity**: "From Office Worker to Warrior"
- **Problem + Solution**: "Tired of Boring Workouts? Learn to Fight."
- **Number + Result**: "21 Classes to Your First Belt"

### CTA Optimization
- **Low Risk**: "Free Trial Class" - No money down
- **Value Stack**: "Free Trial + Personal Assessment + Training Plan"
- **Scarcity**: "Only 3 Trial Spots Left This Week"
- **Social Proof**: "Join 47 Others Who Started This Month"

### Social Proof Elements
- **Before/After Stories**: Physical and mental transformations
- **Belt Promotions**: Visible progress markers
- **Competition Wins**: External validation
- **Community Photos**: Group belonging and camaraderie
- **Coach Credentials**: Authority and expertise

## Examples by Martial Art

### BJJ (Brazilian Jiu-Jitsu)
```
HEADLINE: The Gentle Art That Changes Everything
SUBHEADLINE: Chess with Human Bodies - Where Technique Beats Strength
BODY: Discover why BJJ is the fastest-growing martial art. Start with zero experience and develop skills that work both on and off the mats. Perfect for self-defense, fitness, and mental clarity.
```

### Muay Thai
```
HEADLINE: Unleash Your Inner Warrior
SUBHEADLINE: 8 Weapons. 1 Body. Unlimited Power.
BODY: The Art of 8 Limbs transforms your entire body. Build knockout power, lightning speed, and unbreakable conditioning. No experience needed - just bring your heart.
```

### Boxing
```
HEADLINE: Float Like a Butterfly, Sting Like a Bee
SUBHEADLINE: The Sweet Science of Self-Mastery
BODY: Boxing is 80% mental, 20% physical. Learn the discipline, timing, and confidence that comes from mastering the noble art. Your journey to becoming untouchable starts here.
```

## Testing & Optimization

### A/B Test Elements
- **Headlines**: Benefit-driven vs. Feature-driven
- **CTAs**: "Free Trial" vs. "Book Call" vs. "Join Now"
- **Social Proof**: Video testimonials vs. Text reviews
- **Images**: Action shots vs. Transformation photos vs. Group shots

### Metrics to Track
- **Hero Section**: Time on page, scroll depth
- **CTA Clicks**: Conversion rate by traffic source
- **Form Completions**: Drop-off points in sign-up process
- **Phone Calls**: Tracking from different ad campaigns

## Reference Materials

### Scripts Directory
- `analyze_audience.py` - Audience persona analyzer
- `generate_hero.py` - Hero section copy generator
- `generate_testimonials.py` - Social proof copy generator
- `generate_cta.py` - Call-to-action optimizer
- `emotional_triggers.py` - Psychology-based copy enhancer

### References Directory
- `copy_frameworks.md` - Detailed marketing frameworks
- `psychology_triggers.md` - Martial arts specific motivators
- `competitor_analysis.md` - Industry benchmark copy examples
- `conversion_funnels.md` - Landing page optimization strategies
- `email_sequences.md` - Follow-up marketing templates

### Assets Directory
- `headlines_database.txt` - 100+ proven MMA headlines
- `cta_templates.html` - HTML-ready CTA components
- `testimonial_examples.md` - Real transformation stories
- `emotional_words.txt` - Power words for martial arts

## Quick Start Commands

```bash
# Generate complete landing copy:
python scripts/generate_landing.py --style="transformation" --art="mma" --goal="memberships"

# Optimize existing copy:
python scripts/optimize_copy.py --input="old_copy.txt" --focus="conversions"

# Generate testimonial framework:
python scripts/testimonial_framework.py --persona="beginner" --transformation="90_days"
```

## Pro Tips

### Do's
✅ Use transformation language: "Become", "Transform", "Unleash"
✅ Include specific numbers: "15 classes", "90 days", "500+ members"
✅ Address fears directly: "No experience needed", "Safe environment"
✅ Show the journey: "From where you are to where you want to be"
✅ Use martial arts metaphors: "Step onto the mat", "Earn your stripes"

### Don'ts
❌ Don't use generic fitness language ("get in shape")
❌ Don't intimidate with competition focus for beginners
❌ Don't forget to address safety concerns
❌ Don't overlook community benefits
❌ Don't use vague benefits ("feel better")

## Success Metrics

Good copy should achieve:
- **Above 2%** landing page conversion rate
- **60+ seconds** average time on page
- **70%+** scroll depth to CTA section
- **10+ questions** per consultation call from landing visitors

---

**Remember**: The best MMA landing copy speaks to both the desire to become something more and the fear of staying the same. Every word should move the visitor closer to stepping onto the mat for the first time.