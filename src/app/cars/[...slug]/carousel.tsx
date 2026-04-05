"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CarDetailCarouselVariant } from "@prisma/client";

import { cn } from "@/src/lib/style";

type ContentImage = {
  url: string;
  title: string | null;
  content: string | null;
};

export default function Carousel({
  images,
  contentPosition = "left",
  variant = CarDetailCarouselVariant.SAFETY,
}: {
  images: ContentImage[];
  contentPosition?: "left" | "right";
  variant: CarDetailCarouselVariant;
}) {
  const [current, setCurrent] = useState(0);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)),
    [images.length],
  );
  const next = useCallback(
    () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)),
    [images.length],
  );

  if (images.length === 0) return null;

  const slide = images[current];

  /** md+: "left" = copy column first (left), image second (right); "right" = image left, copy right */
  const imageOrder =
    contentPosition === "left" ? "order-1 md:order-2" : "order-1 md:order-1";
  const copyOrder =
    contentPosition === "left" ? "order-2 md:order-1" : "order-2 md:order-2";

  return (
    <div className="container mx-auto px-4" data-variant={variant}>
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* Image */}
        <div
          className={cn(
            "relative h-[480px] w-full shrink-0 overflow-hidden bg-gray-100",
            imageOrder,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="absolute inset-0"
            >
              <Image
                src={slide.url}
                alt={slide.title ?? `Slide ${current + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content */}
        <div
          className={cn(
            "flex flex-col justify-evenly h-full px-8 py-10 md:px-12 md:py-16",
            copyOrder,
          )}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              {slide.title && (
                <h3 className="font-suzuki-pro-headline text-xl md:text-2xl text-foreground leading-snug">
                  {slide.title}
                </h3>
              )}
              {slide.content && (
                <p className="mt-4 font-sans text-sm md:text-base text-gray-600 leading-relaxed">
                  {slide.content}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <div className="flex items-center gap-3 mt-10">
              <button
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:border-foreground hover:bg-gray-50 cursor-pointer"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 text-foreground" />
              </button>
              <button
                onClick={next}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 transition hover:border-foreground hover:bg-gray-50 cursor-pointer"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 text-foreground" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
