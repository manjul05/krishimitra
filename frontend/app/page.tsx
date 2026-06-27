import Card from "@/components/Card";
import ChatPreview from "@/components/ChatPreview";
import DiseaseDetectionDemo from "@/components/DiseaseDetectionDemo";
import DiseaseGallery from "@/components/DiseaseGallery";
import Footer from "@/components/Footer";
import GovernmentSchemes from "@/components/GovernmentSchemes";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import MarketPrices from "@/components/MarketPrices";
import Navbar from "@/components/Navbar";
import SmartStats from "@/components/SmartStats";
import Testimonials from "@/components/Testimonials";
import WeatherWidget from "@/components/WeatherWidget";
import { AnimatedItem, AnimatedSection } from "@/components/AnimatedSection";

const featureCards = [
  {
    title: "Disease Detection",
    description:
      "Upload crop images and get instant AI-powered disease identification with treatment guidance.",
    iconBg: "#e8f5ec",
    icon: (
      <svg className="h-6 w-6 text-km-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
  },
  {
    title: "AI Farming Assistant",
    description:
      "Ask questions in Hindi or English — get smart advice on crops, weather, pests, and fertilizers.",
    iconBg: "#dbeafe",
    icon: (
      <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    title: "Weather Alerts",
    description:
      "Real-time weather updates with crop-specific alerts to plan irrigation and protect your harvest.",
    iconBg: "#e0f2fe",
    icon: (
      <svg className="h-6 w-6 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
  },
  {
    title: "Farmer Community",
    description:
      "Connect with farmers across regions, share experiences, and learn proven farming practices.",
    iconBg: "#ffedd5",
    icon: (
      <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: "Market Prices",
    description:
      "Live mandi prices for major crops with trend indicators — sell at the right time for better profits.",
    iconBg: "#fef3c7",
    icon: (
      <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    title: "Government Schemes",
    description:
      "Easy access to PM-KISAN, crop insurance, subsidies, and Kisan Credit Card information.",
    iconBg: "#f3e8ff",
    icon: (
      <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SmartStats />

        <AnimatedSection
          id="features"
          className="px-4 py-16 md:px-10 md:py-20"
          stagger
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <p className="km-section-label mb-4">Features</p>
              <h2 className="mb-3 text-3xl font-bold tracking-tight km-text-primary md:text-4xl">
                Everything You Need to Farm Smarter
              </h2>
              <p className="mx-auto max-w-xl km-text-muted">
                Powerful tools designed for Indian farmers — simple to use, available
                in your language.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featureCards.map((card) => (
                <AnimatedItem key={card.title}>
                  <Card
                    title={card.title}
                    description={card.description}
                    icon={card.icon}
                    iconBg={card.iconBg}
                  />
                </AnimatedItem>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <WeatherWidget />
        <HowItWorks />
        <DiseaseGallery />
        <DiseaseDetectionDemo />
        <ChatPreview />
        <Testimonials />
        <MarketPrices />
        <GovernmentSchemes />
      </main>
      <Footer />
    </div>
  );
}
