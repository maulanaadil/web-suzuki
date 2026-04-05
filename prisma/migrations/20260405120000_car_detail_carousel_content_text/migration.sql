-- Long carousel copy in seed exceeds VARCHAR(255)
ALTER TABLE "CarDetailCarouselContent" ALTER COLUMN "title" SET DATA TYPE TEXT;
ALTER TABLE "CarDetailCarouselContent" ALTER COLUMN "content" SET DATA TYPE TEXT;
