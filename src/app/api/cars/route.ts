import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const models = await prisma.carModel.findMany({
    include: {
      variants: {
        orderBy: { sortOrder: "asc" },
        include: { price: true },
      },
      images: {
        where: { type: "PREVIEW" },
        take: 1,
      },
    },
    orderBy: { name: "asc" },
  });

  const payload = models.map((model) => {
    const prices = model.variants
      .map((v) => v.price?.otrPrice)
      .filter(Boolean)
      .sort((a, b) => (a && b ? Number(a - b) : 0));

    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      category: model.category,
      vehicleType: model.vehicleType,
      imageUrl: model.images[0]?.url ?? null,
      startPrice: prices[0] ? prices[0].toString() : null,
    };
  });

  return NextResponse.json({
    source: "database",
    count: payload.length,
    data: payload,
  });
}
