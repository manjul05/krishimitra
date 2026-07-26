"use client";

import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled App Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12 md:px-10">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50/50 p-6 text-center shadow-sm dark:border-red-900/40 dark:bg-red-950/20 sm:p-8">
          <div className="mb-4 text-4xl" aria-hidden="true">
            ⚠️
          </div>
          <h1 className="mb-2 text-2xl font-bold text-red-800 dark:text-red-300">
            Something went wrong!
          </h1>
          <p className="mb-6 text-sm km-text-muted">
            {error.message || "An unexpected error occurred while processing your request."}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={reset}
              className="rounded-xl bg-km-green px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-km-green-dark"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-xl border border-km-border px-5 py-2.5 text-sm font-semibold km-text-primary transition-colors hover:bg-km-green-light/40 dark:border-km-green/30"
            >
              Return Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
