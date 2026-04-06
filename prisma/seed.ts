/**
 * Seed script: translates all JSON car data into the database.
 * Run with: npx tsx prisma/seed.ts
 *
 * Strategy per car:
 *  - Upsert CarModel
 *  - Upsert CarVariant for every variant code found in prices (filtered by modelCode)
 *  - Delete + recreate CarSpec for features (FEATURES) and performance (PERFORMANCE)
 *  - Upsert CarPrice per variant
 */

import {
  CarDetailCarouselVariant,
  CarImageType,
  PrismaClient,
} from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import path from "path";
import dotenv from "dotenv";
import { existsSync, readFileSync, readdirSync } from "fs";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set.");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

type JsonFeature = {
  featureName: string;
  v1?: string;
  v2?: string;
  v3?: string;
  order_index?: string | number;
};

type JsonPrice = {
  sellingPriceDetails: {
    modelCode: string;
    variantCode: string;
    landingPrice: number;
  }[];
};

type CarJson = {
  name: string;
  features: JsonFeature[];
  performance: JsonFeature[];
  prices: JsonPrice[];
};

function loadJson(file: string): CarJson {
  return JSON.parse(
    readFileSync(path.resolve(__dirname, `../src/data/cars/${file}`), "utf-8"),
  );
}

/** Normalise a feature value: treat whitespace-only / undefined as "-" */
function normaliseValue(v: string | undefined): string {
  if (!v) return "-";
  const t = v.trim();
  if (t === "" || t === "                -") return "-";
  // Convert checkmark symbol to "Tersedia" for consistency
  if (t === "✓") return "Tersedia";
  return t;
}

/** Extract unique (variantCode → price) from the prices array, filtered by modelCode */
function extractPrices(
  prices: JsonPrice[],
  modelCodeFilter: string,
): Map<string, number> {
  const map = new Map<string, number>();
  for (const entry of prices) {
    for (const detail of entry.sellingPriceDetails) {
      if (
        detail.modelCode === modelCodeFilter &&
        !map.has(detail.variantCode)
      ) {
        map.set(detail.variantCode, detail.landingPrice);
      }
    }
  }
  return map;
}

/* ─────────────────────────────────────────────
   Car definitions
───────────────────────────────────────────── */

type VariantCols = { v1?: string; v2?: string; v3?: string };

type CarDef = {
  slug: string;
  file: string;
  /** Maps v1/v2/v3 column keys to the primary variantCode for specs */
  variantCols: VariantCols;
  /** Full name label per variant code */
  variantNames: Record<string, string>;
  /** Filter prices array to only this modelCode */
  modelCodeFilter: string;
  /** Which cols exist in the features/performance arrays */
  cols: ("v1" | "v2" | "v3")[];
};

