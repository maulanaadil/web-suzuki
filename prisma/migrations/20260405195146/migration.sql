-- CreateEnum
CREATE TYPE "CarColorType" AS ENUM ('PRIMARY', 'SECONDARY');

-- AlterTable
ALTER TABLE "CarColor" ADD COLUMN     "secondaryColorCode" VARCHAR(255),
ADD COLUMN     "type" "CarColorType" NOT NULL DEFAULT 'PRIMARY';
