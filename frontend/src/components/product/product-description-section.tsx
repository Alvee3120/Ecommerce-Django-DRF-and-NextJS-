import { ImageIcon } from "lucide-react";

export function ProductDescriptionSection({ description }: { description: string }) {
  return (
    <section>
      <h2 className="relative mb-8 text-2xl font-medium after:absolute after:top-full after:left-0 after:mt-3 after:h-px after:w-16 after:bg-foreground/20">
        Description
      </h2>
      {description ? (
        <p className="mb-8 max-w-3xl text-muted-foreground">{description}</p>
      ) : (
        <p className="mb-8 text-muted-foreground">No description provided yet.</p>
      )}
      <div className="flex aspect-[2/1] items-center justify-center rounded-lg border border-dashed border-foreground/20 bg-neutral-100 text-foreground/40">
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs">Add description image</span>
        </div>
      </div>
    </section>
  );
}
