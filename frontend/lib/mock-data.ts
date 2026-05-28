import type { Candidate, SkillNode } from "./types";

export const candidates: Candidate[] = [
  {
    id: "cand_ava_chen",
    name: "Ava Chen",
    role: "AI Platform Engineer",
    location: "San Francisco, CA",
    experienceYears: 7,
    summary: "AI platform engineer with 7+ years building ML infrastructure and vector search systems.",
    skills: ["Python", "FastAPI", "FAISS", "Docker", "Kubernetes", "AWS", "Terraform"],
    domains: ["AI Platform", "Infrastructure"],
    leadership: 0.82,
    learningVelocity: 0.78,
    stability: 0.74,
    collaboration: 0.8,
    projects: ["Retrieval system", "Kubernetes migration", "Model serving"],
    growthTimeline: [
      { year: 2019, level: "Senior Engineer" },
      { year: 2021, level: "Lead Engineer" },
      { year: 2023, level: "Platform Lead" }
    ],
    scores: {
      semanticMatch: 0.92,
      technicalFit: 0.88,
      behavioralScore: 0.84,
      learningVelocity: 0.78,
      domainMatch: 0.86,
      stabilityScore: 0.74,
      finalScore: 0.86
    }
  },
  {
    id: "cand_mateo_singh",
    name: "Mateo Singh",
    role: "Full Stack Product Engineer",
    location: "Austin, TX",
    experienceYears: 6,
    summary: "Full stack engineer delivering AI dashboards, semantic ranking, and recruiter analytics.",
    skills: ["TypeScript", "Next.js", "React", "Python", "FastAPI", "Recharts"],
    domains: ["Recruiting Tech", "AI Product"],
    leadership: 0.7,
    learningVelocity: 0.84,
    stability: 0.68,
    collaboration: 0.86,
    projects: ["Recruiter analytics", "LLM insights", "Semantic ranking"],
    growthTimeline: [
      { year: 2020, level: "Engineer" },
      { year: 2022, level: "Senior Engineer" },
      { year: 2024, level: "Product Engineer" }
    ],
    scores: {
      semanticMatch: 0.88,
      technicalFit: 0.8,
      behavioralScore: 0.83,
      learningVelocity: 0.84,
      domainMatch: 0.82,
      stabilityScore: 0.68,
      finalScore: 0.83
    }
  },
  {
    id: "cand_nora_patel",
    name: "Nora Patel",
    role: "ML Engineer",
    location: "New York, NY",
    experienceYears: 5,
    summary: "ML engineer focused on embeddings, rerankers, and semantic matching systems.",
    skills: ["Python", "PyTorch", "Sentence Transformers", "spaCy", "FAISS"],
    domains: ["NLP", "Search"],
    leadership: 0.62,
    learningVelocity: 0.9,
    stability: 0.6,
    collaboration: 0.78,
    projects: ["Embedding pipelines", "Reranker tuning", "Skill taxonomy"],
    growthTimeline: [
      { year: 2021, level: "ML Engineer" },
      { year: 2023, level: "Senior ML Engineer" }
    ],
    scores: {
      semanticMatch: 0.86,
      technicalFit: 0.76,
      behavioralScore: 0.79,
      learningVelocity: 0.9,
      domainMatch: 0.75,
      stabilityScore: 0.6,
      finalScore: 0.8
    }
  }
];

export const skillTransferGraph: SkillNode[] = [
  { skill: "PyTorch", transfer: ["TensorFlow", "JAX"] },
  { skill: "Docker", transfer: ["Kubernetes", "Containerd"] },
  { skill: "AWS", transfer: ["GCP", "Azure"] },
  { skill: "FastAPI", transfer: ["Django", "Starlette"] }
];

export const skillDemand = [
  { skill: "Vector Search", value: 88 },
  { skill: "Async APIs", value: 82 },
  { skill: "AI Product", value: 76 },
  { skill: "Observability", value: 64 }
];

export const fitDistribution = [
  { name: "90-100", value: 2 },
  { name: "80-89", value: 3 },
  { name: "70-79", value: 4 },
  { name: "60-69", value: 1 }
];

export const heatmapData = [
  { category: "Leadership", score: 0.78 },
  { category: "Adaptability", score: 0.82 },
  { category: "Growth", score: 0.85 },
  { category: "Culture Fit", score: 0.8 }
];
