"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ErrorState from "@/components/ErrorState";
import { Loader, showErrorToast, showSuccessToast } from "@/components/ui";
import { deleteDisease, getDisease, updateDisease } from "@/services/api";
import type { Disease, DiseaseUpdatePayload } from "@/types/disease";
import { motion } from "framer-motion";

const severityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  moderate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function DiseaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [disease, setDisease] = useState<Disease | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<DiseaseUpdatePayload>({});
  const [saving, setSaving] = useState(false);

  const fetchDisease = useCallback(async () => {
    if (Number.isNaN(id)) {
      setError("Invalid disease ID");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getDisease(id);
      setDisease(data);
      setEditForm({
        crop: data.crop,
        disease: data.disease,
        symptoms: data.symptoms,
        treatment: data.treatment,
        severity: data.severity,
        image: data.image,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load disease";
      setError(msg);
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDisease();
  }, [fetchDisease]);

  const handleSave = async () => {
    if (!disease) return;
    setSaving(true);
    try {
      const updated = await updateDisease(disease.id, editForm);
      setDisease(updated);
      setEditing(false);
      showSuccessToast("Disease Updated");
    } catch (err) {
      showErrorToast(err instanceof Error ? err.message : "Failed to update disease");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!disease || !confirm("Are you sure you want to delete this disease record?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteDisease(disease.id);
      showSuccessToast("Disease Deleted");
      router.push("/");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete disease";
      showErrorToast(msg);
    } finally {
      setDeleting(false);
    }
  };

  const severityClass =
    severityStyles[disease?.severity.toLowerCase() ?? ""] ??
    "bg-gray-100 text-gray-700";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-km-green transition-colors hover:text-km-green-dark"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>

          {loading && (
            <div className="flex flex-col items-center gap-6 py-20">
              <Loader size="lg" label="Loading disease details" />
              <div className="w-full space-y-4">
                <div className="km-skeleton h-56 rounded-2xl" />
                <div className="km-skeleton h-8 w-2/3 rounded-lg" />
                <div className="km-skeleton h-4 w-full rounded" />
                <div className="km-skeleton h-4 w-5/6 rounded" />
              </div>
            </div>
          )}

          {!loading && error && (
            <ErrorState message={error} onRetry={fetchDisease} />
          )}

          {!loading && !error && disease && (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="overflow-hidden rounded-2xl border border-km-border km-glass dark:border-km-green/20">
                <div className="relative h-48 sm:h-64 md:h-72">
                  {disease.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={disease.image}
                      alt={`${disease.disease} on ${disease.crop}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-km-green-light/30 text-6xl">
                      🌿
                    </div>
                  )}
                  <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-semibold ${severityClass}`}
                  >
                    {disease.severity} Severity
                  </span>
                </div>

                <div className="p-5 sm:p-8">
                  <p className="mb-1 text-sm font-semibold uppercase tracking-wide text-km-green">
                    {disease.crop}
                  </p>
                  <h1 className="mb-4 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
                    {disease.disease}
                  </h1>

                  <div className="mb-6 grid gap-4 sm:grid-cols-2">
                    {editing ? (
                      <>
                        <div className="sm:col-span-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-xs font-medium km-text-muted">Crop</label>
                            <input
                              value={editForm.crop ?? ""}
                              onChange={(e) => setEditForm({ ...editForm, crop: e.target.value })}
                              className="w-full rounded-lg border border-km-border px-3 py-2 text-sm dark:border-km-green/20 dark:bg-km-green-dark/40"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-medium km-text-muted">Disease</label>
                            <input
                              value={editForm.disease ?? ""}
                              onChange={(e) => setEditForm({ ...editForm, disease: e.target.value })}
                              className="w-full rounded-lg border border-km-border px-3 py-2 text-sm dark:border-km-green/20 dark:bg-km-green-dark/40"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium km-text-muted">Symptoms</label>
                          <textarea
                            value={editForm.symptoms ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, symptoms: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg border border-km-border px-3 py-2 text-sm dark:border-km-green/20 dark:bg-km-green-dark/40"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs font-medium km-text-muted">Treatment</label>
                          <textarea
                            value={editForm.treatment ?? ""}
                            onChange={(e) => setEditForm({ ...editForm, treatment: e.target.value })}
                            rows={3}
                            className="w-full rounded-lg border border-km-border px-3 py-2 text-sm dark:border-km-green/20 dark:bg-km-green-dark/40"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="rounded-xl border border-km-border/50 bg-km-green-light/20 p-4 dark:border-km-green/15 dark:bg-km-green/5">
                          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold km-text-primary">
                            <span aria-hidden="true">🔬</span> Symptoms
                          </h2>
                          <p className="text-sm leading-relaxed km-text-muted">{disease.symptoms}</p>
                        </div>
                        <div className="rounded-xl border border-km-border/50 bg-km-green-light/20 p-4 dark:border-km-green/15 dark:bg-km-green/5">
                          <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold km-text-primary">
                            <span aria-hidden="true">💊</span> Treatment
                          </h2>
                          <p className="text-sm leading-relaxed km-text-muted">{disease.treatment}</p>
                        </div>
                      </>
                    )}
                  </div>

                  <p className="text-xs km-text-muted">
                    Added on{" "}
                    {new Date(disease.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {editing ? (
                      <>
                        <button
                          type="button"
                          onClick={handleSave}
                          disabled={saving}
                          className="rounded-xl bg-km-green px-4 py-2 text-sm font-semibold text-white hover:bg-km-green-dark disabled:opacity-50"
                        >
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          className="rounded-xl border border-km-border px-4 py-2 text-sm font-semibold km-text-primary hover:bg-km-green-light/30 dark:border-km-green/30"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setEditing(true)}
                          className="rounded-xl border border-km-border px-4 py-2 text-sm font-semibold text-km-green transition-colors hover:bg-km-green-light dark:border-km-green/30 dark:hover:bg-km-green/10"
                        >
                          Edit Record
                        </button>
                        <Link
                          href={`/search?crop=${encodeURIComponent(disease.crop)}`}
                          className="rounded-xl border border-km-border px-4 py-2 text-sm font-semibold text-km-green transition-colors hover:bg-km-green-light dark:border-km-green/30 dark:hover:bg-km-green/10"
                        >
                          More {disease.crop} Diseases
                        </Link>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={deleting}
                          className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {deleting ? "Deleting..." : "Delete Record"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
