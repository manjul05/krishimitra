import Card from "@/components/Card";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";

const featureCards = [
  {
    title: "Disease Detection",
    description: "Upload crop images and detect diseases instantly.",
  },
  {
    title: "AI Farmer Assistant",
    description: "Get AI-powered farming advice and recommendations.",
  },
  {
    title: "Farmer Community",
    description: "Connect and interact with farmers across regions.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section className="px-4 py-12 md:px-10">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
            {featureCards.map((card) => (
              <Card
                key={card.title}
                title={card.title}
                description={card.description}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
