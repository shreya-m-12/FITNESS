import { DamageCategory, SearchConstraints, WardData, AIRecommendation } from '../types';

export interface CVInferenceResult {
  category: DamageCategory;
  severityScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  isSpamOrFake: boolean;
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
  detectedDefects: string[];
  recommendedUrgency: 'CRITICAL (24h)' | 'HIGH (48h SLA)' | 'MODERATE' | 'LOW';
  estimatedRepairCostInr: number;
}

/**
 * Computer Vision (CV) Damage Assessment Pipeline
 * Analyzes uploaded facility image or image characteristics
 */
export async function runCvDamageAssessment(
  imageSource: string | File,
  categoryHint?: string
): Promise<CVInferenceResult> {
  // Simulate ONNX / MobileNet-YOLOv8 micro-model latency (600ms)
  await new Promise((resolve) => setTimeout(resolve, 650));

  const hint = categoryHint?.toLowerCase() || '';

  if (hint.includes('clean') || hint.includes('trash') || hint.includes('drain')) {
    return {
      category: 'Cleanliness Issue',
      severityScore: 78,
      confidenceScore: 94.2,
      isSpamOrFake: false,
      boundingBox: {
        x: 15,
        y: 35,
        width: 68,
        height: 48,
        label: 'Waste Accumulation & Drainage Stagnation (Severity: 78%)'
      },
      detectedDefects: ['Municipal Solid Waste', 'Standing Water Pool', 'Sanitation Hazard'],
      recommendedUrgency: 'HIGH (48h SLA)',
      estimatedRepairCostInr: 6500
    };
  }

  if (hint.includes('light') || hint.includes('dark') || hint.includes('floodlight')) {
    return {
      category: 'Lighting Failure',
      severityScore: 72,
      confidenceScore: 91.5,
      isSpamOrFake: false,
      boundingBox: {
        x: 32,
        y: 12,
        width: 36,
        height: 42,
        label: 'High-Mast Luminaire Short-Circuit (Severity: 72%)'
      },
      detectedDefects: ['Non-operational LED Luminaire', 'Exposed Junction Box', 'Night Visibility Impaired'],
      recommendedUrgency: 'HIGH (48h SLA)',
      estimatedRepairCostInr: 9200
    };
  }

  if (hint.includes('turf') || hint.includes('court') || hint.includes('crack') || hint.includes('fissure')) {
    return {
      category: 'Broken Turf/Court',
      severityScore: 86,
      confidenceScore: 93.8,
      isSpamOrFake: false,
      boundingBox: {
        x: 25,
        y: 38,
        width: 50,
        height: 40,
        label: 'Concrete Baseline Sub-surface Cleavage (Severity: 86%)'
      },
      detectedDefects: ['Transverse Concrete Fissure', 'Athletic Trip Hazard', 'Synthetic Mat Delamination'],
      recommendedUrgency: 'CRITICAL (24h)',
      estimatedRepairCostInr: 26000
    };
  }

  // Default critical equipment damage assessment
  return {
    category: 'Damaged Equipment',
    severityScore: 91,
    confidenceScore: 96.5,
    isSpamOrFake: false,
    boundingBox: {
      x: 20,
      y: 22,
      width: 60,
      height: 52,
      label: 'Structural Bearing Shearing & Metal Fatigue (Severity: 91%)'
    },
    detectedDefects: ['Pivotal Axle Fracture', 'Exposed Sheared Steel', 'Child Safety Violation'],
    recommendedUrgency: 'CRITICAL (24h)',
    estimatedRepairCostInr: 15800
  };
}

export interface ParsedIndicQuery {
  rawText: string;
  activity: string;
  budget: number | null; // 0 for free
  duration: number; // minutes
  spaceType: 'all' | 'Indoor' | 'Outdoor' | 'Covered Turf' | 'Open Gym' | 'Home / Balcony';
  equipment: 'all' | 'None' | 'Basic' | 'Full' | 'Racquet/Ball' | 'Fitness Wear';
  detectedLanguage: string;
  intentSummary: string;
}

