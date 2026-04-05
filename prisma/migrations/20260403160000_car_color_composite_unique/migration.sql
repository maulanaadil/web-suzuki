-- DropIndex
DROP INDEX "CarColor_carVariantCode_key";

-- CreateIndex
CREATE UNIQUE INDEX "CarColor_carVariantCode_colorCode_key" ON "CarColor"("carVariantCode", "colorCode");
