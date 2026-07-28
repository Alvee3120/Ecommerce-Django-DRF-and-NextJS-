import { Heart, LayoutGrid, Store, User } from "lucide-react";
import Link from "next/link";

const ITEMS = [
  { label: "Shop", Icon: Store, href: "/" },
  { label: "Categories", Icon: LayoutGrid, href: "/" },
  { label: "Account", Icon: User, href: "/track-order" },
];

export function MobileTabBar() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background lg:hidden">
      {ITEMS.map(({ label, Icon, href }) => (
        <Link
          key={label}
          href={href}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-foreground/70 hover:text-primary"
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
      <span
        aria-label="Wishlist (coming soon)"
        title="Coming soon"
        className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] text-foreground/40"
      >
        <Heart className="h-5 w-5" />
        Wishlist
      </span>
    </nav>
  );
}
