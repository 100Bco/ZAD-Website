import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import LocaleProvider from "@/components/LocaleProvider";
import RevealObserver from "@/components/RevealObserver";
import Lightbox from "@/components/Lightbox";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { getContent } from "@/lib/content";
import { alternates, isLocale, locales, ogLocale, type Locale } from "@/lib/i18n";
import "../globals.css";

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

// Both languages are built ahead of time. The proxy only ever sends "vi" or "en" here;
// unknown addresses reach app/[lang]/[...rest] and show the 404 page in that language.
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

type LayoutProps = { children: ReactNode; params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Pick<LayoutProps, "params">): Promise<Metadata> {
  const { lang } = await params;
  const locale: Locale = isLocale(lang) ? lang : "vi";
  const { ui } = getContent(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "ZAD Agency | Do It Right Once",
      template: "ZAD Agency | %s",
    },
    description: ui.meta.description,
    alternates: alternates(locale, "/"),
    openGraph: {
      siteName: "ZAD Agency",
      images: [shareImage],
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [shareImage],
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#063a8e",
};

// Runs before first paint: hides the intro for visitors who already saw it this session
const introScript = `(function(){try{var r=document.documentElement;if(sessionStorage.getItem("zad-intro")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches){r.classList.add("intro-seen")}else{r.classList.add("is-intro-pending")}}catch(e){}})();`;

export default async function RootLayout({ children, params }: LayoutProps) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { site, ui } = getContent(lang);

  return (
    <html lang={lang} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link rel="preload" href="/fonts/inter-vietnamese.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossOrigin="" />
      </head>
      <body>
        <LocaleProvider value={{ locale: lang, site, ui }}>
          <SiteHeader />
          {children}
          <Lightbox />
          <RevealObserver />
          <SmoothScroll />
          <PageTransition />
        </LocaleProvider>
      </body>
    </html>
  );
}
