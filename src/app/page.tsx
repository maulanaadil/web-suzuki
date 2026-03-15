"use client";

import Image from "next/image";
import SuzukiHeroImage from "../../public/images//suzuki-hero.webp";
import JimnyImage from "../../public/images/jimny.webp";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import {
  ChevronDown,
  ChevronRight,
  ChevronUp,
  InfoIcon,
  MessageCircle,
  PlusIcon,
  Star,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ComponentType } from "react";
import CarMPVIcon from "../assets/icons/car-mpv";
import CarCommercialIcon from "../assets/icons/car-commercial";
import CarSUVIcon from "../assets/icons/car-suv";
import CarCityIcon from "../assets/icons/car-city";

export default function Home() {
  return (
    <main id="landing-page" className="w-full h-full min-h-screen">
      <HeroSection />

      <FindYourSuzukiSection />

      <DealerAndService />

      <Testimonials />

      <Contact />

      <Footer />
    </main>
  );
}

const heroCtaLinks = [
  {
    label: "Products",
    href: "/products",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Reviews",
    href: "/reviews",
  },
];

const HeroSection = () => {
  return (
    <div id="hero-section" className="relative min-h-screen">
      <div className="absolute top-0 left-0 right-0 z-30">
        <Header />
      </div>
      <div className="grid grid-cols-2 min-h-screen">
        {/* left section */}
        <div className="relative">
          <Image
            src={SuzukiHeroImage}
            alt="hero-section-1"
            fill
            objectFit="cover"
          />
          <div className="absolute bottom-0 right-0 w-full max-w-xl h-40">
            <div className="w-full h-full bg-foreground/50 backdrop-blur-md  grid grid-cols-2">
              <div className="relative w-full h-full min-h-0 overflow-hidden">
                <Image
                  src={JimnyImage}
                  alt="hero-section-2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex flex-col gap-2 justify-center">
                <p className="text-semibold font-suzuki-pro-headline text-white text-2xl">
                  Jimny gear to ProClaim
                </p>
                <p className="font-sans text-white text-sm">
                  Carve your own legendary path.
                </p>
                <button className="flex items-center gap-3.5 mt-4">
                  <div className="p-2 rounded-full bg-white flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 text-black" />
                  </div>
                  <p className="font-sans text-white text-sm">Explore</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="relative bg-foreground w-full h-full flex flex-col justify-center gap-6 pb-10 pt-28 px-15 ">
          <p className="font-suzuki-pro-headline text-white text-7xl">
            The joy of driving is back.
          </p>
          <p className="font-sans text-gray-200 text-sm">
            Find your perfect Suzuki car today and experience unmatched
            performance, cutting-edge technology, and stylish design for every
            journey. Discover the full range of Suzuki vehicles built to meet
            your lifestyle, with special offers and exclusive features waiting
            for you.
          </p>
          <button className="flex items-center gap-3.5 mt-4 group cursor-pointer">
            <div className="p-4 rounded-full bg-transparent border border-gray-500 flex items-center justify-center group-hover:bg-white group-hover:text-primary-suzuki transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-white group-hover:text-primary-suzuki transition-all duration-300" />
            </div>
            <p className="font-sans text-white text-sm group-hover:text-white transition-all duration-300">
              Discover more
            </p>
          </button>

          <div className="w-full h-px bg-gray-500/80 mt-20" />

          <div className="flex items-center gap-4 justify-evenly w-full mt-10">
            {heroCtaLinks.map((link) => (
              <button
                className="flex items-center gap-3.5 mt-4 group cursor-pointer"
                key={link.label}
              >
                <div className="p-2.5 rounded-full bg-transparent border border-gray-500 flex items-center justify-center group-hover:bg-white group-hover:text-primary-suzuki transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-white group-hover:text-primary-suzuki transition-all duration-300" />
                </div>
                <p className="font-sans text-white text-sm group-hover:text-white transition-all duration-300">
                  {link.label}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const categories = [
  {
    label: "Category",
    items: [
      {
        label: "SUV",
        type: "suv",
      },
      {
        label: "MPV",
        type: "mpv",
      },
      {
        label: "City Car",
        type: "city-car",
      },
      {
        label: "Commercial",
        type: "commercial",
      },
    ],
  },
  {
    label: "Type",
    items: [
      {
        label: "Passenger",
        href: "/passenger",
      },
      {
        label: "Commercial",
        href: "/commercial",
      },
    ],
  },
  {
    label: "Range Price",
    items: [],
  },
];

function FindYourSuzukiSection() {
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const handleCategoryClick = (category: string) => {
    if (selectedCategory.includes(category)) {
      setSelectedCategory((prev) => prev.filter((c) => c !== category));
    } else {
      setSelectedCategory((prev) => [...prev, category]);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 0) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 * i },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.main
      id="find-your-suzuki-section"
      className="w-full h-full container mx-auto bg-white py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={containerVariants}
    >
      <motion.div
        className="flex flex-col gap-2.5 mb-12"
        variants={itemVariants}
      >
        <p className="text-3xl font-suzuki-pro-headline text-black">
          Discover and configure all Suzuki models.
        </p>
        <p className="font-sans text-gray-600 text-base">
          Explore our extensive range of Suzuki cars, from compact city cars to
          rugged SUVs, each designed to fit your lifestyle and needs.
        </p>
      </motion.div>
      <motion.div className="flex gap-6" variants={containerVariants}>
        <div className="w-1/4 flex flex-col gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.label}
              variants={itemVariants}
              className="flex flex-col gap-4"
            >
              <motion.div
                className="flex items-center justify-between border-b border-gray-600 pb-4 cursor-pointer group transition-colors duration-300 hover:opacity-80 hover:border-primary-suzuki"
                onClick={() => handleCategoryClick(category.label)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="font-sans text-gray-600 text-xl group-hover:text-primary-suzuki transition-colors duration-300">
                  {category.label}
                </p>
                {selectedCategory.includes(category.label) ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 group-hover:text-primary-suzuki transition-colors duration-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-primary-suzuki transition-colors duration-300" />
                )}
              </motion.div>

              <AnimatePresence initial={false}>
                {selectedCategory.includes(category.label) ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {category.label === "Range Price" ? (
                      <PriceRangeScale />
                    ) : (
                      <Categories items={category.items} />
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="flex-1 w-full bg-gray-100 p-4"
          variants={itemVariants}
        >
          <motion.div className="grid grid-cols-3 gap-4">
            <CarItemCard />
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}

const PRICE_SCALE_MIN = 0;
const PRICE_SCALE_MAX = 600_000_000; // 600 million IDR
const PRICE_STEP = 10_000_000; // 10 million

function formatPriceIdr(value: number): string {
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(0)} jt`;
  }
  return `Rp ${value.toLocaleString("id-ID")}`;
}

const priceScaleVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

function PriceRangeScale() {
  const [minPrice, setMinPrice] = useState(PRICE_SCALE_MIN);
  const [maxPrice, setMaxPrice] = useState(PRICE_SCALE_MAX);

  const handleMinChange = (v: number) => {
    setMinPrice(Math.min(v, maxPrice - PRICE_STEP));
  };

  const handleMaxChange = (v: number) => {
    setMaxPrice(Math.max(v, minPrice + PRICE_STEP));
  };

  const range = PRICE_SCALE_MAX - PRICE_SCALE_MIN;
  const minPct = ((minPrice - PRICE_SCALE_MIN) / range) * 100;
  const maxPct = ((maxPrice - PRICE_SCALE_MIN) / range) * 100;

  const trackStyleMin = {
    background: `linear-gradient(to right, var(--primary-suzuki) 0%, var(--primary-suzuki) ${minPct}%, #e5e7eb ${minPct}%, #e5e7eb 100%)`,
  };

  const trackStyleMax = {
    background: `linear-gradient(to right, var(--primary-suzuki) 0%, var(--primary-suzuki) ${maxPct}%, #e5e7eb ${maxPct}%, #e5e7eb 100%)`,
  };

  return (
    <motion.div
      className="flex flex-col gap-4 py-2"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.06 } },
      }}
    >
      <motion.div className="flex flex-col gap-3" variants={priceScaleVariants}>
        <div className="flex justify-between items-center text-sm font-sans text-gray-800">
          <span>Minimum price</span>
          <span className="font-medium tabular-nums">
            {formatPriceIdr(minPrice)}
          </span>
        </div>
        <input
          type="range"
          min={PRICE_SCALE_MIN}
          max={PRICE_SCALE_MAX}
          step={PRICE_STEP}
          value={minPrice}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          style={trackStyleMin}
          className="price-range-input w-full h-2 rounded-lg appearance-none cursor-pointer"
        />
      </motion.div>
      <motion.div className="flex flex-col gap-3" variants={priceScaleVariants}>
        <div className="flex justify-between items-center text-sm font-sans text-gray-800">
          <span>Maximum price</span>
          <span className="font-medium tabular-nums">
            {formatPriceIdr(maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min={PRICE_SCALE_MIN}
          max={PRICE_SCALE_MAX}
          step={PRICE_STEP}
          value={maxPrice}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          style={trackStyleMax}
          className="price-range-input w-full h-2 rounded-lg appearance-none cursor-pointer"
        />
      </motion.div>
      <motion.p
        className="text-xs font-sans text-gray-500"
        variants={priceScaleVariants}
      >
        Range: {formatPriceIdr(minPrice)} – {formatPriceIdr(maxPrice)}
      </motion.p>
    </motion.div>
  );
}

const categoryIcons: Record<string, ComponentType<{ className?: string }>> = {
  suv: CarSUVIcon,
  mpv: CarMPVIcon,
  "city-car": CarCityIcon,
  commercial: CarCommercialIcon,
};

const categoryChipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

function Categories({ items }: Pick<(typeof categories)[number], "items">) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 items-center"
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {items.map((item) => {
        const Icon =
          "type" in item && item.type ? categoryIcons[item.type] : null;

        return (
          <motion.div
            key={item.label}
            variants={categoryChipVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col gap-1.5 py-2 px-4 bg-transparent border group border-gray-400 rounded cursor-pointer hover:border-primary-suzuki hover:bg-gray-50 transition-colors duration-300 items-center min-w-16"
          >
            {Icon && (
              <span className="inline-flex shrink-0 text-gray-800 group-hover:text-primary-suzuki transition-all duration-300 [&_svg]:w-8 [&_svg]:h-8 [&_svg]:shrink-0 [&_svg_path]:fill-current">
                <Icon />
              </span>
            )}
            <p className="text-gray-800 group-hover:text-primary-suzuki transition-all duration-300 text-center text-sm font-sans">
              {item.label}
            </p>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function CarItemCard() {
  return (
    <div className="bg-white p-4 flex flex-col gap-2 cursor-pointer hover:opacity-90 transition-colors duration-300">
      {/* Badge type */}
      <div className="flex flex-col p-2">
        <p className="bg-foreground w-fit text-white px-2 text-[10px] py-1">
          SUV
        </p>
        <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mt-1">
          Fronx
        </p>
        <img
          src="https://auto.suzuki.co.id/_next/image?url=https%3A%2F%2Fd37ehbjruvijch.cloudfront.net%2Fmodels%2FFRONX%2Fimages%2FFronxthumbnaildesktopvers_1746594808870_1748335241821.png&w=640&q=75"
          alt="Suzuki Fronx"
          className="w-full h-full object-cover bg-transparent"
        />

        <div className="mt-2">
          <div className="flex items-center gap-1">
            <p className="text-sm text-gray-500">Start from</p>
            <InfoIcon className="w-3 h-3 cursor-pointer text-gray-500" />
          </div>
          <span className="font-semibold text-base text-black">
            Rp 261.500.000 IDR
          </span>
        </div>
      </div>
    </div>
  );
}

function DealerAndService() {
  return (
    <div
      id="dealer-and-service-section"
      className="w-full h-full bg-white grid grid-cols-2 gap-4 min-h-80 container mx-auto"
    >
      <div className="w-full h-full">
        <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
          Dealer
        </p>
      </div>
      <div className="w-full h-full">
        <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
          Service Center
        </p>
      </div>
    </div>
  );
}

const testimonialData = [
  {
    id: "featured",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: true,
  },
  {
    id: "1",
    name: "Michael Grant",
    title: "Content Creator",
    quote:
      "I've grown my audience faster here than on any other social platform I've tried.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "2",
    name: "David Kim",
    title: "Social Media Strategist",
    quote:
      "User-friendly, engaging, and built for growth. Every connection I make here is meaningful.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: false,
  },
  {
    id: "4",
    name: "Emma Rodriguez",
    title: "Digital Marketer at SocialLift",
    quote:
      "It's not just about followers—it's about building a real community that supports each other.",
    rating: 4.9,
    featured: false,
  },
];

function TestimonialCard({
  name,
  title,
  quote,
  rating,
  featured,
  className = "",
}: (typeof testimonialData)[number] & { className?: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`p-6 flex flex-col gap-4 ${
        featured
          ? "bg-foreground text-white"
          : "bg-gray-100 text-foreground border border-gray-200"
      } ${className}`.trim()}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full shrink-0 flex items-center justify-center text-sm font-semibold ${
            featured ? "bg-white/20 text-white" : "bg-gray-300 text-gray-600"
          }`}
        >
          {initials}
        </div>
        <span
          className={`font-sans text-sm font-medium flex items-center gap-1.5 ${
            featured ? "text-white" : "text-foreground"
          }`}
        >
          {rating}
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          Rating
        </span>
      </div>
      <p
        className={`font-sans ${
          featured
            ? "text-lg font-bold leading-snug"
            : "text-base font-normal text-gray-700"
        }`}
      >
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-auto pt-2">
        <p
          className={`font-sans font-semibold ${featured ? "text-white" : "text-foreground"}`}
        >
          {name}
        </p>
        <p
          className={`font-sans text-sm ${featured ? "text-white/80" : "text-gray-500"}`}
        >
          {title}
        </p>
      </div>
    </div>
  );
}

function Testimonials() {
  const featured = testimonialData.find((t) => t.featured);
  const gridItems = testimonialData.filter((t) => !t.featured);

  return (
    <section
      id="testimonials-section"
      className="w-full container mx-auto py-16 bg-white"
    >
      <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mb-8">
        Testimonials
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-fr">
        {featured && (
          <div className="sm:row-span-2 min-h-[280px]">
            <TestimonialCard {...featured} className="h-full" />
          </div>
        )}
        {gridItems.map((item) => (
          <div key={item.id} className="min-h-[200px]">
            <TestimonialCard {...item} className="h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact-section"
      className="w-full container mx-auto py-16 bg-white flex flex-col items-center"
    >
      <div className="w-full max-w-3xl relative pt-12 pb-12">
        {/* Horizontal line */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2" aria-hidden />
        {/* Profile circle centered on the line */}
        <div className="relative flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 border-4 border-white shrink-0 overflow-hidden">
            MT
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center -mt-2">
        <h2 className="text-2xl font-bold font-sans text-foreground">
          Muhammad Talha
        </h2>
        <p className="text-base font-sans text-gray-500 max-w-md">
          Get a conversion-focused website for your business!
        </p>
        <a
          href="https://wa.me/6281234567890"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}