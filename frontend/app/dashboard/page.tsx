"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import DiseaseCard from "@/components/DiseaseCard";
import StatsCards, { StatsCardsSkeleton } from "@/components/StatsCards";
import DiseaseForm from "@/components/DiseaseForm";
import ErrorState from "@/components/ErrorState";
import { Loader, showErrorToast } from "@/components/ui";
import { getDiseases, getStats } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import type { Disease, Stats } from "@/types/disease";

export default function DashboardPage() {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    setError(null);
    try {
      const [statsData, diseasesData] = await Promise.all([
        getStats(),
        getDiseases(),
      ]);
      setStats(statsData);
      setDiseases(diseasesData.slice(0, 4));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load dashboard";
      setError(msg);
      showErrorToast(msg);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchData();
    }
  }, [fetchData, currentUser]);

  if (loading || !currentUser) {
    return (
      <div className="flex min-h-screen flex-col overflow-x-hidden">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-8">
          <Loader size="lg" label="Checking authentication..." />
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 sm:mb-10">
            <p className="km-section-label mb-3">Dashboard</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
              Disease Analytics Dashboard
            </h1>
            <p className="max-w-2xl text-sm km-text-muted sm:text-base md:text-lg">
              Real-time statistics and recent disease records from the KrishiMitra API.
            </p>
          </div>

          {dataLoading && (
            <div className="space-y-8">
              <div className="flex justify-center py-4">
                <Loader size="lg" label="Loading dashboard" />
              </div>
              <StatsCardsSkeleton />
            </div>
          )}

          {!dataLoading && error && (
            <ErrorState message={error} onRetry={fetchData} />
          )}

          {!dataLoading && !error && stats && (

            <>
              <div className="mb-10">
                <StatsCards stats={stats} />
              </div>

              <section className="mb-8 rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20">
                <h2 className="mb-4 text-lg font-semibold km-text-primary">Add New Disease</h2>
                <DiseaseForm onSuccess={fetchData} />
              </section>

              <section className="mb-8">
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold km-text-primary sm:text-xl">
                    Recent Diseases
                  </h2>
                  <Link
                    href="/"
                    className="text-sm font-medium text-km-green hover:underline"
                  >
                    View All
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {diseases.map((disease, i) => (
                    <DiseaseCard key={disease.id} disease={disease} index={i} />
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20">
                <h2 className="mb-4 text-lg font-semibold km-text-primary">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { href: "/search", label: "Search by Crop", icon: "🔍" },
                    { href: "/detect", label: "Scan Crop", icon: "📸" },
                    { href: "/", label: "Disease Library", icon: "📚" },
                    { href: "/dashboard", label: "Refresh Stats", icon: "📊" },
                  ].map((action) => (
                    <Link
                      key={action.label}
                      href={action.href}
                      onClick={
                        action.label === "Refresh Stats"
                          ? (e) => {
                              e.preventDefault();
                              fetchData();
                            }
                          : undefined
                      }
                      className="flex items-center gap-3 rounded-xl border border-km-border/50 bg-white/50 p-4 transition-colors hover:border-km-green/40 hover:bg-km-green-light/30 dark:border-km-green/15 dark:bg-km-green-dark/30 dark:hover:bg-km-green/10"
                    >
                      <span className="text-xl" aria-hidden="true">{action.icon}</span>
                      <span className="text-sm font-medium km-text-primary">{action.label}</span>
                    </Link>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
