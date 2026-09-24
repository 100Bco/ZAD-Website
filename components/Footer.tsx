import Link from "next/link";
import { site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer__grid">
        <div className="footer__cta">
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
          <Link className="pill pill--white" href="/contact">
            {site.footer.startLabel}
          </Link>
        </div>
        <p className="footer__address">{site.address}</p>
        <p className="footer__copy">{site.copyright}</p>
      </div>
    </footer>
  );
}
