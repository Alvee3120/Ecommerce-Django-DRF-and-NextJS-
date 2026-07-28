import { ProductCard } from "@/components/product-card";
import type { ProductList } from "@/lib/types";

const INACTIVE_TABS = ["Featured", "Best Selling", "Top Rate", "Trends"];

export function ProductTabsSection({
  heading,
  products,
}: {
  heading: string;
  products: ProductList[];
}) {
  return (
    <section>
      <h2 className="text-center text-2xl font-medium sm:text-3xl">{heading}</h2>

      <div className="mt-5 overflow-x-auto border-b">
        <div className="flex w-max min-w-full justify-center gap-6 whitespace-nowrap sm:gap-10">
          <span className="border-b-2 border-foreground pb-3 text-xs font-medium tracking-widest text-foreground uppercase sm:text-sm">
            All
          </span>
          {INACTIVE_TABS.map((tab) => (
            <span
              key={tab}
              title="Coming soon"
              className="cursor-not-allowed pb-3 text-xs font-medium tracking-widest text-foreground/35 uppercase sm:text-sm"
            >
              {tab}
            </span>
          ))}
        </div>
      </div>

      {products.length === 0 ? (
        <p className="mt-8 text-center text-muted-foreground">No products yet.</p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
