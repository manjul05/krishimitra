"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type SearchBarProps = {
  /** Initial crop query (e.g. from URL params) */
  defaultValue?: string;
  /** Called on submit with the crop query */
  onSearch?: (crop: string) => void;
  /** When true, navigates to /search?q=... instead of calling onSearch */
  navigateOnSubmit?: boolean;
  placeholder?: string;
};

export default function SearchBar({
  defaultValue = "",
  onSearch,
  navigateOnSubmit = false,
  placeholder = "Search by crop (e.g. Tomato, Wheat, Rice)...",
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (navigateOnSubmit) {
      router.push(`/search?crop=${encodeURIComponent(trimmed)}`);
    } else {
      onSearch?.(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="flex items-center gap-2 rounded-2xl border border-km-border km-glass p-1.5 pl-4 transition-shadow focus-within:ring-2 focus-within:ring-km-green/30 dark:border-km-green/20">
        <svg
          className="h-5 w-5 shrink-0 km-text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm km-text-primary outline-none placeholder:km-text-muted sm:text-base"
          aria-label="Search diseases by crop"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-km-green px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-km-green-dark sm:px-5"
        >
          Search
        </button>
      </div>
    </form>
  );
}
