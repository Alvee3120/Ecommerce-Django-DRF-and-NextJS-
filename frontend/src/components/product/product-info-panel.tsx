import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { PaymentIcons } from "@/components/footer/payment-icons";
import { ProductHelpRow } from "@/components/product/product-help-row";
import { QuantityStepper } from "@/components/product/quantity-stepper";
import { ShareButtons } from "@/components/product/share-buttons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AttributeValue } from "@/lib/types";

const STOCK_BAR_BASELINE = 100;

export function ProductInfoPanel({
  productName,
  description,
  attributeOptions,
  selection,
  onSelectionChange,
  activePrice,
  activeRegularPrice,
  activeStock,
  quantity,
  onQuantityChange,
  canAddToCart,
  added,
  onAddToCart,
  onBuyNow,
  previousSlug,
  nextSlug,
  shareUrl,
  shareImage,
  supportEmail,
}: {
  productName: string;
  description: string;
  attributeOptions: Map<string, { name: string; values: Map<string, AttributeValue> }>;
  selection: Record<string, string>;
  onSelectionChange: (attrSlug: string, value: string) => void;
  activePrice: string | null;
  activeRegularPrice: string | null;
  activeStock: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  canAddToCart: boolean;
  added: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  previousSlug: string | null;
  nextSlug: string | null;
  shareUrl: string;
  shareImage: string | null;
  supportEmail: string;
}) {
  const stockPct = Math.min(100, (activeStock / STOCK_BAR_BASELINE) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-medium">{productName}</h1>
        <div className="flex shrink-0 gap-2">
          {previousSlug ? (
            <Link
              href={`/product/${previousSlug}`}
              aria-label="Previous product"
              className="flex h-9 w-9 items-center justify-center rounded-full border text-foreground/60 hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border text-foreground/20">
              <ChevronLeft className="h-4 w-4" />
            </span>
          )}
          {nextSlug ? (
            <Link
              href={`/product/${nextSlug}`}
              aria-label="Next product"
              className="flex h-9 w-9 items-center justify-center rounded-full border text-foreground/60 hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full border text-foreground/20">
              <ChevronRight className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activePrice ? (
          <span className="text-2xl font-semibold">${activePrice}</span>
        ) : (
          <span className="text-muted-foreground">Select options to see price</span>
        )}
        {activeRegularPrice && activePrice && activeRegularPrice !== activePrice && (
          <span className="text-lg text-muted-foreground line-through">${activeRegularPrice}</span>
        )}
      </div>

      {description && <p className="line-clamp-3 max-w-md text-sm text-muted-foreground">{description}</p>}

      {Array.from(attributeOptions.entries()).map(([attrSlug, { name, values }]) => (
        <div key={attrSlug} className="space-y-2">
          <label className="text-sm font-medium">{name}</label>
          <Select
            value={selection[attrSlug]}
            onValueChange={(value) => {
              if (!value) return;
              onSelectionChange(attrSlug, value);
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

      <div>
        <p className="text-sm">
          {activeStock > 0 ? (
            <>
              Only <span className="font-semibold text-primary">{activeStock}</span> item(s) left in
              stock.
            </>
          ) : (
            <span className="font-medium text-destructive">Out of stock.</span>
          )}
        </p>
        <div className="mt-2 h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary" style={{ width: `${stockPct}%` }} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={quantity} max={Math.max(activeStock, 1)} onChange={onQuantityChange} />
        <button
          type="button"
          disabled={!canAddToCart}
          onClick={onAddToCart}
          className="rounded-[5px] bg-primary px-8 py-3 text-xs font-semibold tracking-widest text-primary-foreground uppercase hover:opacity-90 disabled:opacity-40"
        >
          {added ? "Added!" : "Add to cart"}
        </button>
        <button
          type="button"
          disabled={!canAddToCart}
          onClick={onBuyNow}
          className="rounded-[5px] bg-emerald-500 px-8 py-3 text-xs font-semibold tracking-widest text-white uppercase hover:opacity-90 disabled:opacity-40"
        >
          Buy now
        </button>
      </div>

      <ProductHelpRow supportEmail={supportEmail} />

      <ShareButtons url={shareUrl} title={productName} image={shareImage} />

      <div className="max-w-sm rounded-lg border p-4">
        <p className="mb-3 text-center text-sm font-medium">Guaranteed Safe Checkout</p>
        <PaymentIcons className="justify-center" />
      </div>
    </div>
  );
}
