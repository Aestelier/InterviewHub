import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aestelier, building tools with artists",
  description:
    "Aestelier is a research phase for digital tools built with visual artists, designed to support their workflow without taking control of their work."
};

export default function EnglishLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
