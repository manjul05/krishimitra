"use client";

import { motion } from "framer-motion";
import { AnimatedHeading, AnimatedItem, AnimatedSection } from "./AnimatedSection";

const schemes = [
  {
    title: "PM-KISAN",
    subtitle: "Direct Income Support",
    description:
      "₹6,000 per year in three installments directly to farmer bank accounts.",
    icon: "💰",
    iconBg: "#e8f5ec",
    link: "https://pmkisan.gov.in/",
  },
  {
    title: "Crop Insurance",
    subtitle: "PM Fasal Bima Yojana",
    description:
      "Comprehensive crop insurance against natural calamities at subsidized premium rates.",
    icon: "🛡️",
    iconBg: "#dbeafe",
    link: "https://pmfby.gov.in/",
  },
  {
    title: "Subsidies",
    subtitle: "Fertilizer & Seed Support",
    description:
      "Government subsidies on urea, DAP, seeds, and farm equipment through DBT.",
    icon: "🌱",
    iconBg: "#ffedd5",
    link: "#",
  },
  {
    title: "Kisan Credit Card",
    subtitle: "Easy Farm Loans",
    description:
      "Collateral-free credit up to ₹3 lakh at 4% interest for agricultural needs.",
    icon: "🏦",
    iconBg: "#f3e8ff",
    link: "#",
  },
];

export default function GovernmentSchemes() {
  return (
    <AnimatedSection
      id="schemes"
      className="bg-km-green-light/20 px-4 py-16 dark:bg-km-green-dark/20 md:px-10 md:py-20"
      stagger
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Government Schemes"
          title="Support Programs for Farmers"
          subtitle="Access key government initiatives — subsidies, insurance, and financial aid made simple."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {schemes.map((scheme) => (
            <AnimatedItem key={scheme.title}>
              <motion.a
                href={scheme.link}
                target={scheme.link.startsWith("http") ? "_blank" : undefined}
                rel={scheme.link.startsWith("http") ? "noopener noreferrer" : undefined}
                className="group km-glass km-glass-hover flex h-full flex-col rounded-2xl p-6 no-underline"
                whileHover={{ y: -4 }}
              >
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: scheme.iconBg }}
                >
                  {scheme.icon}
                </div>
                <h3 className="mb-1 text-lg font-bold km-text-primary">{scheme.title}</h3>
                <p className="mb-2 text-xs font-semibold text-km-green">{scheme.subtitle}</p>
                <p className="flex-1 text-sm leading-relaxed km-text-muted">
                  {scheme.description}
                </p>
                <span className="mt-4 text-xs font-semibold text-km-green transition-colors group-hover:text-km-green-dark">
                  Learn more →
                </span>
              </motion.a>
            </AnimatedItem>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
