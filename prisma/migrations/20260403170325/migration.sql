/*
  Warnings:

  - A unique constraint covering the columns `[carVariantCode]` on the table `CarColor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "CarImageType" ADD VALUE 'EKSTERIOR';

-- DropIndex
DROP INDEX "CarColor_carVariantCode_colorCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carVariantCode_key" ON "CarColor"("carVariantCode");
