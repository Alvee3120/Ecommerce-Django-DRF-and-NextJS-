export function FooterLinks({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-3 text-sm">
      {items.map((label) => (
        <li key={label}>
          <a href="#" className="text-foreground/80 hover:text-primary">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
