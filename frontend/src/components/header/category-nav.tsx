import { ChevronDown } from "lucide-react";
import Link from "next/link";

import type { CategoryTreeNode } from "@/lib/types";

export function CategoryNav({ categories }: { categories: CategoryTreeNode[] }) {
  if (categories.length === 0) return null;

  return (
    <nav className="hidden border-t lg:block">
      <ul className="mx-auto flex max-w-[1200px] items-center justify-center gap-8 px-4 text-sm font-medium tracking-wide text-foreground/70">
        {categories.map((category) => (
          <li key={category.id} className="group relative py-4">
            <Link
              href={`/category/${category.slug}`}
              className="flex items-center gap-1 uppercase hover:text-primary"
            >
              {category.name}
              {category.children.length > 0 && <ChevronDown className="h-3 w-3" />}
            </Link>
            {category.children.length > 0 && (
              <ul className="invisible absolute top-full left-1/2 z-20 min-w-[200px] -translate-x-1/2 rounded-md border bg-background py-2 opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100">
                {category.children.map((child) => (
                  <li key={child.id}>
                    <Link
                      href={`/category/${child.slug}`}
                      className="block px-4 py-2 text-foreground/80 normal-case hover:bg-muted hover:text-primary"
                    >
                      {child.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
