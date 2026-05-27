import type { Metadata } from "next";
import localFont from "next/font/local";
import { headers } from "next/headers";
import "./globals.css";

const geist = localFont({
  src: [
    {
      path: "./fonts/geist-latin.woff2",
      weight: "300 600",
      style: "normal"
    }
  ],
  variable: "--font-sans",
  display: "swap"
});

const instrument = localFont({
  src: [
    {
      path: "./fonts/InstrumentSerif-Regular.ttf",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/InstrumentSerif-Italic.ttf",
      weight: "400",
      style: "italic"
    }
  ],
  variable: "--font-italic",
  display: "swap"
});

const mono = localFont({
  src: [
    {
      path: "./fonts/JetBrainsMono-wght.ttf",
      weight: "400 500",
      style: "normal"
    }
  ],
  variable: "--font-mono",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Aestelier — Construire des outils avec les artistes",
  description:
    "Aestelier est une suite d’outils numériques construits avec les artistes visuels pour augmenter leur workflow, sans rien prendre sur leurs œuvres. Phase de recherche en cours."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
  const skipLabel = locale === "en" ? "Skip to main content" : "Aller au contenu principal";

  return (
    <html lang={locale} className={`${geist.variable} ${instrument.variable} ${mono.variable}`}>
      <body className="antialiased">
        <a href="#main-content" className="skip-link">
          {skipLabel}
        </a>
        <div id="main-content" tabIndex={-1}>
          {children}
        </div>
      </body>
    </html>
  );
}
