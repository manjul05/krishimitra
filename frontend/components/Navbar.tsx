import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/login", label: "Login" },
];

export default function Navbar() {
  return (
    <nav className="bg-green-700 text-white px-4 md:px-10 py-4">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <Link href="/" className="text-xl font-bold">
          🌾 KrishiMitra
        </Link>
        <ul className="flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="transition-colors hover:text-emerald-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
