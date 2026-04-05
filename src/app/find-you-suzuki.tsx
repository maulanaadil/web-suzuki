"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronRight, ChevronUp } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";

import CarCityIcon from "../assets/icons/car-city";
import CarCommercialIcon from "../assets/icons/car-commercial";
import CarMPVIcon from "../assets/icons/car-mpv";
import CarSUVIcon from "../assets/icons/car-suv";
import { cn } from "../lib/style";

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
        type: "passenger",
      },
      {
        label: "Commercial",
        type: "commercial",
      },
    ],
  },
  {
    label: "Range Price",
    items: [],
  },
];

type CarCatalogItem = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  vehicleType: string | null;
  imageUrl: string | null;
  startPrice: string | null;
};

function normalizeCategory(category: string | null): string {
  if (!category) return "other";
  if (category === "CITY_CAR") return "city-car";
  return category.toLowerCase();
}

function normalizeVehicleType(type: string | null): string {
  return type?.toLowerCase() ?? "";
}

export default function FindYourSuzukiSection({
  className,
}: {
  className?: string;
}) {
  const router = useRouter();
  const [selectedAccordion, setSelectedAccordion] = useState<string[]>([
    "Category",
    "Range Price",
  ]);
  const [selectedCategoryFilters, setSelectedCategoryFilters] = useState<
    string[]
  >([]);
  const [selectedTypeFilters, setSelectedTypeFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({
    min: PRICE_SCALE_MIN,
    max: PRICE_SCALE_MAX,
  });
  const [catalog, setCatalog] = useState<CarCatalogItem[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const response = await fetch("/api/cars");
        if (!response.ok) {
          throw new Error(`Failed to load cars (${response.status})`);
        }
        const payload = (await response.json()) as { data: CarCatalogItem[] };
        setCatalog(payload.data ?? []);
      } catch (error) {
        console.error("Failed to load car catalog", error);
        setCatalog([]);
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    void loadCars();
  }, []);

  const priceBounds = useMemo(() => {
    const values = catalog
      .map((car) => Number(car.startPrice ?? 0))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (values.length === 0) {
      return { min: PRICE_SCALE_MIN, max: PRICE_SCALE_MAX };
    }
    const min = Math.min(...values);
    const max = Math.max(...values);
    return {
      min: Math.floor(min / PRICE_STEP) * PRICE_STEP,
      max: Math.ceil(max / PRICE_STEP) * PRICE_STEP,
    };
  }, [catalog]);

  useEffect(() => {
    setPriceRange((prev) => ({
      min: Math.max(priceBounds.min, prev.min),
      max: Math.min(priceBounds.max, prev.max),
    }));
  }, [priceBounds.max, priceBounds.min]);

  const filteredCars = useMemo(() => {
    return catalog.filter((car) => {
      const categoryMatch =
        selectedCategoryFilters.length === 0 ||
        selectedCategoryFilters.includes(normalizeCategory(car.category));
      const typeMatch =
        selectedTypeFilters.length === 0 ||
        selectedTypeFilters.includes(normalizeVehicleType(car.vehicleType));
      const price = Number(car.startPrice ?? 0);
      const priceMatch = price >= priceRange.min && price <= priceRange.max;
      return categoryMatch && typeMatch && priceMatch;
    });
  }, [
    catalog,
    priceRange.max,
    priceRange.min,
    selectedCategoryFilters,
    selectedTypeFilters,
  ]);

  console.log(filteredCars);

  const toggleAccordion = (category: string) => {
    if (selectedAccordion.includes(category)) {
      setSelectedAccordion((prev) => prev.filter((c) => c !== category));
    } else {
      setSelectedAccordion((prev) => [...prev, category]);
    }
  };

  const toggleCategoryFilter = (value: string) => {
    setSelectedCategoryFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };

  const toggleTypeFilter = (value: string) => {
    setSelectedTypeFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
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
      className={cn(
        "w-full h-full container mx-auto bg-white py-16 px-6 sm:px-0",
        className,
      )}
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
          Temukan dan atur semua model Suzuki.
        </p>
        <p className="font-sans text-gray-600 text-base">
          Jelajahi beragam pilihan mobil Suzuki kami, mulai dari mobil kota yang
          ringkas hingga SUV yang tangguh, yang masing-masing dirancang untuk
          menyesuaikan gaya hidup dan kebutuhan Anda.
        </p>
      </motion.div>
      <motion.div
        className="flex flex-col lg:flex-row gap-6"
        variants={containerVariants}
      >
        <div className="w-full lg:w-1/4 flex flex-col gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.label}
              variants={itemVariants}
              className="flex flex-col gap-4"
            >
              <motion.div
                className="flex items-center justify-between border-b border-gray-600 pb-4 cursor-pointer group transition-colors duration-300 hover:opacity-80"
                onClick={() => toggleAccordion(category.label)}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <p className="font-sans text-gray-600 text-xl group-hover:text-primary-suzuki transition-colors duration-300">
                  {category.label}
                </p>
                {selectedAccordion.includes(category.label) ? (
                  <ChevronUp className="w-4 h-4 text-gray-600 group-hover:text-primary-suzuki transition-colors duration-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600 group-hover:text-primary-suzuki transition-colors duration-300" />
                )}
              </motion.div>

              <AnimatePresence initial={false}>
                {selectedAccordion.includes(category.label) ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    {category.label === "Range Price" ? (
                      <PriceRangeScale
                        value={priceRange}
                        bounds={priceBounds}
                        onChange={setPriceRange}
                      />
                    ) : (
                      <Categories
                        items={category.items}
                        selectedValues={
                          category.label === "Category"
                            ? selectedCategoryFilters
                            : selectedTypeFilters
                        }
                        onToggle={(value) =>
                          category.label === "Category"
                            ? toggleCategoryFilter(value)
                            : toggleTypeFilter(value)
                        }
                      />
                    )}
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
        <motion.div
          className="flex-1 w-full p-0 sm:p-4 min-h-0 lg:min-h-240.75"
          variants={itemVariants}
        >
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingCatalog ? (
              <p className="font-sans text-sm text-gray-600">Loading cars...</p>
            ) : filteredCars.length === 0 ? (
              <p className="font-sans text-sm text-gray-600">
                No cars match your filter yet.
              </p>
            ) : (
              filteredCars.map((car) => (
                <CarItemCard
                  key={car.id}
                  car={car}
                  onClick={() => router.push(`/cars/${car.slug}`)}
                />
              ))
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.main>
  );
}

const PRICE_SCALE_MIN = 0;
const PRICE_SCALE_MAX = 760_000_000; // 600 million IDR
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

function PriceRangeScale({
  value,
  bounds,
  onChange,
}: {
  value: { min: number; max: number };
  bounds: { min: number; max: number };
  onChange: (value: { min: number; max: number }) => void;
}) {
  const minPrice = value.min;
  const maxPrice = value.max;

  const handleMinChange = (v: number) => {
    onChange({ min: Math.min(v, maxPrice - PRICE_STEP), max: maxPrice });
  };

  const handleMaxChange = (v: number) => {
    onChange({ min: minPrice, max: Math.max(v, minPrice + PRICE_STEP) });
  };

  const range = Math.max(bounds.max - bounds.min, PRICE_STEP);
  const minPct = ((minPrice - bounds.min) / range) * 100;
  const maxPct = ((maxPrice - bounds.min) / range) * 100;

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
          min={bounds.min}
          max={bounds.max}
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
          min={bounds.min}
          max={bounds.max}
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
  passenger: CarMPVIcon,
};

const categoryChipVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
};

function Categories({
  items,
  selectedValues,
  onToggle,
}: Pick<(typeof categories)[number], "items"> & {
  selectedValues: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <motion.div
      className="flex flex-wrap gap-2 items-center px-0 "
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      {items.map((item) => {
        const Icon =
          "type" in item && item.type ? categoryIcons[item.type] : null;
        const value =
          "type" in item && item.type ? item.type : item.label.toLowerCase();
        const isActive = selectedValues.includes(value);

        return (
          <motion.div
            key={item.label}
            variants={categoryChipVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onToggle(value)}
            className={`flex flex-col gap-1.5 py-2 px-4 border group rounded cursor-pointer transition-colors duration-300 items-center min-w-16 ${
              isActive
                ? "border-primary-suzuki bg-gray-50"
                : "bg-transparent border-gray-400 hover:bg-gray-50"
            }`}
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

function formatPriceFullIdr(value: string | null): string {
  if (!value) return "Price on request";
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return "Price on request";
  return `Rp ${numeric.toLocaleString("id-ID")}`;
}

function CarItemCard({
  car,
  onClick,
}: {
  car: CarCatalogItem;
  onClick: () => void;
}) {
  const badge = car.category?.replace("_", " ") ?? "OTHER";
  return (
    <button
      type="button"
      onClick={onClick}
      className="group bg-white p-4 flex flex-col gap-2 text-left cursor-pointer transition-colors duration-300 border border-transparent"
    >
      {/* Badge type */}
      <div className="flex flex-col p-2">
        <p className="bg-foreground w-fit text-white px-2 text-[10px] py-1">
          {badge}
        </p>
        <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground my-2">
          {car.name}
        </p>
        <div className="relative w-full aspect-video">
          <Image
            src={
              car.imageUrl ??
              "https://placehold.co/720x405/e5e7eb/9ca3af?text=Suzuki"
            }
            width={720}
            height={405}
            alt={`Suzuki ${car.name}`}
            className="object-cover"
            objectFit="cover"
            unoptimized
          />
        </div>

        <div className="mt-2">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <p className="text-sm text-gray-500">Mulai dari</p>
              </div>
              <span className="font-semibold text-base text-black">
                {formatPriceFullIdr(car.startPrice)}
              </span>
            </div>
            <div
              className="flex flex-col items-center gap-1.5 self-end"
              aria-hidden
            >
              <ChevronRight
                className="size-5 shrink-0 text-foreground transition-colors duration-300 ease-out group-hover:text-primary-suzuki"
                strokeWidth={2.25}
              />
              <span className="h-px w-5 bg-foreground transition-colors duration-300 ease-out group-hover:bg-primary-suzuki" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
