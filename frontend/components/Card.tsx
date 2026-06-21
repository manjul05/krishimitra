"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type CardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  iconBg: string;
};

export default function Card({ title, description, icon, iconBg }: CardProps) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl km-glass km-glass-hover p-7"
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-km-green to-km-green-muted opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      <div
        className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold km-text-primary">{title}</h3>
      <p className="text-sm leading-relaxed km-text-muted">{description}</p>
    </motion.div>
  );
}
