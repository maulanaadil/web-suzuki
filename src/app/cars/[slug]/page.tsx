import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PriceSource } from "@prisma/client";
import { prisma } from "../../../lib/prisma";
import VariantCompareClient from "./variant-compare-client";

function formatPriceFullIdr(value: bigint | null | undefined): string {
  if (!value) return "Price on request";
  return `Rp ${Number(value).toLocaleString("id-ID")} IDR`;
}

function normalizeSpecKey(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export default async function CarDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const activePriceList = await prisma.priceList.findFirst({
    where: {
      source: PriceSource.OTR_IMAGE,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const model = await prisma.carModel.findUnique({
    where: { slug },
    include: {
      colors: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        orderBy: { sortOrder: "asc" },
        include: {
          specs: {
            orderBy: [{ specGroup: "asc" }, { sortOrder: "asc" }],
          },
          prices: activePriceList
            ? {
                where: { priceListId: activePriceList.id },
                orderBy: { otrPrice: "asc" },
              }
            : false,
        },
      },
      prices: activePriceList
        ? {
            where: { priceListId: activePriceList.id },
            orderBy: { otrPrice: "asc" },
          }
        : false,
    },
  });

  if (!model) {
    notFound();
  }

  const compareVariants = model.variants.slice(0, 3);

  const performanceKeys = Array.from(
    new Set(
      compareVariants.flatMap((variant) =>
        variant.specs
          .filter((spec) => spec.specGroup.toUpperCase() === "PERFORMANCE")
          .map((spec) => normalizeSpecKey(spec.specKey)),
      ),
    ),
  );

  const featureKeys = Array.from(
    new Set(
      compareVariants.flatMap((variant) =>
        variant.specs
          .filter((spec) => spec.specGroup.toUpperCase() === "KEY_FEATURES")
          .map((spec) => normalizeSpecKey(spec.specKey)),
      ),
    ),
  );

  const valueByVariantAndKey = new Map<string, string>();
  for (const variant of compareVariants) {
    for (const spec of variant.specs) {
      valueByVariantAndKey.set(`${variant.id}::${normalizeSpecKey(spec.specKey)}`, spec.specValue);
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pb-16 pt-28 md:pt-32">
        <section id="overview" className="mb-10">
          <p className="font-sans text-sm uppercase tracking-wide text-primary-suzuki">Suzuki Indonesia</p>
          <h1 className="mt-2 text-4xl font-suzuki-pro-headline text-foreground md:text-5xl">{model.name}</h1>
          <p className="mt-3 max-w-3xl font-sans text-base text-gray-600 md:text-lg">
            Pilih varian yang paling sesuai dengan kebutuhan Anda, lalu lanjutkan ke formulir pemesanan untuk
            konsultasi dan simulasi kredit.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/order?slug=${model.slug}&model=${encodeURIComponent(model.name)}`}
              className="inline-flex items-center justify-center rounded-full bg-primary-suzuki px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
            >
              Order Sekarang
            </Link>
            <a
              href="#spesifikasi"
              className="inline-flex items-center justify-center rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-foreground hover:bg-gray-50"
            >
              Lihat Spesifikasi
            </a>
          </div>
        </section>

        <section id="variant" className="mb-10">
          <h2 className="mb-4 text-2xl font-suzuki-pro-headline text-foreground">Varian Unggulan</h2>
          <VariantCompareClient
            modelName={model.name}
            heroImage={model.heroImage}
            variants={compareVariants.map((variant) => ({
              id: variant.id,
              name: variant.name,
              priceText: formatPriceFullIdr(variant.prices[0]?.otrPrice),
            }))}
            colors={model.colors.map((color) => ({
              id: color.id,
              name: color.name,
              imageUrl: color.imageUrl,
              hexCodePrimary: color.hexCodePrimary,
              hexCodeSecondary: color.hexCodeSecondary,
            }))}
          />
        </section>

        <section id="spesifikasi" className="mt-10 rounded-2xl border border-gray-200 bg-white">
          <h2 className="border-b border-gray-200 px-4 py-3 text-2xl font-suzuki-pro-headline text-foreground">
            Performance
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <tbody>
                {performanceKeys.map((key) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="w-72 px-4 py-3 font-sans text-gray-600">{key}</td>
                    {compareVariants.map((variant) => (
                      <td key={`${variant.id}-${key}`} className="px-4 py-3 font-sans text-foreground">
                        {valueByVariantAndKey.get(`${variant.id}::${key}`) ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="fitur" className="mt-8 rounded-2xl border border-gray-200 bg-white">
          <h2 className="border-b border-gray-200 px-4 py-3 text-2xl font-suzuki-pro-headline text-foreground">
            Key Features
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px] text-sm">
              <tbody>
                {featureKeys.map((key) => (
                  <tr key={key} className="border-b border-gray-100">
                    <td className="w-72 px-4 py-3 font-sans text-gray-600">{key}</td>
                    {compareVariants.map((variant) => (
                      <td key={`${variant.id}-${key}`} className="px-4 py-3 font-sans text-foreground">
                        {valueByVariantAndKey.get(`${variant.id}::${key}`) ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">Semua Varian</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {model.variants.map((variant) => (
              <div key={variant.id} className="rounded-xl border border-gray-200 p-3">
                <p className="font-sans text-sm text-gray-600">{variant.name}</p>
                <p className="mt-1 font-sans font-medium text-foreground">
                  {formatPriceFullIdr(variant.prices[0]?.otrPrice)}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-4">
          <h2 className="mb-3 font-sans text-lg font-semibold text-foreground">Pilihan Warna</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {model.colors.map((color) => (
              <div key={color.id} className="rounded-lg border border-gray-200 p-2">
                <div className="relative mb-2 w-full aspect-video rounded-md bg-gray-100">
                  <Image
                    src={color.imageUrl ?? "https://placehold.co/300x180/111827/9ca3af?text=Color"}
                    alt={color.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <p className="line-clamp-2 text-xs font-sans text-gray-700">{color.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-foreground px-6 py-8 text-white">
          <h3 className="text-2xl font-suzuki-pro-headline">Siap order {model.name}?</h3>
          <p className="mt-2 max-w-2xl text-sm text-white/80">
            Isi form pemesanan untuk mendapatkan penawaran terbaik, estimasi cicilan, dan jadwal test drive.
          </p>
          <Link
            href={`/order?slug=${model.slug}&model=${encodeURIComponent(model.name)}`}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-primary-suzuki px-6 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Order Sekarang
          </Link>
        </section>
      </div>
    </main>
  );
}
