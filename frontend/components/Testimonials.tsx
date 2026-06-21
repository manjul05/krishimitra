"use client";

import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedItem, AnimatedSection } from "./AnimatedSection";

const testimonials = [
  {
    name: "Rajesh Kumar",
    state: "Punjab",
    avatar: "RK",
    avatarBg: "#e8f5ec",
    rating: 5,
    text: "KrishiMitra detected wheat rust on my crop before I even noticed. Saved my entire harvest this season!",
  },
  {
    name: "Lakshmi Devi",
    state: "Andhra Pradesh",
    avatar: "LD",
    avatarBg: "#dbeafe",
    rating: 5,
    text: "The Hindi AI assistant helped me choose the right fertilizer. Very easy to use on my phone.",
  },
  {
    name: "Suresh Patil",
    state: "Maharashtra",
    avatar: "SP",
    avatarBg: "#ffedd5",
    rating: 4,
    text: "Market price alerts help me sell at the right time. Best farming app I've used in 20 years.",
  },
  {
    name: "Priya Sharma",
    state: "Uttar Pradesh",
    avatar: "PS",
    avatarBg: "#f3e8ff",
    rating: 5,
    text: "Government scheme information was always confusing. KrishiMitra made PM-KISAN application simple.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={i < count ? "text-amber-400" : "text-gray-300 dark:text-gray-600"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <AnimatedSection
      id="testimonials"
      className="bg-km-green-light/20 px-4 py-16 dark:bg-km-green-dark/20 md:px-10 md:py-20"
      stagger
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Testimonials"
          title="Trusted by Farmers Nationwide"
          subtitle="Real stories from farmers who transformed their harvest with KrishiMitra."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((t) => (
            <AnimatedItem key={t.name}>
              <motion.div
                className="km-glass km-glass-hover flex h-full flex-col rounded-2xl p-6"
                whileHover={{ y: -4 }}
              >
                <StarRating count={t.rating} />
                <p className="my-4 flex-1 text-sm leading-relaxed km-text-muted">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-km-border/40 pt-4 dark:border-km-green/15">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-km-green"
                    style={{ backgroundColor: t.avatarBg }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold km-text-primary">{t.name}</p>
                    <p className="text-xs km-text-muted">{t.state}, India</p>
                  </div>
                </div>
              </motion.div>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
