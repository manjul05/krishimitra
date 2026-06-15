import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-12 md:px-10">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-4 text-3xl font-bold text-green-700">
            Login to KrishiMitra
          </h1>
          <p className="text-lg text-gray-600">
            Sign in to access your smart farming tools, disease detection, and
            farmer community.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
