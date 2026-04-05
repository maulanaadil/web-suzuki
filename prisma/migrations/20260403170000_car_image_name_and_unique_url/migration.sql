-- AlterTable
ALTER TABLE "CarImage" ADD COLUMN "name" VARCHAR(255) NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "CarImage_carModelId_url_key" ON "CarImage"("carModelId", "url");
