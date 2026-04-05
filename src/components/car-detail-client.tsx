"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, Check, Minus, ChevronDown, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ───── Types ───── */

export type Feature = {
  featureName: string;
  v1: string;
  v2: string;
  v3?: string;
  order_index?: number | string;
};

export type SellingPriceDetail = {
  variantCode: string;
  landingPrice: number;
};

export type PriceEntry = {
  sellingPriceDetails: SellingPriceDetail[];
};

export type CarData = {
  name: string;
  features: Feature[];
  performance: Feature[];
  prices: PriceEntry[];
};

export type VariantColor = {
  name: string;
  hexPrimary: string;
  hexSecondary?: string;
  image: string;
};

export type CompareVariant = {
  key: string;
  label: string;
  shortLabel: string;
  code: string;
  colors: VariantColor[];
  otrPrice: number;
};

export type CarPageConfig = {
  slug: string;
  description: string;
  variantMap: Record<string, string>;
  compareVariants: CompareVariant[];
  interiorImages?: { src: string; alt: string }[];
  variantColumns: ("v1" | "v2" | "v3")[];
};

/* ───── Helpers ───── */

function formatPrice(value: number): string {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function formatPriceIDR(value: number): string {
  return `${value.toLocaleString("id-ID")} IDR`;
}

function getSwatchStyle(color: VariantColor): CSSProperties {
  if (color.hexSecondary) {
    return {
      background: `linear-gradient(135deg, ${color.hexPrimary} 0%, ${color.hexPrimary} 50%, ${color.hexSecondary} 50%, ${color.hexSecondary} 100%)`,
    };
  }
  return { backgroundColor: color.hexPrimary };
}

function FeatureValue({ value }: { value: string | undefined }) {
  const trimmed = (value ?? "-").trim();
  if (trimmed === "Tersedia") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-suzuki/10">
        <Check className="w-4 h-4 text-primary-suzuki" />
      </span>
    );
  }
  if (trimmed === "-") {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100">
        <Minus className="w-4 h-4 text-gray-400" />
      </span>
    );
  }
  return <span className="text-sm text-foreground">{trimmed}</span>;
}

/* ───── Image Carousel ───── */

function ImageCarousel({ images }: { images: { src: string; alt: string }[] }) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gray-100">
      <div className="relative aspect-video w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[current].src}
              alt={images[current].alt}
              fill
              className="object-cover"
              priority={current === 0}
              unoptimized={images[current].src.startsWith("http")}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition hover:bg-white"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-sm transition hover:bg-white"
        aria-label="Next image"
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === current ? "w-6 bg-white" : "w-2 bg-white/50"
            }`}
            aria-label={`Go to image ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ───── Variant Compare Section ───── */

