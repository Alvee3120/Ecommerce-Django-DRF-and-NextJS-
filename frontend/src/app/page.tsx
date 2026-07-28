import Link from "next/link";

import { HeroSlider, type HeroSlide } from "@/components/home/hero-slider";
import { TrustBadges } from "@/components/home/trust-badges";
import { ProductCard } from "@/components/product-card";
import { getCategoryTree, getProducts, getSiteSettings } from "@/lib/data";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [settings, categoryTree, products] = await Promise.all([
    getSiteSettings(),
    getCategoryTree(),
    getProducts({ search: q }),
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

        <section>
          <h2 className="mb-4 text-xl font-semibold">
            {q ? `Search results for "${q}"` : "All products"}
          </h2>
          {products.results.length === 0 ? (
            <p className="text-muted-foreground">
              {q ? "No products matched your search." : "No products yet."}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {products.results.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
