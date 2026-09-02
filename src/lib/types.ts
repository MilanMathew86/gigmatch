// Shared domain types for GigMatch. Mock data implements these shapes today;
// a real backend can replace the data source later without touching the UI.

export const SERVICE_CATEGORIES = [
  "Elder Care",
  "Cleaning",
  "Plumbing",
  "Electrical",
  "Cooking",
  "Tutoring",
  "Driving",
  "Beauty & Wellness",
  "Babysitting & Childcare",
  "Pet Care",
  "Gardening & Landscaping",
  "Carpentry",
  "Painting",
  "Appliance Repair",
  "Home Nursing & Caregiving",
  "Event Staff & Catering",
  "Photography & Videography",
  "Fitness Training",
  "Makeup & Styling",
  "Laundry & Ironing",
  "Moving & Packing Help",
  "Computer & IT Support",
  "Delivery & Courier",
  "Security Guard",
  "Other",
] as const;

export type ServiceCategory = (typeof SERVICE_CATEGORIES)[number];

/** The sentinel category that triggers a free-text "what do you do?" entry.
 * Displayed to users as "Others". */
export const OTHER_SERVICE_CATEGORY: ServiceCategory = "Other";

/** Resolves the label that should actually be shown for a service — the
 * custom text the person typed after picking "Others", if any, otherwise
 * the category itself. */
export function serviceLabel(service: ServiceCategory, custom?: string): string {
  if (service === OTHER_SERVICE_CATEGORY && custom && custom.trim()) return custom.trim();
  return service;
}

export type Urgency = "Routine" | "Soon" | "Urgent";

export const URGENCY_LEVELS: Urgency[] = ["Routine", "Soon", "Urgent"];

export type Duration = "1 day" | "3 days" | "1 week" | "Custom";

export const DURATIONS: Duration[] = ["1 day", "3 days", "1 week", "Custom"];

/** Travel range options a provider can pick from. The last two aren't a
 * fixed distance, so they map to large sentinel km values rather than a
 * literal radius — travelRangeLabel() turns those back into words. */
export const TRAVEL_RANGE_OPTIONS: { label: string; km: number }[] = [
  { label: "5 km", km: 5 },
  { label: "10 km", km: 10 },
  { label: "15 km", km: 15 },
  { label: "25 km", km: 25 },
  { label: "Within my state", km: 150 },
  { label: "Distance is not a problem", km: 100000 },
];

export function travelRangeKmForLabel(label: string): number {
  return TRAVEL_RANGE_OPTIONS.find((o) => o.label === label)?.km ?? 10;
}

export function travelRangeLabelForKm(km: number): string {
  return TRAVEL_RANGE_OPTIONS.find((o) => o.km === km)?.label ?? `${km} km`;
}

/** Friendly display for a travel range on a read-only profile view. */
export function travelRangeDisplay(km: number): string {
  const match = TRAVEL_RANGE_OPTIONS.find((o) => o.km === km);
  if (match && (match.label === "Within my state" || match.label === "Distance is not a problem")) {
    return match.label;
  }
  return `Up to ${km} km`;
}

/** Suggested reasons for "Why are you a good fit?" — a starting point the
 * person can pick from and/or add their own to. */
export const GOOD_FIT_SUGGESTIONS: string[] = [
  "Relevant skills or experience",
  "Experience with similar work",
  "Good communication skills",
  "Quick learner",
  "Reliable and responsible",
  "Strong problem-solving skills",
  "Flexible availability",
  "Familiar with relevant tools/technology",
  "Able to work independently",
  "Good teamwork and collaboration",
];

export type Certificate = {
  id: string;
  name: string;
  institution: string;
  verified: boolean;
};

/** Hand-authored fit inputs used by the demo scoring engine — stand in for
 * what a real system would compute from calendars, geocoding, etc. */
export type FitProfile = {
  skills: number; // 0-100 baseline skills strength for their category
  availability: number; // 0-100 how open their schedule generally is
  location: number; // 0-100 how well their service area covers most requests
};

export type Provider = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string; // solid Tailwind bg-* token
  service: ServiceCategory;
  /** Custom role text, only meaningful when service === "Other". */
  customService?: string;
  skills: string[];
  professionalExperienceYears: number;
  platformJobsCompleted: number;
  rating: number | null;
  isNewProvider: boolean;
  identityVerified: boolean;
  serviceArea: string;
  travelRangeKm: number;
  availabilitySummary: string;
  bio: string;
  /** Selected/custom reasons answering "Why are you a good fit?" */
  whyGoodFit?: string[];
  certificates: Certificate[];
  fitProfile: FitProfile;
};

export type ServiceRequest = {
  service: ServiceCategory;
  /** Custom role text, only meaningful when service === "Other". */
  customService?: string;
  description: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: Duration;
  urgency: Urgency;
  requiredSkills: string[];
  languagePreference: string;
  otherPreferences: string;
};

export type MatchBreakdown = {
  skillsFitPct: number;
  availabilityFitPct: number;
  locationFitPct: number;
  experienceYears: number;
  platformHistoryNote: string;
  verifiedCredentialsNote?: string;
};

export type MatchedProvider = {
  provider: Provider;
  matchScore: number;
  breakdown: MatchBreakdown;
};

export const emptyServiceRequest = (): ServiceRequest => ({
  service: "Elder Care",
  customService: "",
  description: "",
  location: "",
  date: "",
  startTime: "",
  endTime: "",
  duration: "1 day",
  urgency: "Routine",
  requiredSkills: [],
  languagePreference: "No preference",
  otherPreferences: "",
});
