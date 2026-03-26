-- CreateEnum
CREATE TYPE "CarCategory" AS ENUM ('SUV', 'MPV', 'CITY_CAR', 'COMMERCIAL', 'HATCHBACK', 'SEDAN', 'CROSSOVER', 'OTHER');

-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('PASSENGER', 'COMMERCIAL');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('OTR_IMAGE', 'SUZUKI_WEB', 'MANUAL');

-- CreateEnum
CREATE TYPE "IngestionStatus" AS ENUM ('RUNNING', 'SUCCESS', 'FAILED');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "CarModel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "category" "CarCategory",
    "vehicleType" "VehicleType",
    "heroImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarVariant" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "transmission" TEXT,
    "engine" TEXT,
    "drivetrain" TEXT,
    "isHybrid" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarColor" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hexCode" TEXT,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarColor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarSpec" (
    "id" TEXT NOT NULL,
    "carVariantId" TEXT NOT NULL,
    "specGroup" TEXT NOT NULL,
    "specKey" TEXT NOT NULL,
    "specValue" TEXT NOT NULL,
    "unit" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceList" (
    "id" TEXT NOT NULL,
    "source" "PriceSource" NOT NULL,
    "region" TEXT,
    "dealer" TEXT,
    "effectiveDate" TIMESTAMP(3),
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPrice" (
    "id" TEXT NOT NULL,
    "priceListId" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "variantId" TEXT,
    "otrPrice" BIGINT NOT NULL,
    "discount" BIGINT,
    "netPrice" BIGINT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataIngestionRun" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "IngestionStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "recordsRead" INTEGER NOT NULL DEFAULT 0,
    "recordsUpserted" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataIngestionRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_slug_key" ON "CarModel"("slug");

-- CreateIndex
CREATE INDEX "CarVariant_carModelId_idx" ON "CarVariant"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "CarVariant_carModelId_name_key" ON "CarVariant"("carModelId", "name");

-- CreateIndex
CREATE INDEX "CarColor_carModelId_idx" ON "CarColor"("carModelId");

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carModelId_name_key" ON "CarColor"("carModelId", "name");

-- CreateIndex
CREATE INDEX "CarSpec_carVariantId_idx" ON "CarSpec"("carVariantId");

-- CreateIndex
CREATE INDEX "PriceList_source_createdAt_idx" ON "PriceList"("source", "createdAt");

-- CreateIndex
CREATE INDEX "CarPrice_carModelId_idx" ON "CarPrice"("carModelId");

-- CreateIndex
CREATE INDEX "CarPrice_priceListId_idx" ON "CarPrice"("priceListId");

-- CreateIndex
CREATE INDEX "CarPrice_variantId_idx" ON "CarPrice"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "CarPrice_priceListId_carModelId_variantId_key" ON "CarPrice"("priceListId", "carModelId", "variantId");

-- AddForeignKey
ALTER TABLE "CarVariant" ADD CONSTRAINT "CarVariant_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarColor" ADD CONSTRAINT "CarColor_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpec" ADD CONSTRAINT "CarSpec_carVariantId_fkey" FOREIGN KEY ("carVariantId") REFERENCES "CarVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPrice" ADD CONSTRAINT "CarPrice_priceListId_fkey" FOREIGN KEY ("priceListId") REFERENCES "PriceList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPrice" ADD CONSTRAINT "CarPrice_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPrice" ADD CONSTRAINT "CarPrice_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "CarVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

