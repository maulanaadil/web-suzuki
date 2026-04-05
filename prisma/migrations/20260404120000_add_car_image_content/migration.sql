-- CreateTable
CREATE TABLE "CarImageContent" (
    "id" TEXT NOT NULL,
    "carImageId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarImageContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CarImageContent_carImageId_key" ON "CarImageContent"("carImageId");

-- CreateIndex
CREATE INDEX "CarImageContent_carImageId_idx" ON "CarImageContent"("carImageId");

-- AddForeignKey
ALTER TABLE "CarImageContent" ADD CONSTRAINT "CarImageContent_carImageId_fkey" FOREIGN KEY ("carImageId") REFERENCES "CarImage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
