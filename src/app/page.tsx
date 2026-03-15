"use client";

import Image from "next/image";
import SuzukiHeroImage from "../../public/images//suzuki-hero.webp";
import JimnyImage from "../../public/images/jimny.webp";
import Header from "../layouts/header";
import Footer from "../layouts/footer";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  InfoIcon,
  MessageCircle,
  PlusIcon,
  Star,
} from "lucide-react";
import { useRef, useState } from "react";
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
      <Articles />

      <Testimonials />

      <DealerAndService />

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

const articlesData = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=260&fit=crop",
    category: "News",
    title:
      "Suzuki Indonesia Launches New Ertiga Hybrid with Enhanced Fuel Efficiency",
    snippet:
      "Suzuki Indonesia today announced the launch of the all-new Ertiga Hybrid, featuring improved fuel economy and lower emissions for families looking for a practical and eco-friendly choice...",
    date: "5 Feb, 2026",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=260&fit=crop",
    category: "Events",
    title: "Growing The Future Together: Suzuki Jimny Experience 2026",
    snippet:
      "Suzuki Indonesia and its dealer network are pleased to announce the Jimny Experience 2026, an off-road adventure series that lets customers experience the capability of the Jimny...",
    date: "20 Jan, 2026",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=400&h=260&fit=crop",
    category: "Technology",
    title: "Suzuki Announces Smart Hybrid Technology for Next-Gen Models",
    snippet:
      "Suzuki Motor Corporation today unveiled its latest Smart Hybrid technology at an event in Jakarta, presenting a bold vision for more efficient and connected vehicles across the lineup...",
    date: "7 Jan, 2026",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=260&fit=crop",
    category: "Global",
    title: "Suzuki Global and Indonesian Market Expansion Plans",
    snippet:
      "Suzuki continues to strengthen its presence in Southeast Asia with new investments in Indonesia, connecting local manufacturing with Suzuki's worldwide audience in new ways...",
    date: "28 Dec, 2025",
  },
];

function ArticleCard({
  image,
  category,
  title,
  snippet,
  date,
}: (typeof articlesData)[number]) {
  return (
    <article className="shrink-0 w-[320px] sm:w-[360px] flex flex-col bg-white rounded-lg overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
      <div className="relative w-full aspect-video bg-gray-200">
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 640px) 320px, 360px"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <span className="font-sans text-sm text-primary-suzuki font-medium">
          {category}
        </span>
        <h3 className="font-sans text-foreground font-bold text-base leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="font-sans text-gray-500 text-sm leading-relaxed line-clamp-3">
          {snippet}
        </p>
        <p className="font-sans text-gray-400 text-xs mt-1">{date}</p>
      </div>
    </article>
  );
}

function Articles() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const step = 380;
    const offset = direction === "left" ? -step : step;
    scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };

  return (
    <section
      id="articles-section"
      className="w-full bg-white py-16 container mx-auto px-4"
    >
      <h2 className="text-2xl font-semibold font-suzuki-pro-headline text-foreground mb-8">
        Articles
      </h2>
      <div className="flex flex-col gap-8">
        <div
          className="overflow-x-auto overflow-y-hidden scroll-smooth scrollbar-hide"
          ref={scrollRef}
        >
          <div className="flex gap-6 pb-4">
            {articlesData.map((article) => (
              <ArticleCard key={article.id} {...article} />
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 w-full" aria-hidden />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 rounded text-gray-500 hover:text-foreground hover:bg-gray-100 transition-colors"
              aria-label="Previous articles"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 rounded text-gray-500 hover:text-foreground hover:bg-gray-100 transition-colors"
              aria-label="Next articles"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const dealerMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.4368540471655!2d107.77797017507909!3d-6.957683668119986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c500b460afab%3A0x7cecc2f19f0f1560!2sSuzuki%20Rancaekek%20PT.Nusantara%20Jaya%20Sentosa!5e0!3m2!1sen!2sid!4v1773599673566!5m2!1sen!2sid";

const dealerInfo = {
  name: "Suzuki Rancaekek PT. Nusantara Jaya Sentosa",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Suzuki+Rancaekek+PT.Nusantara+Jaya+Sentosa",
};

function DealerAndService() {
  return (
    <div
      id="dealer-and-service-section"
      className="w-full bg-white py-16 container mx-auto px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dealer: map + info */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
            Dealer
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full aspect-4/3 min-h-[280px]">
              <iframe
                src={dealerMapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Suzuki Rancaekek - PT. Nusantara Jaya Sentosa location"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="font-sans font-semibold text-foreground">
                {dealerInfo.name}
              </p>
              <a
                href={dealerInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-sm font-sans text-primary-suzuki hover:underline"
              >
                <ChevronRight className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Service Center */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
            Service Center
          </p>
          <div className="rounded-xl border border-gray-200 shadow-sm p-6 min-h-[200px] flex flex-col justify-center">
            <p className="font-sans text-gray-600">
              Visit our service center for maintenance, repairs, and genuine
              parts. Same location as our dealer for your convenience.
            </p>
          </div>
        </div>
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
        Our beloved customers
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
        <div
          className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"
          aria-hidden
        />
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
