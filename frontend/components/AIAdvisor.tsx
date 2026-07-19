"use client";

import { useState } from "react";
import { Button, Loader, showErrorToast, showSuccessToast } from "@/components/ui";
import Input from "@/components/ui/Input";
import { generateAdvice } from "@/services/ai";
import type { AdvisorData } from "@/types/ai";

interface AIAdvisorProps {
  initialCrop?: string;
  initialDisease?: string;
}

const severityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50",
  moderate: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50",
  low: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/50",
};

function getSeverityBadgeClass(severity: string): string {
  const key = severity.toLowerCase();
  return (
    severityStyles[key] ??
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
  );
}

export default function AIAdvisor({
  initialCrop = "",
  initialDisease = "",
}: AIAdvisorProps) {
  const [crop, setCrop] = useState(initialCrop);
  const [disease, setDisease] = useState(initialDisease);
  const [language, setLanguage] = useState<"english" | "hindi">("english");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [advice, setAdvice] = useState<AdvisorData | null>(null);

  const handleGetAdvice = async () => {
    // Basic client validation
    if (!crop.trim()) {
      showErrorToast("Crop name is required.");
      return;
    }
    if (!disease.trim()) {
      showErrorToast("Disease name is required.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setAdvice(null);

    try {
      const response = await generateAdvice({
        crop: crop.trim(),
        disease: disease.trim(),
        language,
      });

      if (response.success && response.data) {
        setAdvice(response.data);
        showSuccessToast("AI agricultural advice generated successfully!");
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err) {
      console.error("AI Advisor error:", err);
      showErrorToast("Unable to generate AI advice. Please try again.");
      setErrorMsg("Unable to generate AI advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleGetAdvice();
  };

  return (
    <div className="w-full space-y-8">
      {/* Input panel Form */}
      <div className="rounded-2xl border border-km-border/60 bg-white/70 p-6 shadow-sm backdrop-blur-md dark:border-km-green/20 dark:bg-km-green-dark/40">
        <h2 className="mb-4 text-lg font-bold km-text-primary flex items-center gap-2">
          <span>🌿</span> Crop Health AI Advisor
        </h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Input
                label="Crop Name"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Tomato, Rice, Wheat"
                disabled={loading}
                required
              />
            </div>
            <div>
              <Input
                label="Disease Name"
                value={disease}
                onChange={(e) => setDisease(e.target.value)}
                placeholder="e.g. Late Blight, Blast, Rust"
                disabled={loading}
                required
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium km-text-primary">
                Advice Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as "english" | "hindi")}
                disabled={loading}
                className="w-full rounded-xl border border-km-border bg-white px-4 py-2.5 text-sm km-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-km-green/30 dark:border-km-green/30 dark:bg-km-green-dark/40"
              >
                <option value="english">English</option>
                <option value="hindi">Hindi (हिंदी)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={loading || !crop.trim() || !disease.trim()}
              className="w-full md:w-auto"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader size="sm" />
                  <span>Generating...</span>
                </div>
              ) : (
                "Generate Advice"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Loading state rendering */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-3 rounded-2xl border border-dashed border-km-border/60 bg-km-green-light/10 dark:border-km-green/20">
          <Loader size="lg" />
          <p className="text-sm font-semibold km-text-primary animate-pulse">
            Generating AI advice...
          </p>
          <p className="text-xs km-text-muted">
            Our AI agricultural scientist is analyzing treatment options...
          </p>
        </div>
      )}

      {/* Error state rendering */}
      {errorMsg && !loading && (
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center dark:border-red-900/30 dark:bg-red-950/10">
          <p className="text-sm font-semibold text-red-800 dark:text-red-400">
            ⚠️ {errorMsg}
          </p>
          <button
            onClick={() => handleGetAdvice()}
            className="mt-3 text-xs font-bold text-km-green underline hover:text-km-green-dark dark:text-km-green-light"
          >
            Retry Request
          </button>
        </div>
      )}

      {/* Success state rendering */}
      {advice && !loading && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-km-green/20 bg-gradient-to-r from-km-green-light/40 to-km-hero-end/30 p-6 shadow-sm dark:from-km-green/10 dark:to-km-green-dark/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-km-green dark:text-km-green-light">
                  Crop Advisor Report
                </p>
                <h3 className="text-2xl font-bold km-text-primary mt-1">
                  {crop} &mdash; <span className="text-km-green dark:text-km-green-light">{advice.disease}</span>
                </h3>
              </div>
              <div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${getSeverityBadgeClass(advice.severity)}`}>
                  <span className="h-2 w-2 rounded-full bg-current animate-ping" />
                  Severity: {advice.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cause Card */}
            <div className="rounded-2xl border border-km-border/50 km-glass km-glass-hover p-6">
              <h4 className="text-base font-bold km-text-primary mb-2 flex items-center gap-2 text-sky-700 dark:text-sky-400">
                <span>🔬</span> Cause of Infection
              </h4>
              <p className="text-sm leading-relaxed km-text-muted">
                {advice.cause}
              </p>
            </div>

            {/* Prevention Card */}
            <div className="rounded-2xl border border-km-border/50 km-glass km-glass-hover p-6">
              <h4 className="text-base font-bold km-text-primary mb-2 flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <span>🛡️</span> Preventative Guidelines
              </h4>
              <p className="text-sm leading-relaxed km-text-muted">
                {advice.prevention}
              </p>
            </div>

            {/* Organic Treatment Card */}
            <div className="rounded-2xl border border-km-border/50 km-glass km-glass-hover p-6 md:col-span-1">
              <h4 className="text-base font-bold km-text-primary mb-2 flex items-center gap-2 text-km-green dark:text-km-green-light">
                <span>🌿</span> Organic Control (Recommended)
              </h4>
              <p className="text-sm leading-relaxed km-text-muted">
                {advice.organic_treatment}
              </p>
            </div>

            {/* Chemical Treatment Card */}
            <div className="rounded-2xl border border-km-border/50 km-glass km-glass-hover p-6 md:col-span-1">
              <h4 className="text-base font-bold km-text-primary mb-2 flex items-center gap-2 text-orange-700 dark:text-orange-400">
                <span>🧪</span> Chemical Control
              </h4>
              <p className="text-sm leading-relaxed km-text-muted">
                {advice.chemical_treatment}
              </p>
            </div>

            {/* Farmer Tips Card */}
            <div className="rounded-2xl border border-km-border/50 km-glass km-glass-hover p-6 md:col-span-2 bg-gradient-to-br from-amber-500/5 to-transparent dark:from-amber-500/10">
              <h4 className="text-base font-bold km-text-primary mb-2 flex items-center gap-2 text-amber-600 dark:text-amber-400">
                <span>💡</span> Indian Farmer Pro Tips
              </h4>
              <p className="text-sm leading-relaxed km-text-muted">
                {advice.farmer_tips}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
