import Link from "next/link";
import { site } from "@/lib/content";

/** `light`: white footer, used on the homepage where the blue client band sits right above it. */
export default function Footer({ light = false }: { light?: boolean }) {
  return (
    <footer className={`site-footer${light ? " site-footer--light" : ""}`}>
      <div className="container footer__grid">
        {/* on the homepage this block slides in when the footer comes into view (RevealObserver) */}
        <div className={`footer__cta${light ? " footer__cta--slide" : ""}`} data-observe={light ? "" : undefined}>
          <p className="label">{site.footer.ctaLabel}</p>
          <p className="footer__big">
            {site.footer.ctaLines[0]}
            <br /> {site.footer.ctaLines[1]}
          </p>
        </div>
        <div className="footer__contact">
          <p className="label">{site.footer.contactLabel}</p>
          <p className="footer__big">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
          </p>
        </div>
        <div className="footer__social">
          {site.socials.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener">
              {s.label}
            </a>
          ))}
        </div>
        <div className="footer__start">
          <Link className={`pill ${light ? "pill--blue" : "pill--white"}`} href="/contact">
            {site.footer.startLabel}
          </Link>
        </div>
        <p className="footer__address">{site.address}</p>
        <p className="footer__copy">{site.copyright}</p>
      </div>
    </footer>
  );
}
