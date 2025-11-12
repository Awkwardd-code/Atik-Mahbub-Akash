import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import React Three Fiber compatibility fix globally
import "../lib/reactThreeCompat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atik Mahbub Akash | Immersive Product Designer & Developer",
  description:
    "Portfolio of Atik Mahbub Akash, crafting cinematic web experiences, 3D interfaces, and scalable product systems for visionary teams.",
  openGraph: {
    title: "Atik Mahbub Akash | Immersive Product Designer & Developer",
    description:
      "Crafting cinematic web experiences, 3D interfaces, and scalable product systems for visionary teams.",
    url: "https://atik-portfolio.example",
    siteName: "Atik Mahbub Akash Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Atik Mahbub Akash Portfolio Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atik Mahbub Akash | Immersive Product Designer & Developer",
    description:
      "Crafting cinematic web experiences, 3D interfaces, and scalable product systems for visionary teams.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
