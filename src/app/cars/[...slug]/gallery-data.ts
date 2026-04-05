import type { CarImageType } from "@prisma/client";

import { prisma } from "../../../lib/prisma";
import type { GalleryImage } from "./gallery-grid";

export async function getGalleryBySlugAndImageType(
  slug: string,
  imageType: CarImageType,
): Promise<{ name: string; slug: string; images: GalleryImage[] } | null> {
  const model = await prisma.carModel.findUnique({
    where: { slug },
    include: {
      images: {
        include: { contents: true },
      },
    },
  });

  if (!model) return null;

  const images = model.images
    .filter((img) => img.type === imageType)
    .map((img) => ({
      url: img.url,
      title: img.contents?.title ?? null,
      content: img.contents?.content ?? null,
    }));

  return {
    name: model.name,
    slug: model.slug,
    images,
  };
}
