"use client";

import { useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  Button,
  Input,
  Loader,
  Modal,
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from "@/components/ui";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-km-border km-glass p-5 sm:p-6 dark:border-km-green/20">
      <h2 className="mb-1 text-lg font-bold km-text-primary sm:text-xl">{title}</h2>
      {description && (
        <p className="mb-5 text-sm km-text-muted">{description}</p>
      )}
      {children}
    </section>
  );
}

export default function ShowcasePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [showFullscreenLoader, setShowFullscreenLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = () => {
    if (!email.includes("@")) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError("");
    showSuccessToast("Email validated successfully!");
  };

  const triggerFullscreenLoader = () => {
    setShowFullscreenLoader(true);
    window.setTimeout(() => setShowFullscreenLoader(false), 2000);
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-1 px-4 py-10 md:px-10 md:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center sm:mb-12">
            <p className="km-section-label mb-3">Component Library</p>
            <h1 className="mb-3 text-3xl font-bold km-text-primary sm:text-4xl">
              KrishiMitra UI Kit
            </h1>
            <p className="mx-auto max-w-xl text-sm km-text-muted sm:text-base">
              Reusable components for the KrishiMitra platform — buttons, inputs,
              modals, toasts, and loaders.
            </p>
          </div>

          <div className="flex flex-col gap-6 sm:gap-8">
            <Section title="Button Variants" description="Primary, secondary, and outline styles.">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="primary" disabled>
                  Disabled
                </Button>
              </div>
            </Section>

            <Section title="Button Sizes" description="Small, medium, and large presets.">
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
              </div>
            </Section>

            <Section title="Input" description="Label, placeholder, and error states.">
              <div className="grid gap-5 sm:grid-cols-2">
                <Input
                  label="Farmer Name"
                  placeholder="Enter your name"
                  value=""
                  onChange={() => {}}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) setEmailError("");
                  }}
                  error={emailError}
                />
              </div>
              <div className="mt-4">
                <Button size="sm" onClick={validateEmail}>
                  Validate Email
                </Button>
              </div>
            </Section>

            <Section title="Modal" description="Backdrop, escape key, and click-outside close.">
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Crop Disease Detected"
              >
                <p className="mb-4 text-sm leading-relaxed">
                  Your wheat crop shows signs of Leaf Rust. Apply recommended
                  fungicide within 48 hours for best results.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm" onClick={() => setModalOpen(false)}>
                    View Treatment
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setModalOpen(false)}>
                    Dismiss
                  </Button>
                </div>
              </Modal>
            </Section>

            <Section title="Toast Notifications" description="Global toast helpers via react-hot-toast.">
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => showSuccessToast("Crop scan completed successfully!")}
                >
                  Success Toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => showErrorToast("Failed to upload image. Try again.")}
                >
                  Error Toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => showInfoToast("Weather alert: Rain expected tomorrow.")}
                >
                  Info Toast
                </Button>
              </div>
            </Section>

            <Section title="Loader" description="Inline spinner and full-screen overlay.">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Loader size="sm" />
                  <span className="text-sm km-text-muted">Small</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader size="md" />
                  <span className="text-sm km-text-muted">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader size="lg" />
                  <span className="text-sm km-text-muted">Large</span>
                </div>
              </div>
              <div className="mt-5">
                <Button size="sm" variant="outline" onClick={triggerFullscreenLoader}>
                  Show Fullscreen Loader (2s)
                </Button>
              </div>
              {showFullscreenLoader && <Loader fullscreen label="Processing crop scan" />}
            </Section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
