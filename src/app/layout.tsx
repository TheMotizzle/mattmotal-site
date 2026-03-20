import type { Metadata } from "next";
import localFont from "next/font/local";
import { Crete_Round } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getSiteConfig } from "@/lib/content";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
const creteRound = Crete_Round({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-display",
});

let siteConfig: Awaited<ReturnType<typeof getSiteConfig>>;

export async function generateMetadata(): Promise<Metadata> {
  if (!siteConfig) {
    siteConfig = await getSiteConfig();
  }
  return {
    title: `${siteConfig.siteName} | VFX Artist`,
    description: `Portfolio of Matt Motal - Visual Effects Artist specializing in cinematic storytelling and digital artistry.`,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!siteConfig) {
    siteConfig = await getSiteConfig();
  }

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${creteRound.variable} antialiased bg-neutral-950 text-white`}
      >
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
