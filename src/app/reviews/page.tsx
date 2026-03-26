"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Star } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

import Review1Image from "../../../public/images/review-1.jpeg";

type ReviewItem = {
  id: string;
  name: string;
  city: string;
  car: string;
  rating: number;
  quote: string;
  photoUrl: string | StaticImageData;
  featured?: boolean;
};

const reviews: ReviewItem[] = [
  {
    id: "featured",
    name: "Rizky Pratama",
    city: "Bandung",
    car: "All New Jimny",
    rating: 5,
    quote:
      "From test drive to delivery, everything felt premium. The team explained every feature clearly and helped me choose the right variant.",
    photoUrl: Review1Image,
    featured: true,
  },
  {
    id: "1",
    name: "Ayu Larasati",
    city: "Jakarta",
    car: "New Fronx",
    rating: 4.9,
    quote:
      "The design is stunning and the driving experience is smooth. The promo details were transparent and easy to understand.",
    photoUrl: Review1Image,
  },
  {
    id: "2",
    name: "Dimas Saputra",
    city: "Surabaya",
    car: "Ertiga",
    rating: 4.8,
    quote:
      "Great family car recommendation. The advisor listened first, then suggested options that matched my budget perfectly.",
    photoUrl: Review1Image,
  },
  {
    id: "3",
    name: "Siti Maharani",
    city: "Semarang",
    car: "XL7",
    rating: 4.9,
    quote:
      "Fast WhatsApp response and friendly service. Financing simulation helped me decide confidently without pressure.",
    photoUrl: Review1Image,
  },
  {
    id: "4",
    name: "Fajar Nugroho",
    city: "Yogyakarta",
    car: "Carry",
    rating: 4.8,
    quote:
      "After-sales support has been excellent. Service reminders and maintenance handling are always on time.",
    photoUrl: Review1Image,
  },
];

export default function ReviewsPage() {
  const reviewGrid = reviews;
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeReview, setActiveReview] = useState<ReviewItem | null>(null);
  const rotatingReview = reviews[activeIndex];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviews.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!activeReview) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveReview(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeReview]);

  return (
    <main className="bg-white">
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-suzuki">
            Customer Reviews
          </p>
          <h1 className="mt-3 font-suzuki-pro-headline text-4xl text-foreground md:text-5xl">
            Trusted by Suzuki drivers across Indonesia
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Real stories from customers who found their best-fit Suzuki with
            our team.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={rotatingReview.id}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="py-2"
            >
              <ReviewCard
                review={rotatingReview}
                dark
                className="md:grid md:grid-cols-[1.2fr_1fr] md:gap-10 md:items-start"
                imageClassName="h-80 md:h-[460px]"
                onOpenImage={setActiveReview}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-14 space-y-10">
          {reviewGrid.map((review) => (
            <div key={review.id} className="border-t border-gray-200 pt-8">
              <ReviewCard
                review={review}
                className="md:grid md:grid-cols-[1fr_1.1fr] md:gap-8 md:items-start"
                imageClassName="h-72"
                onOpenImage={setActiveReview}
              />
            </div>
          ))}
        </div>
      </section>

      {activeReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveReview(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-black"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close image preview"
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
              onClick={() => setActiveReview(null)}
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-4/3 w-full">
              <Image
                src={activeReview.photoUrl}
                alt={`${activeReview.name} testimonial customer photo`}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ReviewCard({
  review,
  className = "",
  imageClassName = "h-56",
  dark = false,
  onOpenImage,
}: {
  review: ReviewItem;
  className?: string;
  imageClassName?: string;
  dark?: boolean;
  onOpenImage: (review: ReviewItem) => void;
}) {
  return (
    <article className={`flex flex-col gap-5 ${className}`.trim()}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.995 }}
        className={`group relative w-full overflow-hidden rounded-2xl ${imageClassName}`}
        onClick={() => onOpenImage(review)}
        aria-label={`Open ${review.name} testimonial image`}
      >
        <Image
          src={review.photoUrl}
          alt={`${review.name} testimonial customer photo`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 420px"
        />
        <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Click to view
        </span>
      </motion.button>

      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={`text-base font-semibold ${dark ? "text-foreground" : "text-foreground"}`}>
            {review.name}
          </p>
          <p className="text-sm text-gray-500">
            {review.city} - {review.car}
          </p>
        </div>

        <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">
          {review.rating}
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
        </span>
      </div>

      <p className="font-sans text-lg leading-relaxed text-gray-700">
        &ldquo;{review.quote}&rdquo;
      </p>
    </article>
  );
}
