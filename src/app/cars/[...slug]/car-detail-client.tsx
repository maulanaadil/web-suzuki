"use client";

import React from "react";
import { cn } from "@/src/lib/style";
import type { CarDetailCarouselVariant, CarImageType } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import Banner from "./banner";
import Carousel from "./carousel";

/* ───── Types ───── */

type GallerySection = {
  segment: string;
  label: string;
  images: ContentImage[];
};

type DetailBanner = {
  id: string;
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  bannerVariant: CarImageType;
};

type ImageEntry = { url: string };
type ContentImage = {
  url: string;
  title: string | null;
  content: string | null;
};
type VariantColor = {
  code: string;
  imageUrl: string | null;
  name: string | null;
  primaryColorCode: string | null;
  secondaryColorCode: string | null;
};
type VariantSpec = {
  group: string;
  key: string;
  value: string;
  sortOrder: number;
};
type FullVariant = {
  id: string;
  code: string;
  name: string;
  price: number;
  colors: VariantColor[];
  specs: VariantSpec[];
};

type DetailCarouselForClient = {
  id: string;
  variant: CarDetailCarouselVariant;
  carouselContent: {
    id: string;
    imageUrl: string;
    title: string;
    content: string;
  }[];
};

type Props = {
  model: { slug: string; name: string; category: string | null };
  detailBanners: DetailBanner[];
  detailCarousels: DetailCarouselForClient[];
  bannerImages: ImageEntry[];
  carouselImages: ContentImage[];
  gallerySections: GallerySection[];
  allVariants: FullVariant[];
  /** How many compare columns (2 or 3) */
  compareCount: number;
};

/* ───── Helpers ───── */

function formatPrice(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function FeatureValue({ value }: { value: string }) {
  const trimmed = value.trim();
  if (trimmed === "Tersedia") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5">
        <Check className="w-4 h-4 text-primary-suzuki" />
      </span>
    );
  }
  if (trimmed === "-") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5">
        <Minus className="w-4 h-4 text-gray-300" />
      </span>
    );
  }
  return <span className="text-sm text-foreground">{trimmed}</span>;
}

/** Build spec rows from selected variants for a given group */
function buildSpecRows(
  variants: FullVariant[],
  group: string,
): { key: string; values: string[] }[] {
  const keys = Array.from(
    new Set(
      variants.flatMap((v) =>
        v.specs
          .filter((s) => s.group.toUpperCase() === group.toUpperCase())
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((s) => s.key.trim()),
      ),
    ),
  );

  const specMap = new Map<string, string>();
  for (const v of variants) {
    for (const s of v.specs) {
      specMap.set(`${v.id}::${s.key.trim()}`, s.value);
    }
  }

  return keys.map((key) => ({
    key,
    values: variants.map((v) => specMap.get(`${v.id}::${key}`) ?? "-"),
  }));
}

/* ───── Variant Dropdown ───── */

