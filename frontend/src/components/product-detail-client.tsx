"use client";

import { useMemo, useState } from "react";

import { ProductDescriptionSection } from "@/components/product/product-description-section";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfoPanel } from "@/components/product/product-info-panel";
import { ProductReviews } from "@/components/product/product-reviews";
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

export function ProductDetailClient({
  product: initialProduct,
  siteUrl,
}: {
  product: ProductDetail;
  siteUrl: string;
}) {
  const [product, setProduct] = useState(initialProduct);
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
  const [galleryIndex, setGalleryIndex] = useState(0);

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
  const activeImage =
    (isVariable ? selectedVariation?.image : null) ??
    product.images[galleryIndex]?.image ??
    product.primary_image;
  const canAddToCart = isVariable ? Boolean(selectedVariation) && activeStock > 0 : activeStock > 0;

  function buildCartItem() {
    return {
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
    };
  }

  function handleAddToCart() {
    if (!canAddToCart) return;
    addItem(buildCartItem());
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    if (!canAddToCart) return;
    addItem(buildCartItem());
    window.location.href = "/checkout";
  }

  return (
    <div className="space-y-16">
      <div className="grid gap-8 md:grid-cols-2">
        <ProductGallery
          images={product.images}
          activeIndex={galleryIndex}
          onSelectIndex={setGalleryIndex}
          activeImage={activeImage}
          productName={product.name}
          badge={product.badge}
        />

        <ProductInfoPanel
          productName={product.name}
          description={product.description}
          attributeOptions={attributeOptions}
          selection={selection}
          onSelectionChange={(attrSlug, value) =>
            setSelection((prev) => ({ ...prev, [attrSlug]: value }))
          }
          activePrice={activePrice}
          activeRegularPrice={activeRegularPrice}
          activeStock={activeStock}
          quantity={quantity}
          onQuantityChange={setQuantity}
          canAddToCart={canAddToCart}
          added={added}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          previousSlug={product.previous_slug}
          nextSlug={product.next_slug}
          shareUrl={`${siteUrl}/product/${product.slug}`}
          shareImage={product.primary_image}
          supportEmail="support@yourstore.com"
        />
      </div>

      <div className="flex flex-wrap gap-2 border-t pt-6 text-sm text-muted-foreground">
        {product.categories.length > 0 && (
          <span>
            <span className="font-medium text-foreground">Category:</span>{" "}
            {product.categories.join(", ")}
          </span>
        )}
        {product.categories.length > 0 && product.tags.length > 0 && <span>|</span>}
        {product.tags.length > 0 && (
          <span>
            <span className="font-medium text-foreground">Tags:</span> {product.tags.join(", ")}
          </span>
        )}
      </div>

      <ProductDescriptionSection description={product.description} />

      <ProductReviews product={product} onReviewSubmitted={setProduct} />
    </div>
  );
}
