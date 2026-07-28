import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ProductList } from "@/lib/types";

export function ProductCard({ product }: { product: ProductList }) {
  const hasDiscount =
    product.discount_price &&
    product.regular_price &&
    Number(product.discount_price) < Number(product.regular_price);

  return (
    <Link href={`/product/${product.slug}`}>
      <Card className="h-full overflow-hidden py-0 transition-shadow hover:shadow-md">
        <div className="aspect-square w-full bg-muted">
          {product.primary_image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.primary_image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </div>
        <CardContent className="space-y-1 py-4">
          <p className="line-clamp-1 font-medium">{product.name}</p>
          {product.product_type === "variable" ? (
            <Badge variant="secondary">Multiple options</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-semibold">${product.effective_price}</span>
              {hasDiscount && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.regular_price}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
