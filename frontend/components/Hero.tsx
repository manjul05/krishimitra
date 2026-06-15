import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-green-50 px-4 py-12 text-center md:px-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-800 md:text-5xl">
          AI-Powered Smart Farming Assistant
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 md:text-xl">
          Detect crop diseases and receive AI-driven recommendations instantly.
        </p>
        <Link
          href="/detect"
          className="inline-block rounded-lg bg-emerald-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          Get Started
        </Link>
      </div>
    </section>
  );
}
