"use client";

import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedItem, AnimatedSection } from "./AnimatedSection";

const steps = [
  {
    step: 1,
    title: "Upload a Photo",
    description:
      "Snap or upload a picture of your affected crop leaves or fruit.",
    icon: "📸",
  },
  {
    step: 2,
    title: "AI Analyzes Instantly",
    description:
      "Our model scans for disease patterns in seconds — no lab needed.",
    icon: "🤖",
  },
  {
    step: 3,
    title: "Get Diagnosis & Treatment",
    description:
      "Receive clear results with treatment steps and prevention tips.",
    icon: "💊",
  },
  {
    step: 4,
    title: "Connect & Grow",
    description:
      "Share insights with the farmer community and track your progress.",
    icon: "🌱",
  },
];

export default function HowItWorks() {
  return (
    <AnimatedSection
      className="px-4 py-16 md:px-10 md:py-20"
      stagger
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Simple Process"
          title="How It Works"
          subtitle="From photo to action plan in four simple steps."
        />

        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-10 hidden h-px bg-linear-to-r from-transparent via-km-border to-transparent lg:block"
            aria-hidden="true"
          />

          {steps.map((item) => (
            <AnimatedItem key={item.step}>
              <motion.div
                className="relative km-glass km-glass-hover rounded-2xl p-6 text-center"
                whileHover={{ y: -4 }}
              >
                <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-km-green/20 bg-km-green-light/50 text-2xl dark:bg-km-green/20">
                  {item.icon}
                </div>
                <div className="mb-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-km-green text-xs font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold km-text-primary">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed km-text-muted">
                  {item.description}
                </p>
              </motion.div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
