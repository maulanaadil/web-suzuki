-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "CarModel" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarVariant" (
    "id" TEXT NOT NULL,
    "carModelId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarSpec" (
    "id" TEXT NOT NULL,
    "carVariantId" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarSpec_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarPrice" (
    "id" TEXT NOT NULL,
    "carVariantId" TEXT NOT NULL,
    "otrPrice" BIGINT NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'IDR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarPrice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarModel_slug_key" ON "CarModel"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CarVariant_code_key" ON "CarVariant"("code");

-- CreateIndex
CREATE INDEX "CarVariant_carModelId_idx" ON "CarVariant"("carModelId");

-- CreateIndex
CREATE INDEX "CarSpec_carVariantId_idx" ON "CarSpec"("carVariantId");

-- CreateIndex
CREATE UNIQUE INDEX "CarPrice_carVariantId_key" ON "CarPrice"("carVariantId");

-- AddForeignKey
ALTER TABLE "CarVariant" ADD CONSTRAINT "CarVariant_carModelId_fkey" FOREIGN KEY ("carModelId") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarSpec" ADD CONSTRAINT "CarSpec_carVariantId_fkey" FOREIGN KEY ("carVariantId") REFERENCES "CarVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CarPrice" ADD CONSTRAINT "CarPrice_carVariantId_fkey" FOREIGN KEY ("carVariantId") REFERENCES "CarVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
