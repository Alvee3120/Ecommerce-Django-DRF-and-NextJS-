"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api";
import { useCheckout, useValidateCoupon } from "@/lib/queries";
import { cartTotal, useCartStore } from "@/store/cart";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  phone_number: z.string().min(6, "Phone number is required"),
  email: z.union([z.literal(""), z.string().email("Enter a valid email")]).optional(),
  address_line1: z.string().min(3, "Address is required"),
  address_line2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state_region: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().min(1, "Country is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const subtotal = cartTotal(items);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(
    null
  );
  const [couponMessage, setCouponMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const validateCoupon = useValidateCoupon();
  const checkout = useCheckout();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const discount = appliedCoupon?.discount ?? 0;
  const total = Math.max(subtotal - discount, 0);

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return;
    try {
      const result = await validateCoupon.mutateAsync({
        code: couponCode.trim(),
        subtotal: subtotal.toFixed(2),
      });
      setAppliedCoupon(result.valid ? { code: couponCode.trim(), discount: Number(result.discount_amount) } : null);
      setCouponMessage(result.message);
    } catch {
      setAppliedCoupon(null);
      setCouponMessage("Could not validate coupon.");
    }
  }

  async function onSubmit(values: CheckoutFormValues) {
    setSubmitError(null);
    try {
      const order = await checkout.mutateAsync({
        ...values,
        coupon_code: appliedCoupon?.code,
        items: items.map((item) => ({
          product_id: item.productId,
          variation_id: item.variationId,
          quantity: item.quantity,
        })),
      });
      clearCart();
      router.push(`/order-confirmation/${order.order_number}?phone=${encodeURIComponent(values.phone_number)}`);
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Something went wrong placing your order.");
    }
  }

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
    <div className="mx-auto grid max-w-4xl gap-8 px-4 py-8 md:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h1 className="text-2xl font-semibold">Checkout</h1>

        <div className="space-y-1">
          <Label htmlFor="customer_name">Full name</Label>
          <Input id="customer_name" {...register("customer_name")} />
          {errors.customer_name && (
            <p className="text-sm text-destructive">{errors.customer_name.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="phone_number">Phone number</Label>
          <Input id="phone_number" {...register("phone_number")} />
          {errors.phone_number && (
            <p className="text-sm text-destructive">{errors.phone_number.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="email">Email (optional)</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-1">
          <Label htmlFor="address_line1">Address</Label>
          <Input id="address_line1" {...register("address_line1")} />
          {errors.address_line1 && (
            <p className="text-sm text-destructive">{errors.address_line1.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="address_line2">Address line 2 (optional)</Label>
          <Input id="address_line2" {...register("address_line2")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="state_region">State/Region (optional)</Label>
            <Input id="state_region" {...register("state_region")} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="postal_code">Postal code (optional)</Label>
            <Input id="postal_code" {...register("postal_code")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} />
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country.message}</p>
            )}
          </div>
        </div>

        {submitError && <p className="text-sm text-destructive">{submitError}</p>}

        <Button type="submit" size="lg" className="w-full" disabled={checkout.isPending}>
          {checkout.isPending ? "Placing order..." : "Place order"}
        </Button>
      </form>

      <div className="space-y-4 rounded-lg border p-6">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <div className="space-y-2">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variationId ?? "base"}`}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name}
                {item.variationLabel ? ` (${item.variationLabel})` : ""} &times; {item.quantity}
              </span>
              <span>${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleApplyCoupon}
            disabled={validateCoupon.isPending}
          >
            Apply
          </Button>
        </div>
        {couponMessage && (
          <p className={appliedCoupon ? "text-sm text-green-600" : "text-sm text-destructive"}>
            {couponMessage}
          </p>
        )}

        <div className="space-y-1 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
