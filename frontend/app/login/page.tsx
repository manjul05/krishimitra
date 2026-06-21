"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button, Input, showSuccessToast } from "@/components/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email.includes("@")) nextErrors.email = "Enter a valid email address";
    if (password.length < 6) nextErrors.password = "Password must be at least 6 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      showSuccessToast("Login successful! Redirecting...");
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex flex-1 items-center px-4 py-8 sm:py-12 md:px-10">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 text-center sm:mb-8">
            <span
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-km-green-light text-2xl dark:bg-km-green/30"
              aria-hidden="true"
            >
              🌾
            </span>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl">
              Login to KrishiMitra
            </h1>
            <p className="text-sm km-text-muted sm:text-base">
              Sign in to access disease detection, AI advice, and your dashboard.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20"
          >
            <div className="flex flex-col gap-4 sm:gap-5">
              <Input
                label="Email Address"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                error={errors.email}
                autoComplete="email"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                autoComplete="current-password"
              />

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </div>

            <p className="mt-5 text-center text-sm km-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="#" className="font-medium text-km-green hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
