"use client";

import { Eye, Heart, Repeat, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useState, type MouseEvent } from "react";

import { useCartStore } from "@/store/cart";
import type { ProductList } from "@/lib/types";

const BADGE_STYLES: Record<string, string> = {
  hot: "bg-red-500 text-white",
  new: "bg-emerald-500 text-white",
  sale: "bg-primary text-primary-foreground",
};

const ICON_BUTTON_CLASS =
  "flex h-9 w-9 items-center justify-center rounded-sm bg-white text-foreground shadow-sm hover:bg-primary hover:text-primary-foreground";

export function ProductCard({ product }: { product: ProductList }) {
  const addItem = useCartStore((state) => state.addItem);
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);

  const images = product.images.length > 0 ? product.images : null;
  const activeImage = images ? images[imageIndex % images.length].image : product.primary_image;
  const hasGallery = Boolean(images && images.length > 1);

  const displayPrice = product.effective_price ?? product.starting_price;
  const hasDiscount =
    product.discount_price &&
    product.regular_price &&
    Number(product.discount_price) < Number(product.regular_price);

  const canQuickAdd = product.product_type === "base" && (product.stock ?? 0) > 0;
  const detailHref = `/product/${product.slug}`;

  function showPrevImage(e: MouseEvent) {
    e.preventDefault();
    if (!images) return;
    setImageIndex((i) => (i - 1 + images.length) % images.length);
  }

  function showNextImage(e: MouseEvent) {
    e.preventDefault();
    if (!images) return;
    setImageIndex((i) => (i + 1) % images.length);
  }

  function handleQuickAdd(e: MouseEvent) {
    e.preventDefault();
    if (!canQuickAdd) return;
    addItem({
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      unitPrice: product.effective_price ?? "0",
      image: product.primary_image,
      quantity: 1,
      maxStock: product.stock ?? 0,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100">
        <Link href={detailHref} className="absolute inset-0 block">
          {activeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
        </Link>

        {product.badge && (
          <span
            className={`absolute top-3 left-3 z-10 rounded-sm px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase ${
              BADGE_STYLES[product.badge] ?? "bg-foreground text-background"
            }`}
          >
            {product.badge}
          </span>
        )}

        <span
          title="Coming soon"
          className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground/70 shadow-sm"
        >
          <Heart className="h-4 w-4" />
        </span>

        {hasGallery && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={showPrevImage}
              className="absolute top-1/2 left-2 z-10 hidden -translate-y-1/2 items-center justify-center text-lg text-foreground/60 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground sm:flex"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
              className="absolute top-1/2 right-2 z-10 hidden -translate-y-1/2 items-center justify-center text-lg text-foreground/60 opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground sm:flex"
            >
              ›
            </button>
          </>
        )}

        {/* Desktop hover quick actions */}
        <div className="absolute inset-x-0 bottom-3 z-10 hidden translate-y-2 items-center justify-center gap-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 sm:flex">
          {canQuickAdd ? (
            <button type="button" aria-label="Add to cart" title="Add to cart" onClick={handleQuickAdd} className={ICON_BUTTON_CLASS}>
              {added ? <span className="text-sm">✓</span> : <ShoppingBag className="h-4 w-4" />}
            </button>
          ) : (
            <Link href={detailHref} aria-label="Choose options" title="Choose options" className={ICON_BUTTON_CLASS}>
              <ShoppingBag className="h-4 w-4" />
            </Link>
          )}
          <Link href={detailHref} aria-label="Quick view" title="Quick view" className={ICON_BUTTON_CLASS}>
            <Eye className="h-4 w-4" />
          </Link>
          <span title="Coming soon" className="flex h-9 w-9 items-center justify-center rounded-sm bg-white text-foreground/70 shadow-sm">
            <Repeat className="h-4 w-4" />
          </span>
        </div>

        {/* Mobile always-visible quick add */}
        {canQuickAdd ? (
          <button
            type="button"
            aria-label="Add to cart"
            onClick={handleQuickAdd}
            className="absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground shadow-sm sm:hidden"
          >
            {added ? <span className="text-sm">✓</span> : <ShoppingBag className="h-4 w-4" />}
          </button>
        ) : (
          <Link
            href={detailHref}
            aria-label="Choose options"
            className="absolute right-2 bottom-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-foreground shadow-sm sm:hidden"
          >
            <ShoppingBag className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="pt-3 text-center sm:text-left">
        <Link href={detailHref} className="line-clamp-1 text-sm font-medium hover:text-primary sm:text-base">
          {product.name}
        </Link>

        <div
          className={`mt-1 flex items-center justify-center gap-2 sm:justify-start ${
            product.sizes.length > 0 ? "sm:group-hover:hidden" : ""
          }`}
        >
          {displayPrice ? (
            <span className="font-semibold">${displayPrice}</span>
          ) : (
            <span className="text-sm text-muted-foreground">Select options</span>
          )}
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">${product.regular_price}</span>
          )}
          {product.colors.length > 0 && (
            <span className="ml-1 flex items-center gap-1">
              {product.colors.slice(0, 2).map((color) => (
                <span
                  key={color}
                  title={color}
                  className="h-4 w-4 rounded-full border border-foreground/10"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              ))}
              {product.colors.length > 2 && (
                <span className="text-xs text-muted-foreground">+{product.colors.length - 2}</span>
              )}
            </span>
          )}
        </div>

        {product.sizes.length > 0 && (
          <div className="mt-1 hidden items-center justify-center gap-2 text-xs font-medium tracking-wide text-foreground/60 uppercase sm:justify-start sm:group-hover:flex">
            {product.sizes.map((size) => (
              <span key={size}>{size}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
