import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const model = await prisma.carModel.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { sortOrder: "asc" },
        include: {
          specs: {
            orderBy: [{ group: "asc" }, { sortOrder: "asc" }],
          },
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

  if (!model) {
    return NextResponse.json({ message: "Car not found" }, { status: 404 });
  }

  const prices = model.variants
    .map((v) => v.price?.otrPrice)
    .filter(Boolean)
    .sort((a, b) => (a && b ? Number(a - b) : 0));

  const heroImage =
    model.images.find((img) => img.type === "BANNER")?.url ?? null;

  const payload = {
    id: model.id,
    slug: model.slug,
    name: model.name,
    category: model.category,
    vehicleType: model.vehicleType,
    heroImage,
    startPrice: prices[0] ? prices[0].toString() : null,
    colors: model.colors.map((c) => ({
      id: c.id,
      variantCode: c.carVariantCode,
      colorCode: c.colorCode,
    })),
    images: model.images.map((img) => ({
      id: img.id,
      url: img.url,
      type: img.type,
      content: img.contents
        ? { title: img.contents.title, content: img.contents.content }
        : null,
    })),
    variants: model.variants.map((variant) => ({
      id: variant.id,
      code: variant.code,
      name: variant.name,
      price: variant.price?.otrPrice?.toString() ?? null,
      specs: variant.specs.map((spec) => ({
        id: spec.id,
        group: spec.group,
        key: spec.key,
        value: spec.value,
      })),
    })),
  };

  return NextResponse.json(payload);
}
