import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import SiteHeader from "@/components/SiteHeader";
import RevealObserver from "@/components/RevealObserver";
import Lightbox from "@/components/Lightbox";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "ZAD Agency | Kiến tạo thương hiệu bằng chiến lược và sáng tạo",
    template: "ZAD Agency | %s",
  },
  description:
    "ZAD Agency xây dựng và tái định vị nhận diện thương hiệu: Brand identity, Packaging / Print, Website / App, Advertising.",
  openGraph: {
    siteName: "ZAD Agency",
    images: ["/images/og-image.jpg"],
    locale: "vi_VN",
    type: "website",
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
