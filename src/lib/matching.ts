import type { MatchBreakdown, MatchedProvider, Provider, ServiceRequest } from "@/lib/types";

// Deterministic, explainable matching used on the customer-facing side of
// GigMatch. This is intentionally simple arithmetic, not a model — the goal
// is a score a customer (or a judge) can read the reasoning behind.
//
// Two conceptual layers, per the product's central idea:
//   Layer 1 — suitability: is this provider even relevant to the request?
//   Layer 2 — opportunity allocation: among suitable providers, how much
//     weight does accumulated platform history carry versus giving a
//     less-proven-but-suitable provider a chance to be seen?
//
// The exploration/exploitation *research* (pure exploitation, ε-greedy,
// UCB1) lives entirely in src/lib/simulation — this module only reflects the
// same underlying principle at a much lighter touch, for a single request.

const SUITABILITY_THRESHOLD = 55;

function skillsFit(provider: Provider, request: ServiceRequest): number {
  if (request.requiredSkills.length === 0) return provider.fitProfile.skills;
  const matched = request.requiredSkills.filter((skill) =>
    provider.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
  ).length;
  const overlap = matched / request.requiredSkills.length;
  return Math.round(provider.fitProfile.skills * (0.45 + 0.55 * overlap));
}

function availabilityFit(provider: Provider, request: ServiceRequest): number {
  let score = provider.fitProfile.availability;
  if (request.urgency === "Urgent" && provider.isNewProvider) score -= 6;
  if (request.urgency === "Routine") score += 4;
  return clamp(score);
}

function experienceFit(provider: Provider): number {
  return clamp(Math.round(45 + provider.professionalExperienceYears * 7));
}

// Layer 2: how much accumulated platform evidence should weigh in, without
// ever treating "no evidence yet" as "low quality." Established providers
// get credit for a track record; new providers get a fair neutral baseline
// rather than a penalty — nudged only slightly by request urgency, echoing
// the research finding that this bias is strongest for urgent requests.
function platformConfidence(provider: Provider, request: ServiceRequest): number {
  if (provider.isNewProvider) {
    const urgencyAdjustment = request.urgency === "Urgent" ? -5 : 0;
    return clamp(66 + urgencyAdjustment);
  }
  const trackRecord = 58 + provider.platformJobsCompleted * 0.1 + (provider.rating ?? 0) * 6;
  const urgencyAdjustment = request.urgency === "Urgent" ? 4 : 0;
  return clamp(Math.round(trackRecord + urgencyAdjustment));
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function scoreProvider(provider: Provider, request: ServiceRequest): MatchedProvider {
  const skills = clamp(skillsFit(provider, request));
  const availability = clamp(availabilityFit(provider, request));
  const location = clamp(provider.fitProfile.location);
  const experience = experienceFit(provider);
  const confidence = platformConfidence(provider, request);

  const matchScore = clamp(
    0.32 * skills + 0.18 * availability + 0.18 * location + 0.2 * experience + 0.12 * confidence
  );

  const breakdown: MatchBreakdown = {
    skillsFitPct: skills,
    availabilityFitPct: availability,
    locationFitPct: location,
    experienceYears: provider.professionalExperienceYears,
    platformHistoryNote: provider.isNewProvider
      ? "New to GigMatch — limited platform history yet, so this reflects uncertainty, not a quality concern."
      : `${provider.platformJobsCompleted} completed jobs on GigMatch${provider.rating ? ` · ${provider.rating.toFixed(1)} rating` : ""}.`,
    verifiedCredentialsNote:
      provider.certificates.length > 0
        ? `${provider.certificates.filter((c) => c.verified).length} verified credential${provider.certificates.length > 1 ? "s" : ""} on file.`
        : undefined,
  };

  return { provider, matchScore, breakdown };
}

export function findSuitableProviders(request: ServiceRequest, pool: Provider[]): MatchedProvider[] {
  return pool
    .filter((p) => p.service === request.service)
    .map((p) => scoreProvider(p, request))
    .filter((m) => m.matchScore >= SUITABILITY_THRESHOLD)
    .sort((a, b) => b.matchScore - a.matchScore);
}