const CARS: CarDef[] = [
  /* ── Fronx ─────────────────────────────── */
  {
    slug: "fronx",
    file: "fronx.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "A3L415FM01SXATS",
      v2: "A3L415FM00SXATS",
      v3: "A3L415FM00GXATS",
    },
    variantNames: {
      A3L415FM01SXATS: "FRONX SGX 2Tone A/T",
      A3L415FM00SXATS: "FRONX SGX A/T",
      A3L415FM00GXATS: "FRONX GX A/T",
      A3L415FM00GXMTS: "FRONX GX M/T",
      A3L415FM00GLATS: "FRONX GL A/T",
      A3L415FM00GLMTS: "FRONX GL M/T",
    },
    modelCodeFilter: "FRONX",
  },

  /* ── APV ────────────────────────────────── */
  {
    slug: "apv",
    file: "apv.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "GC415V.M72SXMTP",
      v2: "GC415V.M71GXMTP",
      v3: "GC415V.M71GLMTP",
    },
    variantNames: {
      "GC415V.M72SXMTP": "APV SGX M/T",
      "GC415V.M71GXMTP": "APV GX M/T",
      "GC415V.M71GLMTP": "APV GL M/T",
      "GC415V.M71GEMTP": "APV GE M/T",
      "GC415V.M71BVMTP": "APV Blind Van M/T",
    },
    modelCodeFilter: "APV",
  },

  /* ── e-Vitara ───────────────────────────── */
  {
    slug: "evitara",
    file: "e-vitara.json",
    cols: ["v1", "v2"],
    variantCols: {
      v1: "8IE1X0000001ATT",
      v2: "8IE1X0000000ATT",
    },
    variantNames: {
      "8IE1X0000001ATT": "e VITARA Two Tone",
      "8IE1X0000000ATT": "e VITARA Single Tone",
    },
    modelCodeFilter: "E-VITARA",
  },

  /* ── Grand Vitara ───────────────────────── */
  {
    slug: "grand-vitara",
    file: "grand-vitara.json",
    cols: ["v1", "v2"],
    variantCols: {
      v1: "PQ5FX00012GXATS",
      v2: "PQ5FX00002GXATS",
    },
    variantNames: {
      PQ5FX00012GXATS: "Grand Vitara GX 2Tone A/T",
      PQ5FX00002GXATS: "Grand Vitara GX A/T",
    },
    modelCodeFilter: "GRAND-VITARA",
  },

  /* ── All New Ertiga ─────────────────────── */
  {
    slug: "all-new-ertiga",
    file: "all-new-ertiga.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "ARK415FM19SSATR",
      v2: "ARK415FM19SSMTR",
      v3: "ARK415FM09SSATR",
    },
    variantNames: {
      ARK415FM19SSATR: "Ertiga CRUISE Hybrid A/T 2Tone",
      ARK415FM19SSMTR: "Ertiga CRUISE Hybrid M/T 2Tone",
      ARK415FM09SSATR: "Ertiga CRUISE Hybrid A/T",
      ARK415FM09SSMTR: "Ertiga CRUISE Hybrid M/T",
      ARK415FM06GXATR: "Ertiga GX A/T",
      ARK415FM06GXMTR: "Ertiga GX M/T",
      ARK415FM05GLATP: "Ertiga GL A/T",
      ARK415FM05GLMTP: "Ertiga GL M/T",
    },
    modelCodeFilter: "ALL-NEW-ERTIGA-06",
  },

  /* ── Espresso ───────────────────────────── */
  {
    slug: "espresso",
    file: "espresso.json",
    cols: ["v1", "v2"],
    variantCols: {
      v1: "BU4FL0000001ATP",
      v2: "BU4FL0000001MTP",
    },
    variantNames: {
      BU4FL0000001ATP: "Espresso AGS",
      BU4FL0000001MTP: "Espresso M/T",
      BU4FL0000001ATR: "Espresso AGS",
      BU4FL0000001MTR: "Espresso M/T",
    },
    modelCodeFilter: "S-PRESSO-02",
  },

  /* ── Jimny ──────────────────────────────── */
  {
    slug: "jimny",
    file: "jimny.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "6N415VX00013ATR",
      v2: "6N415VX00012ATR",
      v3: "6N415VX00012MTR",
    },
    variantNames: {
      "6N415VX00013ATR": "Jimny 5-Door White Rhino A/T",
      "6N415VX00012ATR": "Jimny 5-Door 2Tone A/T",
      "6N415VX00012MTR": "Jimny 5-Door 2Tone M/T",
      "6N415VX00011ATR": "Jimny 5-Door A/T",
      "6N415VX00011MTR": "Jimny 5-Door M/T",
      "6G415VX00002ATP": "Jimny 3-Door 2Tone A/T",
      "6G415VX00002MTP": "Jimny 3-Door 2Tone M/T",
      "6G415VX00001ATP": "Jimny 3-Door A/T",
      "6G415VX00001MTP": "Jimny 3-Door M/T",
    },
    modelCodeFilter: "NEW-JIMNY-FE",
  },

  /* ── New XL7 ────────────────────────────── */
  {
    slug: "new-xl7",
    file: "new-xl7.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "XL7415F.54HBATS",
      v2: "XL7415F.44HBATS",
      v3: "XL7415F.34GSATR",
    },
    variantNames: {
      "XL7415F.54HBATS": "XL7 Alpha Kuro 2Tone A/T Hybrid",
      "XL7415F.44HBATS": "XL7 Alpha Kuro A/T Hybrid",
      "XL7415F.34GSATR": "XL7 Alpha 2Tone A/T",
      "XL7415F.34GSMTR": "XL7 Alpha 2Tone M/T",
      "XL7415F.24GSATP": "XL7 Alpha A/T",
      "XL7415F.24GSMTP": "XL7 Alpha M/T",
      "XL7415F.24GXATP": "XL7 Beta A/T",
      "XL7415F.24GXMTP": "XL7 Beta M/T",
      "XL7415F.24GLATP": "XL7 Zeta A/T",
      "XL7415F.24GLMTP": "XL7 Zeta M/T",
    },
    modelCodeFilter: "XL-7-03",
  },

  /* ── New Carry Pick Up ─────────────────── */
  {
    slug: "new-carry-pick-up",
    file: "new-carry-pick-up.json",
    cols: ["v1", "v2", "v3"],
    variantCols: {
      v1: "AEV415W.44WDMTP",
      v2: "AEV415P.34FDMTP",
      v3: "AEV415W.34WDMTP",
    },
    variantNames: {
      "AEV415W.44WDMTP": "New Carry WD AC/PS",
      "AEV415P.34FDMTP": "New Carry FD",
      "AEV415W.34WDMTP": "New Carry WD",
      "AEV415P.44FDMTP": "New Carry FD AC/PS",
    },
    modelCodeFilter: "NEW-CARRY-03",
  },
];