function VariantDropdown({
  modelName,
  allVariants,
  selectedId,
  onSelect,
}: {
  modelName: string;
  allVariants: FullVariant[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = allVariants.find((v) => v.id === selectedId);

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between bg-gray-50 px-5 py-4 text-left cursor-pointer transition hover:bg-gray-100"
      >
        <div className="text-center w-full">
          <p className="text-lg font-bold text-foreground uppercase">
            {modelName}
          </p>
          <p className="text-sm text-gray-600">
            {selected?.name ?? selected?.code}
          </p>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 z-30 mt-0.5 bg-white shadow-lg border border-gray-200 max-h-72 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-bold text-foreground uppercase">
              {modelName}
            </p>
          </div>
          {allVariants.map((v) => (
            <button
              key={v.id}
              type="button"
              onClick={() => {
                onSelect(v.id);
                setOpen(false);
              }}
              className={cn(
                "block w-full px-4 py-3 text-left text-sm transition hover:bg-gray-50 cursor-pointer",
                v.id === selectedId
                  ? "bg-primary-suzuki/5 font-semibold text-primary-suzuki"
                  : "text-foreground",
              )}
            >
              {v.name ?? v.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───── Main Component ───── */

export default function CarDetailClient({
  model,
  detailBanners,
  detailCarousels,
  bannerImages,
  gallerySections,
  allVariants,
  compareCount,
}: Props) {
  // Initially select the first N variants for comparison
  const initialIds = allVariants.slice(0, compareCount).map((v) => v.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialIds);
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(
    Object.fromEntries(allVariants.map((v) => [v.id, 0])),
  );
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [performanceExpanded, setPerformanceExpanded] = useState(true);

  const variantById = useMemo(
    () => new Map(allVariants.map((v) => [v.id, v])),
    [allVariants],
  );

  const selectedVariants = useMemo(
    () =>
      selectedIds
        .map((id) => variantById.get(id))
        .filter((v): v is FullVariant => !!v),
    [selectedIds, variantById],
  );

  const performanceSpecs = useMemo(
    () => buildSpecRows(selectedVariants, "PERFORMANCE"),
    [selectedVariants],
  );

  const featureSpecs = useMemo(
    () => buildSpecRows(selectedVariants, "FEATURES"),
    [selectedVariants],
  );

  const sortedVariants = useMemo(
    () => [...allVariants].sort((a, b) => a.price - b.price),
    [allVariants],
  );

  const lowestPrice = sortedVariants[0]?.price ?? 0;

  const findInteriorImage = bannerImages.find((img) =>
    img.url.includes("interior"),
  );

  const navItems = [
    { href: "#overview", label: "Overview" },
    { href: "#varian", label: "Varian" },
    ...gallerySections.map((g) => ({
      href: `/cars/${model.slug}/${g.segment}`,
      label: g.label,
    })),
    { href: "#spesifikasi", label: "Fitur Safety" },
    { href: "#harga", label: "Harga" },
  ] as const;

  const handleSelectVariant = (colIdx: number, variantId: string) => {
    setSelectedIds((prev) => {
      const next = [...prev];
      next[colIdx] = variantId;
      return next;
    });
  };

  if (!findInteriorImage) return null;

  return (
    <main className="min-h-screen bg-white">
      <section id="overview" className="scroll-mt-24">
        <div className="relative w-full aspect-21/9 bg-gray-100">
          <Image
            src={findInteriorImage.url}
            alt={model.name}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container mx-auto px-4 pb-8">
            <p className="text-sm uppercase tracking-widest text-white/60">
              Suzuki Indonesia
            </p>
            <h1 className="mt-1 text-5xl font-suzuki-pro-headline text-white md:text-7xl">
              {model.name}
            </h1>
            {lowestPrice > 0 && (
              <p className="mt-2 text-sm text-white/70">
                Mulai dari{" "}
                <span className="text-white font-semibold">
                  {formatPrice(lowestPrice)}
                </span>
              </p>
            )}
          </div>
        </div>
      </section>

      <nav className="sticky top-13 z-20 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex gap-6 overflow-x-auto px-4 scrollbar-hide">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border-b-2 border-transparent py-3.5 text-xs font-sans font-medium text-gray-500 transition hover:border-primary-suzuki hover:text-primary-suzuki"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="whitespace-nowrap border-b-2 border-transparent py-3.5 text-xs font-sans font-medium text-gray-500 transition hover:border-primary-suzuki hover:text-primary-suzuki"
              >
                {item.label}
              </a>
            ),
          )}
        </div>
      </nav>

      <div className="px-8">
        {detailBanners
          .sort((a, b) => {
            if (
              a.bannerVariant === "EKSTERIOR" &&
              b.bannerVariant !== "EKSTERIOR"
            )
              return -1;
            if (
              a.bannerVariant !== "EKSTERIOR" &&
              b.bannerVariant === "EKSTERIOR"
            )
              return 1;
            return 0;
          })
          .map((banner, idx) => (
            <Banner
              key={banner.id}
              title={banner.title}
              description={banner.description}
              buttonLabel={banner.buttonLabel}
              buttonHref={banner.buttonHref}
              imageUrl={banner.imageUrl}
              className={cn(idx === 0 ? "pt-4 pb-8" : "")}
              variant={banner.bannerVariant}
            />
          ))}
      </div>

      {detailCarousels
        .filter((c) => c.carouselContent.length > 0)
        .map((carousel, index) => (
          <section key={carousel.id} className="py-8 md:py-12">
            <Carousel
              images={carousel.carouselContent.map((content) => ({
                url: content.imageUrl,
                title: content.title,
                content: content.content,
              }))}
              contentPosition={index % 2 === 0 ? "left" : "right"}
              variant={carousel.variant}
            />
          </section>
        ))}

      {/* ── Variant Compare with Dropdowns ── */}
      <section
        id="varian"
        className="container mx-auto px-4 py-12 scroll-mt-16"
      >
        <h2 className="text-3xl font-suzuki-pro-headline text-foreground uppercase md:text-4xl">
          See Which {model.name} Is
          <br />
          Perfectly Right For You
        </h2>

        {/* Unified grid: label column + variant columns */}
        <div className="mt-10 overflow-x-auto">
          <div
            className="min-w-[700px]"
            style={{
              display: "grid",
              gridTemplateColumns: `minmax(200px, 2fr) ${selectedVariants.map(() => "1fr").join(" ")}`,
            }}
          >
            {/* ── Variant selector row ── */}
            <div /> {/* empty label column */}
            {selectedVariants.map((variant, colIdx) => {
              const activeIdx = selectedColors[variant.id] ?? 0;
              const activeColor = variant.colors[activeIdx];

              return (
                <div key={colIdx} className="flex flex-col items-center px-2">
                  {/* Dropdown selector */}
                  <VariantDropdown
                    modelName={model.name}
                    allVariants={allVariants}
                    selectedId={variant.id}
                    onSelect={(id) => handleSelectVariant(colIdx, id)}
                  />

                  {/* Car image */}
                  <div className="relative mt-4 w-full aspect-4/3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${variant.id}-${activeIdx}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0"
                      >
                        {activeColor?.imageUrl ? (
                          <Image
                            src={activeColor.imageUrl}
                            alt={`${variant.name} - ${activeColor.code}`}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-sm text-gray-400">
                              No image
                            </span>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Color swatches */}
                  {variant.colors.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      {variant.colors.map(
                        (color: VariantColor, cIdx: number) => {
                          const isActive = cIdx === activeIdx;
                          const isTwoTone =
                            !!color.secondaryColorCode &&
                            !!color.primaryColorCode;
                          const primary = color.primaryColorCode
                            ? `#${color.primaryColorCode}`
                            : `#${color.code}`;
                          const secondary = color.secondaryColorCode
                            ? `#${color.secondaryColorCode}`
                            : undefined;

                          return (
                            <button
                              key={color.code}
                              type="button"
                              onClick={() =>
                                setSelectedColors((prev) => ({
                                  ...prev,
                                  [variant.id]: cIdx,
                                }))
                              }
                              className={`h-7 w-7 rounded-full border-2 transition-all cursor-pointer overflow-hidden ${
                                isActive
                                  ? "border-primary-suzuki ring-2 ring-primary-suzuki/30"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                              style={
                                isTwoTone
                                  ? {
                                      background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)`,
                                    }
                                  : { backgroundColor: primary }
                              }
                              aria-label={`Select color ${color.name ?? color.code}`}
                              title={color.name ?? color.code}
                            />
                          );
                        },
                      )}
                    </div>
                  )}

                  <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                    {activeColor?.name ?? ""}
                  </p>
                  {variant.price > 0 && (
                    <>
                      <p className="mt-3 text-2xl font-bold text-foreground">
                        {formatPrice(variant.price)}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">OTR Bandung</p>
                    </>
                  )}
                </div>
              );
            })}
            {/* ── Performance section ── */}
            {performanceSpecs.length > 0 && (
              <>
                {/* Performance header - spans full width */}
                <div className="mt-10 col-span-full">
                  <button
                    type="button"
                    onClick={() => setPerformanceExpanded(!performanceExpanded)}
                    className="flex w-full items-center justify-between bg-foreground px-6 py-4 text-left cursor-pointer"
                  >
                    <div>
                      <h2 className="text-xl font-suzuki-pro-headline text-white md:text-2xl">
                        Performance
                      </h2>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white transition ${
                        performanceExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {performanceExpanded &&
                  performanceSpecs.map((row, idx) => (
                    <React.Fragment key={row.key}>
                      <div
                        className={cn(
                          "px-6 py-3 text-sm text-foreground font-medium flex items-center",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        )}
                      >
                        {row.key}
                      </div>
                      {row.values.map((val: string, vIdx: number) => (
                        <div
                          key={vIdx}
                          className={cn(
                            "px-4 py-3 text-center text-sm text-gray-700 flex items-center justify-center",
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                          )}
                        >
                          {val}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
              </>
            )}
            {/* ── Key Features section ── */}
            {featureSpecs.length > 0 && (
              <>
                {/* Features header - spans full width */}
                <div className="mt-8 col-span-full" id="spesifikasi">
                  <button
                    type="button"
                    onClick={() => setFeaturesExpanded(!featuresExpanded)}
                    className="flex w-full items-center justify-between bg-primary-suzuki px-6 py-4 text-left cursor-pointer scroll-mt-16"
                  >
                    <div>
                      <h2 className="text-xl font-suzuki-pro-headline text-white md:text-2xl">
                        Key Features
                      </h2>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-white transition ${
                        featuresExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {featuresExpanded &&
                  featureSpecs.map((row, idx) => (
                    <React.Fragment key={row.key}>
                      <div
                        className={cn(
                          "px-6 py-3 text-sm text-foreground font-medium flex items-center",
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                        )}
                      >
                        {row.key}
                      </div>
                      {row.values.map((val: string, vIdx: number) => (
                        <div
                          key={vIdx}
                          className={cn(
                            "px-4 py-3 flex items-center justify-center",
                            idx % 2 === 0 ? "bg-white" : "bg-gray-50/50",
                          )}
                        >
                          <FeatureValue value={val} />
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="harga" className="container mx-auto px-4 py-12 scroll-mt-16">
        <p className="text-sm uppercase tracking-widest text-primary-suzuki">
          Harga
        </p>
        <h2 className="mt-2 text-3xl font-suzuki-pro-headline text-foreground md:text-4xl">
          Pilih Varian Anda
        </h2>
        <p className="mt-2 text-sm text-gray-500">OTR bandung</p>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="bg-foreground text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Varian
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold">
                  Harga OTR
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold">
                  &nbsp;
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedVariants.map((variant, idx) => (
                <tr
                  key={variant.id}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
                >
                  <td className="px-6 py-4 text-sm font-medium text-foreground">
                    {variant.name}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                    {variant.price > 0
                      ? formatPrice(variant.price)
                      : "Hubungi kami"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      href={`/order?slug=${model.slug}&model=${encodeURIComponent(variant.name)}`}
                      className="inline-flex items-center bg-primary-suzuki px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                    >
                      Pesan
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="container mx-auto px-4 pb-16">
        <div className="bg-foreground px-6 py-12 text-white md:px-12">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-suzuki-pro-headline md:text-4xl">
              Siap Memiliki {model.name}?
            </h3>
            <p className="mt-3 text-base text-white/80 leading-relaxed">
              Isi form pemesanan untuk mendapatkan penawaran terbaik, estimasi
              cicilan, dan jadwal test drive dari dealer terdekat.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/order?slug=${model.slug}&model=${encodeURIComponent(model.name)}`}
                className="inline-flex items-center bg-primary-suzuki px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Order Sekarang
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
