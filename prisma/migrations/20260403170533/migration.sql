/*
  Warnings:

  - A unique constraint covering the columns `[carVariantCode,colorCode]` on the table `CarColor` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CarColor_carVariantCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carVariantCode_colorCode_key" ON "CarColor"("carVariantCode", "colorCode");
