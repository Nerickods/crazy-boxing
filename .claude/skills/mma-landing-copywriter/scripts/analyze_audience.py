#!/usr/bin/env python3
"""
MMA Landing Copywriter - Audience Analyzer Script
Analyzes target audience demographics and motivations for martial arts gyms.
"""

import argparse
import json
from typing import Dict, List, Tuple

class MMAAudienceAnalyzer:
    """Analyzes MMA audience personas and motivations"""

    def __init__(self):
        self.personas = {
            "beginner": {
                "age_groups": {
                    "18-25": ["fitness", "self_defense", "confidence"],
                    "26-35": ["stress_relief", "weight_loss", "community"],
                    "36-45": ["health", "new_challenge", "discipline"],
                    "46+": ["mobility", "mental_health", "lifelong_learning"]
                },
                "pain_points": [
                    "feeling unsafe or vulnerable",
                    "boring gym routines",
                    "lack of discipline",
                    "social isolation",
                    "low self-confidence"
                ],
                "desires": [
                    "self-defense skills",
                    "physical fitness",
                    "mental toughness",
                    "belonging to community",
                    "personal growth"
                ]
            },
            "competitor": {
                "age_groups": {
                    "18-25": ["mma_debut", "amateur_fights", "skill_development"],
                    "26-30": ["professional_fights", "sponsorship", "championships"],
                    "31-35": ["coaching", "legacy", "high_level_competition"]
                },
                "pain_points": [
                    "plateau in skills",
                    "lack of quality training partners",
                    "inadequate coaching",
                    "limited competition opportunities",
                    "injury recovery"
                ],
                "desires": [
                    "championship titles",
                    "professional contracts",
                    "skill mastery",
                    "recognition",
                    "fight record improvement"
                ]
            },
            "hobbyist": {
                "age_groups": {
                    "25-35": ["fitness_with_purpose", "skill_building", "stress_relief"],
                    "36-50": ["maintenance", "enjoyment", "social_connection"],
                    "51+": ["health_benefits", "mental_clarity", "lifelong_activity"]
                },
                "pain_points": [
                    "sedentary lifestyle",
                    "work-related stress",
                    "lack of engaging hobbies",
                    "feeling out of shape",
                    "limited social activities"
                ],
                "desires": [
                    "enjoyable workout",
                    "skill progression",
                    "social community",
                    "stress management",
                    "physical health"
                ]
            }
        }

        self.motivations = {
            "fitness": {
                "triggers": ["transform", "sculpt", "forge", "build", "unleash"],
                "benefits": ["strength", "endurance", "flexibility", "conditioning"],
                "emotional": "empowerment through physical capability"
            },
            "self_defense": {
                "triggers": ["protect", "defend", "secure", "confident", "ready"],
                "benefits": ["awareness", "technique", "composure", "capability"],
                "emotional": "peace of mind and personal security"
            },
            "competition": {
                "triggers": ["dominate", "conquer", "victory", "championship", "legacy"],
                "benefits": ["skill", "strategy", "performance", "excellence"],
                "emotional": "recognition and achievement"
            },
            "community": {
                "triggers": ["brotherhood", "sisterhood", "family", "together", "support"],
                "benefits": ["camaraderie", "friendship", "belonging", "growth"],
                "emotional": "connection and mutual support"
            },
            "discipline": {
                "triggers": ["master", "control", "focus", "dedication", "commitment"],
                "benefits": ["consistency", "routine", "improvement", "mastery"],
                "emotional": "self-control and personal growth"
            }
        }

    def analyze_persona(self, persona: str, age_group: str, primary_goal: str) -> Dict:
        """Generate comprehensive audience analysis"""

        if persona not in self.personas:
            raise ValueError(f"Persona must be one of: {list(self.personas.keys())}")

        persona_data = self.personas[persona]

        if age_group not in persona_data["age_groups"]:
            raise ValueError(f"Age group '{age_group}' not valid for persona '{persona}'")

        # Build audience profile
        profile = {
            "persona": persona,
            "age_group": age_group,
            "primary_goal": primary_goal,
            "demographic_goals": persona_data["age_groups"][age_group],
            "pain_points": persona_data["pain_points"],
            "desires": persona_data["desires"],
            "primary_motivation": self._extract_motivation(primary_goal),
            "messaging_focus": self._get_messaging_focus(persona, primary_goal),
            "emotional_levers": self._get_emotional_levers(persona, primary_goal),
            "objection_handlers": self._get_objection_handlers(persona)
        }

        return profile

    def _extract_motivation(self, goal: str) -> Dict:
        """Extract motivation details based on primary goal"""

        # Map common goals to motivation categories
        goal_mapping = {
            "fitness": "fitness",
            "weight_loss": "fitness",
            "competition": "competition",
            "self_defense": "self_defense",
            "confidence": "self_defense",
            "community": "community",
            "belonging": "community",
            "discipline": "discipline",
            "focus": "discipline",
            "stress_relief": "fitness",
            "new_challenge": "discipline",
            "skill_development": "competition"
        }

        motivation_key = goal_mapping.get(goal.lower(), "fitness")
        motivation = self.motivations.get(motivation_key, self.motivations["fitness"])

        return {
            "category": motivation_key,
            "triggers": motivation["triggers"],
            "benefits": motivation["benefits"],
            "emotional_core": motivation["emotional"]
        }

    def _get_messaging_focus(self, persona: str, goal: str) -> List[str]:
        """Determine key messaging focus areas"""

        focus_matrix = {
            "beginner": [
                "safety and welcome",
                "progressive learning",
                "community support",
                "transformative results",
                "no experience needed"
            ],
            "competitor": [
                "elite coaching",
                "proven results",
                "advanced techniques",
                "competition preparation",
                "performance optimization"
            ],
            "hobbyist": [
                "enjoyable experience",
                "skill progression",
                "health benefits",
                "social atmosphere",
                "flexible scheduling"
            ]
        }

        return focus_matrix.get(persona, focus_matrix["beginner"])

    def _get_emotional_levers(self, persona: str, goal: str) -> List[str]:
        """Identify key emotional triggers"""

        base_levers = {
            "beginner": [
                "fear → confidence",
                "confusion → clarity",
                "weakness → strength",
                "isolation → belonging",
                "doubt → self-belief"
            ],
            "competitor": [
                "plateau → breakthrough",
                "frustration → mastery",
                "anxiety → readiness",
                "good → great",
                "local → recognized"
            ],
            "hobbyist": [
                "boredom → excitement",
                "stress → relief",
                "sedentary → active",
                "alone → connected",
                "routine → adventure"
            ]
        }

        return base_levers.get(persona, base_levers["beginner"])

    def _get_objection_handlers(self, persona: str) -> Dict[str, List[str]]:
        """Prepare responses to common objections"""

        handlers = {
            "beginner": {
                "not_fit_enough": [
                    "Everyone starts somewhere - we meet you where you are",
                    "Fitness is the result, not the requirement",
                    "We have beginner programs designed for all fitness levels"
                ],
                "too_intimidating": [
                    "Our community is known for being welcoming and supportive",
                    "You'll train with other beginners in introductory classes",
                    "No egos, just growth - that's our culture"
                ],
                "afraid_of_injury": [
                    "Safety is our top priority with certified instructors",
                    "Progressive skill building minimizes risk",
                    "Proper technique before intensity"
                ]
            },
            "competitor": {
                "already_have_gym": [
                    "See what's missing from your current training",
                    "Complement your existing skills with our expertise",
                    "One visit will show you the difference in coaching"
                ],
                "too_expensive": [
                    "Investment in your fighting career",
                    "Compare to what you're losing without proper training",
                    "Championship earnings offset training costs"
                ]
            },
            "hobbyist": {
                "not_enough_time": [
                    "Flexible class schedules for busy professionals",
                    "Quality over quantity - 3 classes per week for results",
                    "Stress relief that makes you more productive"
                ],
                "too_old": [
                    "Age is just a number on our mats",
                    "We have members in their 60s training safely",
                    "Adapted techniques for all ages and abilities"
                ]
            }
        }

        return handlers.get(persona, handlers["beginner"])

    def generate_copy_strategy(self, profile: Dict) -> str:
        """Generate copywriting strategy based on analysis"""

        strategy = f"""
# 🎯 Copy Strategy for {profile['persona'].title()} ({profile['age_group']})

## Primary Focus
{', '.join(profile['messaging_focus'])}

## Key Emotional Journey
{profile['emotional_levers'][0] if profile['emotional_levers'] else 'transformation'}

## Core Message
"From {profile['pain_points'][0] if profile['pain_points'] else 'where you are'} to {profile['desires'][0] if profile['desires'] else 'where you want to be'}"

## Power Words to Use
{', '.join(profile['primary_motivation']['triggers'][:5])}

## Benefits to Highlight
{', '.join(profile['primary_motivation']['benefits'])}

## Objection Handling Priority
Most common: {list(profile['objection_handlers'].keys())[0] if profile['objection_handlers'] else 'safety concerns'}
"""

        return strategy