function VariantCompareSection({
  carName,
  compareVariants,
}: {
  carName: string;
  compareVariants: CompareVariant[];
}) {
  const [selectedColors, setSelectedColors] = useState<Record<string, number>>(
    Object.fromEntries(compareVariants.map((v) => [v.key, 0])),
  );

  const selectColor = (variantKey: string, colorIdx: number) => {
    setSelectedColors((prev) => ({ ...prev, [variantKey]: colorIdx }));
  };

  return (
    <section id="varian" className="mb-16 scroll-mt-32">
      <h2 className="text-3xl font-suzuki-pro-headline text-foreground uppercase md:text-4xl">
        See Which {carName} Is
        <br />
        Perfectly Right For You
      </h2>

      <div
        className={`mt-10 grid grid-cols-1 gap-6 ${
          compareVariants.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"
        }`}
      >
        {compareVariants.map((variant) => {
          const activeIdx = selectedColors[variant.key] ?? 0;
          const activeColor = variant.colors[activeIdx];

          return (
            <div key={variant.key} className="flex flex-col items-center">
              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 px-5 py-4 text-center">
                <p className="text-lg font-bold text-foreground uppercase">{carName}</p>
                <p className="text-sm text-gray-600">{variant.label}</p>
              </div>

              <div className="relative mt-4 w-full aspect-4/3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${variant.key}-${activeIdx}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={activeColor.image}
                      alt={`${variant.label} - ${activeColor.name}`}
                      fill
                      className="object-contain"
                      unoptimized
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {variant.colors.map((color, cIdx) => {
                  const isActive = cIdx === activeIdx;
                  return (
                    <button
                      key={color.name}
                      onClick={() => selectColor(variant.key, cIdx)}
                      className={`h-7 w-7 rounded-full border-2 transition-all ${
                        isActive
                          ? "border-primary-suzuki ring-2 ring-primary-suzuki/30"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={getSwatchStyle(color)}
                      aria-label={`Select ${color.name}`}
                      title={color.name}
                    />
                  );
                })}
              </div>

              <p className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                {activeColor.name}
              </p>
              <Info className="mt-1 h-4 w-4 text-gray-400" />
              <p className="mt-3 text-2xl font-bold text-foreground">
                {formatPriceIDR(variant.otrPrice)}
              </p>
              <p className="mt-1 text-xs text-gray-500">OTR D.K.I Jakarta</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───── Main Component ───── */

export default function CarDetailClient({
  data,
  config,
}: {
  data: CarData;
  config: CarPageConfig;
}) {
  const [featuresExpanded, setFeaturesExpanded] = useState(true);
  const [performanceExpanded, setPerformanceExpanded] = useState(true);

  const cols = config.variantColumns;
  const colCount = cols.length;

  const allPrices = useMemo(() => {
    const priceMap = new Map<string, number>();
    for (const entry of data.prices) {
      for (const detail of entry.sellingPriceDetails) {
        if (!priceMap.has(detail.variantCode)) {
          priceMap.set(detail.variantCode, detail.landingPrice);
        }
      }
    }
    return priceMap;
  }, [data.prices]);

  const sortedVariants = useMemo(() => {
    return Array.from(allPrices.entries())
      .map(([code, price]) => ({
        code,
        name: config.variantMap[code] || code,
        price,
      }))
      .sort((a, b) => a.price - b.price);
  }, [allPrices, config.variantMap]);

  const getFeatureVal = (feature: Feature, col: string) => {
    return (feature as Record<string, string | undefined>)[col];
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative bg-linear-to-b from-[#001a3e] to-[#003478] text-white">
        <div className="container mx-auto px-4 pt-28 pb-12 md:pt-36 md:pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-sm uppercase tracking-widest text-white/60">Suzuki Indonesia</p>
              <h1 className="mt-3 text-5xl font-suzuki-pro-headline md:text-7xl">{data.name}</h1>
              <p className="mt-4 max-w-md text-base text-white/80 leading-relaxed">
                {config.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/order?slug=${config.slug}&model=${encodeURIComponent(data.name)}`}
                  className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-suzuki transition hover:bg-white/90"
                >
                  Order Sekarang
                </Link>
                <a
                  href="#spesifikasi"
                  className="inline-flex items-center rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Spesifikasi
                </a>
              </div>
              <p className="mt-6 text-sm text-white/50">
                Mulai dari{" "}
                <span className="text-white font-semibold">
                  {formatPrice(sortedVariants[0]?.price ?? 0)}
                </span>
              </p>
            </div>
            <div className="relative">
              {config.interiorImages && config.interiorImages.length > 0 ? (
                <ImageCarousel images={config.interiorImages} />
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-white/5">
                  <Image
                    src={config.compareVariants[0]?.colors[0]?.image ?? ""}
                    alt={data.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Nav */}
      <nav className="sticky top-[64px] z-20 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex gap-6 overflow-x-auto px-4 scrollbar-hide">
          {[
            { href: "#varian", label: "Varian" },
            { href: "#spesifikasi", label: "Fitur Keselamatan" },
            { href: "#performa", label: "Performa" },
            { href: "#harga", label: "Harga" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="whitespace-nowrap border-b-2 border-transparent py-4 text-sm font-medium text-gray-600 transition hover:border-primary-suzuki hover:text-primary-suzuki"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Interior Gallery */}
        {config.interiorImages && config.interiorImages.length > 0 && (
          <section className="mb-16">
            <h2 className="text-sm uppercase tracking-widest text-primary-suzuki">Interior</h2>
            <p className="mt-2 text-3xl font-suzuki-pro-headline text-foreground md:text-4xl">
              A Scene Of Bliss That You Adore
            </p>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {config.interiorImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-4/3 overflow-hidden rounded-xl bg-gray-100"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition hover:scale-105"
                    unoptimized={img.src.startsWith("http")}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Variant Compare */}
        <VariantCompareSection
          carName={data.name}
          compareVariants={config.compareVariants}
        />

        {/* Features Table */}
        <section id="spesifikasi" className="mb-12 scroll-mt-32">
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setFeaturesExpanded(!featuresExpanded)}
              className="flex w-full items-center justify-between bg-primary-suzuki px-6 py-4 text-left"
            >
              <div>
                <h2 className="text-xl font-suzuki-pro-headline text-white md:text-2xl">
                  Fitur Keselamatan
                </h2>
                <p className="mt-1 text-sm text-white/70">Suzuki Safety Support</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-white transition ${featuresExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {featuresExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-[40%]">
                        Fitur
                      </th>
                      {config.compareVariants.map((v) => (
                        <th
                          key={v.key}
                          className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                          <span className="text-primary-suzuki">{v.shortLabel}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.features.map((feature, idx) => (
                      <tr
                        key={feature.featureName}
                        className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {feature.featureName.trim()}
                        </td>
                        {cols.map((col) => (
                          <td key={col} className="px-4 py-4 text-center">
                            <div className="flex justify-center">
                              <FeatureValue value={getFeatureVal(feature, col)} />
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Performance Table */}
        <section id="performa" className="mb-12 scroll-mt-32">
          <div className="rounded-2xl border border-gray-200 overflow-hidden">
            <button
              onClick={() => setPerformanceExpanded(!performanceExpanded)}
              className="flex w-full items-center justify-between bg-foreground px-6 py-4 text-left"
            >
              <div>
                <h2 className="text-xl font-suzuki-pro-headline text-white md:text-2xl">
                  Performa
                </h2>
                <p className="mt-1 text-sm text-white/70">Spesifikasi Teknis</p>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-white transition ${performanceExpanded ? "rotate-180" : ""}`}
              />
            </button>

            {performanceExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-[40%]">
                        Spesifikasi
                      </th>
                      {config.compareVariants.map((v) => (
                        <th
                          key={v.key}
                          className="px-4 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500"
                        >
                          <span className="text-foreground">{v.shortLabel}</span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.performance.map((spec, idx) => (
                      <tr
                        key={spec.featureName}
                        className={`border-b border-gray-100 transition hover:bg-gray-50 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
                        }`}
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {spec.featureName.trim()}
                        </td>
                        {cols.map((col) => (
                          <td key={col} className="px-4 py-4 text-center text-sm text-gray-700">
                            {getFeatureVal(spec, col) ?? "-"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section id="harga" className="mb-12 scroll-mt-32">
          <h2 className="text-sm uppercase tracking-widest text-primary-suzuki">Harga</h2>
          <p className="mt-2 text-3xl font-suzuki-pro-headline text-foreground md:text-4xl">
            Pilih Varian Anda
          </p>
          <p className="mt-2 text-sm text-gray-500">Harga OTR D.K.I Jakarta</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedVariants.map((variant, idx) => {
              const isTopTier = idx === sortedVariants.length - 1;
              return (
                <motion.div
                  key={variant.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`relative rounded-2xl border p-6 transition hover:shadow-lg ${
                    isTopTier
                      ? "border-primary-suzuki bg-primary-suzuki/2"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {isTopTier && (
                    <span className="absolute -top-3 left-4 rounded-full bg-primary-suzuki px-3 py-1 text-xs font-semibold text-white">
                      Tertinggi
                    </span>
                  )}
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
                    Suzuki
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-foreground">{variant.name}</h3>
                  <p className="mt-4 text-2xl font-bold text-primary-suzuki">
                    {formatPrice(variant.price)}
                  </p>
                  <Link
                    href={`/order?slug=${config.slug}&model=${encodeURIComponent(variant.name)}`}
                    className="mt-6 block w-full rounded-full bg-primary-suzuki py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Pesan Sekarang
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-linear-to-r from-[#001a3e] to-[#003478] px-6 py-12 text-white md:px-12">
          <div className="max-w-2xl">
            <h3 className="text-3xl font-suzuki-pro-headline md:text-4xl">
              Siap Memiliki {data.name}?
            </h3>
            <p className="mt-3 text-base text-white/80 leading-relaxed">
              Isi form pemesanan untuk mendapatkan penawaran terbaik, estimasi cicilan, dan jadwal
              test drive dari dealer terdekat.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={`/order?slug=${config.slug}&model=${encodeURIComponent(data.name)}`}
                className="inline-flex items-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-primary-suzuki transition hover:bg-white/90"
              >
                Order Sekarang
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Hubungi Kami
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
