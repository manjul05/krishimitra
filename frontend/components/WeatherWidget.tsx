"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedHeading, AnimatedSection } from "./AnimatedSection";
import Skeleton from "./Skeleton";

type WeatherData = {
  temp: number;
  humidity: number;
  rainfall: number;
  condition: string;
  icon: string;
  alerts: string[];
};

const mockWeather: WeatherData = {
  temp: 32,
  humidity: 68,
  rainfall: 12,
  condition: "Partly Cloudy",
  icon: "⛅",
  alerts: [
    "🌾 Wheat: Reduce irrigation — rain expected tomorrow",
    "🍅 Tomato: High humidity — watch for blight",
    "🌽 Maize: Ideal conditions for fertilizer application",
  ],
};

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWeather(mockWeather);
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatedSection
      id="weather"
      className="bg-km-green-light/20 px-4 py-16 dark:bg-km-green-dark/20 md:px-10 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Live Weather"
          title="Farm Weather at a Glance"
          subtitle="Real-time conditions and crop-specific alerts for smarter farming decisions."
        />

        <motion.div
          className="mx-auto max-w-3xl overflow-hidden rounded-2xl km-glass"
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {loading ? (
            <div className="p-6 md:p-8">
              <div className="mb-6 flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-2xl" />
                <div className="flex-1">
                  <Skeleton className="mb-2 h-8 w-32" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>
              <div className="mb-6 grid grid-cols-3 gap-4">
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
                <Skeleton className="h-20 rounded-xl" />
              </div>
              <Skeleton className="h-24 rounded-xl" />
            </div>
          ) : weather ? (
            <div className="p-6 md:p-8">
              <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-km-green-light text-4xl dark:bg-km-green/20">
                    {weather.icon}
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-km-green">
                      {weather.temp}°C
                    </p>
                    <p className="text-sm km-text-muted">
                      {weather.condition} · New Delhi, India
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-km-green/10 px-3 py-1 text-xs font-semibold text-km-green">
                  Live · Updated now
                </span>
              </div>

              <div className="mb-6 grid grid-cols-3 gap-3 md:gap-4">
                {[
                  { label: "Temperature", value: `${weather.temp}°C`, icon: "🌡️" },
                  { label: "Humidity", value: `${weather.humidity}%`, icon: "💧" },
                  { label: "Rainfall", value: `${weather.rainfall}mm`, icon: "🌧️" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-km-border/40 bg-white/50 p-3 text-center dark:border-km-green/15 dark:bg-km-green/5 md:p-4"
                  >
                    <p className="mb-1 text-lg md:text-xl">{item.icon}</p>
                    <p className="text-lg font-bold text-km-green md:text-xl">
                      {item.value}
                    </p>
                    <p className="text-[10px] font-medium km-text-muted md:text-xs">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-amber-200/60 bg-amber-50/80 p-4 dark:border-amber-800/30 dark:bg-amber-900/10">
                <p className="mb-3 text-sm font-semibold text-amber-800 dark:text-amber-400">
                  🔔 Crop-Specific Alerts
                </p>
                <ul className="flex flex-col gap-2">
                  {weather.alerts.map((alert) => (
                    <li
                      key={alert}
                      className="text-xs leading-relaxed text-amber-900/80 dark:text-amber-200/80 md:text-sm"
                    >
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