def main():
    parser = argparse.ArgumentParser(description='Analyze MMA audience personas for copywriting')
    parser.add_argument('--persona', required=True,
                       choices=['beginner', 'competitor', 'hobbyist'],
                       help='Target audience persona')
    parser.add_argument('--age', required=True,
                       choices=['18-25', '26-35', '36-45', '46+'],
                       help='Age group targeting')
    parser.add_argument('--goal', required=True,
                       help='Primary goal (fitness, competition, self_defense, community, etc.)')
    parser.add_argument('--output', '-o',
                       help='Output file for analysis (JSON format)')
    parser.add_argument('--strategy', '-s', action='store_true',
                       help='Include copywriting strategy')

    args = parser.parse_args()

    analyzer = MMAAudienceAnalyzer()

    try:
        # Generate analysis
        profile = analyzer.analyze_persona(args.persona, args.age, args.goal)

        # Add strategy if requested
        if args.strategy:
            profile['copy_strategy'] = analyzer.generate_copy_strategy(profile)

        # Output results
        if args.output:
            with open(args.output, 'w') as f:
                json.dump(profile, f, indent=2)
            print(f"✅ Analysis saved to {args.output}")
        else:
            print(json.dumps(profile, indent=2, ensure_ascii=False))

        # Print strategy if requested
        if args.strategy:
            print("\n" + "="*50)
            print("COPYWRITING STRATEGY")
            print("="*50)
            print(profile['copy_strategy'])

    except Exception as e:
        print(f"❌ Error: {e}")
        return 1

    return 0

if __name__ == "__main__":
    exit(main())