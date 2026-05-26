import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aestelier — Construire des outils avec les artistes",
  description:
    "Aestelier est une suite d’outils numériques construits avec les artistes visuels pour augmenter leur workflow, sans rien prendre sur leurs œuvres. Phase de recherche en cours."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
