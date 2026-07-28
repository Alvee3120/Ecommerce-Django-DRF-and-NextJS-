"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import { apiGet, apiPost } from "./api";
import type {
  CheckoutPayload,
  CouponValidateResponse,
  Order,
  Popup,
} from "./types";

export function useActivePopup() {
  return useQuery({
    queryKey: ["popup", "active"],
    queryFn: () => apiGet<Popup | null>("/popups/active/"),
    staleTime: 60_000,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: ({ code, subtotal }: { code: string; subtotal: string }) =>
      apiPost<CouponValidateResponse>("/coupons/validate/", { code, subtotal }),
  });
}

export function useCheckout() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => apiPost<Order>("/orders/", payload),
  });
}

export function useOrderLookup(orderNumber: string, phone: string, enabled: boolean) {
  return useQuery({
    queryKey: ["order-lookup", orderNumber, phone],
    queryFn: () =>
      apiGet<Order>(
        `/orders/lookup/?order_number=${encodeURIComponent(orderNumber)}&phone=${encodeURIComponent(phone)}`
      ),
    enabled,
    retry: false,
  });
}
