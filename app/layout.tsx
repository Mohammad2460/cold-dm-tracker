import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Nav } from "@/components/nav";
import { Providers } from "./providers";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cold DM Tracker - Never Lose a Deal to Forgotten Follow-Ups",
  description: "Track your cold DMs across all platforms and get reminded automatically. Join 50+ professionals who never miss a follow-up.",
  metadataBase: new URL('https://applyfast.dev'),
  keywords: ["cold DM", "follow-up tracker", "sales", "outreach", "CRM", "LinkedIn", "Twitter", "freelancer"],
  authors: [{ name: "Mohammad", url: "https://twitter.com/SaaSbyMohd" }],
  creator: "Mohammad",
  openGraph: {
    title: 'Cold DM Tracker - Never Lose a Deal to Forgotten Follow-Ups',
    description: 'Track cold DMs across all platforms and get reminded automatically. Join the waitlist - 50% off for first 50 users!',
    siteName: 'Cold DM Tracker',
    locale: 'en_US',
    type: 'website',
    url: 'https://applyfast.dev',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cold DM Tracker - Never Lose a Deal',
    description: 'Track cold DMs across all platforms and get reminded automatically. Join the waitlist!',
    creator: '@SaaSbyMohd',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Providers>
            <Nav />
            {children}
            <SpeedInsights />
            <Analytics />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}