import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { ApiError } from "@/lib/api";
import { getCategory, getProducts } from "@/lib/data";

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let category;
  try {
    category = await getCategory(slug);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) notFound();
    throw err;
  }

  const products = await getProducts({ category: slug });

  return (
    <div className="mx-auto max-w-[1200px] space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">{category.name}</h1>
        {category.children.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {category.children.map((child) => (
              <Link
                key={child.id}
                href={`/category/${child.slug}`}
                className="rounded-full border px-4 py-2 text-sm hover:bg-accent"
              >
                {child.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {products.results.length === 0 ? (
        <p className="text-muted-foreground">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
