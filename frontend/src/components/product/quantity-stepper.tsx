import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  const clamp = (v: number) => Math.max(1, Math.min(v, Math.max(max, 1)));

  return (
    <div className="flex h-11 w-20 items-center justify-between rounded-lg border px-2">
      <span className="text-sm font-medium tabular-nums">{value}</span>
      <div className="flex flex-col">
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => onChange(clamp(value + 1))}
          className="text-foreground/60 hover:text-foreground"
        >
          <Plus className="h-3 w-3" />
        </button>
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => onChange(clamp(value - 1))}
          className="text-foreground/60 hover:text-foreground"
        >
          <Minus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
