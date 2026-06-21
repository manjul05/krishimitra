"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DragEvent, useCallback, useState } from "react";
import { AnimatedHeading, AnimatedSection } from "./AnimatedSection";

type AnalysisResult = {
  disease: string;
  confidence: number;
  severity: string;
  severityColor: string;
  treatment: string[];
};

const demoResult: AnalysisResult = {
  disease: "Early Blight (Alternaria solani)",
  confidence: 91.7,
  severity: "Moderate",
  severityColor: "amber",
  treatment: [
    "Remove and destroy infected leaves immediately",
    "Apply copper-based fungicide every 7–10 days",
    "Improve air circulation between plants",
    "Avoid overhead watering — use drip irrigation",
  ],
};

type AnalysisState = "idle" | "analyzing" | "done";

export default function DiseaseDetectionDemo() {
  const [state, setState] = useState<AnalysisState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const runAnalysis = useCallback(() => {
    setState("analyzing");
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setState("done");
          return 100;
        }
        return p + 4;
      });
    }, 80);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    runAnalysis();
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const reset = () => {
    setState("idle");
    setPreview(null);
    setProgress(0);
  };

  return (
    <AnimatedSection
      id="detect-demo"
      className="px-4 py-16 md:px-10 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <AnimatedHeading
          label="Disease Detection"
          title="Try AI Crop Diagnosis"
          subtitle="Upload or drag a crop image to see instant AI-powered disease analysis."
        />

        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {state !== "done" ? (
              <motion.div
                key="upload"
                className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-colors md:p-12 ${
                  dragOver
                    ? "border-km-green bg-km-green-light/50 dark:bg-km-green/10"
                    : "border-km-border/60 km-glass"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {preview && state === "analyzing" ? (
                  <div className="relative mx-auto mb-6 max-w-xs overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={preview}
                      alt="Uploaded crop"
                      className="aspect-square w-full object-cover"
                    />
                    <div className="km-scan-line absolute left-0 right-0 h-1 bg-km-green shadow-[0_0_16px_rgba(26,92,46,0.5)]" />
                  </div>
                ) : (
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-km-green-light text-4xl dark:bg-km-green/20">
                    📸
                  </div>
                )}

                {state === "analyzing" ? (
                  <div>
                    <p className="mb-4 text-sm font-semibold text-km-green">
                      AI Analyzing... {progress}%
                    </p>
                    <div className="mx-auto h-2 max-w-xs overflow-hidden rounded-full bg-km-green-light dark:bg-km-green/20">
                      <motion.div
                        className="h-full rounded-full bg-km-green"
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                    <p className="mt-4 text-xs km-text-muted">
                      Scanning for disease patterns...
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="mb-2 text-lg font-semibold km-text-primary">
                      Drop your crop image here
                    </p>
                    <p className="mb-6 text-sm km-text-muted">
                      or click to browse · JPG, PNG supported
                    </p>
                    <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl bg-km-green px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-km-green/20 transition-all hover:bg-km-green-dark">
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFile(file);
                        }}
                      />
                    </label>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                className="overflow-hidden rounded-2xl km-glass"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="relative bg-km-green-light/30 p-4 dark:bg-km-green/10">
                    {preview && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={preview}
                        alt="Analyzed crop"
                        className="aspect-square w-full rounded-xl object-cover"
                      />
                    )}
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="rounded-full bg-km-green/10 px-3 py-1 text-xs font-bold text-km-green">
                        ✓ Analysis Complete
                      </span>
                      <span className="text-2xl font-bold text-km-green">
                        {demoResult.confidence}%
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold km-text-primary">
                      {demoResult.disease}
                    </h3>

                    <span className="mb-4 inline-block rounded-lg bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Severity: {demoResult.severity}
                    </span>

                    <p className="mb-3 text-sm font-semibold km-text-primary">
                      Treatment Recommendations:
                    </p>
                    <ul className="mb-6 flex flex-col gap-2">
                      {demoResult.treatment.map((tip) => (
                        <li
                          key={tip}
                          className="flex gap-2 text-xs leading-relaxed km-text-muted md:text-sm"
                        >
                          <span className="mt-0.5 text-km-green">✓</span>
                          {tip}
                        </li>
                      ))}
                    </ul>

                    <button
                      type="button"
                      onClick={reset}
                      className="rounded-xl border border-km-border px-5 py-2.5 text-sm font-semibold text-km-green transition-colors hover:bg-km-green-light dark:hover:bg-km-green/10"
                    >
                      Scan Another Image
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatedSection>
  );
}
