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
  CarColorType,
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

const GRAND_VITARA_VARIANT_CODES = ["PQ5FX00012GXATS", "PQ5FX00002GXATS"];
const GRAND_VITARA_COLOR_CODES = [
  {
    code: "ERD",
    name: "PRIME SPLENDID SILVER + BLACK",
    primaryColorCode: "d7d7d6",
    secondaryColorCode: "000000",
    type: CarColorType.SECONDARY,
  },
  {
    code: "C9J",
    name: "PEARL ARCTIC WHITE + BLACK",
    primaryColorCode: "e9e9ea",
    secondaryColorCode: "000000",
    type: CarColorType.SECONDARY,
  },
  {
    code: "ZAM",
    name: "PEARL MIDNIGHT BLACK",
    primaryColorCode: "041322",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZQD",
    name: "PEARL CAVE BLACK",
    primaryColorCode: "524d44",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
];

const ESPRESSO_VARIANT_CODES = ["BU4FL0000001ATP", "BU4FL0000001MTP"];
const ESPRESSO_COLOR_CODES = [
  {
    code: "ZZT",
    name: "PEARL WHITE",
    primaryColorCode: "e4e5e7",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "Z2S",
    name: "SILVER METALLIC",
    primaryColorCode: "CFD0D4",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "Z4Q",
    name: "GRAPHITE GREY METALLIC",
    primaryColorCode: "838384",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "26U",
    name: "BURGUNDY RED",
    primaryColorCode: "761842",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZTN",
    name: "COOL BLACK METALLIC",
    primaryColorCode: "000000",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
];

const FRONX_VARIANT_CODES = ["6G415VX00001ATP"];
const FRONX_COLOR_CODES = [
  {
    code: "Z2S",
    name: "METALLIC SILKY SILVER",
    primaryColorCode: "999",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZJ3",
    name: "PEARL BLUISH BLACK 3",
    primaryColorCode: "141414",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZVL",
    name: "MEDIUM GRAY",
    primaryColorCode: "5A5856",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZVR",
    name: "PEARL PURE WHITE",
    primaryColorCode: "FFFFFF",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
  {
    code: "ZZC",
    name: "JUNGLE GREEN",
    primaryColorCode: "3D4238",
    secondaryColorCode: null,
    type: CarColorType.ONE_TONE,
  },
];

async function seedColor() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "jimny" },
    include: { variants: true },
  });

  if (!model) throw new Error('CarModel "apv" not found');

  const codesOnModel = new Set(model.variants.map((v) => v.code));
  const missing = FRONX_VARIANT_CODES.filter((c) => !codesOnModel.has(c));
  if (missing.length > 0) {
    throw new Error(
      `apv variants missing in DB: ${missing.join(", ")} (have: ${[...codesOnModel].join(", ") || "none"})`,
    );
  }

  let upserted = 0;
  for (const variantCode of FRONX_VARIANT_CODES) {
    for (const colorCode of FRONX_COLOR_CODES) {
      await prisma.carColor.upsert({
        where: {
          carVariantCode_colorCode: {
            carVariantCode: variantCode,
            colorCode: colorCode.code,
          },
        },
        create: {
          carModelId: model.id,
          carVariantCode: variantCode,
          colorCode: colorCode.code,
          name: colorCode.name,
          primaryColorCode: colorCode.primaryColorCode,
          secondaryColorCode: colorCode.secondaryColorCode,
          type: colorCode.type,
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

async function seedGrandVitaraColor() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "grand-vitara" },
    include: { variants: true },
  });

  if (!model) throw new Error('CarModel "grand-vitara" not found');

  const codesOnModel = new Set(model.variants.map((v) => v.code));
  const missing = GRAND_VITARA_VARIANT_CODES.filter(
    (c) => !codesOnModel.has(c),
  );
  if (missing.length > 0) {
    throw new Error(
      `grand-vitara variants missing in DB: ${missing.join(", ")} (have: ${[...codesOnModel].join(", ") || "none"})`,
    );
  }

  let upserted = 0;
  for (const variantCode of GRAND_VITARA_VARIANT_CODES) {
    for (const colorCode of GRAND_VITARA_COLOR_CODES) {
      await prisma.carColor.upsert({
        where: {
          carVariantCode_colorCode: {
            carVariantCode: variantCode,
            colorCode: colorCode.code,
          },
        },
        create: {
          carModelId: model.id,
          carVariantCode: variantCode,
          colorCode: colorCode.code,
          name: colorCode.name,
          primaryColorCode: colorCode.primaryColorCode,
          secondaryColorCode: colorCode.secondaryColorCode,
          type: colorCode.type,
        },
        update: {},
      });
      upserted += 1;
    }
  }

  console.log(
    `  ✓ CarColors upserted for grand-vitara (${upserted} rows): variants ${GRAND_VITARA_VARIANT_CODES.join(", ")} × colors ${GRAND_VITARA_COLOR_CODES.map((c) => c.code).join(", ")}`,
  );
}

async function seedEspressoColor() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "espresso" },
    include: { variants: true },
  });

  if (!model) throw new Error('CarModel "espresso" not found');

  const codesOnModel = new Set(model.variants.map((v) => v.code));
  const missing = ESPRESSO_VARIANT_CODES.filter((c) => !codesOnModel.has(c));
  if (missing.length > 0) {
    throw new Error(
      `espresso variants missing in DB: ${missing.join(", ")} (have: ${[...codesOnModel].join(", ") || "none"})`,
    );
  }

  let upserted = 0;
  for (const variantCode of ESPRESSO_VARIANT_CODES) {
    for (const colorCode of ESPRESSO_COLOR_CODES) {
      await prisma.carColor.upsert({
        where: {
          carVariantCode_colorCode: {
            carVariantCode: variantCode,
            colorCode: colorCode.code,
          },
        },
        create: {
          carModelId: model.id,
          carVariantCode: variantCode,
          colorCode: colorCode.code,
          name: colorCode.name,
          primaryColorCode: colorCode.primaryColorCode,
          secondaryColorCode: colorCode.secondaryColorCode,
          type: colorCode.type,
        },
        update: {},
      });
      upserted += 1;
    }
  }

  console.log(
    `  ✓ CarColors upserted for espresso (${upserted} rows): variants ${ESPRESSO_VARIANT_CODES.join(", ")} × colors ${ESPRESSO_COLOR_CODES.map((c) => c.code).join(", ")}`,
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
    where: { slug: "grand-vitara" },
  });

  if (!model) throw new Error('CarModel "grand-vitara" not found');

  await prisma.carDetailBanner.create({
    data: {
      carModelId: model.id,
      title: "Elegance in Motion",
      description:
        "Premium finishes, advanced features, and thoughtful seat design can enhance the soothing atmosphere in the cabin.",
      buttonLabel: "Explore Interior",
      buttonHref: "/cars/grand-vitara/interior",
      bannerVariant: CarImageType.INTERIOR,
      imageUrl: "/images/grand-vitara/banner/interior-banner.webp",
    },
  });
  console.log(`  ✓ CarDetailBanner upserted for ${model.name}`);
}

