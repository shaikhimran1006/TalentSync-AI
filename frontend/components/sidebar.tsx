import Link from "next/link";
import { Brain, LayoutDashboard, MessageSquareText, LineChart, Users } from "lucide-react";

const navItems = [
  { href: "/", label: "Recruiter Dashboard", icon: LayoutDashboard },
  { href: "/candidates", label: "Candidates", icon: Users },
  { href: "/analytics", label: "Analytics", icon: LineChart },
  { href: "/chat", label: "Recruiter Copilot", icon: MessageSquareText }
];

export default function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 flex-col gap-8 border-r border-white/10 bg-slate-950/80 px-6 py-8 lg:flex">
      <div className="flex items-center gap-3 text-white">
        <div className="rounded-2xl bg-cyan-400/20 p-2">
          <Brain className="h-6 w-6 text-cyan-300" />
        </div>
        <div>
          <p className="text-lg font-semibold">TalentSync AI</p>
          <p className="text-xs text-white/60">Hiring Intelligence</p>
        </div>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4 text-xs text-white/60">
        <p className="text-white">TalentSync Signal</p>
        <p>AI engine running at 98ms latency</p>
      </div>
    </aside>
  );
}
