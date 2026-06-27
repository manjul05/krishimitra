"use client";

import Link from "next/link";
import DiseaseCard from "@/components/DiseaseCard";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import SearchBar from "@/components/SearchBar";
import { SkeletonDiseaseCard } from "@/components/SkeletonDiseaseCard";
import { Loader, showErrorToast } from "@/components/ui";
import { useDiseases } from "@/hooks/useDiseases";
import { AnimatedSection } from "@/components/AnimatedSection";
import { useEffect } from "react";

export default function DiseaseGallery() {
  const { diseases, loading, error, refetch } = useDiseases();

  useEffect(() => {
    if (error) showErrorToast(error);
  }, [error]);

  return (
    <AnimatedSection id="diseases" className="px-4 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <p className="km-section-label mb-4">Crop Diseases</p>
          <h2 className="mb-3 text-3xl font-bold tracking-tight km-text-primary md:text-4xl">
            Disease Library
          </h2>
          <p className="mx-auto mb-8 max-w-xl km-text-muted">
            Browse our database of crop diseases with symptoms, severity levels, and
            treatment recommendations.
          </p>
          <div className="mx-auto max-w-xl">
            <SearchBar navigateOnSubmit />
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center gap-8">
            <Loader size="lg" label="Loading diseases" />
            <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonDiseaseCard key={i} />
              ))}
            </div>
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={refetch} />
        )}

        {!loading && !error && diseases.length === 0 && (
          <EmptyState
            title="No diseases in database"
            description="The disease library is empty. Add records via the API or dashboard."
            actionLabel="Refresh"
            onAction={refetch}
          />
        )}

        {!loading && !error && diseases.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {diseases.map((disease, i) => (
                <DiseaseCard key={disease.id} disease={disease} index={i} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/search"
                className="inline-flex items-center gap-2 rounded-xl border border-km-border px-5 py-2.5 text-sm font-semibold text-km-green transition-colors hover:bg-km-green-light dark:border-km-green/30 dark:hover:bg-km-green/10"
              >
                Search by Crop
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        )}
      </div>
    </AnimatedSection>
  );
}
