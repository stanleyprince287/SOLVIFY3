import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Solvify — Find the right professional for the job",
  description:
    "Solvify connects you with verified local professionals — electricians, plumbers, mechanics, cleaners, developers, and more."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-ink antialiased">{children}</body>
    </html>
  );
}