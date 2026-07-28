import { ImageIcon } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

const TILE_COUNT = 6;
const OVERLAY_INDEX = 2;

export function InstagramFollow({ handle }: { handle: string }) {
  return (
    <section className="py-10">
      <h2 className="mb-8 text-center text-2xl font-medium sm:text-3xl">Follow us on Instagram</h2>
      <div className="grid grid-cols-3 sm:grid-cols-6">
        {Array.from({ length: TILE_COUNT }).map((_, i) => (
          <a
            key={i}
            href="#"
            aria-label="View on Instagram"
            className={`group relative flex aspect-[4/5] items-center justify-center ${
              i % 2 === 0 ? "bg-neutral-100" : "bg-neutral-200"
            }`}
          >
            <ImageIcon className="h-6 w-6 text-foreground/25 transition-opacity group-hover:opacity-60" />
            {i === OVERLAY_INDEX && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/45 p-2">
                <span className="flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-[9px] font-semibold whitespace-nowrap text-foreground uppercase sm:gap-2 sm:px-5 sm:py-2.5 sm:text-xs sm:tracking-widest">
                  <FaInstagram className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
                  {handle}
                </span>
              </span>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
