import Link from "next/link";

import { ProductCard } from "@/components/product-card";
import { getCategoryTree, getProducts } from "@/lib/data";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [categoryTree, products] = await Promise.all([
    getCategoryTree(),
    getProducts({ search: q }),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8">
      {!q && (
        <section>
          <h1 className="mb-4 text-2xl font-semibold">Shop by category</h1>
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
  );
}
