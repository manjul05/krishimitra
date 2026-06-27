import { Suspense } from "react";
import SearchPageClient from "./SearchPageClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div
            className="h-10 w-10 animate-spin rounded-full border-4 border-km-green/20 border-t-km-green"
            role="status"
            aria-label="Loading"
          />
        </div>
      }
    >
      <SearchPageClient />
    </Suspense>
  );
}
