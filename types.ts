
export enum AppTab {
  DASHBOARD = 'dashboard',
  MOVEMENT = 'movement',
  MINDSET = 'mindset',
  BIO_SYNC = 'biosync',
  NUTRITION = 'nutrition',
  PROTOCOLS = 'protocols',
  NETWORK = 'network',
  ANALYSIS = 'analysis',
  ONBOARDING = 'onboarding'
}

export type PhysiqueType = 'shredded' | 'mass_monster' | 'athletic_lean' | 'functional_power';

export interface UserProfile {
  name: string;
  age: number;
  weight: number;
  height: string;
  bodyFatGoal: string;
  primaryGoals: string[];
  dietaryPreferences: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'pro';
  sleepHabit: 'early_bird' | 'night_owl' | 'irregular';
  stressLevel: 'low' | 'moderate' | 'high';
  equipmentAccess: string[];
  origin: string; // Heritage
  residence: string; // Current environment
  targetPhysique: PhysiqueType;
  targetTimeline: string;
  physiqueVisualUrl?: string;
  completedOnboarding: boolean;
}

export interface ExerciseStep {
  name: string;
  sets: string;
  reps: string;
  instructions: string[];
  tempo: string;
  cue: string;
  videoUrl: string;
}

export interface MealStep {
  meal: string;
  menu: string;
  objective: string;
  ingredients: string[];
  preparationSteps: string[];
  videoUrl: string;
}

export interface EliteHabit {
  id: string;
  name: string;
  category: 'recovery' | 'performance' | 'nutrition' | 'mindset';
  completed: boolean;
}

export interface DailyLog {
  nutrition: string;
  exercise: string;
  stress: number;
  notes: string;
  habits: EliteHabit[];
  timestamp: number;
}
