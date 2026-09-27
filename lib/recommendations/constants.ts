export const SCORE_WEIGHTS = {
  SERVICE: 40,
  SERVICE_RELATED: 25,
  LOCATION_AREA: 25,
  LOCATION_CITY: 20,
  LOCATION_NEARBY: 10,
  RATING_MAX: 15,
  VERIFIED: 10,
  EXPERIENCE_MAX: 5,
  JOBS_MAX: 5
} as const;

export const EXPERIENCE_CAP_YEARS = 10;
export const JOBS_CAP_COUNT = 50;

export function ratingToScore(rating: number): number {
  return (Math.max(0, Math.min(5, rating)) / 5) * SCORE_WEIGHTS.RATING_MAX;
}

export function experienceToScore(years: number): number {
  return (
    (Math.min(years, EXPERIENCE_CAP_YEARS) / EXPERIENCE_CAP_YEARS) *
    SCORE_WEIGHTS.EXPERIENCE_MAX
  );
}

export function jobsToScore(completed: number): number {
  return (
    (Math.min(completed, JOBS_CAP_COUNT) / JOBS_CAP_COUNT) *
    SCORE_WEIGHTS.JOBS_MAX
  );
}