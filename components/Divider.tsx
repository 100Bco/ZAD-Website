import Link from "next/link";

type Props = { href: string; label: string; icon: "plus" | "down"; className?: string };

export default function Divider({ href, label, icon, className }: Props) {
  return (
    <Link className={`divider ${className ?? ""}`} href={href} aria-label={label}>
      <span className="divider__badge">
        {icon === "plus" ? (
          <svg viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
            <path d="M3.37 7.6V4.6H.3V3.4h3.07V.2h1.26v3.2H7.7v1.2H4.63v3H3.37Z" />
          </svg>
        ) : (
          <svg viewBox="0 0 8 10" fill="none" stroke="currentColor" aria-hidden="true">
            <path d="M4 .5v8M.8 5.6 4 8.8l3.2-3.2" />
          </svg>
        )}
      </span>
    </Link>
  );
}