/* ─────────────────────────────────────────────
   Main seed function
───────────────────────────────────────────── */

async function seedCar(car: CarDef) {
  const json = loadJson(car.file);
  const prices = extractPrices(json.prices, car.modelCodeFilter);

  console.log(`\n▶ ${car.slug} — ${prices.size} variant(s) found in prices`);

  // 1. Upsert CarModel
  const model = await prisma.carModel.upsert({
    where: { slug: car.slug },
    update: { name: json.name },
    create: { slug: car.slug, name: json.name },
  });
  console.log(`  ✓ CarModel: ${model.id}`);

  // 2. Upsert CarVariant for every variant code in prices
  const variantIdByCode = new Map<string, string>();
  let sortOrder = 0;
  for (const [code] of prices) {
    const name = car.variantNames[code] ?? code;
    const variant = await prisma.carVariant.upsert({
      where: { code },
      update: { name, sortOrder, carModelId: model.id },
      create: { carModelId: model.id, code, name, sortOrder },
    });
    variantIdByCode.set(code, variant.id);
    sortOrder++;
  }
  console.log(`  ✓ CarVariants upserted: ${variantIdByCode.size}`);

  // 3. Upsert CarSpec — delete all existing specs for spec variants, then recreate
  const specVariantCodes = Object.values(car.variantCols).filter(
    Boolean,
  ) as string[];
  for (const code of specVariantCodes) {
    const variantId = variantIdByCode.get(code);
    if (!variantId) continue;
    // Delete old specs
    await prisma.carSpec.deleteMany({ where: { carVariantId: variantId } });
  }

  // Insert features → KEY_FEATURES
  let specSort = 0;
  for (const feature of json.features) {
    for (const col of car.cols) {
      const code = car.variantCols[col];
      if (!code) continue;
      const variantId = variantIdByCode.get(code);
      if (!variantId) continue;
      await prisma.carSpec.create({
        data: {
          carVariantId: variantId,
          group: "FEATURES",
          key: feature.featureName.trim(),
          value: normaliseValue(feature[col]),
          sortOrder: specSort,
        },
      });
    }
    specSort++;
  }

  // Insert performance → PERFORMANCE
  specSort = 0;
  for (const spec of json.performance) {
    for (const col of car.cols) {
      const code = car.variantCols[col];
      if (!code) continue;
      const variantId = variantIdByCode.get(code);
      if (!variantId) continue;
      await prisma.carSpec.create({
        data: {
          carVariantId: variantId,
          group: "PERFORMANCE",
          key: spec.featureName.trim(),
          value: normaliseValue(spec[col]),
          sortOrder: specSort,
        },
      });
    }
    specSort++;
  }
  console.log(`  ✓ CarSpecs created (features + performance)`);

  // 4. Upsert CarPrices
  for (const [code, price] of prices) {
    const variantId = variantIdByCode.get(code);
    await prisma.carPrice.upsert({
      where: { carVariantId: variantId ?? "" },
      update: { otrPrice: BigInt(price) },
      create: { carVariantId: variantId ?? "", otrPrice: BigInt(price) },
    });
  }
  console.log(`  ✓ CarPrices upserted: ${prices.size}`);
}

const FRONX_VARIANT_CODES = ["8IE1X0000000ATT"];
const FRONX_COLOR_CODES = ["WB3"];

