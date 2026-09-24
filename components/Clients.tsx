type Client = { name: string; logo: string; color?: string };

/** Client logo grid. Logos are grey; hovering shows the brand-colour version when `color` is set. */
export default function Clients({ items }: { items: Client[] }) {
  return (
    <ul className="clients__grid">
      {items.map((c) => (
        <li key={c.name} className={`client${c.color ? " client--has-color" : ""}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="client__logo" src={c.logo} alt={c.name} loading="lazy" />
          {c.color && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="client__logo client__logo--color" src={c.color} alt="" aria-hidden="true" loading="lazy" />
          )}
        </li>
      ))}
    </ul>
  );
}
