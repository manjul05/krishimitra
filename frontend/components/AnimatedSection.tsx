"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

type AnimatedSectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  stagger?: boolean;
};

export function AnimatedSection({
  children,
  className = "",
  id,
  stagger: useStagger = false,
}: AnimatedSectionProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={useStagger ? stagger : fadeUp}
    >
      {children}
    </motion.section>
  );
}

export function AnimatedItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={fadeUp}>
      {children}
    </motion.div>
  );
}

export function AnimatedHeading({
  label,
  title,
  subtitle,
}: {
  label: string;
  title: string;
  subtitle: string;
}) {
  return (
    <AnimatedSection className="mb-12 text-center">
      <motion.p
        className="km-section-label mb-4"
        variants={fadeUp}
      >
        {label}
      </motion.p>
      <motion.h2
        className="mb-3 text-3xl font-bold tracking-tight km-text-primary md:text-4xl"
        variants={fadeUp}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mx-auto max-w-xl km-text-muted"
        variants={fadeUp}
      >
        {subtitle}
      </motion.p>
    </AnimatedSection>
  );
}
