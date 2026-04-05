-- CreateEnum
CREATE TYPE "CarDetailCarouselVariant" AS ENUM ('SAFETY', 'SECURITY', 'PERFORMANCE');

-- CreateTable
CREATE TABLE "CarDetailBanner" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "bannerVariant" "CarImageType" NOT NULL DEFAULT 'INTERIOR',
    "description" VARCHAR(255) NOT NULL,
    "buttonLabel" VARCHAR(255) NOT NULL,
    "buttonHref" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarDetailBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarDetailCarousel" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "carouselVariant" "CarImageType" NOT NULL DEFAULT 'CAROUSEL',
    "variant" "CarDetailCarouselVariant" NOT NULL DEFAULT 'SAFETY',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarDetailCarousel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarDetailCarouselContent" (
    "id" TEXT NOT NULL,
    "carDetailCarouselId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarDetailCarouselContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarDetailBanner_carModelId_key" ON "CarDetailBanner"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "CarDetailCarousel_carModelId_key" ON "CarDetailCarousel"("carModelId");

-- AddForeignKey
ALTER TABLE "CarDetailBanner" ADD CONSTRAINT "CarDetailBanner_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarDetailCarousel" ADD CONSTRAINT "CarDetailCarousel_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarDetailCarouselContent" ADD CONSTRAINT "CarDetailCarouselContent_carDetailCarouselId_fkey" FOREIGN KEY ("carDetailCarouselId") REFERENCES "CarDetailCarousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
