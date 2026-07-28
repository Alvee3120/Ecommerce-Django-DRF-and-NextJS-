"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCartStore } from "@/store/cart";
import type { AttributeValue, ProductDetail, ProductVariation } from "@/lib/types";

function buildAttributeOptions(variations: ProductVariation[]) {
  const map = new Map<string, { name: string; values: Map<string, AttributeValue> }>();
  for (const variation of variations) {
    for (const av of variation.attribute_values) {
      if (!map.has(av.attribute_slug)) {
        map.set(av.attribute_slug, { name: av.attribute, values: new Map() });
      }
      map.get(av.attribute_slug)!.values.set(av.slug, av);
    }
  }
  return map;
}

export function ProductDetailClient({ product }: { product: ProductDetail }) {
  const addItem = useCartStore((state) => state.addItem);
  const isVariable = product.product_type === "variable";

  const attributeOptions = useMemo(
    () =>
      isVariable
        ? buildAttributeOptions(product.variations)
        : new Map<string, { name: string; values: Map<string, AttributeValue> }>(),
    [isVariable, product.variations]
  );

  const [selection, setSelection] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (isVariable && product.variations.length > 0) {
      for (const av of product.variations[0].attribute_values) {
        initial[av.attribute_slug] = av.slug;
      }
    }
    return initial;
  });

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariation = useMemo(() => {
    if (!isVariable) return null;
    return (
      product.variations.find((variation) => {
        const attrs = variation.attribute_values;
        if (attrs.length !== Object.keys(selection).length) return false;
        return attrs.every((av) => selection[av.attribute_slug] === av.slug);
      }) ?? null
    );
  }, [isVariable, product.variations, selection]);

  const activeStock = isVariable ? selectedVariation?.stock ?? 0 : product.stock ?? 0;
  const activePrice = isVariable ? selectedVariation?.effective_price ?? null : product.effective_price;
  const activeRegularPrice = isVariable
    ? selectedVariation?.regular_price ?? null
    : product.regular_price;
  const activeImage = isVariable
    ? selectedVariation?.image ?? product.primary_image
    : product.primary_image;
  const canAddToCart = isVariable ? Boolean(selectedVariation) && activeStock > 0 : activeStock > 0;

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem({
      productId: product.id,
      variationId: selectedVariation?.id,
      productSlug: product.slug,
      name: product.name,
      variationLabel: selectedVariation
        ? selectedVariation.attribute_values.map((av) => av.value).join(" / ")
        : undefined,
      unitPrice: activePrice ?? "0",
      image: activeImage,
      quantity,
      maxStock: activeStock,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No image
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          {product.description && (
            <p className="mt-2 text-muted-foreground">{product.description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {activePrice ? (
            <span className="text-2xl font-semibold">${activePrice}</span>
          ) : (
            <span className="text-muted-foreground">Select options to see price</span>
          )}
          {activeRegularPrice && activePrice && activeRegularPrice !== activePrice && (
            <span className="text-lg text-muted-foreground line-through">
              ${activeRegularPrice}
            </span>
          )}
        </div>

        {isVariable &&
          Array.from(attributeOptions.entries()).map(([attrSlug, { name, values }]) => (
            <div key={attrSlug} className="space-y-2">
              <label className="text-sm font-medium">{name}</label>
              <Select
                value={selection[attrSlug]}
                onValueChange={(value) => {
                  if (!value) return;
                  setSelection((prev) => ({ ...prev, [attrSlug]: value }));
                }}
              >
                <SelectTrigger className="w-full sm:w-64">
                  <SelectValue placeholder={`Choose ${name}`} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(values.values()).map((av) => (
                    <SelectItem key={av.slug} value={av.slug}>
                      {av.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}

        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Qty</label>
          <Input
            type="number"
            min={1}
            max={Math.max(activeStock, 1)}
            value={quantity}
            onChange={(e) =>
              setQuantity(
                Math.max(1, Math.min(Number(e.target.value) || 1, Math.max(activeStock, 1)))
              )
            }
            className="w-20"
          />
          <span className="text-sm text-muted-foreground">
            {activeStock > 0 ? `${activeStock} in stock` : "Out of stock"}
          </span>
        </div>

        <Button size="lg" disabled={!canAddToCart} onClick={handleAddToCart}>
          {added ? "Added!" : "Add to cart"}
        </Button>

        {product.images.length > 0 && (
          <div className="flex gap-3 pt-4">
            {product.images.map((img) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={img.id}
                src={img.image}
                alt={img.alt_text || product.name}
                className="h-20 w-20 rounded-md object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