async function seedColor() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "evitara" },
    include: { variants: true },
  });

  if (!model) throw new Error('CarModel "evitara" not found');

  const codesOnModel = new Set(model.variants.map((v) => v.code));
  const missing = FRONX_VARIANT_CODES.filter((c) => !codesOnModel.has(c));
  if (missing.length > 0) {
    throw new Error(
      `Fronx variants missing in DB: ${missing.join(", ")} (have: ${[...codesOnModel].join(", ") || "none"})`,
    );
  }

  let upserted = 0;
  for (const variantCode of FRONX_VARIANT_CODES) {
    for (const colorCode of FRONX_COLOR_CODES) {
      await prisma.carColor.upsert({
        where: {
          carVariantCode_colorCode: { carVariantCode: variantCode, colorCode },
        },
        create: {
          carModelId: model.id,
          carVariantCode: variantCode,
          colorCode,
        },
        update: {},
      });
      upserted += 1;
    }
  }

  console.log(
    `  ✓ CarColors upserted for fronx (${upserted} rows): variants ${FRONX_VARIANT_CODES.join(", ")} × colors ${FRONX_COLOR_CODES.join(", ")}`,
  );
}

const IMAGE_FILE_RE = /\.(webp|jpe?g|png|gif|avif|svg)$/i;

function folderToCarImageType(folder: string) {
  switch (folder.toLowerCase()) {
    case "banner":
      return CarImageType.BANNER;
    case "carousel":
      return CarImageType.CAROUSEL;
    case "interior":
      return CarImageType.INTERIOR;
    case "preview":
      return CarImageType.PREVIEW;
    case "eksterior":
      return CarImageType.EKSTERIOR;
    default:
      throw new Error(
        `Unknown image subfolder "${folder}" under public/images/<model>/ (use banner, carousel, interior, or preview)`,
      );
  }
}

function collectImageFiles(absDir: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      if (ent.name.startsWith(".")) continue;
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(full);
      else if (IMAGE_FILE_RE.test(ent.name)) out.push(full);
    }
  };
  walk(absDir);
  return out;
}

/** Match CarModel by folder slug (e.g. fronx) or name containing that slug. */
async function carModelIdForImageFolder(modelFolder: string): Promise<string> {
  const slug = modelFolder.toLowerCase();
  const model = await prisma.carModel.findFirst({
    where: {
      OR: [
        { slug },
        { slug: { equals: modelFolder, mode: "insensitive" } },
        { name: { contains: slug, mode: "insensitive" } },
      ],
    },
  });
  if (!model) {
    throw new Error(
      `CarModel not found for images folder "${modelFolder}" (expected slug "${slug}" or name containing it)`,
    );
  }
  return model.id;
}

/**
 * Seeds CarImage rows from public/images/<modelSlug>/<typeDir>/...
 * `typeDir` maps to CarImageType (banner, carousel, interior, preview).
 * `url` is the public path (e.g. /images/fronx/carousel/feature.webp).
 */
async function seedImage(modelSlugFolder = "evitara") {
  const publicDir = path.join(process.cwd(), "public");
  const modelRoot = path.join(publicDir, "images", modelSlugFolder);

  if (!existsSync(modelRoot)) {
    console.warn(
      `  ⚠ Skipping CarImage seed: missing ${path.relative(process.cwd(), modelRoot)}`,
    );
    return;
  }

  const carModelId = await carModelIdForImageFolder(modelSlugFolder);
  const files = collectImageFiles(modelRoot);
  let upserted = 0;

  for (const absPath of files) {
    const relFromPublic = path.relative(publicDir, absPath);
    const segments = relFromPublic.split(path.sep);

    if (segments.length < 4 || segments[0] !== "images") {
      console.warn(
        `  ⚠ Skipping CarImage (need images/<model>/<type>/file): ${relFromPublic}`,
      );
      continue;
    }

    const modelDir = segments[1];
    const typeDir = segments[2];
    if (modelDir.toLowerCase() !== modelSlugFolder.toLowerCase()) continue;

    const url = `/${segments.join("/")}`;
    const type = folderToCarImageType(typeDir);

    await prisma.carImage.upsert({
      where: { carModelId_url: { carModelId, url } },
      create: { carModelId, url, type },
      update: { type },
    });
    upserted += 1;
  }

  console.log(
    `  ✓ CarImages upserted for ${modelSlugFolder} (${upserted} files from public/images/${modelSlugFolder}/)`,
  );
}

