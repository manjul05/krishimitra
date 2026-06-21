"use client";

import { motion } from "framer-motion";

type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <motion.div
      className={`km-skeleton rounded-xl ${className}`}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="km-glass rounded-2xl p-6">
      <Skeleton className="mb-4 h-11 w-11" />
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
  );
}
