import type { Provider, ServiceCategory, Urgency } from "@/lib/types";

export type Opportunity = {
  id: string;
  service: ServiceCategory;
  customerSummary: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  location: string;
  requiredSkills: string[];
  urgency: Urgency;
  whyGoodFit: string;
  estimatedEarnings: string;
  status: "New" | "Accepted";
};

const SAMPLE_REQUESTS: Partial<Record<ServiceCategory, string[]>> = {
  "Elder Care": ["Day support for an elderly parent, mornings only", "Companionship and light mobility assistance"],
  Cleaning: ["Deep clean before move-in", "Weekly kitchen and bathroom cleaning"],
  Plumbing: ["Fix a leaking kitchen tap", "Bathroom fitting replacement"],
  Electrical: ["Rewire a bedroom switchboard", "Inverter installation"],
  Cooking: ["Daily North Indian home meals", "Weekend meal prep for a family of four"],
  Tutoring: ["Grade 9 maths, twice a week", "Physics revision before exams"],
  Driving: ["Daily office commute, weekday mornings", "Outstation trip this weekend"],
  "Beauty & Wellness": ["At-home haircut and styling", "Bridal trial package"],
  Other: ["General help needed around the house"],
};

const DATES = ["2026-09-05", "2026-09-04", "2026-09-07"];
const START_TIMES = ["09:00", "14:00", "10:30"];
const END_TIMES = ["12:00", "17:00", "13:00"];
const DURATIONS = ["3 hours", "3 hours", "2.5 hours"];
const EARNINGS = ["₹1,200", "₹1,500", "₹900"];
const URGENCIES: Urgency[] = ["Routine", "Soon", "Urgent"];
const FIT_NOTES = [
  "Matches your listed skills and is within your usual service area.",
  "Your availability overlaps with the requested time window.",
  "A nearby customer requested this service today.",
];

export function generateOpportunities(provider: Provider): Opportunity[] {
  const samples = SAMPLE_REQUESTS[provider.service] ?? SAMPLE_REQUESTS.Other!;
  const summaries = [samples[0], samples[1] ?? samples[0], samples[0]];

  return summaries.map((summary, i) => ({
    id: `opp_${provider.id}_${i}`,
    service: provider.service,
    customerSummary: summary,
    date: DATES[i],
    startTime: START_TIMES[i],
    endTime: END_TIMES[i],
    duration: DURATIONS[i],
    location: provider.serviceArea,
    requiredSkills: provider.skills.slice(0, 2),
    urgency: URGENCIES[i % URGENCIES.length],
    whyGoodFit: FIT_NOTES[i],
    estimatedEarnings: EARNINGS[i],
    status: "New",
  }));
}

export function getOpportunityById(provider: Provider, id: string): Opportunity | undefined {
  return generateOpportunities(provider).find((o) => o.id === id);
}

export type JobHistoryEntry = {
  id: string;
  service: ServiceCategory;
  date: string;
  rating: number | null;
  outcome: "Completed";
};

const PAST_DATES = ["2026-08-28", "2026-08-21", "2026-08-14", "2026-08-06", "2026-07-30", "2026-07-22"];

export function generateJobHistory(provider: Provider): JobHistoryEntry[] {
  if (provider.platformJobsCompleted === 0) return [];
  const count = Math.min(provider.platformJobsCompleted, PAST_DATES.length);
  const baseRating = provider.rating ?? 4.6;
  return PAST_DATES.slice(0, count).map((date, i) => ({
    id: `job_${provider.id}_${i}`,
    service: provider.service,
    date,
    rating: Math.min(5, Math.max(3.5, Math.round((baseRating + (i % 2 === 0 ? 0.1 : -0.1)) * 10) / 10)),
    outcome: "Completed" as const,
  }));
}
