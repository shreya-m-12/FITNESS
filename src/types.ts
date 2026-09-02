export type UserRole = 'citizen' | 'officer' | 'ministry';

export type LanguageCode = 'en' | 'hi' | 'mr' | 'ta' | 'bn';

export interface SportsFacility {
  id: string;
  name: string;
  nameHindi?: string;
  wardId: string;
  wardName: string;
  category: 'Stadium' | 'District Sports Complex' | 'Open Gym & Park' | 'Turf & Court' | 'Swimming Pool & Aquatic Center' | 'Community Ground';
  sports: string[];
  lat: number;
  lng: number;
  isFree: boolean;
  pricingNote?: string;
  spaceType: 'Indoor' | 'Outdoor' | 'Covered Turf' | 'Open Gym' | 'Home / Balcony';
  equipmentRequired: 'None' | 'Basic' | 'Full' | 'Racquet/Ball' | 'Fitness Wear' | 'Specialized Gear';
  conditionScore: number; // 0 to 100
  conditionStatus: 'Excellent' | 'Good' | 'Fair' | 'Critical Repair Needed';
  verifiedByULB: boolean;
  kheloIndiaPartner: boolean;
  fitIndiaCertified: boolean;
  openingHours: string;
  lightingAvailable: boolean;
  wheelchairAccessible: boolean;
  rating: number;
  photoUrl: string;
  address: string;
  activeUsersNow: number;
}

export interface WardData {
  id: string;
  name: string;
  zone: string;
  population: number;
  areaKm2: number;
  populationDensity: number; // per km2
  facilitiesCount: number;
  avgDistanceKm: number;
  avgConditionScore: number;
  freeFacilityPercentage: number;
  aesScore: number; // Activity Equity Score (0-100)
  spatialGini: number;
  moransI: number; // Spatial autocorrelation (-1 to +1)
  isDesert: boolean;
  boundaryGeoJson: {
    type: 'Polygon';
    coordinates: [number, number][][];
  };
}

export type DamageCategory = 
  | 'Damaged Equipment'
  | 'Broken Turf/Court'
  | 'Lighting Failure'
  | 'Cleanliness Issue'
  | 'Normal';

export interface DamageReport {
  id: string;
  trackingId: string; // e.g. ULB-DEL-2026-8942
  facilityId: string;
  facilityName: string;
  wardId: string;
  wardName: string;
  reportedAt: string;
  citizenName: string;
  citizenPhone: string;
  category: DamageCategory;
  description: string;
  severityScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  imageUrl: string;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  };
  status: 'Pending' | 'Dispatched' | 'In Progress' | 'Resolved';
  slaDeadline: string; // ISO string 48 hours from reported
  assignedContractor?: string;
  workOrderNumber?: string;
  estimatedCostInr?: number;
  notes?: string;
}

export interface SearchConstraints {
  query: string;
  durationMinutes: number; // 15, 30, 45, 60
  spaceType: 'all' | 'Indoor' | 'Outdoor' | 'Covered Turf' | 'Open Gym' | 'Home / Balcony';
  equipmentOnHand: 'all' | 'None' | 'Basic' | 'Full' | 'Racquet/Ball' | 'Fitness Wear';
  budgetMax: number; // 0 for free only, or 500
  activityType: string; // e.g. "all", "badminton", "running", "yoga", "swimming"
}

export interface MicroMovementRoutine {
  title: string;
  durationMin: number;
  equipment: string;
  space: string;
  caloriesBurn: number;
  exercises: { name: string; repsOrTime: string; tip: string }[];
}

export interface AIRecommendation {
  recommendedLat: number;
  recommendedLng: number;
  wardId: string;
  wardName: string;
  facilityType: string;
  allocatedBudgetInr: number;
  projectedBeneficiaries: number;
  projectedAesGain: number; // e.g. +14.8 pts
  rationale: string;
}
