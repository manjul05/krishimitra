"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedHeading, AnimatedItem, AnimatedSection } from "./AnimatedSection";
import Skeleton from "./Skeleton";

type CropPrice = {
  crop: string;
  mandi: string;
  price: number;
  unit: string;
  trend: "up" | "down" | "stable";
  change: number;
};

const mockPrices: CropPrice[] = [
  { crop: "Wheat", mandi: "Azadpur, Delhi", price: 2450, unit: "₹/quintal", trend: "up", change: 2.3 },
  { crop: "Rice (Basmati)", mandi: "Karnal, Haryana", price: 4200, unit: "₹/quintal", trend: "up", change: 1.8 },
  { crop: "Cotton", mandi: "Nagpur, Maharashtra", price: 6800, unit: "₹/quintal", trend: "down", change: -0.9 },
  { crop: "Soybean", mandi: "Indore, MP", price: 4650, unit: "₹/quintal", trend: "up", change: 3.1 },
  { crop: "Tomato", mandi: "Nashik, Maharashtra", price: 1200, unit: "₹/quintal", trend: "down", change: -4.2 },
  { crop: "Onion", mandi: "Lasalgaon, Maharashtra", price: 1850, unit: "₹/quintal", trend: "stable", change: 0.1 },
];

function TrendIcon({ trend, change }: { trend: CropPrice["trend"]; change: number }) {
  if (trend === "up") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        ↑ {Math.abs(change)}%
      </span>
    );
  }
  if (trend === "down") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-red-500 dark:text-red-400">
        ↓ {Math.abs(change)}%
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold text-gray-500">→ {Math.abs(change)}%</span>
  );
}

export default function MarketPrices() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedSection
      id="market-prices"
      className="px-4 py-16 md:px-10 md:py-20"
      stagger
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Market Prices"
          title="Live Mandi Prices"
          subtitle="Stay updated with real-time crop prices from major mandis across India."
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockPrices.map((item, i) => (
              <AnimatedItem key={item.crop}>
                <motion.div
                  className="km-glass km-glass-hover rounded-2xl p-5"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold km-text-primary">{item.crop}</h3>
                      <p className="text-xs km-text-muted">{item.mandi}</p>
                    </div>
                    <TrendIcon trend={item.trend} change={item.change} />
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-km-green">
                        ₹{item.price.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs km-text-muted">{item.unit}</p>
                    </div>
                    <span className="rounded-full bg-km-green/10 px-2 py-0.5 text-[10px] font-semibold text-km-green">
                      LIVE
                    </span>
                  </div>
                </motion.div>
              </AnimatedItem>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
