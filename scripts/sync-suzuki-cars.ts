import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { IngestionStatus, PriceSource, PrismaClient } from "@prisma/client";
import { parseOtrPriceRowsFromImage } from "../src/lib/ingestion/otr-image-source";
import { scrapeAllSuzukiModels } from "../src/lib/ingestion/suzuki-web-source";

const isDryRun = process.argv.includes("--dry-run");
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required for sync-suzuki-cars script.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: databaseUrl }),
});

async function main() {
  if (isDryRun) {
    const models = await scrapeAllSuzukiModels();
    const prices = parseOtrPriceRowsFromImage();
    console.log(
      `[sync-suzuki-cars] dry run: models=${models.length}, prices=${prices.length}, firstModel=${models[0]?.name ?? "N/A"}`,
    );
    console.log(
      "[sync-suzuki-cars] dry run samples:",
      JSON.stringify(
        {
          model: models[0]
            ? {
                slug: models[0].slug,
                name: models[0].name,
                category: models[0].category,
                vehicleType: models[0].vehicleType,
                heroImage: models[0].heroImage,
                variants: models[0].variants.slice(0, 3).map((variant) => variant.name),
                colors: models[0].colors.slice(0, 3).map((color) => color.name),
              }
            : null,
          prices: prices.slice(0, 5),
        },
        (_, value) => (typeof value === "bigint" ? value.toString() : value),
        2,
      ),
    );
    return;
  }

  const run = await prisma.dataIngestionRun.create({
    data: {
      source: "suzuki-web+otr-image",
      status: IngestionStatus.RUNNING,
      notes: "Live import mode",
    },
  });

  try {
    const models = await scrapeAllSuzukiModels();
    const prices = parseOtrPriceRowsFromImage();

    let upserted = 0;
    const modelIdBySlug = new Map<string, string>();

    for (const model of models) {
      const modelRecord = await prisma.carModel.upsert({
        where: { slug: model.slug },
        create: {
          slug: model.slug,
          name: model.name,
          tagline: model.tagline,
          category: model.category,
          vehicleType: model.vehicleType,
          heroImage: model.heroImage,
          isActive: true,
        },
        update: {
          name: model.name,
          tagline: model.tagline,
          category: model.category,
          vehicleType: model.vehicleType,
          heroImage: model.heroImage,
          isActive: true,
        },
      });

      modelIdBySlug.set(model.slug, modelRecord.id);
      upserted += 1;

      for (const [variantIndex, variant] of model.variants.entries()) {
        const variantRecord = await prisma.carVariant.upsert({
          where: {
            carModelId_name: {
              carModelId: modelRecord.id,
              name: variant.name,
            },
          },
          create: {
            carModelId: modelRecord.id,
            name: variant.name,
            transmission: variant.transmission,
            engine: variant.engine,
            drivetrain: variant.drivetrain,
            isHybrid: variant.isHybrid,
            sortOrder: variantIndex,
          },
          update: {
            transmission: variant.transmission,
            engine: variant.engine,
            drivetrain: variant.drivetrain,
            isHybrid: variant.isHybrid,
            sortOrder: variantIndex,
          },
        });

        upserted += 1;

        if (!isDryRun) {
          await prisma.carSpec.deleteMany({
            where: { carVariantId: variantRecord.id },
          });
          if (variant.specs.length > 0) {
            await prisma.carSpec.createMany({
              data: variant.specs.map((spec, specIndex) => ({
                carVariantId: variantRecord.id,
                specGroup: spec.group,
                specKey: spec.key,
                specValue: spec.value,
                sortOrder: specIndex,
              })),
            });
            upserted += variant.specs.length;
          }
        }
      }

      for (const [colorIndex, color] of model.colors.entries()) {
        await prisma.carColor.upsert({
          where: {
            carModelId_name: {
              carModelId: modelRecord.id,
              name: color.name,
            },
          },
          create: {
            carModelId: modelRecord.id,
            name: color.name,
            hexCode: color.hexCodePrimary,
            hexCodePrimary: color.hexCodePrimary,
            hexCodeSecondary: color.hexCodeSecondary,
            imageUrl: color.imageUrl,
            sortOrder: colorIndex,
          },
          update: {
            hexCode: color.hexCodePrimary,
            hexCodePrimary: color.hexCodePrimary,
            hexCodeSecondary: color.hexCodeSecondary,
            imageUrl: color.imageUrl,
            sortOrder: colorIndex,
          },
        });
        upserted += 1;
      }
    }

    if (!isDryRun) {
      await prisma.priceList.updateMany({
        where: { source: PriceSource.OTR_IMAGE, isActive: true },
        data: { isActive: false },
      });
    }

    const priceList = await prisma.priceList.create({
      data: {
        source: PriceSource.OTR_IMAGE,
        region: "Rancaekek",
        dealer: "PT. Nusantara Jaya Sentosa",
        currency: "IDR",
        notes: "OTR image update 27/2",
        isActive: !isDryRun,
      },
    });

    const variants = await prisma.carVariant.findMany({
      select: {
        id: true,
        carModelId: true,
        name: true,
      },
    });

    for (const priceRow of prices) {
      const modelId = modelIdBySlug.get(priceRow.normalizedModelKey);
      if (!modelId) continue;

      let matchedVariant = variants.find(
        (variant) =>
          variant.carModelId === modelId &&
          priceRow.variantName.toUpperCase().includes(variant.name.toUpperCase()),
      );

      if (!matchedVariant) {
        const createdVariant = await prisma.carVariant.upsert({
          where: {
            carModelId_name: {
              carModelId: modelId,
              name: priceRow.variantName,
            },
          },
          create: {
            carModelId: modelId,
            name: priceRow.variantName,
            transmission: /AT/i.test(priceRow.variantName)
              ? "AT"
              : /MT/i.test(priceRow.variantName)
                ? "MT"
                : undefined,
            isHybrid: /HYBRID|SHVS|HEV/i.test(priceRow.variantName),
            sortOrder: 999,
          },
          update: {},
          select: {
            id: true,
            carModelId: true,
            name: true,
          },
        });
        matchedVariant = createdVariant;
        variants.push(createdVariant);
      }

      await prisma.carPrice.upsert({
        where: {
          priceListId_carModelId_variantId: {
            priceListId: priceList.id,
            carModelId: modelId,
            variantId: matchedVariant.id,
          },
        },
        create: {
          priceListId: priceList.id,
          carModelId: modelId,
          variantId: matchedVariant.id,
          otrPrice: priceRow.otrPrice,
        },
        update: {
          otrPrice: priceRow.otrPrice,
        },
      });
      upserted += 1;
    }

    await prisma.dataIngestionRun.update({
      where: { id: run.id },
      data: {
        status: IngestionStatus.SUCCESS,
        endedAt: new Date(),
        recordsRead: models.length + prices.length,
        recordsUpserted: upserted,
      },
    });

    console.log(
      `[sync-suzuki-cars] done. models=${models.length} prices=${prices.length} upserted=${upserted} dryRun=${isDryRun}`,
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await prisma.dataIngestionRun.update({
      where: { id: run.id },
      data: {
        status: IngestionStatus.FAILED,
        endedAt: new Date(),
        error: message,
      },
    });
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("[sync-suzuki-cars] failed:", error);
  process.exit(1);
});
