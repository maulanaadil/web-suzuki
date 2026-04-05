-- DropForeignKey
ALTER TABLE "CarDetailBanner" DROP CONSTRAINT "CarDetailBanner_carModelId_fkey";

-- DropForeignKey
ALTER TABLE "CarDetailCarousel" DROP CONSTRAINT "CarDetailCarousel_carModelId_fkey";

-- CreateTable
CREATE TABLE "_CarDetailBanner" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CarDetailBanner_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CarDetailCarousel" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CarDetailCarousel_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CarDetailBanner_B_index" ON "_CarDetailBanner"("B");

-- CreateIndex
CREATE INDEX "_CarDetailCarousel_B_index" ON "_CarDetailCarousel"("B");

-- AddForeignKey
ALTER TABLE "_CarDetailBanner" ADD CONSTRAINT "_CarDetailBanner_A_fkey" FOREIGN KEY ("A") REFERENCES "CarDetailBanner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarDetailBanner" ADD CONSTRAINT "_CarDetailBanner_B_fkey" FOREIGN KEY ("B") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarDetailCarousel" ADD CONSTRAINT "_CarDetailCarousel_A_fkey" FOREIGN KEY ("A") REFERENCES "CarDetailCarousel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CarDetailCarousel" ADD CONSTRAINT "_CarDetailCarousel_B_fkey" FOREIGN KEY ("B") REFERENCES "CarModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
