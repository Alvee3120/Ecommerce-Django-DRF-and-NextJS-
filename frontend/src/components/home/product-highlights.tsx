import Link from "next/link";

import { StarRating } from "@/components/star-rating";
import type { ProductList } from "@/lib/types";

function ProductMiniRow({ product }: { product: ProductList }) {
  const displayPrice = product.effective_price ?? product.starting_price;
  const hasDiscount =
    product.discount_price &&
    product.regular_price &&
    Number(product.discount_price) < Number(product.regular_price);

  return (
    <Link href={`/product/${product.slug}`} className="flex gap-4">
      <div className="h-24 w-24 shrink-0 overflow-hidden bg-neutral-100">
        {product.primary_image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.primary_image}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center gap-1.5">
        <p className="font-medium text-foreground">{product.name}</p>
        {product.average_rating && <StarRating value={Number(product.average_rating)} />}
        <div className="flex items-center gap-2">
          {displayPrice && <span className="font-semibold">${displayPrice}</span>}
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.regular_price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function ProductHighlights({
  topRated,
  bestSelling,
  onSale,
}: {
  topRated: ProductList[];
  bestSelling: ProductList[];
  onSale: ProductList[];
}) {
  const columns = [
    { title: "Top Rated", products: topRated },
    { title: "Best Selling", products: bestSelling },
    { title: "On Sale", products: onSale },
  ].filter((column) => column.products.length > 0);

  if (columns.length === 0) return null;

  return (
    <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {columns.map((column) => (
        <div key={column.title}>
          <h3 className="mb-5 text-xl font-medium">{column.title}</h3>
          <div className="space-y-6">
            {column.products.slice(0, 3).map((product) => (
              <ProductMiniRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
