"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { CategoryTreeNode } from "@/lib/types";

export function MobileMenu({ categories }: { categories: CategoryTreeNode[] }) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger aria-label="Open menu">
        <Menu className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-2 flex flex-col px-4">
          {categories.map((category) => (
            <div key={category.id} className="border-b">
              <div className="flex items-center justify-between">
                <Link
                  href={`/category/${category.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 text-sm font-medium tracking-wide uppercase"
                >
                  {category.name}
                </Link>
                {category.children.length > 0 && (
                  <button
                    type="button"
                    aria-label="Expand category"
                    onClick={() => setExpanded(expanded === category.id ? null : category.id)}
                    className="p-3"
                  >
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        expanded === category.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
              {expanded === category.id && category.children.length > 0 && (
                <div className="flex flex-col pb-2 pl-4">
                  {category.children.map((child) => (
                    <Link
                      key={child.id}
                      href={`/category/${child.slug}`}
                      onClick={() => setOpen(false)}
                      className="py-2 text-sm text-foreground/70"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
