import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarDetailCarouselVariant } from "@prisma/client";
import { notFound } from "next/navigation";

import { prisma } from "../../../lib/prisma";
import CarDetailClient from "./car-detail-client";
import { CAR_GALLERY_ENTRIES } from "./gallery-routes";
import { getGalleryBySlugAndImageType } from "./gallery-data";
import GalleryGrid from "./gallery-grid";

export default async function CarsCatchAllPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug: segments } = await params;
  if (!segments?.length) notFound();

  if (segments.length === 2) {
    const [modelSlug, galleryKind] = segments;
    const entry = CAR_GALLERY_ENTRIES.find((e) => e.segment === galleryKind);
    if (!entry) notFound();

    const data = await getGalleryBySlugAndImageType(modelSlug, entry.imageType);
    if (!data) notFound();

    return (
      <main className="min-h-screen bg-white py-8">
        <div className="container mx-auto px-4">
          <Link
            href={`/cars/${data.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-primary-suzuki"
          >
            <ChevronLeft className="size-4" aria-hidden />
            Kembali ke {data.name}
          </Link>

          <p className="mt-8 text-sm uppercase tracking-widest text-primary-suzuki">
            {entry.label}
          </p>
          <h1 className="mt-2 text-3xl font-suzuki-pro-headline text-foreground uppercase md:text-4xl">
            Gallery — {data.name}
          </h1>

          {data.images.length === 0 ? (
            <p className="mt-8 text-gray-500">
              Belum ada gambar untuk kategori ini.
            </p>
          ) : (
            <div className="mt-10">
              <GalleryGrid images={data.images} />
            </div>
          )}
        </div>
      </main>
    );
  }

  // `/cars/:modelSlug` — car detail
  if (segments.length !== 1) notFound();
  const slug = segments[0];

  const model = await prisma.carModel.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { sortOrder: "asc" },
        include: {
          specs: { orderBy: [{ group: "asc" }, { sortOrder: "asc" }] },
          price: true,
          colors: true,
        },
      },
      colors: true,
      images: {
        include: { contents: true },
      },
    },
  });

  if (!model) notFound();

  const detailBannersRaw = await prisma.carDetailBanner.findMany({
    where: { carModelId: model.id },
  });
  const detailBanners = detailBannersRaw.map((b) => ({
    id: b.id,
    title: b.title,
    description: b.description,
    buttonLabel: b.buttonLabel,
    buttonHref: b.buttonHref,
    imageUrl: b.imageUrl,
    bannerVariant: b.bannerVariant,
  }));

  const CAROUSEL_ORDER: CarDetailCarouselVariant[] = [
    CarDetailCarouselVariant.SECURITY,
    CarDetailCarouselVariant.SAFETY,
    CarDetailCarouselVariant.PERFORMANCE,
  ];

  const detailCarouselsRaw = await prisma.carDetailCarousel.findMany({
    where: { carModelId: model.id },
    include: {
      carouselContent: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  const detailCarousels = detailCarouselsRaw
    .slice()
    .sort(
      (a, b) =>
        CAROUSEL_ORDER.indexOf(a.variant) - CAROUSEL_ORDER.indexOf(b.variant),
    )
    .map((c) => ({
      id: c.id,
      variant: c.variant,
      carouselContent: c.carouselContent.map((row) => ({
        id: row.id,
        imageUrl: row.imageUrl,
        title: row.title,
        content: row.content,
      })),
    }));

  const bannerImages = model.images
    .filter((img) => img.type === "BANNER")
    .map((img) => ({ url: img.url }));

  const carouselImages = model.images
    .filter((img) => img.type === "CAROUSEL")
    .map((img) => ({
      url: img.url,
      title: img.contents?.title ?? null,
      content: img.contents?.content ?? null,
    }));

  const gallerySections = CAR_GALLERY_ENTRIES.map(
    ({ segment, imageType, label }) => ({
      segment,
      label,
      images: model.images
        .filter((img) => img.type === imageType)
        .map((img) => ({
          url: img.url,
          title: img.contents?.title ?? null,
          content: img.contents?.content ?? null,
        })),
    }),
  );

  const previewImages = model.images
    .filter((img) => img.type === "PREVIEW")
    .map((img) => ({ url: img.url }));

  const colorImageMap = new Map(
    previewImages.map((img) => {
      const filename = img.url.split("/").pop() ?? "";
      const code = filename.replace("-color.webp", "").replace(".webp", "");
      return [code, img.url];
    }),
  );

  const allVariants = model.variants.map((v) => {
    const variantColors = model.colors
      .filter((c) => c.carVariantCode === v.code)
      .map((c) => ({
        code: c.colorCode,
        name: c.name ?? null,
        imageUrl: colorImageMap.get(c.colorCode) ?? null,
        primaryColorCode: c.primaryColorCode ?? null,
        secondaryColorCode: c.type === "SECONDARY" ? (c.secondaryColorCode ?? null) : null,
      }));

    return {
      id: v.id,
      code: v.code,
      name: v.name ?? v.code,
      price: v.price?.otrPrice ? Number(v.price.otrPrice) : 0,
      colors: variantColors,
      specs: v.specs.map((s) => ({
        group: s.group,
        key: s.key,
        value: s.value,
        sortOrder: s.sortOrder,
      })),
    };
  });

  const compareCount = Math.min(model.variants.length, 3);

  return (
    <CarDetailClient
      model={{
        slug: model.slug,
        name: model.name,
        category: model.category,
      }}
      bannerImages={bannerImages}
      carouselImages={carouselImages}
      gallerySections={gallerySections}
      allVariants={allVariants}
      compareCount={compareCount}
      detailBanners={detailBanners}
      detailCarousels={detailCarousels}
    />
  );
}