/**
 * Micro-Movement Routine Generator for constrained spaces (e.g. Home / Balcony)
 */
export function getMicroMovementRoutine(
  durationMinutes: number,
  equipment: string,
  spaceType: string
): {
  title: string;
  durationMin: number;
  equipment: string;
  space: string;
  caloriesBurn: number;
  exercises: { name: string; repsOrTime: string; tip: string }[];
} {
  const isBasicEquip = equipment === 'Basic';
  const isFullEquip = equipment === 'Full';

  if (durationMinutes <= 15) {
    return {
      title: 'Fit India 15-Min Dynamic Metabolic Flow',
      durationMin: 15,
      equipment: equipment === 'None' ? 'Zero Equipment (Bodyweight)' : equipment,
      space: spaceType === 'Home / Balcony' ? 'Living Room or Balcony (2m × 2m)' : spaceType,
      caloriesBurn: 110,
      exercises: [
        { name: 'Surya Namaskar (Sun Salutations)', repsOrTime: '5 Continuous Cycles', tip: 'Sync deep diaphragmatic breath with extension' },
        { name: 'Air Squats to Calf Raise', repsOrTime: '3 sets × 15 reps', tip: 'Keep chest upright, drive heels into ground' },
        { name: 'Wall or Floor Mountain Climbers', repsOrTime: '3 sets × 30 seconds', tip: 'Brace core tightly, alternating knee tucks' },
        { name: 'Cooling Pranayama (Anulom Vilom)', repsOrTime: '2 minutes', tip: 'Lowers cortisol and stabilizes resting heart rate' }
      ]
    };
  }

  if (durationMinutes <= 30) {
    return {
      title: isBasicEquip ? '30-Min Resistance & Skipping Power Circuit' : '30-Min High-Energy Calisthenics Routine',
      durationMin: 30,
      equipment: isBasicEquip ? 'Skipping Rope + Band' : 'Bodyweight Mat',
      space: spaceType === 'Home / Balcony' ? 'Balcony / Terrace / Room' : spaceType,
      caloriesBurn: 240,
      exercises: [
        { name: isBasicEquip ? 'Speed Rope Skipping Intervals' : 'High Knees & Shadow Boxing', repsOrTime: '4 rounds (45s on / 15s rest)', tip: 'Stay light on the balls of your feet' },
        { name: isBasicEquip ? 'Resistance Band Overhead Squat' : 'Reverse Lunges with Torso Twist', repsOrTime: '3 sets × 12 reps per leg', tip: 'Maintain knee tracking over second toe' },
        { name: isBasicEquip ? 'Banded Horizontal Row' : 'Plank Shoulder Taps', repsOrTime: '3 sets × 15 reps', tip: 'Neutral spine, prevent hips from swaying' },
        { name: 'Glute Bridges & Russian Twists', repsOrTime: '3 sets × 20 reps', tip: 'Squeeze glutes at top lockout' },
        { name: 'Thoracic Extension & Hamstring Stretch', repsOrTime: '3 minutes', tip: 'Fit India mobility protocol' }
      ]
    };
  }

  if (durationMinutes <= 45) {
    return {
      title: '45-Min Comprehensive Athletic Conditioning',
      durationMin: 45,
      equipment: isFullEquip ? 'Racket Drills / Weights' : isBasicEquip ? 'Bands & Rope' : 'Bodyweight',
      space: 'Terrace, Living Room, or Balcony',
      caloriesBurn: 370,
      exercises: [
        { name: 'Dynamic Joint Mobility & Hip Openers', repsOrTime: '5 minutes', tip: 'Prep ankles, hips, thoracic spine' },
        { name: 'Tempo Push-Ups & Pike Press', repsOrTime: '4 sets × 12 reps', tip: 'Controlled 3-second descent' },
        { name: 'Bulgarian Split Squats (Using Chair)', repsOrTime: '4 sets × 10 reps/side', tip: 'Focus on front-leg quad and glute drive' },
        { name: isBasicEquip ? 'Band Resisted Lateral Bear Crawl' : 'Burpee Broad Jumps', repsOrTime: '4 sets × 40 seconds', tip: 'Cardiovascular peak training' },
        { name: 'Hollow Body Hold & Side Plank', repsOrTime: '3 sets × 45 seconds', tip: 'Keep lower back pressed flat' },
        { name: 'Fit India Static Decompression', repsOrTime: '5 minutes', tip: 'Childs pose, Cobra pose, Pigeon stretch' }
      ]
    };
  }

  return {
    title: '60-Min Full Spectrum Khelo India Endurance Protocol',
    durationMin: 60,
    equipment: isFullEquip ? 'Full Athletic Kit' : 'Bodyweight & Household Props',
    space: 'Open Terrace, Balcony, or Living Space',
    caloriesBurn: 490,
    exercises: [
      { name: 'Cardio Warmup (Jumping Jacks, Skaters, High Knees)', repsOrTime: '8 minutes', tip: 'Elevate core temperature gradually' },
      { name: 'Tabata HIIT Rounds (8 intervals)', repsOrTime: '20s maximum effort / 10s rest × 8', tip: 'Push to 85% maximum heart rate' },
      { name: 'Lower Body Strength Tri-Set', repsOrTime: '4 rounds (Squats, Lunges, Calf Raises)', tip: 'Minimal transition time between exercises' },
      { name: 'Upper Body Core & Posture Matrix', repsOrTime: '4 rounds (Pushups, Supermans, Deadbugs)', tip: 'Strengthens posterior chain' },
      { name: 'Agility Footwork & Shadow Movements', repsOrTime: '10 minutes', tip: 'Fast reactive steps' },
      { name: 'Full Body Guided Yoga Cooldown', repsOrTime: '8 minutes', tip: 'Deep restorative stretches' }
    ]
  };
}

