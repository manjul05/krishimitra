import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-km-green-light/60 text-5xl dark:bg-km-green/20">
          🌾
        </div>
        <h1 className="mb-2 text-4xl font-bold km-text-primary sm:text-5xl">404</h1>
        <p className="mb-2 text-lg font-semibold km-text-primary">Page Not Found</p>
        <p className="mb-8 max-w-md text-sm km-text-muted sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link
          href="/"
          className="rounded-xl bg-km-green px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-km-green-dark"
        >
          Back to Home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
