"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { Disease } from "@/types/disease";

const severityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function getSeverityClass(severity: string): string {
  const key = severity.toLowerCase();
  return severityStyles[key] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

type DiseaseCardProps = {
  disease: Disease;
  index?: number;
};

export default function DiseaseCard({ disease, index = 0 }: DiseaseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        href={`/diseases/${disease.id}`}
        className="group block overflow-hidden rounded-2xl border border-km-border km-glass km-glass-hover dark:border-km-green/20"
      >
        <div className="relative h-40 overflow-hidden bg-km-green-light/30 sm:h-44">
          {disease.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={disease.image}
              alt={`${disease.disease} on ${disease.crop}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🌿</div>
          )}
          <span
            className={`absolute right-3 top-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${getSeverityClass(disease.severity)}`}
          >
            {disease.severity}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-km-green">
            {disease.crop}
          </p>
          <h3 className="mb-2 text-base font-bold km-text-primary transition-colors group-hover:text-km-green sm:text-lg">
            {disease.disease}
          </h3>
          <p className="line-clamp-2 text-sm km-text-muted">{disease.symptoms}</p>
        </div>
      </Link>
    </motion.div>
  );
}
