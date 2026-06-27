"use client";

import { motion } from "framer-motion";

type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Something went wrong while loading data.",
  onRetry,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 px-6 py-14 text-center dark:border-red-900/40 dark:bg-red-950/20"
      role="alert"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-3xl dark:bg-red-900/30">
        ⚠️
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-800 dark:text-red-300">
        Failed to Load
      </h3>
      <p className="mb-6 max-w-md text-sm text-red-700 dark:text-red-400">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-xl border border-red-300 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/30"
        >
          Try Again
        </button>
      )}
    </motion.div>
  );
}
