"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/obras",     label: "Obras" },
  { href: "/exposicoes",label: "Exposições" },
  { href: "/mapa",      label: "Mapa" },
  { href: "/blog",      label: "Blog" },
  { href: "/sobre",     label: "Sobre" },
  { href: "/contactos", label: "Contactos" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-paper/96 backdrop-blur-md border-b border-line">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <Link href="/" className="type-nav text-muted hover:text-ink transition-colors duration-200">
            Luís Campos
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`type-nav transition-colors duration-200 ${
                  pathname.startsWith(link.href) ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 text-ink transition-colors duration-300"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 bg-paper flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mt-20 flex flex-col px-8 py-8">
          {links.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
              className={`type-h3 py-4 border-b border-line transition-all duration-300 ${
                pathname.startsWith(link.href) ? "text-accent" : "text-ink"
              } ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
