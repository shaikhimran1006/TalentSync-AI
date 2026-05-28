"use client";

import { motion } from "framer-motion";

import type { GrowthPoint } from "@/lib/types";

export default function GrowthTimeline({ points }: { points: GrowthPoint[] }) {
  return (
    <div className="space-y-4">
      {points.map((point, index) => (
        <motion.div
          key={`${point.year}-${point.level}`}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
        >
          <div className="h-3 w-3 rounded-full bg-cyan-300" />
          <div>
            <p className="text-sm font-semibold text-white">{point.level}</p>
            <p className="text-xs text-white/60">{point.year}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
