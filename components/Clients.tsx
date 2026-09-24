type Client = { name: string; logo: string };

/**
 * Client logo grid. Each file is the brand-colour logo on a transparent 264x99 cell;
 * CSS shows it in grey and reveals the real colours on hover.
 */
export default function Clients({ items }: { items: Client[] }) {
  return (
    <ul className="clients__grid">
      {items.map((c) => (
        <li key={c.name} className="client">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="client__logo" src={c.logo} alt={c.name} width={792} height={299} loading="lazy" />
        </li>
      ))}
    </ul>
  );
}
