"use client";

import { useEffect, useState } from "react";

import AiInsight from "@/components/ai-insight";
import GrowthTimeline from "@/components/growth-timeline";
import SkillTransferGraph from "@/components/skill-transfer-graph";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { fetchCandidate, fetchCandidates } from "@/lib/api";
import { candidates as fallbackCandidates, skillTransferGraph } from "@/lib/mock-data";
import type { Candidate } from "@/lib/types";

export default function CandidateProfile({ params }: { params: { id: string } }) {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [similar, setSimilar] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCandidate = async () => {
      setIsLoading(true);
      const fetched = await fetchCandidate(params.id);
      if (fetched) {
        setCandidate(fetched);
        const list = await fetchCandidates();
        setSimilar(list.filter((item) => item.id !== fetched.id).slice(0, 2));
      } else {
        const fallback = fallbackCandidates.find((item) => item.id === params.id) ?? null;
        setCandidate(fallback);
        setSimilar(fallbackCandidates.filter((item) => item.id !== params.id).slice(0, 2));
      }
      setIsLoading(false);
    };

    void loadCandidate();
  }, [params.id]);

  if (isLoading) {
    return <p className="text-sm text-white/60">Loading candidate...</p>;
  }

  if (!candidate) {
    return <p className="text-sm text-white/60">Candidate not found.</p>;
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{candidate.name}</CardTitle>
          <p className="text-sm text-white/60">{candidate.role} • {candidate.location}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-white/70">{candidate.summary}</p>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.map((skill) => (
              <Badge key={skill}>{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Fit Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl text-white">{Math.round(candidate.scores.finalScore * 100)}%</p>
            <Progress value={candidate.scores.finalScore} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Behavioral Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl text-white">{Math.round(candidate.scores.behavioralScore * 100)}%</p>
            <Progress value={candidate.scores.behavioralScore} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Velocity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl text-white">{Math.round(candidate.scores.learningVelocity * 100)}%</p>
            <Progress value={candidate.scores.learningVelocity} className="mt-4" />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Growth Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <GrowthTimeline points={candidate.growthTimeline} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Transferable Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillTransferGraph nodes={skillTransferGraph} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <AiInsight
          title="Recruiter Explanation"
          body="Candidate lacks direct Kubernetes leadership but demonstrates strong infra adaptability through Docker, AWS, and CI/CD ownership."
        />
        <AiInsight
          title="Risk Factors"
          body="Moderate stability score. Validate tenure continuity and leadership references."
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Similar Candidates</CardTitle>
          <p className="text-sm text-white/60">Semantic similarity based on transferable skills.</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {similar.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="text-xs text-white/60">{item.role}</p>
              </div>
              <p className="text-sm text-cyan-200">{Math.round(item.scores.finalScore * 100)}%</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
