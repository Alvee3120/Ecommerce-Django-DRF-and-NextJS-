"use client";

import { useState } from "react";

import { OrderSummary } from "@/components/order-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOrderLookup } from "@/lib/queries";

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const {
    data: order,
    isFetching,
    isError,
  } = useOrderLookup(orderNumber, phone, submitted);

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Track your order</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your order number and the phone number you used at checkout.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <Label htmlFor="order_number">Order number</Label>
          <Input
            id="order_number"
            value={orderNumber}
            onChange={(e) => {
              setOrderNumber(e.target.value);
              setSubmitted(false);
            }}
            placeholder="ORD-XXXXXXXX"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setSubmitted(false);
            }}
          />
        </div>
        <Button type="submit" className="w-full">
          Track order
        </Button>
      </form>

      {submitted && isFetching && (
        <p className="text-sm text-muted-foreground">Looking up your order...</p>
      )}
      {submitted && !isFetching && isError && (
        <p className="text-sm text-destructive">
          We couldn&apos;t find an order matching that number and phone.
        </p>
      )}
      {submitted && order && <OrderSummary order={order} />}
    </div>
  );
}
