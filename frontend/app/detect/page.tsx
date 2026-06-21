"use client";

import { useRef, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button, Loader, showErrorToast, showSuccessToast } from "@/components/ui";

export default function DetectPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showErrorToast("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
    setResult(null);
  };

  const handleScan = () => {
    if (!preview) {
      showErrorToast("Please upload a crop image first.");
      return;
    }

    setScanning(true);
    setResult(null);

    window.setTimeout(() => {
      setScanning(false);
      setResult({ disease: "Leaf Rust (Puccinia triticina)", confidence: "94.2%" });
      showSuccessToast("Disease detection complete!");
    }, 2500);
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
              className="group relative mx-auto flex w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-km-border bg-km-green-light/30 p-8 transition-colors hover:border-km-green/50 hover:bg-km-green-light/50 dark:border-km-green/30 dark:bg-km-green/10 dark:hover:bg-km-green/15 sm:p-10"
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
              <Button onClick={handleScan} disabled={scanning || !preview} className="w-full sm:w-auto">
                {scanning ? "Scanning..." : "Detect Disease"}
              </Button>
              {preview && !scanning && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setPreview(null);
                    setResult(null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="w-full sm:w-auto"
                >
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
              <div className="mt-8 rounded-xl border border-km-green/30 bg-km-green-light/40 p-4 sm:p-5 dark:border-km-green/20 dark:bg-km-green/10">
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-km-green">✓ Result Found</span>
                  <span className="rounded-full bg-km-green/10 px-2.5 py-0.5 text-xs font-bold text-km-green">
                    {result.confidence}
                  </span>
                </div>
                <p className="text-base font-bold km-text-primary sm:text-lg">{result.disease}</p>
                <p className="mt-2 text-sm leading-relaxed km-text-muted">
                  Apply recommended fungicide spray within 48 hours. Remove infected
                  leaves to prevent spread.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
