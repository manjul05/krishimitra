"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const trustBadges = [
  { value: "98%", label: "Accuracy" },
  { value: "120+", label: "Diseases" },
  { value: "12", label: "Languages" },
];

function HeroMockup() {
  return (
    <motion.div
      className="relative mx-auto w-full max-w-sm lg:max-w-none"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative mx-auto w-[280px] sm:w-[300px]">
        <div className="absolute -inset-4 rounded-[2.5rem] bg-km-green/10 blur-2xl dark:bg-km-green/20" />

        <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-gray-900 bg-gray-900 shadow-2xl shadow-km-green/20 dark:border-gray-700">
          <div className="flex items-center justify-between bg-gray-900 px-5 py-2">
            <span className="text-[10px] font-medium text-white/70">9:41</span>
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
              <span className="h-2 w-2 rounded-full bg-white/40" />
            </div>
          </div>

          <div className="bg-white p-4 dark:bg-gray-950">
            <div className="mb-3 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-km-green-light text-sm dark:bg-km-green/30">
                🌾
              </span>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  Disease Scan
                </p>
                <p className="text-[10px] text-gray-500">AI Analysis</p>
              </div>
            </div>

            <div className="relative mb-3 overflow-hidden rounded-xl bg-km-green-light/50 dark:bg-km-green/10">
              <div className="relative aspect-[4/3]">
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-km-hero-start to-km-hero-end dark:from-km-green-dark/40 dark:to-km-green/20">
                  <svg
                    viewBox="0 0 120 80"
                    className="h-20 w-28 text-km-green/60"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <ellipse cx="60" cy="40" rx="50" ry="30" opacity="0.3" />
                    <path
                      d="M30 50 Q45 20 60 35 Q75 20 90 50 Q75 65 60 55 Q45 65 30 50"
                      opacity="0.8"
                    />
                    <path
                      d="M55 30 Q58 45 65 50"
                      stroke="#c0392b"
                      strokeWidth="2"
                      fill="none"
                      opacity="0.7"
                    />
                    <circle cx="58" cy="38" r="4" fill="#c0392b" opacity="0.6" />
                    <circle cx="68" cy="45" r="3" fill="#c0392b" opacity="0.5" />
                  </svg>
                </div>

                <div className="km-scan-line absolute left-0 right-0 h-0.5 bg-km-green shadow-[0_0_12px_rgba(26,92,46,0.6)]" />

                <div className="absolute inset-0 border-2 border-km-green/30 rounded-xl" />
                <div className="absolute left-2 top-2 rounded bg-km-green px-1.5 py-0.5 text-[9px] font-bold text-white">
                  SCANNING
                </div>
              </div>
            </div>

            <motion.div
              className="rounded-xl border border-km-border/60 bg-km-green-light/40 p-3 dark:border-km-green/20 dark:bg-km-green/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-km-green dark:text-km-green-muted">
                  ✓ Result Found
                </span>
                <span className="rounded-full bg-km-green/10 px-2 py-0.5 text-[10px] font-bold text-km-green">
                  94.2%
                </span>
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">
                Leaf Rust (Puccinia triticina)
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-gray-600 dark:text-gray-400">
                Apply fungicide spray. Remove infected leaves.
              </p>
              <div className="mt-2 flex gap-1">
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                  Moderate
                </span>
                <span className="rounded-md bg-km-green-light px-1.5 py-0.5 text-[9px] font-medium text-km-green dark:bg-km-green/20">
                  Treatable
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute -right-4 top-16 km-glass rounded-xl px-3 py-2 shadow-lg sm:-right-8"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <p className="text-[10px] font-medium km-text-muted">Accuracy</p>
          <p className="text-lg font-bold text-km-green">98%</p>
        </motion.div>

        <motion.div
          className="absolute -left-4 bottom-24 km-glass rounded-xl px-3 py-2 shadow-lg sm:-left-8"
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <p className="text-[10px] font-medium km-text-muted">Diseases</p>
          <p className="text-lg font-bold text-km-green">120+</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="km-hero-glow relative overflow-hidden px-4 py-14 md:px-10 md:py-20 lg:py-24">
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-km-border/60 km-glass px-4 py-1.5 text-sm font-medium text-km-green"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-km-green text-[10px] text-white">
              🇮🇳
            </span>
            Trusted by farmers across India
          </motion.span>

          <h1 className="mb-5 text-4xl font-bold leading-[1.12] tracking-tight km-text-primary md:text-5xl lg:text-[3.25rem]">
            AI-Powered Farming,{" "}
            <span className="bg-linear-to-r from-km-green to-km-green-muted bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="mb-8 max-w-lg text-lg leading-relaxed km-text-muted md:text-xl">
            Detect crop diseases instantly, get smart recommendations, and connect
            with farmers — all in your language.
          </p>

          <div className="mb-8 flex flex-wrap gap-3">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                className="km-glass rounded-xl px-4 py-2.5 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                <p className="text-xl font-bold text-km-green">{badge.value}</p>
                <p className="text-xs km-text-muted">{badge.label}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/detect"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-km-green px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-km-green/25 transition-all hover:bg-km-green-dark hover:shadow-xl hover:shadow-km-green/30"
            >
              📸 Scan Crop Disease
            </Link>
            <a
              href="#ai-chat"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-km-border km-glass px-7 py-3.5 text-base font-semibold text-km-green transition-all hover:border-km-green/40"
            >
              🤖 Talk to AI
            </a>
          </div>
        </motion.div>

        <HeroMockup />
      </div>
    </section>
  );
}