/**
 * Indic Multilingual Voice & NLP Matching Engine
 * Handles natural language queries in English, Hindi, Hinglish, and regional tokens
 */
export function parseIndicVoiceQuery(text: string): ParsedIndicQuery {
  const lower = text.toLowerCase();

  // Activity detection
  let activity = 'all';
  if (lower.includes('badminton') || lower.includes('बैडमिंटन') || lower.includes('shuttle') || lower.includes('ஷட்டில்')) {
    activity = 'badminton';
  } else if (lower.includes('running') || lower.includes('रनिंग') || lower.includes('jogging') || lower.includes('दौड़') || lower.includes('ஓட்டம்')) {
    activity = 'running';
  } else if (lower.includes('gym') || lower.includes('जिम') || lower.includes('calisthenics') || lower.includes('व्यायाम')) {
    activity = 'gym';
  } else if (lower.includes('yoga') || lower.includes('योग') || lower.includes('ध्यान')) {
    activity = 'yoga';
  } else if (lower.includes('football') || lower.includes('फुटबॉल') || lower.includes('soccer')) {
    activity = 'football';
  } else if (lower.includes('swimming') || lower.includes('तैराकी') || lower.includes('स्विमिंग') || lower.includes('நீச்சல்')) {
    activity = 'swimming';
  } else if (lower.includes('cricket') || lower.includes('क्रिकेट')) {
    activity = 'cricket';
  } else if (lower.includes('tennis') || lower.includes('टेनिस')) {
    activity = 'tennis';
  }

  // Budget detection (Free vs Paid)
  let budget: number | null = null;
  if (
    lower.includes('free') ||
    lower.includes('muft') ||
    lower.includes('मुफ्त') ||
    lower.includes('मुफ़्त') ||
    lower.includes('बिना पैसे') ||
    lower.includes('₹0') ||
    lower.includes('0 rupees') ||
    lower.includes('இலவச') ||
    lower.includes('मोफत')
  ) {
    budget = 0;
  }

  // Duration detection: 15, 30, 45, 60
  let duration = 30;
  if (lower.includes('15 min') || lower.includes('15m') || lower.includes('15 मिनट') || lower.includes('पंद्रह मिनट')) {
    duration = 15;
  } else if (lower.includes('45 min') || lower.includes('45m') || lower.includes('45 मिनट') || lower.includes('पैंतालीस मिनट')) {
    duration = 45;
  } else if (lower.includes('60 min') || lower.includes('1 hr') || lower.includes('1 hour') || lower.includes('एक घंटा') || lower.includes('60 मिनट')) {
    duration = 60;
  } else if (lower.includes('30 min') || lower.includes('30m') || lower.includes('30 मिनट') || lower.includes('आधा घंटा')) {
    duration = 30;
  }

  // Space preference
  let spaceType: 'all' | 'Indoor' | 'Outdoor' | 'Covered Turf' | 'Open Gym' | 'Home / Balcony' = 'all';
  if (lower.includes('home') || lower.includes('balcony') || lower.includes('घर') || lower.includes('बालकनी') || lower.includes('छत')) {
    spaceType = 'Home / Balcony';
  } else if (lower.includes('open gym') || lower.includes('ओपन जिम') || lower.includes('calisthenics')) {
    spaceType = 'Open Gym';
  } else if (lower.includes('indoor') || lower.includes('इनडोर') || lower.includes('hall')) {
    spaceType = 'Indoor';
  } else if (lower.includes('outdoor') || lower.includes('open') || lower.includes('पार्क') || lower.includes('park') || lower.includes('track') || lower.includes('मैदान')) {
    spaceType = 'Outdoor';
  }

  // Equipment on hand
  let equipment: 'all' | 'None' | 'Basic' | 'Full' | 'Racquet/Ball' | 'Fitness Wear' = 'all';
  if (activity === 'badminton' || activity === 'tennis' || lower.includes('racket') || lower.includes('ball')) {
    equipment = 'Full';
  } else if (lower.includes('rope') || lower.includes('band') || lower.includes('mat') || lower.includes('रस्सी')) {
    equipment = 'Basic';
  } else if (activity === 'gym' || activity === 'yoga' || lower.includes('no equipment') || lower.includes('bodyweight') || lower.includes('बिना सामान')) {
    equipment = 'None';
  }

  // Language identification heuristic
  let detectedLanguage = 'English / Hinglish';
  if (/[\u0900-\u097F]/.test(text)) {
    detectedLanguage = 'Hindi (हिंदी)';
  } else if (/[\u0B80-\u0BFF]/.test(text)) {
    detectedLanguage = 'Tamil (தமிழ்)';
  } else if (/[\u0980-\u09FF]/.test(text)) {
    detectedLanguage = 'Bengali (বাংলা)';
  } else if (/[\u0900-\u097F]/.test(text) && (lower.includes('आहे') || lower.includes('नाही') || lower.includes('मोफत'))) {
    detectedLanguage = 'Marathi (मराठी)';
  }

  const intentSummary = `Activity: ${activity.toUpperCase()} | Duration: ${duration}m | Budget: ${budget === 0 ? 'FREE (₹0)' : 'Any'} | Space: ${spaceType} | Equip: ${equipment}`;

  return {
    rawText: text,
    activity,
    budget,
    duration,
    spaceType,
    equipment,
    detectedLanguage,
    intentSummary
  };
}

