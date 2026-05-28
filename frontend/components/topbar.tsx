import { Sparkles } from "lucide-react";

import { Input } from "@/components/ui/input";

export default function Topbar() {
  return (
    <div className="flex flex-col gap-4 border-b border-white/10 bg-slate-950/60 px-6 py-6 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/80">TalentSync AI</p>
        <h1 className="font-display text-2xl text-white">Recruiter Intelligence Command</h1>
      </div>
      <div className="flex w-full items-center gap-3 lg:w-96">
        <Input placeholder="Search roles, skills, candidates" />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200">
          <Sparkles className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
