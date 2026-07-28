"use client";

import Autoplay from "embla-carousel-autoplay";
import { ImageIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface HeroSlide {
  eyebrow: string;
  titleLines: string[];
  cta: string;
  href: string;
}

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [api, setApi] = useState<CarouselApi>();

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!api) return () => {};
      api.on("select", onStoreChange);
      api.on("reInit", onStoreChange);
      return () => {
        api.off("select", onStoreChange);
        api.off("reInit", onStoreChange);
      };
    },
    [api]
  );
  const selected = useSyncExternalStore(
    subscribe,
    () => api?.selectedScrollSnap() ?? 0,
    () => 0
  );

  return (
    <div className="relative">
      <Carousel
        opts={{ loop: true }}
        plugins={[Autoplay({ delay: 5000, stopOnInteraction: false })]}
        setApi={setApi}
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.titleLines.join(" ")} className="pl-0">
              <div className="grid grid-cols-2 items-center bg-neutral-100">
                <div className="px-6 py-14 sm:px-12 sm:py-20 lg:px-20">
                  <p className="mb-3 text-xs font-medium tracking-[0.3em] text-foreground/50 uppercase sm:text-sm">
                    {slide.eyebrow}
                  </p>
                  <h1 className="text-3xl leading-tight font-medium text-foreground sm:text-5xl lg:text-6xl">
                    {slide.titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h1>
                  <Link
                    href={slide.href}
                    className="mt-6 inline-block rounded-[5px] bg-primary px-8 py-3 text-xs font-semibold tracking-widest text-primary-foreground uppercase hover:opacity-90 sm:mt-8"
                  >
                    {slide.cta}
                  </Link>
                </div>
                <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden sm:min-h-[440px]">
                  <div className="absolute h-[75%] w-[75%] rounded-full bg-white/70" />
                  <div className="relative flex h-[85%] w-[70%] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-foreground/20 text-foreground/40">
                    <ImageIcon className="h-8 w-8" />
                    <span className="text-xs">Add hero image</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 hidden sm:flex" />
        <CarouselNext className="right-4 hidden sm:flex" />
      </Carousel>

      <div className="absolute bottom-4 left-6 flex gap-2 sm:bottom-8 sm:left-12 lg:left-20">
        {slides.map((slide, i) => (
          <button
            key={slide.titleLines.join(" ")}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => api?.scrollTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              selected === i ? "w-6 bg-primary" : "w-1.5 bg-foreground/20"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
