import { NextResponse } from "next/server";
import { PriceSource } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

type CarResponse = {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  vehicleType: string | null;
  imageUrl: string | null;
  startPrice: string | null;
};

export async function GET() {
  const activePriceList = await prisma.priceList.findFirst({
    where: {
      source: PriceSource.OTR_IMAGE,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const models = await prisma.carModel.findMany({
    where: { isActive: true },
    include: {
      colors: {
        orderBy: { sortOrder: "asc" },
      },
      prices: activePriceList
        ? {
            where: { priceListId: activePriceList.id },
            orderBy: { otrPrice: "asc" },
          }
        : false,
    },
    orderBy: { name: "asc" },
  });

  const payload: CarResponse[] = models.map((model) => {
    const firstPrice = model.prices[0]?.otrPrice;
    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      category: model.category ?? null,
      vehicleType: model.vehicleType ?? null,
      imageUrl: model.heroImage ?? model.colors[0]?.imageUrl ?? null,
      startPrice: firstPrice ? firstPrice.toString() : null,
    };
  });

  return NextResponse.json({
    source: activePriceList ? "database" : "database_no_active_price_list",
    count: payload.length,
    data: payload,
  });
}
