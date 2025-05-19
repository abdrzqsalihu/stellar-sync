import LenisScroll from "./LenisScroll";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ClerkProvider } from "@clerk/nextjs";
import { Rubik } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/theme-provider";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "StellarSync",
  description: "Upload, Manage, and Share Your Content Seamlessly!",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={rubik.className} suppressHydrationWarning>
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
