import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ThemeProvider from "@/components/ThemeProvider";
import { ToastProvider } from "@/components/ui";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KrishiMitra - AI-Powered Smart Farming Assistant",
  description:
    "Detect crop diseases and receive AI-driven farming recommendations instantly. Built for Indian farmers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        <ThemeProvider>
          {children}
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
