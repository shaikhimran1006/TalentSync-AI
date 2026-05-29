"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import AiInsight from "@/components/ai-insight";
import CandidateTable from "@/components/candidate-table";
import MetricCard from "@/components/metric-card";
import SkillTransferGraph from "@/components/skill-transfer-graph";
import { analyzeJob, downloadRankedCandidatesPdf, rankCandidates } from "@/lib/api";
import { candidates as fallbackCandidates, skillTransferGraph } from "@/lib/mock-data";
import type { Candidate } from "@/lib/types";

const defaultJobDescription =
  "We are hiring a Senior AI Platform Engineer to build scalable GenAI infrastructure. " +
  "You will own vector search, async APIs, cloud reliability, and mentor engineers.";

const defaultTags = [
  "Vector Search",
  "AI Platform",
  "Async APIs",
  "Cloud Reliability",
  "Mentorship",
  "Ownership",
  "Startup Mindset"
];

export default function DashboardPage() {
  const router = useRouter();
  const [jobTitle, setJobTitle] = useState("Senior AI Platform Engineer");
  const [jobDescription, setJobDescription] = useState(defaultJobDescription);
  const [dnaTags, setDnaTags] = useState<string[]>(defaultTags);
  const [rankedCandidates, setRankedCandidates] = useState<Candidate[]>(fallbackCandidates);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError("");
    setStatus("Analyzing job description...");
    try {
      const tags = await analyzeJob({ title: jobTitle || "Role", description: jobDescription });
      if (tags.length) {
        setDnaTags(tags);
      }
      setStatus("Ideal Candidate DNA refreshed.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Job analysis failed.";
      setError(message);
    }
  };

  const handleRank = async () => {
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError("");
    setStatus("Ranking candidates...");
    try {
      const ranked = await rankCandidates({ jobTitle: jobTitle || "Role", jobDescription });
      if (ranked.length) {
        setRankedCandidates(ranked);
      }
      setStatus("Ranking complete.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ranking failed.";
      setError(message);
    }
  };

  const handleDownload = async () => {
    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    setError("");
    setStatus("Preparing PDF...");
    setIsDownloading(true);

    try {
      const blob = await downloadRankedCandidatesPdf({
        jobTitle: jobTitle || "Role",
        jobDescription,
        topN: 5
      });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "top-ranked-candidates.pdf";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      setStatus("PDF downloaded.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "PDF download failed.";
      setError(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-10">
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh opacity-80" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl">Ideal Candidate DNA</CardTitle>
            <p className="text-sm text-white/70">
              AI synthesized DNA from the current job description.
            </p>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div className="flex flex-wrap gap-2">
              {(dnaTags.length ? dnaTags : defaultTags).map((item) => (
                <Badge key={item}>{item}</Badge>
              ))}
            </div>
            <div className="grid gap-3">
              <Input
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="Job title"
              />
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Paste job description to analyze"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleAnalyze}>Analyze Job Description</Button>
              <Button variant="outline" onClick={handleRank}>Run Ranking</Button>
            </div>
            {status ? <p className="text-xs text-cyan-200">{status}</p> : null}
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}
          </CardContent>
        </Card>
        <div className="space-y-6">
          <MetricCard
            title="Semantic Match Velocity"
            value="92%"
            trend="+12% vs last cycle"
            progress={0.92}
          />
          <MetricCard
            title="Behavioral Signal Confidence"
            value="88%"
            trend="High growth potential"
            progress={0.88}
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <MetricCard title="Candidates Ranked" value="126" trend="Last 24 hours" progress={0.7} />
        <MetricCard title="AI Explainability" value="97%" trend="Recruiter clarity" progress={0.97} />
        <MetricCard title="Transferable Skills" value="64" trend="Auto-detected" progress={0.64} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Top Ranked Candidates</CardTitle>
              <p className="text-sm text-white/60">Semantic ranking with recruiter-grade reasoning.</p>
            </div>
            <Button variant="outline" onClick={handleDownload} disabled={isDownloading}>
              {isDownloading ? "Preparing PDF..." : "Download Top 5 PDF"}
            </Button>
          </CardHeader>
          <CardContent>
            <CandidateTable data={rankedCandidates} />
          </CardContent>
        </Card>
        <div className="space-y-6">
          <AiInsight
            title="Recruiter Insight"
            body="Ava Chen leads due to strong platform depth and FAISS experience. Mateo Singh is a close second with strong AI product delivery and UX alignment."
          />
          <AiInsight
            title="Risk Detector"
            body="Two candidates show early tenure volatility. Consider validating leadership references during screening."
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Skill Transferability Graph</CardTitle>
            <p className="text-sm text-white/60">Adjacent skills inferred by semantic reasoning.</p>
          </CardHeader>
          <CardContent>
            <SkillTransferGraph nodes={skillTransferGraph} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recruiter Copilot Prompts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/70">
            <p>Show candidates strong in backend systems and adaptable to GenAI.</p>
            <p>Find candidates similar to Ava Chen but with stronger frontend impact.</p>
            <p>Who has the highest leadership potential?</p>
            <Button variant="ghost" onClick={() => router.push("/chat")}>Open Copilot</Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
