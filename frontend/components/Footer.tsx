import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto bg-gray-900 px-4 py-8 text-white md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3 md:flex-row md:gap-6">
          <Link href="/about" className="hover:text-emerald-300">
            About
          </Link>
          <a href="mailto:contact@krishimitra.com" className="hover:text-emerald-300">
            Contact
          </a>
          <Link href="#" className="hover:text-emerald-300">
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} KrishiMitra. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
