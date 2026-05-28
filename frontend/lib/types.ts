export type ScoreBreakdown = {
  semanticMatch: number;
  technicalFit: number;
  behavioralScore: number;
  learningVelocity: number;
  domainMatch: number;
  stabilityScore: number;
  finalScore: number;
};

export type GrowthPoint = {
  year: number;
  level: string;
};

export type Candidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  experienceYears: number;
  summary: string;
  skills: string[];
  domains: string[];
  leadership: number;
  learningVelocity: number;
  stability: number;
  collaboration: number;
  projects: string[];
  growthTimeline: GrowthPoint[];
  scores: ScoreBreakdown;
};

export type SkillNode = {
  skill: string;
  transfer: string[];
};
