"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cartTotal, useCartStore } from "@/store/cart";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-primary underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <h1 className="text-2xl font-semibold">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variationId ?? "base"}`}
            className="flex items-center gap-4 border-b pb-4"
          >
            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <Link href={`/product/${item.productSlug}`} className="font-medium hover:underline">
                {item.name}
              </Link>
              {item.variationLabel && (
                <p className="text-sm text-muted-foreground">{item.variationLabel}</p>
              )}
              <p className="text-sm">${item.unitPrice}</p>
            </div>
            <Input
              type="number"
              min={1}
              max={item.maxStock}
              value={item.quantity}
              onChange={(e) =>
                updateQuantity(item.productId, item.variationId, Number(e.target.value) || 1)
              }
              className="w-16"
            />
            <p className="w-20 text-right font-medium">
              ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
            </p>
            <button
              onClick={() => removeItem(item.productId, item.variationId)}
              className="text-sm text-muted-foreground hover:text-destructive"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4 text-lg font-semibold">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <Link href="/checkout" className={buttonVariants({ size: "lg", className: "w-full" })}>
        Proceed to checkout
      </Link>
    </div>
  );
}
