import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AIAdvisor from "@/components/AIAdvisor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Advisor - KrishiMitra",
  description:
    "Get AI-powered crop advisory services, organic and chemical treatment instructions, and prevention suggestions.",
};

export default function AdvisorPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-10 md:px-10 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="km-section-label mb-3">AI Advisory</p>
            <h1 className="mb-2 text-2xl font-bold km-text-primary sm:text-3xl md:text-4xl">
              AI Crop Disease Advisor
            </h1>
            <p className="mx-auto max-w-xl text-sm km-text-muted sm:text-base">
              Consult our AI agricultural scientist. Specify a crop, select the disease,
              and receive organic treatments, chemical controls, and preventative steps instantly.
            </p>
          </div>

          <AIAdvisor />
        </div>
      </main>
      <Footer />
    </div>
  );
}
