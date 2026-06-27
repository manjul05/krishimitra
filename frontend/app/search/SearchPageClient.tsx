"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DiseaseCard from "@/components/DiseaseCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SearchBar from "@/components/SearchBar";
import { SkeletonDiseaseCard } from "@/components/SkeletonDiseaseCard";
import { Loader, showErrorToast } from "@/components/ui";
import { searchDisease } from "@/services/api";
import type { Disease } from "@/types/disease";

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const initialCrop = searchParams.get("crop") ?? "";

  const [query, setQuery] = useState(initialCrop);
  const [results, setResults] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (crop: string) => {
    const trimmed = crop.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setSearched(true);
    setQuery(trimmed);

    try {
      const data = await searchDisease(trimmed);
      setResults(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Search failed";
      setError(msg);
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialCrop) {
      performSearch(initialCrop);
    }
  }, [initialCrop, performSearch]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <p className="km-section-label mb-3">Search</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
              Search Diseases by Crop
            </h1>
            <p className="mb-6 max-w-2xl text-sm km-text-muted sm:text-base">
              Find diseases affecting specific crops — tomato, wheat, rice, and more.
            </p>
            <SearchBar
              defaultValue={query}
              onSearch={performSearch}
              placeholder="Enter crop name (e.g. Tomato)..."
            />
          </div>

          {loading && (
            <div className="flex flex-col items-center gap-8">
              <Loader size="lg" label="Searching diseases" />
              <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <SkeletonDiseaseCard key={i} />
                ))}
              </div>
            </div>
          )}

          {!loading && error && (
            <ErrorState message={error} onRetry={() => performSearch(query)} />
          )}

          {!loading && !error && searched && results.length === 0 && (
            <EmptyState
              title={`No diseases found for "${query}"`}
              description="Try a different crop name or browse the full disease library."
              actionLabel="Clear Search"
              onAction={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
            />
          )}

          {!loading && !error && results.length > 0 && (
            <>
              <p className="mb-5 text-sm km-text-muted">
                Found <span className="font-semibold text-km-green">{results.length}</span>{" "}
                disease{results.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold km-text-primary">&quot;{query}&quot;</span>
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {results.map((disease, i) => (
                  <DiseaseCard key={disease.id} disease={disease} index={i} />
                ))}
              </div>
            </>
          )}

          {!loading && !searched && !error && (
            <div className="rounded-2xl border border-dashed border-km-border km-glass px-6 py-12 text-center dark:border-km-green/20">
              <p className="mb-4 text-4xl">🔍</p>
              <p className="text-sm km-text-muted">
                Enter a crop name above to search the disease database.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
