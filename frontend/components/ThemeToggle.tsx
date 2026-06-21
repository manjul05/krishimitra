"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Theme toggle button for the navbar.
 * Avoids hydration mismatch by rendering only after mount.
 */
export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className="h-9 w-9 rounded-xl border border-km-border/60 bg-white/80 dark:border-km-green/20 dark:bg-km-green-dark/40"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-xl border border-km-border/60 bg-white/80 text-lg transition-colors hover:border-km-green/40 dark:border-km-green/20 dark:bg-km-green-dark/40"
      whileTap={{ scale: 0.92 }}
    >
      {isDark ? "☀️" : "🌙"}
    </motion.button>
  );
}
