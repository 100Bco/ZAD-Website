"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { useLocale } from "./LocaleProvider";
import { basePath, localePath, locales } from "@/lib/i18n";

export default function SiteHeader() {
  const { site, ui, locale, href } = useLocale();
  const pathname = usePathname();
  const base = basePath(pathname);
  const isHome = base === "/";
  // this page's public URL (on Vercel, usePathname() can report the internal /vi/... path)
  const current = href(base);
  const menuLinks = [{ label: "Home", href: href("/") }, ...site.nav];

  // VI / EN: the same page in each language
  const langSwitch = (
    <div className="lang-switch" role="group" aria-label={ui.nav.language}>
      {locales.map((l) => (
        <Link
          key={l}
          href={localePath(l, base)}
          hrefLang={l}
          lang={l}
          prefetch={false}
          aria-current={l === locale ? "true" : undefined}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  // after a page change the menu vanishes at once (the page ripple is already covering it)
  const [instant, setInstant] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Solid background after scrolling; hide while scrolling down
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > lastY && y > 240 && !document.body.classList.contains("is-locked"));
      lastY = y;
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu when the route changes
  useEffect(() => {
    setInstant(true);
    setOpen(false);
    const t = setTimeout(() => setInstant(false), 50);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("is-locked", open);
    if (open) {
      const t = setTimeout(() => closeRef.current?.focus(), 50);
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      document.addEventListener("keydown", onKey);
      return () => {
        clearTimeout(t);
        document.removeEventListener("keydown", onKey);
      };
    }
  }, [open]);

  const closeMenu = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  const headerClass = [
    "site-header",
    isHome && "site-header--light site-header--home",
    scrolled && "is-scrolled",
    hidden && "is-hidden",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <header className={headerClass}>
        <nav className="nav container" aria-label={ui.nav.main}>
          <Link className="nav__logo" href={href("/")} aria-label={ui.nav.home}>
            <Logo />
          </Link>
          <ul className="nav__links">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={current === item.href ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {langSwitch}
          <button
            ref={toggleRef}
            className="nav__toggle"
            type="button"
            aria-label={ui.nav.openMenu}
            aria-expanded={open}
            aria-controls="menu"
            onClick={() => setOpen(true)}
          >
            <span />
          </button>
        </nav>
      </header>

      <div className={`menu${open ? " is-open" : ""}${instant ? " is-instant" : ""}`} id="menu" aria-hidden={!open} inert={!open}>
        <div className="menu__top container">
          <Link className="nav__logo" href={href("/")} aria-label={ui.nav.home} onClick={closeMenu}>
            <Logo />
          </Link>
          <button ref={closeRef} className="menu__close" type="button" aria-label={ui.nav.closeMenu} onClick={closeMenu} />
        </div>
        <div className="menu__body container">
          <ul className="menu__links">
            {menuLinks.map((item, i) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => item.href === current && setOpen(false)}>
                  <small>{String(i).padStart(2, "0")}</small>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="menu__foot">
            <div>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              <a href={`tel:${site.phoneHref}`}>{site.phone}</a>
            </div>
            <div>
              {site.socials.map((s, i) => (
                <span key={s.label}>
                  {i > 0 && " / "}
                  <a href={s.href} target="_blank" rel="noopener">
                    {s.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
