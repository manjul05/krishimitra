"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "./AnimatedSection";

type StatItem = {
  value: number;
  suffix: string;
  label: string;
  decimals?: number;
};

const stats: StatItem[] = [
  { value: 10000, suffix: "+", label: "Farmers Helped" },
  { value: 50000, suffix: "+", label: "Diseases Detected" },
  { value: 12, suffix: "", label: "Languages Supported" },
  { value: 98, suffix: "%", label: "Diagnosis Accuracy", decimals: 0 },
];

function AnimatedCounter({
  value,
  suffix,
  decimals = 0,
  inView,
}: {
  value: number;
  suffix: string;
  decimals?: number;
  inView: boolean;
}) {
  const spring = useSpring(0, { stiffness: 50, damping: 20 });
  const display = useTransform(spring, (v) => {
    if (decimals === 0 && value >= 100) {
      return Math.round(v).toLocaleString("en-IN") + suffix;
    }
    return v.toFixed(decimals) + suffix;
  });
  const [text, setText] = useState("0" + suffix);

  useEffect(() => {
    if (inView) spring.set(value);
  }, [inView, spring, value]);

  useEffect(() => {
    return display.on("change", (v) => setText(v));
  }, [display]);

  return <span>{text}</span>;
}

export default function SmartStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <AnimatedSection className="px-4 py-12 md:px-10 md:py-16">
      <div ref={ref} className="mx-auto max-w-6xl">
        <motion.div
          className="mb-8 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-km-border/60 km-glass px-4 py-1.5 text-sm font-medium text-km-green">
            <span aria-hidden="true">🇮🇳</span>
            Trusted by farmers across India
          </span>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="km-glass km-glass-hover rounded-2xl px-5 py-6 text-center md:px-6 md:py-8"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-2xl font-bold text-km-green md:text-3xl lg:text-4xl">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  inView={inView}
                />
              </p>
              <p className="mt-2 text-xs font-medium km-text-muted md:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
