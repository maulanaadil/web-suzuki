import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({
    include: {
      carModel: {
        select: {
          name: true,
          slug: true,
          images: {
            where: { type: "PREVIEW" },
            take: 1,
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const data = testimonials.map((t) => ({
    id: t.id,
    name: t.name,
    quote: t.quote,
    imageUrl: t.imageUrl,
    car: {
      name: t.carModel.name,
      slug: t.carModel.slug,
      imageUrl: t.carModel.images[0]?.url ?? null,
    },
  }));

  return NextResponse.json({ data });
}
