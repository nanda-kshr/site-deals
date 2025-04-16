import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { satoshi } from "@/styles/fonts";
import TopBanner from "@/components/layout/Banner/TopBanner";
import TopNavbar from "@/components/layout/Navbar/TopNavbar";
import Footer from "@/components/layout/Footer";
import HolyLoader from "holy-loader";
import Providers from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "SiteDeals - Best Offers and Deals Online",
  description: "Discover the best online deals, discounts, coupons, and promotional offers on products and services across various categories. Save money with SiteDeals.",
  keywords: "deals, offers, discounts, coupons, promo codes, online shopping, best deals, sales",
  authors: [{ name: "SiteDeals Team" }],
  creator: "SiteDeals",
  publisher: "SiteDeals",
  openGraph: {
    title: "SiteDeals - Best Offers and Deals Online",
    description: "Discover the best online deals, discounts, coupons, and promotional offers.",
    url: "https://sitedeals.store",
    siteName: "SiteDeals",
    images: [
      {
        url: "/images/logo.png",
        width: 320,
        height: 320,
        alt: "SiteDeals Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SiteDeals - Best Offers and Deals Online",
    description: "Discover the best online deals, discounts, coupons, and promotional offers.",
    images: ["/images/logo.png"],
  },
  icons: {
    icon: [
      { url: "/images/logo.ico" },
      { url: "/images/logo.png", type: "image/png" }
    ],
    shortcut: ["/images/logo.ico"],
    apple: [{ url: "/images/logo.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={satoshi.className}>
        <HolyLoader color="#868686" />
        <TopBanner />
        <Providers>
          <TopNavbar />
          {children}
        </Providers>
        <Footer />
        <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
