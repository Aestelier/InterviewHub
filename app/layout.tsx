import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aestelier - Consentement entretien",
  description:
    "Site privacy-first pour comprendre l'entretien de recherche Aestelier et generer un formulaire de consentement."
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
