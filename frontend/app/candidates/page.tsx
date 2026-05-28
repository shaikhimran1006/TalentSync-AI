"use client";

import { useEffect, useState } from "react";

import CandidateTable from "@/components/candidate-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { fetchCandidates, rankCandidates, uploadResume } from "@/lib/api";
import type { Candidate } from "@/lib/types";

export default function CandidatesPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [lastParsed, setLastParsed] = useState<Candidate | null>(null);
  const [jobTitle, setJobTitle] = useState("Senior AI Platform Engineer");
  const [jobDescription, setJobDescription] = useState(
    "We are hiring a Senior AI Platform Engineer to build scalable GenAI infrastructure. " +
      "You will own vector search, async APIs, cloud reliability, and mentor engineers."
  );

  const loadCandidates = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await fetchCandidates();
      setCandidates(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load candidates.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const runRanking = async () => {
    if (!jobDescription.trim()) {
      setError("Job description is required for ranking.");
      return;
    }

    setIsLoading(true);
    setError("");
    setStatus("Ranking candidates...");
    try {
      const ranked = await rankCandidates({
        jobTitle: jobTitle || "Role",
        jobDescription
      });
      setCandidates(ranked);
      setStatus("Ranking complete.");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ranking failed.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void runRanking();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Select a PDF or DOCX resume first.");
      return;
    }

    setError("");
    setIsLoading(true);
    setStatus("Parsing resume...");
    try {
      const candidate = await uploadResume(selectedFile);
      if (!jobDescription.trim()) {
        setCandidates((prev) => [candidate, ...prev]);
        setLastParsed(candidate);
        setStatus("Resume parsed. Add a job description to rank.");
      } else {
        setStatus("Ranking candidate...");
        try {
          const ranked = await rankCandidates({
            jobTitle: jobTitle || "Role",
            jobDescription
          });
          setCandidates(ranked);
          const updated = ranked.find((item) => item.id === candidate.id) ?? candidate;
          setLastParsed(updated);
          setStatus("Resume parsed and ranked successfully.");
        } catch (rankError) {
          setCandidates((prev) => [candidate, ...prev]);
          setLastParsed(candidate);
          const message = rankError instanceof Error ? rankError.message : "Ranking failed.";
          setError(message);
          setStatus("Resume parsed, ranking unavailable.");
        }
      }
      setSelectedFile(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Resume parsing failed.";
      setError(message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="section-title">Candidate Intelligence Hub</h2>
        <p className="subtle-text">Review, upload, and validate resumes with AI-assisted parsing.</p>
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>Candidate Library</CardTitle>
              <p className="text-sm text-white/60">Live shortlist with semantic scores.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={loadCandidates}>
                View Raw
              </Button>
              <Button onClick={runRanking}>Rank For Job</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid gap-3">
              <Input
                value={jobTitle}
                onChange={(event) => setJobTitle(event.target.value)}
                placeholder="Job title"
              />
              <textarea
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Paste job description for ranking"
              />
            </div>
            {isLoading ? (
              <p className="text-sm text-white/60">Loading candidates...</p>
            ) : (
              <CandidateTable data={candidates} />
            )}
            {status ? <p className="mt-3 text-xs text-cyan-200">{status}</p> : null}
            {error ? <p className="mt-3 text-xs text-rose-300">{error}</p> : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manual Resume Check</CardTitle>
            <p className="text-sm text-white/60">Upload a resume to extract skills and signals.</p>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-white/70">
            <div className="space-y-2">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-cyan-400/20 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-cyan-100"
              />
              <Button onClick={handleUpload}>Parse Resume</Button>
            </div>

            {status ? <p className="text-xs text-cyan-200">{status}</p> : null}
            {error ? <p className="text-xs text-rose-300">{error}</p> : null}

            {lastParsed ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white">Latest parsed candidate</p>
                <p className="text-xs text-white/60">{lastParsed.name}</p>
                <p className="mt-2 text-xs text-white/70">Skills: {lastParsed.skills.join(", ") || "Not detected"}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
