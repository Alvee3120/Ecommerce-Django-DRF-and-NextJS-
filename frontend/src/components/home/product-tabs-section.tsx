"use client";

import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import type { ProductList } from "@/lib/types";

export interface ProductTab {
  label: string;
  products: ProductList[];
}

export function ProductTabsSection({ heading, tabs }: { heading: string; tabs: ProductTab[] }) {
  const [active, setActive] = useState(0);
  const activeTab = tabs[active];

  return (
    <section>
      <h2 className="text-center text-2xl font-medium sm:text-3xl">{heading}</h2>

      <div className="mt-5 overflow-x-auto border-b">
        <div className="flex w-max min-w-full justify-center gap-6 whitespace-nowrap sm:gap-10">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(i)}
              className={`pb-3 text-xs font-medium tracking-widest uppercase sm:text-sm ${
                i === active
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-foreground/35 hover:text-foreground/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab.products.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">
          No products tagged &quot;{activeTab.label}&quot; yet.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {activeTab.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
