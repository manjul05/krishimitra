"use client";

import { motion } from "framer-motion";
import type { Stats } from "@/types/disease";

type StatsCardsProps = {
  stats: Stats;
};

const statConfig = [
  {
    key: "total_diseases" as const,
    label: "Total Diseases",
    icon: "🦠",
    color: "text-km-green",
  },
  {
    key: "crop_count" as const,
    label: "Total Crops",
    icon: "🌾",
    color: "text-emerald-600 dark:text-emerald-400",
  },
  {
    key: "high_severity_count" as const,
    label: "High Severity",
    icon: "⚠️",
    color: "text-red-600 dark:text-red-400",
  },
];

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {statConfig.map((item, i) => (
        <motion.div
          key={item.key}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20"
        >
          <span className="mb-3 block text-2xl" aria-hidden="true">
            {item.icon}
          </span>
          <p className={`text-3xl font-bold sm:text-4xl ${item.color}`}>
            {stats[item.key]}
          </p>
          <p className="mt-1 text-sm km-text-muted">{item.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20"
        >
          <div className="km-skeleton mb-3 h-8 w-8 rounded-lg" />
          <div className="km-skeleton mb-2 h-10 w-16 rounded-lg" />
          <div className="km-skeleton h-4 w-28 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
