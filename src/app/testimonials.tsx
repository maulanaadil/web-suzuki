"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type TestimonialItem = {
  id: string;
  name: string;
  quote: string;
  imageUrl: string;
  car: {
    name: string;
    slug: string;
    imageUrl: string | null;
  };
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const sectionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: easeOut },
  },
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) return;
        const json = (await res.json()) as { data: TestimonialItem[] };
        setTestimonials(json.data ?? []);
      } catch {
        /* ignore */
      }
    };
    void load();
  }, []);

  const featured = testimonials[0] ?? null;
  const gridItems = testimonials.slice(1);
  const selected = testimonials.find((t) => t.id === selectedId) ?? null;

  const springTransition = reduceMotion
    ? { duration: 0.15 }
    : { type: "spring" as const, damping: 28, stiffness: 320 };

  if (testimonials.length === 0) return null;

  return (
    <section
      id="testimonials-section"
      className="w-full container mx-auto pb-16 bg-white"
    >
      <motion.p
        className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mb-8"
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: reduceMotion ? 0.15 : 0.45, ease: easeOut }}
      >
        Testimoni Pelanggan Kami
      </motion.p>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={sectionVariants}
      >
        {featured && (
          <motion.div
            className="sm:row-span-2 min-h-[280px]"
            variants={itemVariants}
          >
            <TestimonialCard
              item={featured}
              featured
              className="h-full"
              onClick={() => setSelectedId(featured.id)}
              reduceMotion={!!reduceMotion}
            />
          </motion.div>
        )}
        {gridItems.map((item) => (
          <motion.div
            key={item.id}
            className="min-h-[200px]"
            variants={itemVariants}
          >
            <TestimonialCard
              item={item}
              className="h-full"
              onClick={() => setSelectedId(item.id)}
              reduceMotion={!!reduceMotion}
            />
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key="backdrop"
            role="presentation"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.12 : 0.22 }}
            onClick={() => setSelectedId(null)}
          >
            <motion.div
              key={selected.id}
              role="dialog"
              aria-modal="true"
              aria-labelledby="testimonial-modal-title"
              className="bg-white max-w-lg w-full p-6 relative flex flex-col gap-4 shadow-xl"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.94, y: 24 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.96, y: 16 }
              }
              transition={springTransition}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer rounded-full p-1 transition-colors hover:bg-gray-100"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {selected.car.imageUrl && (
                <motion.div
                  className="relative w-full aspect-video overflow-hidden rounded-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reduceMotion ? 0 : 0.05, duration: 0.3 }}
                >
                  <Image
                    src={selected.car.imageUrl}
                    alt={selected.car.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              )}

              {selected.imageUrl && (
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-gray-100">
                    <Image
                      src={selected.imageUrl}
                      alt={selected.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p
                      id="testimonial-modal-title"
                      className="font-sans font-semibold text-foreground"
                    >
                      {selected.name}
                    </p>
                    <p className="font-sans text-sm text-gray-500">
                      Suzuki {selected.car.name} owner
                    </p>
                  </div>
                </div>
              )}

              <p className="font-sans text-base text-gray-700 leading-relaxed">
                &ldquo;{selected.quote}&rdquo;
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function TestimonialCard({
  item,
  featured = false,
  className = "",
  onClick,
  reduceMotion,
}: {
  item: TestimonialItem;
  featured?: boolean;
  className?: string;
  onClick: () => void;
  reduceMotion: boolean;
}) {
  const initials = item.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={
        reduceMotion ? undefined : { y: -3, transition: { duration: 0.2 } }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`p-6 flex flex-col gap-4 text-left cursor-pointer shadow-sm ${
        featured
          ? "bg-foreground text-white"
          : "bg-gray-100 text-foreground border border-gray-200 hover:border-gray-300"
      } ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        {item.imageUrl ? (
          <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 ring-2 ring-black/5">
            <Image
              src={item.imageUrl}
              alt={item.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-semibold ${
              featured ? "bg-white/20 text-white" : "bg-gray-300 text-gray-600"
            }`}
          >
            {initials}
          </div>
        )}
        <span
          className={`font-sans text-sm font-medium ${
            featured ? "text-white/80" : "text-gray-500"
          }`}
        >
          Suzuki {item.car.name}
        </span>
      </div>
      <p
        className={`font-sans ${
          featured
            ? "text-lg font-bold leading-snug"
            : "text-base font-normal text-gray-700"
        }`}
      >
        &ldquo;{item.quote}&rdquo;
      </p>
      <div className="mt-auto pt-2">
        <p
          className={`font-sans font-semibold ${featured ? "text-white" : "text-foreground"}`}
        >
          {item.name}
        </p>
        <p
          className={`font-sans text-sm ${featured ? "text-white/80" : "text-gray-500"}`}
        >
          Suzuki {item.car.name} owner
        </p>
      </div>
    </motion.button>
  );
}
