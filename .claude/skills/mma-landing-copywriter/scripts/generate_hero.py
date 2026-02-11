#!/usr/bin/env python3
"""
MMA Landing Copywriter - Hero Section Generator
Creates compelling hero section copy for MMA landing pages.
"""

import argparse
import random
from typing import Dict, List, Tuple

class HeroCopyGenerator:
    """Generates hero section copy for MMA landing pages"""

    def __init__(self):
        self.headline_templates = {
            "transformation": [
                "Transform Your Body & Mind in {timeframe}",
                "From {starting_point} to {end_state} in {timeframe}",
                "Become the {identity} You Were Meant to Be",
                "{action} Your {inner_quality} in {timeframe}",
                "The {timeframe} Transformation That Changes Everything"
            ],
            "empowerment": [
                "Unleash Your Inner {warrior_type}",
                "Discover the {power_type} You Never Knew You Had",
                "{emotion} Your Life Through Martial Arts",
                "Where {ordinary_people} Become {extraordinary}",
                "Step Into Your Power at {gym_name}"
            ],
            "community": [
                "More Than a Gym - It's Your {family_type}",
                "Join the {community_type} That Lifts You Higher",
                "Where {motivation} Meets {support}",
                "Your {journey} Starts With {community}",
                "The {community} That Changes Lives"
            ],
            "competition": [
                "Champions Are Forged, Not Born",
                "{number}% of Champions Start Right Here",
                "Where {beginners} Become {competitors}",
                "The Path to {achievement} Starts Here",
                "Training That Builds {champions}"
            ],
            "results": [
                "Get {result_type} in {timeframe} - Guaranteed",
                "The Proven System for {specific_result}",
                "{number}+ Transformations Can't Be Wrong",
                "Real Results for Real People",
                "Why Settle for {lesser_result} When You Can Have {better_result}"
            ]
        }

        self.subheadline_templates = {
            "no_experience": [
                "No Experience Needed - Just Bring Your Heart",
                "Perfect for Complete Beginners",
                "Start Your Journey Today, No Prior Training Required",
                "Where Every Black Belt Was Once a White Belt",
                "Your First Step on the Mat is the Hardest - We'll Help"
            ],
            "community": [
                "Join {number}+ Members Who've Already Transformed",
                "Train With a Community That Pushes You to Excel",
                "Where Friendship and Growth Go Hand-in-Hand",
                "Your New Family Awaits on the Mats",
                "Experience the Power of Training Together"
            ],
            "results": [
                "See Results in Your First {number} Classes",
                "Our System Has Delivered {number}+ Transformations",
                "Average Member Loses {number} lbs in {timeframe}",
                "{number}% of Members Report Increased Confidence",
                "Real Change Happens Here - Every Day"
            ],
            "expertise": [
                "Train With {credential} Coaches Who Care",
                "{years} Years of Proven Results",
                "Home to {number}+ Champions and Counting",
                "Where Technique Meets Practical Application",
                "The Gold Standard in {martial_art} Training"
            ]
        }

        self.body_copy_templates = {
            "transformation": [
                "Stop scrolling through fitness apps that promise results but deliver nothing. Step onto our mats and discover the warrior within you. Our proven system has transformed {number}+ everyday people into confident, disciplined martial artists.",
                "You're stronger than you think. But strength without direction is just potential. At {gym_name}, we channel that potential into real, lasting change - body, mind, and spirit.",
                "The journey of a thousand miles begins with a single step. Your first step onto our mats could be the most important decision you make this year. Transform your life, one class at a time."
            ],
            "overcoming_fear": [
                "Fear holds most people back from what they truly want. We create a safe, supportive environment where you can face your fears and discover your true capabilities. No judgment, just growth.",
                "What if you could walk through life with unshakable confidence? That's not just possible - it's our standard result. We'll help you build the courage and skills to handle whatever life throws at you.",
                "Intimidation keeps millions from experiencing martial arts. That's why we've built the most welcoming, beginner-friendly program around. Your comfort zone ends where growth begins - we'll help you cross that line."
            ],
            "community_bond": [
                "In a world of digital isolation, find your tribe. The bonds forged on the training mat last a lifetime. You're not just joining a gym - you're joining a family that will push you, support you, and celebrate your victories.",
                "Success is impossible alone. Every transformation story starts with someone saying 'I'll help you get there.' Our community becomes your greatest asset in this journey of growth.",
                "Show up for yourself, but stay for the family. The magic happens when individual determination meets collective support. That's where real transformation occurs."
            ],
            "practical_benefits": [
                "Self-defense isn't just about fighting - it's about awareness, confidence, and having options when you need them most. Our practical curriculum teaches skills that work both on and off the streets.",
                "Fitness that matters. Instead of endless cardio machines, you'll build functional strength, real coordination, and cardiovascular conditioning while learning skills that could save your life.",
                "The discipline you learn here spreads to every area of your life. Our members report better careers, stronger relationships, and unshakable confidence - all from the lessons learned on the mat."
            ]
        }

        self.cta_templates = {
            "low_risk": [
                "Start Your Free Trial Today",
                "Try Your First Class Free",
                "No Commitment - Just Results",
                "Experience the Difference Risk-Free",
                "Your Journey Starts with a Free Class"
            ],
            "value_stack": [
                "Free Trial + Personal Assessment + Training Plan",
                "Get Your Free Class + Training Guide + Nutrition Tips",
                "Start Free: Trial Class + Goal Setting + Progress Tracking",
                "Complete Beginner Package: Free Class + Equipment + Training Plan",
                "Your First Week Free + Personal Roadmap"
            ],
            "urgency": [
                "Only {number} Trial Spots Left This Week",
                "New Beginner Class Starting {date} - Reserve Your Spot",
                "Limited Time: {offer}",
                "Join {number} Others Who Start This Month",
                "Next Assessment Call: {time} - Book Now"
            ],
            "direct": [
                "Book Your Free Class Now",
                "Start Training Today",
                "Claim Your Free Trial",
                "Get Started Immediately",
                "Join Now - No Experience Needed"
            ]
        }

    def generate_hero_copy(self, style: str = "transformation", emotion: str = "empowerment",
                          martial_art: str = "MMA", gym_name: str = "Our Gym",
                          time_frame: str = "90 days", members_count: int = 500) -> Dict:
        """Generate complete hero section copy"""

        # Validate inputs
        if style not in self.headline_templates:
            style = "transformation"
        if emotion not in self.headline_templates:
            emotion = "transformation"

        # Generate headline
        headline = self._generate_headline(style, martial_art, time_frame)

        # Generate subheadline
        subheadline = self._generate_subheadline("community", members_count)

        # Generate body copy
        body_copy = self._generate_body_copy(style, gym_name, members_count)

        # Generate CTA
        cta = self._generate_cta("low_risk")

        hero_copy = {
            "headline": headline,
            "subheadline": subheadline,
            "body_copy": body_copy,
            "cta_text": cta,
            "cta_url": "#free-trial",
            "background_image": f"/images/hero-{style}-martial-arts.jpg",
            "overlay_opacity": 0.6,
            "text_color": "#ffffff",
            "button_color": "#dc2626",
            "style_notes": self._get_style_notes(style, emotion)
        }

        return hero_copy

    def _generate_headline(self, style: str, martial_art: str, time_frame: str) -> str:
        """Generate headline based on style"""
        templates = self.headline_templates[style]
        template = random.choice(templates)

        # Fill in template variables
        replacements = {
            "{timeframe}": time_frame,
            "{martial_art}": martial_art,
            "{gym_name}": "Our Gym",
            "{action}": "Forge",
            "{inner_quality}": "Inner Warrior",
            "{starting_point}": "Zero",
            "{end_state}": "Hero",
            "{identity}": "Champion",
            "{warrior_type}": "Warrior",
            "{power_type}": "Fighting Spirit",
            "{emotion}": "Transform",
            "{ordinary_people}": "Ordinary People",
            "{extraordinary}": "Extraordinary Warriors",
            "{family_type}": "Fight Family",
            "{community_type}": "Brotherhood of Warriors",
            "{motivation}": "Discipline",
            "{support}": "Unwavering Support",
            "{journey}": "Journey",
            "{community}": "Community",
            "{result_type}": "Fight-Ready",
            "{specific_result}": "Lasting Transformation",
            "{number}": "500",
            "{lesser_result}": "Average Fitness",
            "{better_result}": "Warrior Fitness",
            "{achievement}": "Greatness",
            "{champions}": "Champions",
            "{beginners}": "Beginners",
            "{competitors}": "Competitors"
        }

        headline = template
        for placeholder, replacement in replacements.items():
            headline = headline.replace(placeholder, replacement)

        return headline

    def _generate_subheadline(self, focus: str, members_count: int) -> str:
        """Generate subheadline"""
        templates = self.subheadline_templates[focus]
        template = random.choice(templates)

        replacements = {
            "{number}": str(members_count),
            "{gym_name}": "Our Gym",
            "{credential}": "Expert",
            "{years}": "15",
            "{martial_art}": "MMA"
        }

        subheadline = template
        for placeholder, replacement in replacements.items():
            subheadline = subheadline.replace(placeholder, replacement)

        return subheadline

    def _generate_body_copy(self, style: str, gym_name: str, members_count: int) -> str:
        """Generate body copy"""
        templates = self.body_copy_templates[style]
        template = random.choice(templates)

        replacements = {
            "{gym_name}": gym_name,
            "{number}": str(members_count),
            "{timeframe}": "90 days"
        }

        body_copy = template
        for placeholder, replacement in replacements.items():
            body_copy = body_copy.replace(placeholder, replacement)

        return body_copy

    def _generate_cta(self, cta_type: str) -> str:
        """Generate call-to-action text"""
        templates = self.cta_templates[cta_type]
        template = random.choice(templates)

        replacements = {
            "{number}": "5",
            "{date}": "Monday",
            "{offer}": "50% Off First Month",
            "{time}": "3 PM"
        }

        cta = template
        for placeholder, replacement in replacements.items():
            cta = cta.replace(placeholder, replacement)

        return cta

    def _get_style_notes(self, style: str, emotion: str) -> str:
        """Get styling and implementation notes"""
        notes = f"""
Style: {style.title()} - Focus on {emotion}
- Use bold, confident typography
- Include high-quality training action shots
- Consider video background for dynamic feel
- Ensure mobile responsiveness
- Test different emotional triggers
- Add subtle animations for engagement
- Include social proof near CTA
        """
        return notes.strip()

    def generate_variations(self, base_copy: Dict, num_variations: int = 3) -> List[Dict]:
        """Generate multiple variations of hero copy"""
        variations = []

        for i in range(num_variations):
            variation = base_copy.copy()

            # Vary headline style
            styles = list(self.headline_templates.keys())
            style = styles[i % len(styles)]
            variation["headline"] = self._generate_headline(style, "MMA", "90 days")

            # Vary CTA type
            cta_types = list(self.cta_templates.keys())
            cta_type = cta_types[i % len(cta_types)]
            variation["cta_text"] = self._generate_cta(cta_type)

            variation["variation_id"] = f"hero_{i+1}"
            variations.append(variation)

        return variations

