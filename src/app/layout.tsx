import type { Metadata } from "next";
import localFont from "next/font/local";
 import "./globals.css";

const nexaLight = localFont({
  src: "../fonts/Nexa-Light.otf",
  variable: "--font-nexa-light",
  display: "swap",
  preload: true,
});

const nexaBold = localFont({
  src: "../fonts/Nexa-Bold.otf",
  variable: "--font-nexa-bold",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Luís Campos — Artista Plástico e Xilografista",
    template: "%s — Luís Campos",
  },
  description:
    "Portfólio oficial de Luís Campos, artista plástico e xilografista de Torres Novas, Portugal.",
  keywords: ["Luís Campos", "artista plástico", "xilografista", "xilogravura", "Torres Novas", "Portugal"],
  authors: [{ name: "Luís Campos" }],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "Luís Campos",
    title: "Luís Campos — Artista Plástico e Xilografista",
    description: "Portfólio oficial de Luís Campos, artista plástico e xilografista de Torres Novas, Portugal.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Luís Campos — Artista Plástico e Xilografista",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={`${nexaLight.variable} ${nexaBold.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
