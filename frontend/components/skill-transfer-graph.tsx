"use client";

import { motion } from "framer-motion";

import type { SkillNode } from "@/lib/types";

export default function SkillTransferGraph({ nodes }: { nodes: SkillNode[] }) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="relative z-10 grid h-full grid-cols-2 gap-4">
        {nodes.map((node, index) => (
          <motion.div
            key={node.skill}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="rounded-2xl border border-cyan-400/20 bg-slate-950/70 p-4"
          >
            <p className="text-sm font-semibold text-cyan-200">{node.skill}</p>
            <p className="mt-2 text-xs text-white/70">Transfer to: {node.transfer.join(", ")}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
