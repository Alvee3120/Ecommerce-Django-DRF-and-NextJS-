import { ProductCard } from "@/components/product-card";
import type { ProductList } from "@/lib/types";

export function RelatedProducts({ products }: { products: ProductList[] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="mb-8 text-center text-2xl font-medium sm:text-3xl">Related Products</h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
