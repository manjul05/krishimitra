"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button, Loader, showSuccessToast } from "@/components/ui";
import { useAuth } from "@/context/AuthContext";

export default function ProfilePage() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!loading && !currentUser) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  const handleLogout = () => {
    logout();
    showSuccessToast("Logged out successfully");
    router.push("/");
  };

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

  // Format date
  const joinDate = currentUser.created_at
    ? new Date(currentUser.created_at).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently";

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8">
            <p className="km-section-label mb-3">User Account</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl">
              Your Profile
            </h1>
            <p className="text-sm km-text-muted sm:text-base">
              Manage your KrishiMitra credentials and preferences.
            </p>
          </div>

          <div className="rounded-2xl border border-km-border km-glass p-6 dark:border-km-green/20">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:gap-6 sm:text-left">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-km-green text-3xl text-white shadow-md">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold km-text-primary sm:text-2xl">
                    {currentUser.name}
                  </h2>
                  <p className="text-sm km-text-muted">{currentUser.email}</p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-km-border/50 bg-white/20 p-3.5 dark:border-km-green/15 dark:bg-km-green-dark/20">
                    <span className="block text-xs km-text-muted">Account Type</span>
                    <span className="text-sm font-semibold km-text-primary">
                      {currentUser.google_id ? "Google OAuth 2.0" : "Password Credentials"}
                    </span>
                  </div>
                  <div className="rounded-xl border border-km-border/50 bg-white/20 p-3.5 dark:border-km-green/15 dark:bg-km-green-dark/20">
                    <span className="block text-xs km-text-muted">Joined Date</span>
                    <span className="text-sm font-semibold km-text-primary">
                      {joinDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/dashboard")}>
                    Go to Dashboard
                  </Button>
                  <Button variant="primary" className="w-full bg-red-600 hover:bg-red-700 sm:w-auto" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