type ImageContentEntry = {
  imageFile: string;
  title: string;
  content: string;
};

type ImageContentJson = {
  interior: ImageContentEntry[];
  eksterior: ImageContentEntry[];
};

/**
 * Seeds CarImageContent rows by matching imageFile from the JSON
 * to existing CarImage records via their URL path.
 */
async function seedImageContent(modelSlug = "fronx") {
  const jsonPath = path.resolve(
    __dirname,
    `../src/data/image-contents/${modelSlug}.json`,
  );
  if (!existsSync(jsonPath)) {
    console.warn(`  ⚠ Skipping CarImageContent: missing ${jsonPath}`);
    return;
  }

  const data: ImageContentJson = JSON.parse(readFileSync(jsonPath, "utf-8"));
  let upserted = 0;

  for (const [typeDir, entries] of Object.entries(data)) {
    for (const entry of entries as ImageContentEntry[]) {
      // Build the URL path that matches CarImage.url
      const url = `/images/${modelSlug}/${typeDir}/${entry.imageFile}`;

      const carImage = await prisma.carImage.findFirst({
        where: { url },
      });

      if (!carImage) {
        console.warn(
          `  ⚠ CarImage not found for url "${url}", skipping content "${entry.title}"`,
        );
        continue;
      }

      await prisma.carImageContent.upsert({
        where: { carImageId: carImage.id },
        create: {
          carImageId: carImage.id,
          title: entry.title,
          content: entry.content,
        },
        update: {
          title: entry.title,
          content: entry.content,
        },
      });
      upserted += 1;
    }
  }

  console.log(
    `  ✓ CarImageContent upserted for ${modelSlug} (${upserted} entries)`,
  );
}

async function seedDetailBanner() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "evitara" },
  });

  if (!model) throw new Error('CarModel "fronx" not found');

  await prisma.carDetailBanner.create({
    data: {
      carModelId: model.id,
      title: "Premium Comfort with Advanced Technology",
      description: "Utility, refined for Maximum Ease",
      buttonLabel: "Jelajahi Interior",
      buttonHref: "/cars/evitara/interior",
      bannerVariant: CarImageType.INTERIOR,
      imageUrl: "/images/evitara/banner/interior-banner.webp",
    },
  });
  console.log(`  ✓ CarDetailBanner upserted for ${model.name}`);
}

