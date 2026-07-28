"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: number;
  variationId?: number;
  productSlug: string;
  name: string;
  variationLabel?: string;
  unitPrice: string;
  image: string | null;
  quantity: number;
  maxStock: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number, variationId?: number) => void;
  updateQuantity: (productId: number, variationId: number | undefined, quantity: number) => void;
  clear: () => void;
}

function sameLine(item: CartItem, productId: number, variationId?: number) {
  return item.productId === productId && item.variationId === variationId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        const existing = get().items.find((i) => sameLine(i, item.productId, item.variationId));
        if (existing) {
          set({
            items: get().items.map((i) =>
              sameLine(i, item.productId, item.variationId)
                ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.maxStock) }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },

      removeItem: (productId, variationId) => {
        set({ items: get().items.filter((i) => !sameLine(i, productId, variationId)) });
      },

      updateQuantity: (productId, variationId, quantity) => {
        set({
          items: get().items.map((i) =>
            sameLine(i, productId, variationId)
              ? { ...i, quantity: Math.max(1, Math.min(quantity, i.maxStock)) }
              : i
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    { name: "ecommerce-cart" }
  )
);

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + Number(i.unitPrice) * i.quantity, 0);
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
