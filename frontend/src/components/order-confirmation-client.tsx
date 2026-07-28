"use client";

import { OrderSummary } from "@/components/order-summary";
import { useOrderLookup } from "@/lib/queries";

export function OrderConfirmationClient({
  orderNumber,
  phone,
}: {
  orderNumber: string;
  phone: string;
}) {
  const { data: order, isLoading, isError } = useOrderLookup(orderNumber, phone, Boolean(phone));

  if (!phone) {
    return (
      <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        Missing order details.
      </p>
    );
  }
  if (isLoading) {
    return (
      <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        Loading your order...
      </p>
    );
  }
  if (isError || !order) {
    return (
      <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted-foreground">
        We couldn&apos;t find that order.
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Thank you for your order!</h1>
      <OrderSummary order={order} />
    </div>
  );
}