async function seedDetailCarousel() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "jimny" },
  });

  if (!model) throw new Error('CarModel "apv" not found');

  // Idempotent: re-run safe — CarDetailCarouselContent cascades on delete
  // const deleted = await prisma.carDetailCarousel.deleteMany({
  //   where: { carModelId: model.id },
  // });
  // if (deleted.count > 0) {
  //   console.log(
  //     `  ↺ Removed ${deleted.count} existing CarDetailCarousel row(s) for apv`,
  //   );
  // }

  // const carouselSecurity = await prisma.carDetailCarousel.create({
  //   data: {
  //     carModelId: model.id,
  //     variant: CarDetailCarouselVariant.SECURITY,
  //     carouselVariant: CarImageType.CAROUSEL,
  //   },
  // });
  // const carouselSafety = await prisma.carDetailCarousel.create({
  //   data: {
  //     carModelId: model.id,
  //     variant: CarDetailCarouselVariant.SAFETY,
  //     carouselVariant: CarImageType.CAROUSEL,
  //   },
  // });

  // const carouselPerformance = await prisma.carDetailCarousel.create({
  //   data: {
  //     carModelId: model.id,
  //     variant: CarDetailCarouselVariant.PERFORMANCE,
  //     carouselVariant: CarImageType.CAROUSEL,
  //   },
  // });

  // // await prisma.carDetailCarouselContent.createMany({
  // //   data: [
  // //     {
  // //       title: "NEW FEATURES DUAL SRS-AIRBAG",
  // //       content: "Melindungi pengemudi & penumpang apabila terjadi kecelakaan.",
  // //       imageUrl: "/images/apv/carousel/air-bags.webp",
  // //       carDetailCarouselId: carouselSecurity.id,
  // //     },
  // //     {
  // //       title: "MONOCOQUE WITH LADDER FRAME",
  // //       content: "Lebih kokoh, kuat dan aman saat terjadi benturan.",
  // //       imageUrl: "/images/apv/carousel/monocoque-frame.webp",
  // //       carDetailCarouselId: carouselSecurity.id,
  // //     },
  // //     {
  // //       title: "Side Impact Beam",
  // //       content:
  // //         "Melindungi pengendara saat terjadi benturan dari samping kendaraan.",
  // //       imageUrl: "/images/apv/carousel/side-impact-beam.webp",
  // //       carDetailCarouselId: carouselSecurity.id,
  // //     },
  // //     {
  // //       title: "Tect Body",
  // //       content:
  // //         "Teknologi yang dapat meredam energi benturan sehingga meningkatkan keamanan saat terjadi kecelakaan.",
  // //       imageUrl: "/images/apv/carousel/tect-body.webp",
  // //       carDetailCarouselId: carouselSecurity.id,
  // //     },
  // //     {
  // //       title: "Alat Pemadam Api Ringan (APAR)",
  // //       content:
  // //         "Fitur keselamatan makin lengkap dengan tersedianya alat pemadam api ringan.",
  // //       imageUrl: "/images/apv/carousel/fire.webp",
  // //       carDetailCarouselId: carouselSecurity.id,
  // //     },
  // //     {
  // //       title: "Performa Tangguh",
  // //       content:
  // //         "Mesin type G15A berkapasitas 1500cc lebih bertenaga di tanjakan dan irit bahan bakar.",
  // //       imageUrl: "/images/apv/carousel/machine.webp",
  // //       carDetailCarouselId: carouselPerformance.id,
  // //     },
  // //   ],
  // // });

  // // console.log(
  // //   `  ✓ CarDetailCarousel + content seeded for apv (${carouselSecurity.variant} / ${carouselSafety.variant} / ${carouselPerformance.variant})`,
  // // );

  // ── Jimny ──
  const jimny = await prisma.carModel.findUnique({
    where: { slug: "jimny" },
  });

  if (!jimny) throw new Error('CarModel "jimny" not found');

  const deletedJimny = await prisma.carDetailCarousel.deleteMany({
    where: { carModelId: jimny.id },
  });
  if (deletedJimny.count > 0) {
    console.log(
      `  ↺ Removed ${deletedJimny.count} existing CarDetailCarousel row(s) for jimny`,
    );
  }

  const jimnySafety = await prisma.carDetailCarousel.create({
    data: {
      carModelId: jimny.id,
      variant: CarDetailCarouselVariant.SAFETY,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  const jimnyPerformance = await prisma.carDetailCarousel.create({
    data: {
      carModelId: jimny.id,
      variant: CarDetailCarouselVariant.PERFORMANCE,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  await prisma.carDetailCarouselContent.createMany({
    data: [
      {
        title: "Rear View Camera",
        content: "Rear View Camera (Jimny 5-door)",
        imageUrl: "/images/jimny/carousel/rear-view-camera.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "Air Bags",
        content:
          "Be extra prepared to navigate uncertainties with the six airbags for 5-door & dual airbags for 3-door, ensuring your safety.",
        imageUrl: "/images/jimny/carousel/air-bags.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "Brake Limited Slip Differential Traction Control",
        content:
          "Experience quicker brake response with reduced pedal pressure and improved braking performance to prevent slipping on slippery surfaces.",
        imageUrl: "/images/jimny/carousel/brake-limited-slips.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "ESP® (Electronic Stability Programme)",
        content:
          "Enhances braking stability on slippery and curved roads, preventing both oversteer and understeer.",
        imageUrl: "/images/jimny/carousel/esp.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "TECT Body",
        content:
          "The frame structure effectively absorbs and distributes energy during bumps and crashes, ensuring the cabin space remains intact.",
        imageUrl: "/images/jimny/carousel/tect-body.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "Hill Descent Control",
        content:
          "Control your vehicle speed gracefully while descending steep roads.",
        imageUrl: "/images/jimny/carousel/hill-descent-body.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "Hill Hold Assist",
        content:
          "Prevent the vehicle from rolling backward when bravely facing a new peak.",
        imageUrl: "/images/jimny/carousel/hill-hold-assist.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "4 Spots Parking Sensor",
        content: "4 Spots Parking Sensor (Jimny 5-door)",
        imageUrl: "/images/jimny/carousel/parking-sensor.webp",
        carDetailCarouselId: jimnySafety.id,
      },
      {
        title: "Engine Performance",
        content:
          "The responsive 1.5L K15B engine maintains off-road driving capability, producing strong torque throughout RPM range to provide unwavering power.",
        imageUrl: "/images/jimny/carousel/engine-performance.webp",
        carDetailCarouselId: jimnyPerformance.id,
      },
      {
        title: "Ladder Frame Chassis",
        content:
          "Built with a robust Ladder Frame structure, the Jimny guides you through rugged topographies with full-width rigid axles at front and rear.",
        imageUrl: "/images/jimny/carousel/ladder-frame-chasis.webp",
        carDetailCarouselId: jimnyPerformance.id,
      },
      {
        title: "All Grip Pro",
        content:
          "Transfer lever modes: 2H for driving at normal speeds on roads, 4H for off-road driving, 4L for navigating rough rocks, mud, and more challenging terrain.",
        imageUrl: "/images/jimny/carousel/all-grip.webp",
        carDetailCarouselId: jimnyPerformance.id,
      },
      {
        title: "3-Link Rigid Axle Suspension with Coil Spring",
        content:
          "The Jimny features tough 3-link suspension and rigid axles ensuring stability on any terrain.",
        imageUrl: "/images/jimny/carousel/3-link.webp",
        carDetailCarouselId: jimnyPerformance.id,
      },
    ],
  });

  console.log(
    `  ✓ CarDetailCarousel + content seeded for jimny (${jimnySafety.variant} / ${jimnyPerformance.variant})`,
  );

  // ── S-Presso (espresso) ──
  const espresso = await prisma.carModel.findUnique({
    where: { slug: "espresso" },
  });

  if (!espresso) throw new Error('CarModel "espresso" not found');

  const deletedEspresso = await prisma.carDetailCarousel.deleteMany({
    where: { carModelId: espresso.id },
  });
  if (deletedEspresso.count > 0) {
    console.log(
      `  ↺ Removed ${deletedEspresso.count} existing CarDetailCarousel row(s) for espresso`,
    );
  }

  const espressoSafety = await prisma.carDetailCarousel.create({
    data: {
      carModelId: espresso.id,
      variant: CarDetailCarouselVariant.SAFETY,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  const espressoPerformance = await prisma.carDetailCarousel.create({
    data: {
      carModelId: espresso.id,
      variant: CarDetailCarouselVariant.PERFORMANCE,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  await prisma.carDetailCarouselContent.createMany({
    data: [
      {
        title: "Dual SRS Airbag",
        content:
          "Melindungi pengemudi dan penumpang depan apabila terjadi kecelakaan.",
        imageUrl: "/images/espresso/carousel/dual-srs-airbag.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "Alat Pemadam Api Ringan (APAR)",
        content:
          "Fitur keselamatan makin lengkap dengan tersedianya alat pemadam api ringan.",
        imageUrl: "/images/espresso/carousel/pemadam.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "ISOFIX",
        content:
          "Sistem penguncian kursi anak yang aman dan mudah dipasang untuk keselamatan penumpang kecil.",
        imageUrl: "/images/espresso/carousel/isofix.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "Rear Parking Sensor",
        content:
          "Sensor parkir belakang yang membantu Anda bermanuver dengan aman saat parkir.",
        imageUrl: "/images/espresso/carousel/rear-parking-sensor.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "ABS dan EBD",
        content:
          "Anti-lock Braking System dan Electronic Brake-force Distribution untuk pengereman yang lebih stabil dan aman.",
        imageUrl: "/images/espresso/carousel/abs-ebd.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "Electronic Stability Programme (ESP)",
        content:
          "Meningkatkan stabilitas pengereman di jalan licin dan tikungan, mencegah oversteer dan understeer.",
        imageUrl: "/images/espresso/carousel/esp.webp",
        carDetailCarouselId: espressoSafety.id,
      },
      {
        title: "Strong Performance",
        content:
          "Mesin K10C berkapasitas 998cc dengan teknologi VVT yang bertenaga dan irit bahan bakar.",
        imageUrl: "/images/espresso/carousel/machine.webp",
        carDetailCarouselId: espressoPerformance.id,
      },
      {
        title: "Engine Auto Start Stop",
        content:
          "Fitur auto start stop yang menghemat bahan bakar dengan mematikan mesin secara otomatis saat berhenti.",
        imageUrl: "/images/espresso/carousel/engine-auto-start-stop.webp",
        carDetailCarouselId: espressoPerformance.id,
      },
    ],
  });

  console.log(
    `  ✓ CarDetailCarousel + content seeded for espresso (${espressoSafety.variant} / ${espressoPerformance.variant})`,
  );

  // ── Grand Vitara ──
  const grandVitara = await prisma.carModel.findUnique({
    where: { slug: "grand-vitara" },
  });

  if (!grandVitara) throw new Error('CarModel "grand-vitara" not found');

  const deletedGrandVitara = await prisma.carDetailCarousel.deleteMany({
    where: { carModelId: grandVitara.id },
  });
  if (deletedGrandVitara.count > 0) {
    console.log(
      `  ↺ Removed ${deletedGrandVitara.count} existing CarDetailCarousel row(s) for grand-vitara`,
    );
  }

  const grandVitaraSafety = await prisma.carDetailCarousel.create({
    data: {
      carModelId: grandVitara.id,
      variant: CarDetailCarouselVariant.SAFETY,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  const grandVitaraPerformance = await prisma.carDetailCarousel.create({
    data: {
      carModelId: grandVitara.id,
      variant: CarDetailCarouselVariant.PERFORMANCE,
      carouselVariant: CarImageType.CAROUSEL,
    },
  });

  await prisma.carDetailCarouselContent.createMany({
    data: [
      {
        title: "Electronic Stability Program (ESP®)",
        content:
          "ESP® can detect a wheel slip and helps you stay in directional control.",
        imageUrl: "/images/grand-vitara/carousel/esp.webp",
        carDetailCarouselId: grandVitaraSafety.id,
      },
      {
        title: "6 Airbags",
        content:
          "A cabin that prioritizes safety with dual front, side and curtain airbags.",
        imageUrl: "/images/grand-vitara/carousel/6-airbag.webp",
        carDetailCarouselId: grandVitaraSafety.id,
      },
      {
        title: "Braking System (ABS, EBD & BA)",
        content: "Excellent control to keep you safe wherever you drive.",
        imageUrl: "/images/grand-vitara/carousel/braking-system.webp",
        carDetailCarouselId: grandVitaraSafety.id,
      },
      {
        title: "Suzuki's TECT Concept",
        content:
          "The body embodies Suzuki's TECT concept for lightness and occupant safety.",
        imageUrl: "/images/grand-vitara/carousel/suzuko-tech.webp",
        carDetailCarouselId: grandVitaraSafety.id,
      },
      {
        title: "Hill Hold Control",
        content:
          "Easily navigate through inclines as the system prevents rolling backwards.",
        imageUrl: "/images/grand-vitara/carousel/will-hold-control.webp",
        carDetailCarouselId: grandVitaraSafety.id,
      },
      {
        title: "K15C + Smart Hybrid Vehicle By Suzuki (SHVS)",
        content:
          "With 1.5 litre engine that produces eco-friendly and optimum torque output.",
        imageUrl: "/images/grand-vitara/carousel/machine.webp",
        carDetailCarouselId: grandVitaraPerformance.id,
      },
    ],
  });

  console.log(
    `  ✓ CarDetailCarousel + content seeded for grand-vitara (${grandVitaraSafety.variant} / ${grandVitaraPerformance.variant})`,
  );
}

async function main() {
  console.log("🌱 Starting seed...\n");
  // for (const car of CARS) {
  //   await seedCar(car);
  // }

  // await seedColor();
  // await seedImage("grand-vitara");
  // await seedImageContent("grand-vitara");
  await seedDetailBanner();
  // await seedDetailCarousel();
  // await seedGrandVitaraColor();

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
