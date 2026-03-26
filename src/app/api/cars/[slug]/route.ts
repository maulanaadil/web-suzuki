import { NextResponse } from "next/server";
import { PriceSource } from "@prisma/client";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
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
    return NextResponse.json({ message: "Car not found" }, { status: 404 });
  }

  const payload = {
    id: model.id,
    slug: model.slug,
    name: model.name,
    tagline: model.tagline,
    category: model.category,
    vehicleType: model.vehicleType,
    heroImage: model.heroImage,
    startPrice: model.prices[0]?.otrPrice?.toString() ?? null,
    colors: model.colors.map((color) => ({
      id: color.id,
      name: color.name,
      hexCode: color.hexCode,
      hexCodePrimary: color.hexCodePrimary,
      hexCodeSecondary: color.hexCodeSecondary,
      imageUrl: color.imageUrl,
    })),
    variants: model.variants.map((variant) => ({
      id: variant.id,
      name: variant.name,
      transmission: variant.transmission,
      engine: variant.engine,
      drivetrain: variant.drivetrain,
      isHybrid: variant.isHybrid,
      price: variant.prices[0]?.otrPrice?.toString() ?? null,
      specs: variant.specs.map((spec) => ({
        id: spec.id,
        group: spec.specGroup,
        key: spec.specKey,
        value: spec.specValue,
        unit: spec.unit,
      })),
    })),
  };

  return NextResponse.json(payload);
}
