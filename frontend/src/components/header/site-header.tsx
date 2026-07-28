import { Heart, LayoutGrid, Repeat, User } from "lucide-react";
import Link from "next/link";

import type { CategoryTreeNode, SiteSettings } from "@/lib/types";

import { AnnouncementBar } from "./announcement-bar";
import { CartBadgeLink } from "./cart-badge-link";
import { CategoryNav } from "./category-nav";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { SearchToggle } from "./search-toggle";
import { SocialIcons } from "./social-icons";

interface Props {
  settings: SiteSettings;
  categories: CategoryTreeNode[];
}

export function SiteHeader({ settings, categories }: Props) {
  return (
    <header className="border-b bg-background">
      <AnnouncementBar />

      {/* Desktop main row */}
      <div className="mx-auto hidden max-w-[1200px] items-center justify-between px-4 py-6 lg:flex">
        <SocialIcons />
        <Logo settings={settings} className="text-3xl" />
        <div className="flex items-center gap-5 text-foreground/80">
          <Link href="/" aria-label="Browse categories" className="hover:text-primary">
            <LayoutGrid className="h-5 w-5" />
          </Link>
          <span aria-label="Wishlist (coming soon)" title="Coming soon" className="opacity-60">
            <Heart className="h-5 w-5" />
          </span>
          <span aria-label="Compare (coming soon)" title="Coming soon" className="opacity-60">
            <Repeat className="h-5 w-5" />
          </span>
          <SearchToggle className="hover:text-primary" />
          <CartBadgeLink className="hover:text-primary" />
        </div>
      </div>

      {/* Mobile main row */}
      <div className="flex items-center justify-between px-4 py-4 lg:hidden">
        <div className="flex items-center gap-4">
          <MobileMenu categories={categories} />
          <SearchToggle />
        </div>
        <Logo settings={settings} className="text-xl" />
        <div className="flex items-center gap-4 text-foreground/80">
          <span aria-label="Account (coming soon)" title="Coming soon" className="opacity-60">
            <User className="h-5 w-5" />
          </span>
          <CartBadgeLink />
        </div>
      </div>

      <CategoryNav categories={categories} />
    </header>
  );
}
