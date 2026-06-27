"use client";

import { motion } from "framer-motion";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = "No diseases found",
  description = "Try searching for a different crop or check back later.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-km-border km-glass px-6 py-16 text-center dark:border-km-green/20"
    >
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-km-green-light/60 text-4xl dark:bg-km-green/20">
        🌱
      </div>
      <h3 className="mb-2 text-lg font-semibold km-text-primary sm:text-xl">{title}</h3>
      <p className="mb-6 max-w-sm text-sm km-text-muted sm:text-base">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="rounded-xl bg-km-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-km-green-dark"
        >
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