async function seedDetailCarousel() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "evitara" },
  });

  if (!model) throw new Error('CarModel "evitara" not found');

  // Idempotent: re-run safe — CarDetailCarouselContent cascades on delete
  const deleted = await prisma.carDetailCarousel.deleteMany({
    where: { carModelId: model.id },
  });
  if (deleted.count > 0) {
    console.log(
      `  ↺ Removed ${deleted.count} existing CarDetailCarousel row(s) for evitara`,
    );
  }

  const carouselSecurity = await prisma.carDetailCarousel.create({
    data: {
      carModelId: model.id,
      variant: CarDetailCarouselVariant.SECURITY,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });
  const carouselSafety = await prisma.carDetailCarousel.create({
    data: {
      carModelId: model.id,
      variant: CarDetailCarouselVariant.SAFETY,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  const carouselPerformance = await prisma.carDetailCarousel.create({
    data: {
      carModelId: model.id,
      variant: CarDetailCarouselVariant.PERFORMANCE,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  await prisma.carDetailCarouselContent.createMany({
    data: [
      {
        title: "Suzuki Safety Support",
        content:
          "A cabin that prioritizes safety with dual front, side and curtain airbags for all passengers.",
        imageUrl: "/images/evitara/carousel/suzuki-safety-support.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Adaptive Cruise Control (ACC)",
        content:
          "ACC helps reduce driver fatigue on long trips and when driving in traffic. The system uses millimetre-wave radar and a monocular camera to measure the distance to the vehicle ahead, accelerating or decelerating as needed to maintain the distance you have set. (You can choose from four distance settings.) If the road ahead is clear, it will maintain the speed at which you were travelling when you engaged the system. ACC can be linked to the traffic sign recognition system through the driver customisation setting. ACC set speed will be adjusted based on the posted speed limit.",
        imageUrl: "/images/evitara/carousel/adaptive-cruise-control.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Adaptive High Beam System (AHS)",
        content:
          "AHS uses millimetre-wave radar and the monocular camera to detect the brightness of the surrounding area and the lights of other vehicles, and adjusts the brightness and illumination range of the headlamps as needed. It also adjusts high beam brightness and illumination angle according to vehicle speed, and switches to low beam in well-lit areas.",
        imageUrl: "/images/evitara/carousel/ahs.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Blind Spot Monitor (BSM)",
        content:
          "BSM uses millimetre-wave radar sensors in the rear bumper to detect vehicles located in or approaching either rear blind spot. When a vehicle is detected, a warning icon appears in the corresponding door mirror. If you activate the turn signal on that side, the icon flashes and an audio warning sounds. Approaching vehicle detection area.",
        imageUrl: "/images/evitara/carousel/bms.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Dual Sensor Brake Support II (DSBS II)",
        content:
          "The system employs millimetre-wave radar sensors and a monocular camera to detect vehicles, motorcycle pedestrians and bicycles (daytime only) ahead of the e VITARA. Audio and visual warnings are issued to alert you if the possibility of a collision arises. If you respond with insufficient brake force, brake assist automatically engages to help slow the vehicle. And if the probability of a collision increases, brake force is applied automatically to help reduce impact force and mitigate damage.",
        imageUrl: "/images/evitara/carousel/dsbs-2.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Lane Departure Prevention (LDP)",
        content:
          "LDP detects the lane demarcation lines and predicts your path of travel as you drive. If you begin to drift due to inattention, the system alerts you by vibrating the steering wheel or sounding an audio alert. And if you fail to respond or correct, it provides steering assistance to help return your e VITARA to the centre of the lane.",
        imageUrl: "/images/evitara/carousel/ldp.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Lane Keep Assist (LKA)",
        content:
          "When you have adaptive cruise control activated, LKA helps you keep the e VITARA in the centre of the lane in which you are travelling. And if it senses that you are drawing too close to an adjacent vehicle or other obstacle, LKA provides steering assistance to help maintain a safe distance.",
        imageUrl: "/images/evitara/carousel/lka.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Multiple Collision Braking",
        content:
          "When the brake system receives a signal from the airbag that a collision has occurred, it automatically activates the brakes and brake lamps to alert nearby vehicles and help prevent a secondary collision.",
        imageUrl: "/images/evitara/carousel/multiple-collison-braking.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Rear Cross Traffic Alert (RCTA)",
        content:
          "RCTA is a supplementary safety feature that uses blind spot monitor to detect and warn of vehicles approaching from the left or right when backing out of a parking space or other location.",
        imageUrl: "/images/evitara/carousel/rear-cross-traffic-alert.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Integrated Display Sistem",
        content:
          "The Integrated Display System brings essential vehicle functions together in one central display. It is designed to make daily operation simpler by allowing the driver to access comfort settings, vehicle information, and electric system controls through a clear and easy-to-use interface.",
        imageUrl: "/images/evitara/carousel/integrated-display-sistem.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
      {
        title: "Air Conditioner Control",
        content:
          "Air conditioning settings are operated directly from the display, enabling adjustment of temperature, airflow direction, and fan speed. The on-screen airflow visualisation helps the driver understand how air is distributed throughout the cabin for balanced and comfortable cooling",
        imageUrl: "/images/evitara/carousel/ac-control.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
      {
        title: "EV Setting",
        content:
          "The EV Setting screen provides access to key electric vehicle functions, including charging current adjustment, scheduled charging, and traction battery temperature information. These features support efficient charging management and help maintain optimal battery conditions",
        imageUrl: "/images/evitara/carousel/ev-setting.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
      {
        title: "Display Customisation",
        content:
          "Display Customisation allows the driver to configure how information is shown on the screen. Different functions such as climate control, media, and vehicle status can be displayed according to preference, making important information easier to view while driving.",
        imageUrl: "/images/evitara/carousel/display-custom.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
    ],
  });

  console.log(
    `  ✓ CarDetailCarousel + content seeded for evitara (${carouselSecurity.variant} / ${carouselSafety.variant} / ${carouselPerformance.variant})`,
  );
}

async function main() {
  console.log("🌱 Starting seed...\n");
  // for (const car of CARS) {
  //   await seedCar(car);
  // }

  // await seedColor();
  // await seedImage("evitara");
  // await seedImageContent("evitara");
  // await seedImageContent("fronx");
  // await seedDetailBanner();
  // await seedDetailCarousel();

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
