import { candidates as mockCandidates } from "./mock-data";
import type { Candidate, GrowthPoint, ScoreBreakdown } from "./types";

type ApiGrowthPoint = {
  year: number;
  level: string;
};

type ApiCandidate = {
  id: string;
  name: string;
  role: string;
  location: string;
  experience_years: number;
  summary: string;
  skills: string[];
  domains: string[];
  leadership: number;
  learning_velocity: number;
  stability: number;
  collaboration: number;
  projects: string[];
  growth_timeline?: ApiGrowthPoint[];
};

type ApiScores = {
  semantic_match: number;
  technical_fit: number;
  behavioral_score: number;
  learning_velocity: number;
  domain_match: number;
  stability_score: number;
};

type ApiRankedCandidate = {
  candidate: ApiCandidate;
  scores: ApiScores;
  final_score: number;
  explanation: string;
  risk_flags: string[];
  strengths: string[];
  gaps: string[];
  transfers: string[];
};

type JobDna = {
  technical_skills: string[];
  hidden_skills: string[];
  soft_skills: string[];
  domain_requirements: string[];
  leadership_requirements: string[];
  communication_expectations: string[];
  work_style: string[];
  culture_fit: string[];
  adaptability_needs: string[];
  learning_expectations: string[];
  preferred_behaviors: string[];
};

type JobAnalyzeResponse = {
  job_id: string;
  dna: JobDna;
};

type ChatResponse = {
  answer: string;
  selected_ids: string[];
  rationale: string;
};

const defaultScores: ScoreBreakdown = {
  semanticMatch: 0,
  technicalFit: 0,
  behavioralScore: 0,
  learningVelocity: 0,
  domainMatch: 0,
  stabilityScore: 0,
  finalScore: 0
};

const mapGrowth = (points?: ApiGrowthPoint[]): GrowthPoint[] =>
  (points ?? []).map((point) => ({ year: point.year, level: point.level }));

const mapScores = (scores?: ApiScores, finalScore?: number): ScoreBreakdown => ({
  semanticMatch: scores?.semantic_match ?? 0,
  technicalFit: scores?.technical_fit ?? 0,
  behavioralScore: scores?.behavioral_score ?? 0,
  learningVelocity: scores?.learning_velocity ?? 0,
  domainMatch: scores?.domain_match ?? 0,
  stabilityScore: scores?.stability_score ?? 0,
  finalScore: finalScore ?? 0
});

const mapCandidate = (candidate: ApiCandidate, scores?: ApiScores, finalScore?: number): Candidate => ({
  id: candidate.id,
  name: candidate.name,
  role: candidate.role,
  location: candidate.location,
  experienceYears: candidate.experience_years,
  summary: candidate.summary,
  skills: candidate.skills,
  domains: candidate.domains,
  leadership: candidate.leadership,
  learningVelocity: candidate.learning_velocity,
  stability: candidate.stability,
  collaboration: candidate.collaboration,
  projects: candidate.projects,
  growthTimeline: mapGrowth(candidate.growth_timeline),
  scores: scores ? mapScores(scores, finalScore) : defaultScores
});

export async function fetchCandidates(): Promise<Candidate[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return mockCandidates;
  }

  try {
    const response = await fetch(`${baseUrl}/candidates`, { cache: "no-store" });
    if (!response.ok) {
      return mockCandidates;
    }
    const data = await response.json();
    const candidates = (data.candidates ?? []) as ApiCandidate[];
    return candidates.map((candidate) => mapCandidate(candidate));
  } catch {
    return mockCandidates;
  }
}

export async function analyzeJob(input: { title: string; description: string }): Promise<string[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/jobs/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: input.title, description: input.description })
  });

  if (!response.ok) {
    throw new Error("Job analysis failed");
  }

  const data = (await response.json()) as JobAnalyzeResponse;
  const dna = data.dna;
  return [
    ...dna.technical_skills,
    ...dna.hidden_skills,
    ...dna.soft_skills,
    ...dna.domain_requirements,
    ...dna.leadership_requirements,
    ...dna.communication_expectations,
    ...dna.work_style,
    ...dna.culture_fit,
    ...dna.adaptability_needs,
    ...dna.learning_expectations,
    ...dna.preferred_behaviors
  ].slice(0, 16);
}

export async function rankCandidates(input: {
  jobTitle: string;
  jobDescription: string;
}): Promise<Candidate[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/rank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_title: input.jobTitle,
      job_description: input.jobDescription
    })
  });

  if (!response.ok) {
    throw new Error("Ranking request failed");
  }

  const data = await response.json();
  const ranked = (data.ranked_candidates ?? []) as ApiRankedCandidate[];
  return ranked.map((item) => mapCandidate(item.candidate, item.scores, item.final_score));
}

export async function downloadRankedCandidatesPdf(input: {
  jobTitle: string;
  jobDescription: string;
  topN?: number;
}): Promise<Blob> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/rank/pdf`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_title: input.jobTitle,
      job_description: input.jobDescription,
      top_n: input.topN ?? 5
    })
  });

  if (!response.ok) {
    throw new Error("PDF download failed");
  }

  return await response.blob();
}

export async function sendChat(input: {
  query: string;
  jobTitle: string;
  jobDescription: string;
}): Promise<ChatResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const response = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: input.query,
      job_title: input.jobTitle,
      job_description: input.jobDescription
    })
  });

  if (!response.ok) {
    throw new Error("Chat request failed");
  }

  return (await response.json()) as ChatResponse;
}

export async function fetchCandidate(candidateId: string): Promise<Candidate | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    const fallback = mockCandidates.find((candidate) => candidate.id === candidateId);
    return fallback ?? null;
  }

  try {
    const response = await fetch(`${baseUrl}/candidates/${candidateId}`, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const candidate = data.candidate as ApiCandidate | undefined;
    return candidate ? mapCandidate(candidate) : null;
  } catch {
    return null;
  }
}

export async function uploadResume(file: File): Promise<Candidate> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${baseUrl}/candidates/parse`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Resume parsing failed");
  }

  const data = await response.json();
  const candidate = data.candidate as ApiCandidate | undefined;
  if (!candidate) {
    throw new Error("Resume parsing failed");
  }
  return mapCandidate(candidate);
}
