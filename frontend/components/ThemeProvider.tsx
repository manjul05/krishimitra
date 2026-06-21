"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ReactNode } from "react";

/**
 * Wraps the app with next-themes for dark/light mode.
 * Persists preference in localStorage under "km-theme".
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="km-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
