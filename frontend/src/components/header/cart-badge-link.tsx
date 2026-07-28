"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { cartCount, useCartStore } from "@/store/cart";

export function CartBadgeLink({ className = "" }: { className?: string }) {
  const items = useCartStore((state) => state.items);
  const count = cartCount(items);

  return (
    <Link href="/cart" aria-label="Cart" className={`relative inline-flex ${className}`}>
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
          {count}
        </span>
      )}
    </Link>
  );
}
