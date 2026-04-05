import type { CarImageType } from "@prisma/client";

/** URL segment → DB image type for `/cars/[...slug]` (e.g. `/cars/fronx/eksterior`). */
export const CAR_GALLERY_ENTRIES: readonly {
  segment: string;
  imageType: CarImageType;
  label: string;
}[] = [
  { segment: "eksterior", imageType: "EKSTERIOR", label: "Eksterior" },
  { segment: "interior", imageType: "INTERIOR", label: "Interior" },
];
