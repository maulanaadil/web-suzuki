-- Migrate CarColorType: PRIMARY|SECONDARY -> ONE_TONE|SECONDARY without losing rows.
-- The previous approach failed because existing PRIMARY values could not cast to the new enum.

-- Nullable column; safe for existing rows
ALTER TABLE "CarColor" ADD COLUMN IF NOT EXISTS "primaryColorCode" VARCHAR(255);

-- Move off the old enum so we can remap values and replace the type
ALTER TABLE "CarColor" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "CarColor" ALTER COLUMN "type" TYPE TEXT USING ("type"::text);

UPDATE "CarColor" SET "type" = 'ONE_TONE' WHERE "type" = 'PRIMARY';

DROP TYPE "CarColorType";

CREATE TYPE "CarColorType" AS ENUM ('ONE_TONE', 'SECONDARY');

ALTER TABLE "CarColor"
  ALTER COLUMN "type" TYPE "CarColorType" USING ("type"::"CarColorType");

ALTER TABLE "CarColor" ALTER COLUMN "type" SET DEFAULT 'ONE_TONE'::"CarColorType";
ALTER TABLE "CarColor" ALTER COLUMN "type" SET NOT NULL;