def main():
    parser = argparse.ArgumentParser(description='Generate hero section copy for MMA landing pages')
    parser.add_argument('--style', default='transformation',
                       choices=['transformation', 'empowerment', 'community', 'competition', 'results'],
                       help='Copy style focus')
    parser.add_argument('--emotion', default='empowerment',
                       choices=['empowerment', 'community', 'transformation', 'competition'],
                       help='Emotional angle')
    parser.add_argument('--martial-art', default='MMA',
                       help='Specific martial art (MMA, BJJ, Boxing, Muay Thai)')
    parser.add_argument('--gym-name', default='Our Gym',
                       help='Gym name for personalization')
    parser.add_argument('--timeframe', default='90 days',
                       help='Transformation timeframe')
    parser.add_argument('--members', type=int, default=500,
                       help='Number of current members')
    parser.add_argument('--variations', type=int, default=1,
                       help='Number of variations to generate')
    parser.add_argument('--output', '-o',
                       help='Output file for copy (JSON format)')

    args = parser.parse_args()

    generator = HeroCopyGenerator()

    try:
        # Generate base copy
        base_copy = generator.generate_hero_copy(
            style=args.style,
            emotion=args.emotion,
            martial_art=args.martial_art,
            gym_name=args.gym_name,
            time_frame=args.timeframe,
            members_count=args.members
        )

        # Generate variations if requested
        if args.variations > 1:
            variations = generator.generate_variations(base_copy, args.variations)
            result = {
                "primary": base_copy,
                "variations": variations
            }
        else:
            result = base_copy

        # Output results
        import json
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"✅ Hero copy saved to {args.output}")
        else:
            print(json.dumps(result, indent=2, ensure_ascii=False))

    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

    return 0

if __name__ == "__main__":
    exit(main())