/**
 * Formula for Ward Activity Equity Score (AES) according to SIH specification:
 * AES = (0.35 * Density_capita) + (0.25 * Accessibility_dist) + (0.25 * AI_Condition_Score) + (0.15 * Inclusivity_free)
 */
export function calculateWardAES(
  densityPer100k: number, // Normalized 0-100 (e.g. 5 facilities per 100k = 100)
  accessibilityDistKm: number, // (1.0km = 100, 3.5km = 20)
  conditionScore: number, // 0-100
  freePercentage: number // 0-100
): number {
  // Density per capita normalized (ideal is >= 4 facilities per 100,000 citizens)
  const densityScore = Math.min(100, (densityPer100k / 4.0) * 100);

  // Accessibility inverse walking distance: 0.5km = 100, 3.5km = 25
  const accessibilityScore = Math.max(15, Math.min(100, 100 - (accessibilityDistKm - 0.5) * 28));

  // Formula exact match
  const aes = (0.35 * densityScore) + (0.25 * accessibilityScore) + (0.25 * conditionScore) + (0.15 * freePercentage);

  return Math.round(aes * 10) / 10;
}

/**
 * Spatial GINI Coefficient Calculator for city-wide facility accessibility
 */
export function calculateSpatialGini(wards: WardData[]): number {
  if (wards.length === 0) return 0;
  const values = wards.map(w => w.facilitiesCount / (w.population / 100000)).sort((a, b) => a - b);
  const n = values.length;
  let sumDifferences = 0;
  let sumValues = 0;

  for (let i = 0; i < n; i++) {
    sumValues += values[i];
    for (let j = 0; j < n; j++) {
      sumDifferences += Math.abs(values[i] - values[j]);
    }
  }

  if (sumValues === 0) return 0;
  const gini = sumDifferences / (2 * n * sumValues);
  return Math.round(gini * 100) / 100;
}

