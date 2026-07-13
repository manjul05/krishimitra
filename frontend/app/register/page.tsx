"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button, Input, showSuccessToast, showErrorToast } from "@/components/ui";
import { registerUser } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (name.trim().length === 0) nextErrors.name = "Name is required";
    if (!email.includes("@")) nextErrors.email = "Enter a valid email address";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      await registerUser({ name, email, password });
      showSuccessToast("Account created successfully! Please sign in.");
      router.push("/login");
    } catch (err: any) {
      showErrorToast(err instanceof Error ? err.message : "Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
    window.location.href = `${apiBaseUrl}/api/auth/google/login`;
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
              Create an Account
            </h1>
            <p className="text-sm km-text-muted sm:text-base">
              Register to save scans, track crop status, and get farm advisories.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20"
          >
            <div className="flex flex-col gap-4 sm:gap-5">
              <Input
                label="Full Name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                error={errors.name}
                autoComplete="name"
                disabled={submitting}
              />

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
                disabled={submitting}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                }}
                error={errors.password}
                autoComplete="new-password"
                disabled={submitting}
              />

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Creating Account..." : "Register"}
              </Button>

              <div className="relative my-1 text-center text-xs">
                <span className="bg-transparent px-2 km-text-muted">Or continue with</span>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={submitting}
              >
                <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google
              </Button>
            </div>

            <p className="mt-5 text-center text-sm km-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-km-green hover:underline">
                Login here
              </Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
