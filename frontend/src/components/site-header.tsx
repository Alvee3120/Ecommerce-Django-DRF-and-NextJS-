"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { cartCount, useCartStore } from "@/store/cart";
import type { CategoryTreeNode, SiteSettings } from "@/lib/types";

interface Props {
  settings: SiteSettings;
  categories: CategoryTreeNode[];
}

export function SiteHeader({ settings, categories }: Props) {
  const items = useCartStore((state) => state.items);
  const count = cartCount(items);

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          {settings.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={settings.logo} alt={settings.site_name} className="h-8 w-auto" />
          ) : null}
          <span>{settings.site_name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`} className="hover:text-primary">
              {category.name}
            </Link>
          ))}
        </nav>

        <Link href="/cart" className="relative inline-flex items-center gap-2 text-sm font-medium">
          <ShoppingCart className="h-5 w-5" />
          Cart
          {count > 0 && (
            <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
