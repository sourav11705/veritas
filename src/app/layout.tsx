import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Veritas — Verifiable AI Agents on Solana",
  description: "Cryptographic accountability for autonomous AI agents. Every action proven. Every violation slashed. Built on Solana.",
  openGraph: {
    title: "Veritas — Verifiable AI Agents on Solana",
    description: "Cryptographic accountability for autonomous AI agents. Every action proven. Every violation slashed. Built on Solana.",
    images: ["https://veritas.app/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Veritas — Verifiable AI Agents on Solana",
    description: "Cryptographic accountability for autonomous AI agents. Every action proven. Every violation slashed. Built on Solana.",
    images: ["https://veritas.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
