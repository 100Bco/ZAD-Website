import { NextResponse, type NextRequest } from "next/server";

/**
 * Language routing. The pages live under app/[lang]: Vietnamese keeps the plain addresses
 * (/about is served from /vi/about) and English is under /en (/en/about).
 * /vi/... addresses are redirected to the plain ones so each page has a single address.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/vi" || pathname.startsWith("/vi/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/vi${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Skip Next.js internals and any file with an extension (images, fonts, icons, sitemap.xml...)
  matcher: ["/((?!_next/|api/|.*\\.[^/]+$).*)"],
};
