import type { Metadata } from "next";
import LenisScroll from "./LenisScroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { Rubik, Fraunces } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";
import { Toaster } from "react-hot-toast";

const rubik = Rubik({ subsets: ["latin"] });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://stellar-sync.vercel.app"),
  title: "StellarSync",
  description: "Your files. Always within reach.",
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    images: [
      {
        url: "/social/stellar-sync-share.png",
        width: 1200,
        height: 630,
        alt: "Your files. Always within reach.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/social/stellar-sync-share.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${rubik.className} ${fraunces.variable} bg-white`}
          suppressHydrationWarning
        >
          <Toaster position="top-right" />
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <LenisScroll />
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
