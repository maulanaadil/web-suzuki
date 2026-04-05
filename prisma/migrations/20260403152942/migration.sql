/*
  Warnings:

  - You are about to alter the column `slug` on the `CarModel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `name` on the `CarModel` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- CreateEnum
CREATE TYPE "CarImageType" AS ENUM ('BANNER', 'CAROUSEL', 'INTERIOR');

-- CreateEnum
CREATE TYPE "CarCategory" AS ENUM ('SUV', 'MPV', 'CITY_CAR', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "CarVehicleType" AS ENUM ('PASSENGER', 'COMMERCIAL');

-- AlterTable
ALTER TABLE "CarModel" ADD COLUMN     "category" "CarCategory",
ADD COLUMN     "vehicleType" "CarVehicleType",
ALTER COLUMN "slug" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "CarColor" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "carVariantCode" TEXT NOT NULL,
    "colorCode" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarImage" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "type" "CarImageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "quote" VARCHAR(255) NOT NULL,
    "imageUrl" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarOrderForm" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "idCardNumber" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarOrderForm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carVariantCode_key" ON "CarColor"("carVariantCode");

-- CreateIndex
CREATE INDEX "CarColor_carModelId_idx" ON "CarColor"("carModelId");

-- CreateIndex
CREATE INDEX "CarImage_carModelId_idx" ON "CarImage"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "CarOrderForm_carModelId_key" ON "CarOrderForm"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "CarOrderForm_idCardNumber_key" ON "CarOrderForm"("idCardNumber");

-- AddForeignKey
ALTER TABLE "CarColor" ADD CONSTRAINT "CarColor_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarColor" ADD CONSTRAINT "CarColor_carVariantCode_fkey" FOREIGN KEY ("carVariantCode") REFERENCES "CarVariant"("code") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarImage" ADD CONSTRAINT "CarImage_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarOrderForm" ADD CONSTRAINT "CarOrderForm_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
