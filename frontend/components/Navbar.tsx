"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#weather", label: "Weather" },
  { href: "#market-prices", label: "Prices" },
  { href: "/about", label: "About" },
  { href: "/showcase", label: "UI Kit" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-km-border/60 km-glass px-4 py-3.5 md:px-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-km-dark sm:text-xl dark:text-km-green-light"
        >
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-km-green-light text-base dark:bg-km-green/30"
            aria-hidden="true"
          >
            🌾
          </span>
          <span className="truncate">KrishiMitra</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm font-medium km-text-muted transition-colors hover:text-km-green"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          <Link href="/login" className="hidden sm:block">
            <motion.span
              className="inline-flex rounded-xl bg-km-green px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-km-green/20 transition-all hover:bg-km-green-dark hover:shadow-md hover:shadow-km-green/25"
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.span>
          </Link>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-km-border/60 text-km-green transition-colors hover:border-km-green/40 lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="mx-auto max-w-6xl border-t border-km-border/40 pt-3 pb-1 dark:border-km-green/20">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-2 py-2.5 text-sm font-medium km-text-muted transition-colors hover:bg-km-green-light/50 hover:text-km-green dark:hover:bg-km-green/10"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="sm:hidden">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="mt-1 block rounded-xl bg-km-green px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
