"use client";

import { useRef, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button, Loader, showErrorToast, showSuccessToast } from "@/components/ui";
import { ApiError, predictDisease } from "@/services/api";
import type { PredictResponse } from "@/types/disease";
import AIAdvisor from "@/components/AIAdvisor";


const severityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

function getSeverityClass(severity: string): string {
  const key = severity.toLowerCase();
  return severityStyles[key] ?? "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
}

export default function DetectPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<PredictResponse | null>(null);

  const runPrediction = async (file: File) => {
    setScanning(true);
    setResult(null);

    try {
      const response = await predictDisease(file);
      setResult(response);
      showSuccessToast("Disease detection complete!");
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Detection failed. Please try again.";
      showErrorToast(message);
    } finally {
      setScanning(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload a valid image file.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
    runPrediction(file);
  };

  const handleScan = () => {
    if (!selectedFile) {
      showErrorToast("Please upload a crop image first.");
      return;
    }
    runPrediction(selectedFile);
  };

  const handleClear = () => {
    setPreview(null);
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="km-section-label mb-3">AI Detection</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
              Crop Disease Detection
            </h1>
            <p className="mx-auto max-w-xl text-sm km-text-muted sm:text-base">
              Upload a crop image to detect diseases and receive AI-powered treatment
              recommendations instantly.
            </p>
          </div>

          <div className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 md:p-8 dark:border-km-green/20">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload crop image"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={scanning}
              className="group relative mx-auto flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-km-border bg-km-green-light/30 p-8 transition-colors hover:border-km-green/50 hover:bg-km-green-light/50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-km-green/30 dark:bg-km-green/10 dark:hover:bg-km-green/15 sm:p-10"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Uploaded crop preview"
                  className="max-h-48 w-full rounded-xl object-cover sm:max-h-56"
                />
              ) : (
                <>
                  <span className="mb-3 text-4xl" aria-hidden="true">📸</span>
                  <p className="text-sm font-medium km-text-primary sm:text-base">
                    Tap to upload crop image
                  </p>
                  <p className="mt-1 text-xs km-text-muted">PNG, JPG up to 10 MB</p>
                </>
              )}
            </button>

            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={handleScan}
                disabled={scanning || !selectedFile}
                className="w-full sm:w-auto"
              >
                {scanning ? "Scanning..." : "Detect Disease"}
              </Button>
              {preview && !scanning && (
                <Button variant="outline" onClick={handleClear} className="w-full sm:w-auto">
                  Clear Image
                </Button>
              )}
            </div>

            {scanning && (
              <div className="mt-8 flex flex-col items-center gap-3">
                <Loader size="lg" />
                <p className="text-sm km-text-muted">Analyzing crop image with AI...</p>
              </div>
            )}

            {result && !scanning && (
              <div className="space-y-8">
                <div className="mt-8 overflow-hidden rounded-2xl border border-km-green/30 bg-km-green-light/20 dark:border-km-green/20 dark:bg-km-green/10">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative bg-km-green-light/30 p-4 dark:bg-km-green/10">
                      {result.details?.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={result.details.image}
                          alt={`${result.prediction.disease} reference`}
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ) : preview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={preview}
                          alt="Uploaded crop"
                          className="aspect-square w-full rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex aspect-square items-center justify-center rounded-xl bg-km-green-light/50 text-5xl dark:bg-km-green/20">
                          🌿
                        </div>
                      )}
                    </div>

                    <div className="p-5 sm:p-6">
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <span className="rounded-full bg-km-green/10 px-3 py-1 text-xs font-bold text-km-green">
                          ✓ Result Found
                        </span>
                        <span className="text-2xl font-bold text-km-green">
                          {result.prediction.confidence}%
                        </span>
                      </div>

                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-km-green">
                        {result.prediction.crop}
                      </p>
                      <h2 className="mb-3 text-xl font-bold km-text-primary sm:text-2xl">
                        {result.prediction.disease}
                      </h2>

                      {result.details ? (
                        <>
                          <span
                            className={`mb-4 inline-block rounded-lg px-2.5 py-1 text-xs font-semibold ${getSeverityClass(result.details.severity)}`}
                          >
                            Severity: {result.details.severity}
                          </span>

                          <div className="mb-4">
                            <p className="mb-1 text-sm font-semibold km-text-primary">Symptoms</p>
                            <p className="text-sm leading-relaxed km-text-muted">
                              {result.details.symptoms}
                            </p>
                          </div>

                          <div>
                            <p className="mb-1 text-sm font-semibold km-text-primary">Treatment</p>
                            <p className="text-sm leading-relaxed km-text-muted">
                              {result.details.treatment}
                            </p>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm leading-relaxed km-text-muted">
                          AI prediction complete. No matching disease record was found in the
                          database for detailed symptoms and treatment.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-km-border/40 pt-8 dark:border-km-green/20">
                  <AIAdvisor
                    key={`${result.prediction.crop}-${result.prediction.disease}`}
                    initialCrop={result.prediction.crop}
                    initialDisease={result.prediction.disease}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
