import Link from "next/link";

import { HeroSlider, type HeroSlide } from "@/components/home/hero-slider";
import { ProductHighlights } from "@/components/home/product-highlights";
import { ProductTabsSection } from "@/components/home/product-tabs-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { TrustBadges } from "@/components/home/trust-badges";
import { ProductCard } from "@/components/product-card";
import { getCategoryTree, getProducts, getSiteSettings } from "@/lib/data";
import type { Paginated, ProductList } from "@/lib/types";

const EMPTY_PRODUCTS: Paginated<ProductList> = { count: 0, next: null, previous: null, results: [] };

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const fetchTag = (tag: string) => (q ? Promise.resolve(EMPTY_PRODUCTS) : getProducts({ tag }));
  const [settings, categoryTree, products, featured, bestSelling, topRated, trends, onSale] =
    await Promise.all([
      getSiteSettings(),
      getCategoryTree(),
      getProducts({ search: q }),
      fetchTag("featured"),
      fetchTag("best-selling"),
      fetchTag("top-rated"),
      fetchTag("trends"),
      fetchTag("on-sale"),
    ]);

  const eyebrow = settings.site_name.toUpperCase();
  const slides: HeroSlide[] = [
    { eyebrow, titleLines: ["Autumn", "& Winter 2024"], cta: "Shop Now", href: "/" },
    { eyebrow, titleLines: ["Spring Summer", "Collection"], cta: "Shop Now", href: "/" },
    { eyebrow, titleLines: ["New", "Arrivals"], cta: "Shop Now", href: "/" },
  ];

  return (
    <div>
      {!q && (
        <>
          <HeroSlider slides={slides} />
          <TrustBadges />
        </>
      )}

      <div className="mx-auto max-w-[1200px] space-y-10 px-4 py-8">
        {!q && (
          <section>
            <h2 className="mb-4 text-2xl font-semibold">Shop by category</h2>
            <div className="flex flex-wrap gap-3">
              {categoryTree.results.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="rounded-full border px-4 py-2 text-sm hover:bg-accent"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        {q ? (
          <section>
            <h2 className="mb-4 text-xl font-semibold">Search results for &quot;{q}&quot;</h2>
            {products.results.length === 0 ? (
              <p className="text-muted-foreground">No products matched your search.</p>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {products.results.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            <ProductTabsSection
              heading="Trendy item"
              tabs={[
                { label: "All", products: products.results },
                { label: "Featured", products: featured.results },
                { label: "Best Selling", products: bestSelling.results },
                { label: "Top Rate", products: topRated.results },
                { label: "Trends", products: trends.results },
              ]}
            />
            <PromoBanner />
            <ProductHighlights
              topRated={topRated.results}
              bestSelling={bestSelling.results}
              onSale={onSale.results}
            />
          </>
        )}
      </div>
    </div>
  );
}
