import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import RevealObserver from "@/components/RevealObserver";
import Lightbox from "@/components/Lightbox";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

// Public address used for share images and links. Set NEXT_PUBLIC_SITE_URL to the real domain;
// on Vercel it falls back to the project's production domain, so share previews never point at localhost.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

const shareImage = {
  url: "/images/og-image.jpg",
  width: 1200,
  height: 630,
  alt: "ZAD Agency",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ZAD Agency | Do It Right Once",
    template: "ZAD Agency | %s",
  },
  description:
    "ZAD Agency xây dựng và tái định vị thương hiệu từ chiến lược, thiết kế nhận diện, bao bì, website và quảng cáo nhất quán để thương hiệu làm đúng ngay từ đầu.",
  openGraph: {
    siteName: "ZAD Agency",
    images: [shareImage],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [shareImage],
  },
};

export const viewport: Viewport = {
  themeColor: "#063a8e",
};

// Runs before first paint: hides the intro for visitors who already saw it this session
const introScript = `(function(){try{var r=document.documentElement;if(sessionStorage.getItem("zad-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches){r.classList.add("intro-seen")}else{r.classList.add("is-intro-pending")}}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link rel="preload" href="/fonts/inter-vietnamese.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <SiteHeader />
        {children}
        <Lightbox />
        <RevealObserver />
        <SmoothScroll />
        <PageTransition />
      </body>
    </html>
  );
}
