"use client";

import { ClipboardList, HelpCircle, Undo2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const SIZE_ROWS = [
  { size: "XS", chest: 34, waist: 28, hips: 34 },
  { size: "S", chest: 36, waist: 30, hips: 36 },
  { size: "M", chest: 38, waist: 32, hips: 38 },
  { size: "L", chest: 40, waist: 34, hips: 40 },
  { size: "XL", chest: 42, waist: 36, hips: 42 },
  { size: "2XL", chest: 44, waist: 38, hips: 44 },
];

export function ProductHelpRow({ supportEmail }: { supportEmail: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <Dialog>
        <DialogTrigger className="flex items-center gap-1.5 font-medium hover:text-primary">
          <ClipboardList className="h-4 w-4" />
          Size Guide
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Size Guide</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            General sizing guide — measurements are in inches and may vary slightly by style.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs tracking-wide text-muted-foreground uppercase">
                  <th className="py-2">Size</th>
                  <th className="py-2">Chest</th>
                  <th className="py-2">Waist</th>
                  <th className="py-2">Hips</th>
                </tr>
              </thead>
              <tbody>
                {SIZE_ROWS.map((row) => (
                  <tr key={row.size} className="border-b last:border-0">
                    <td className="py-2 font-medium">{row.size}</td>
                    <td className="py-2">{row.chest}</td>
                    <td className="py-2">{row.waist}</td>
                    <td className="py-2">{row.hips}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      <span className="text-foreground/20">|</span>

      <Dialog>
        <DialogTrigger className="flex items-center gap-1.5 font-medium hover:text-primary">
          <Undo2 className="h-4 w-4" />
          Delivery & Return
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delivery & Return</DialogTitle>
          </DialogHeader>
          <ul className="list-disc space-y-2 pl-4 text-sm text-muted-foreground">
            <li>Free shipping for all US orders.</li>
            <li>You have 30 days to return any unused item.</li>
            <li>Orders are typically processed within 1-2 business days.</li>
          </ul>
        </DialogContent>
      </Dialog>

      <span className="text-foreground/20">|</span>

      <a
        href={`mailto:${supportEmail}`}
        className="flex items-center gap-1.5 font-medium hover:text-primary"
      >
        <HelpCircle className="h-4 w-4" />
        Ask a Question
      </a>
    </div>
  );
}
