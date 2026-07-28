import { ImageIcon } from "lucide-react";
import Link from "next/link";

export function PromoBanner() {
  return (
    <section className="grid grid-cols-5 items-center gap-6 rounded-lg bg-neutral-100 p-6 sm:gap-10 sm:p-10 lg:p-14">
      <div className="col-span-2">
        <h2 className="text-2xl leading-tight font-medium text-foreground sm:text-3xl lg:text-4xl">
          <span className="block">The freshest</span>
          <span className="block">outfits summer</span>
        </h2>
        <p className="mt-3 text-xs text-muted-foreground italic sm:text-base">
          Just pin everything you love
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-[5px] bg-primary px-6 py-2.5 text-[11px] font-semibold tracking-widest text-primary-foreground uppercase hover:opacity-90 sm:px-8 sm:py-3 sm:text-xs"
        >
          Shop Now
        </Link>
      </div>

      <div className="relative col-span-3 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-lg border border-dashed border-foreground/20 text-foreground/40 sm:aspect-[16/10]">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs">Add banner image</span>
        </div>
      </div>
    </section>
  );
}
