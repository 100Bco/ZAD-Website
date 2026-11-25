/** Languages of the site. Vietnamese lives at the root (/about), English under /en (/en/about). */
export const locales = ["vi", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "vi";

export const isLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** "/about" in the given language: "/about" (vi) or "/en/about" (en). */
export function localePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/**
 * The path without its locale prefix. Vietnamese pages are served from root URLs,
 * but the proxy rewrites them to /vi/..., and on Vercel usePathname() can report
 * that internal path, so /vi is stripped as well as /en.
 */
export function basePath(pathname: string) {
  for (const l of locales) {
    if (pathname === `/${l}`) return "/";
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(l.length + 1);
  }
  return pathname;
}

/** Which language a URL path belongs to. */
export function localeOf(pathname: string): Locale {
  for (const l of locales) {
    if (l !== defaultLocale && (pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return l;
  }
  return defaultLocale;
}

export const ogLocale: Record<Locale, string> = { vi: "vi_VN", en: "en_US" };

/** hreflang links for a page, given its path without the language prefix. */
export function alternates(locale: Locale, path: string) {
  return {
    canonical: localePath(locale, path),
    languages: {
      vi: localePath("vi", path),
      en: localePath("en", path),
      "x-default": localePath(defaultLocale, path),
    },
  };
}

/** Reads the language from a page's route params (the root layout has already rejected others). */
export async function localeFromParams(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : defaultLocale;
}