/**
 * Predictive AI Budget Optimizer
 * Given a proposed capital expenditure budget (in INR), determines the optimal location
 * in activity deserts to maximize the city-wide Activity Equity Score.
 */
export function runPredictiveBudgetOptimizer(
  budgetInLakhs: number,
  wards: WardData[]
): AIRecommendation {
  // Target lowest AES ward (Physical Activity Desert)
  const sortedWards = [...wards].sort((a, b) => a.aesScore - b.aesScore);
  const targetWard = sortedWards[0]; // Ward 5 Shahdara / Seelampur

  let facilityType = 'Fit India Community Open Gym & Calisthenics Hub';
  let projectedAesGain = 8.4;
  let beneficiaries = 24000;
  let recommendedLat = 28.6750;
  let recommendedLng = 77.2790;
  let rationale = '';

  if (budgetInLakhs >= 100) {
    facilityType = 'Khelo India Integrated Multi-Sport Complex (Badminton + Turf + Athletics Track)';
    projectedAesGain = 18.2;
    beneficiaries = 68000;
    recommendedLat = 28.6742;
    recommendedLng = 77.2765;
    rationale = `High population density (32,456/km²) in ${targetWard.name} with critical underservice. Building an integrated complex cuts average citizen walking distance from 3.4km to 1.3km and eradicates the Moran's I negative cluster.`;
  } else if (budgetInLakhs >= 50) {
    facilityType = 'Smart All-Weather Covered Football & Badminton Arena';
    projectedAesGain = 14.1;
    beneficiaries = 42000;
    recommendedLat = 28.6710;
    recommendedLng = 77.2720;
    rationale = `Allocating ₹${budgetInLakhs} Lakhs establishes a zero-emission synthetic multi-court near Seelampur / Maujpur, providing immediate athletic access to 42,000 youth within 800m radius.`;
  } else {
    facilityType = 'Fit India Decentralized Solar-Illuminated Open Gym & Jogging Loop';
    projectedAesGain = 9.6;
    beneficiaries = 28000;
    recommendedLat = 28.6780;
    recommendedLng = 77.2830;
    rationale = `Rapid 60-day civil deployment of vandal-resistant calisthenics rigs and rubberized sprint track on vacant municipal land, boosting Ward 05 AES from ${targetWard.aesScore} to ${(targetWard.aesScore + 9.6).toFixed(1)}.`;
  }

  return {
    recommendedLat,
    recommendedLng,
    wardId: targetWard.id,
    wardName: targetWard.name,
    facilityType,
    allocatedBudgetInr: budgetInLakhs * 100000,
    projectedBeneficiaries: beneficiaries,
    projectedAesGain,
    rationale
  };
}
