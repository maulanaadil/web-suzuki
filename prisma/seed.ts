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

const FRONX_VARIANT_CODES = ["A3L415FM00GLMTS", "A3L415FM00GLATS"];
const FRONX_COLOR_CODES = ["ZYZ", "PSW", "ZBD"];

async function seedColor() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "fronx" },
    include: { variants: true },
  });

  if (!model) throw new Error('CarModel "fronx" not found');

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
async function seedImage(modelSlugFolder = "fronx") {
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

const DUMMY_TESTIMONIALS = [
  {
    slug: "fronx",
    name: "Budi Santoso",
    quote:
      "Fronx benar-benar mengubah pengalaman berkendara saya. Desainnya sporty, fiturnya lengkap, dan sangat irit bahan bakar. Pilihan terbaik untuk keluarga muda!",
    imageUrl: "https://i.pravatar.cc/150?img=11",
  },
  {
    slug: "fronx",
    name: "Rina Kartika",
    quote:
      "Saya sudah pakai Fronx selama 6 bulan dan sangat puas. Kabinnya luas, AC-nya cepat dingin, dan fitur safety-nya bikin tenang di jalan.",
    imageUrl: "https://i.pravatar.cc/150?img=5",
  },
  {
    slug: "fronx",
    name: "Andi Wijaya",
    quote:
      "Ground clearance-nya tinggi, cocok buat jalanan Jakarta yang sering banjir. Tampilan luarnya juga keren, banyak tetangga yang tanya mobilnya apa.",
    imageUrl: "https://i.pravatar.cc/150?img=12",
  },
  {
    slug: "all-new-ertiga",
    name: "Siti Nurhaliza",
    quote:
      "Ertiga memang MPV sejati. Muat 7 orang dengan nyaman, bagasinya lega, dan konsumsi BBM-nya sangat irit. Cocok untuk mudik!",
    imageUrl: "https://i.pravatar.cc/150?img=9",
  },
  {
    slug: "jimny",
    name: "Reza Mahendra",
    quote:
      "Jimny itu bukan sekadar mobil, tapi gaya hidup. Bawa off-road tetap tangguh, di kota tetap stylish. Saya sudah jatuh cinta sejak pertama test drive.",
    imageUrl: "https://i.pravatar.cc/150?img=53",
  },
];

async function seedTestimonials() {
  let created = 0;
  for (const t of DUMMY_TESTIMONIALS) {
    const model = await prisma.carModel.findUnique({
      where: { slug: t.slug },
    });
    if (!model) {
      console.warn(`  ⚠ CarModel "${t.slug}" not found, skipping testimonial`);
      continue;
    }

    // Avoid duplicates by checking name + carModelId
    const existing = await prisma.testimonial.findFirst({
      where: { name: t.name, carModelId: model.id },
    });
    if (existing) continue;

    await prisma.testimonial.create({
      data: {
        carModelId: model.id,
        name: t.name,
        quote: t.quote,
        imageUrl: t.imageUrl,
      },
    });
    created += 1;
  }
  console.log(`  ✓ Testimonials created: ${created}`);
}

async function seedDetailBanner() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "fronx" },
  });

  if (!model) throw new Error('CarModel "fronx" not found');

  await prisma.carDetailBanner.create({
    data: {
      carModelId: model.id,
      title: "Feast On The Beauty From Any Angle",
      description:
        "Desain coupe-style SUV Suzuki Fronx yang elegan dan dinamis, memikat perhatian dari pandangan pertama.",
      buttonLabel: "Jelajahi Eksterior",
      buttonHref: "/cars/fronx/eksterior",
      bannerVariant: CarImageType.EKSTERIOR,
      imageUrl: "/images/fronx/banner/eksterior-banner.webp",
    },
  });
  console.log(`  ✓ CarDetailBanner upserted for ${model.name}`);
}

async function seedDetailCarousel() {
  const model = await prisma.carModel.findUnique({
    where: { slug: "fronx" },
  });

  if (!model) throw new Error('CarModel "fronx" not found');

  // Idempotent: re-run safe — CarDetailCarouselContent cascades on delete
  const deleted = await prisma.carDetailCarousel.deleteMany({
    where: { carModelId: model.id },
  });
  if (deleted.count > 0) {
    console.log(
      `  ↺ Removed ${deleted.count} existing CarDetailCarousel row(s) for fronx`,
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
          "Suzuki Fronx dilengkapi dengan sistem Suzuki Safety Support untuk perjalanan yang selalu aman dan nyaman",
        imageUrl: "/images/fronx/carousel/safety-support.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Dual Sensor Brake Support II (DSBS II) (SGX Only)",
        content:
          "Berkendara dengan nyaman di jalan tol dan atur kecepatan yang sesuai untuk menjaga jarak yang aman dan sesuai. Sistem ini otomatis mempercepat, memperlambat, dan berhenti sambil mempertahankan jarak yang telah ditentukan dengan kendaraan di depan.",
        imageUrl: "/images/fronx/carousel/dual-sensor-brake.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Blind Spot Monitor (BSM) (SGX Only)",
        content:
          "Membantu pengemudi memeriksa arah belakang saat ingin berpindah jalur dengan menginformasikan keberadaan kendaraan yang mendekat dari arah belakang.",
        imageUrl: "/images/fronx/carousel/blind-spot-monitoring.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Lane Keep Assist (LKA) (SGX Only)",
        content:
          "Menjaga kendaraan tetap di tengah lajur saat ﬁtur ACC aktif dengan mendeteksi garis marka di sisi kanan dan kiri dan mengarahkan kendaraan ke tengah lajur. Serta memberi bantuan kemudi untuk menjaga jarak aman jika sistem mendeteksi objek penghalang yang terlalu dekat.",
        imageUrl: "/images/fronx/carousel/lane-keep-assists.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Rear Cross Traﬃc Alert (RCTA) (SGX Only)",
        content:
          "Saat mundur di area parkir dan semacamnya, sistem akan mendeteksi kendaraan yang mendekat dari sisi kiri dan kanan belakang kendaraan. Sistem akan memperingatkan pengemudi melalui tampilan peringatan di meter cluster, lampu indikator spion yang berkedip, dan suara peringatan.",
        imageUrl: "/images/fronx/carousel/rear-cross-traffic-alert.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Lane Departure Warning (Peringatan Keluar Jalur)(*) (SGX Only)",
        content:
          "Saat berkendara, sistem mendeteksi garis marka dan kondisi jalan di sisi kiri dan kanan, lalu memprediksi arah laju kendaraan. Jika sistem mendeteksi kendaraan hendak keluar jalur, sistem akan memperingatkan pengemudi melalui indikator visual di meter cluster dan peringatan suara atau getaran di roda kemudi. *Aktif pada kecepatan 50 km/jam atau lebih",
        imageUrl: "/images/fronx/carousel/lane-departure-warning.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title:
          "Vehicle Swaying Warning (Peringatan Vehicle Swaying)(*) (SGX Only)",
        content:
          "Digunakan saat berkendara jarak jauh, sistem mendeteksi garis marka di kedua sisi dan menganalisa pola mengemudi kendaraan. Jika sistem menentukan bahwa kendaraan berjalan tidak stabil (tidak lurus atau menyimpang), maka sistem akan memberikan himbauan peringatan suara dan indikator visual di dalam meter cluster agar pengemudi beristirahat sejenak. *Aktif pada kecepatan 50 km/jam atau lebih",
        imageUrl: "/images/fronx/carousel/vehicle-swaying-warning.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Lane Departure Prevention (LDP)(*) (SGX Only)",
        content:
          "Sistem akan membantu mengoreksi roda kemudi untuk menghindari kendaraan keluar dari jalur. *Aktif pada kecepatan 50 km/jam atau lebih",
        imageUrl: "/images/fronx/carousel/lane-keep-assists.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Hill Hold Control",
        content:
          "Lewati tanjakan jalanan dengan mudah saat berpindah kaki dari pedal rem, dengan sistem yang mencegah mobil bergeser mundur selama dua detik.",
        imageUrl: "/images/fronx/carousel/hill-hold-control.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Parking Sensor (Sensor Parkir)",
        content:
          "Saat pengemudi hendak parkir, empat sensor dirancang untuk mendeteksi objek di belakang. ultrasonik yang terintegrasi di bumper belakang Sistem akan memberikan peringatan kepada pengemudi melalui suara yang berubah menyesuaikan dengan jarak objek.",
        imageUrl: "/images/fronx/carousel/parking-sensor.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "High Beam Assist (HBA)(**) (SGX Only)",
        content:
          "Mendeteksi sorotan cahaya dari lampu kendaraan di depan dan sekitar, lalu secara otomatis beralih antara lampu jauh atau lampu dekat. **Aktif pada kecepatan 30 km/jam atau lebih & dalam mode auto",
        imageUrl: "/images/fronx/carousel/high-beam-assist.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Around View Monitor (Kamera Tampilan 360°) (SGX Only)",
        content:
          "Tempat parkir sempit tidak lagi menjadi masalah dengan 360 Camera dan Back Camera yang membantu Anda melihat lingkungan sekitar secara jelas.",
        imageUrl: "/images/fronx/carousel/360-camera.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Adaptive Cruise Control (ACC) (SGX Only)",
        content:
          "Berkendara dengan nyaman di jalan tol dan atur kecepatan yang sesuai untuk menjaga jarak yang aman dan sesuai. Sistem ini otomatis mempercepat, memperlambat, dan berhenti sambil mempertahankan jarak yang telah ditentukan dengan kendaraan di depan.",
        imageUrl: "/images/fronx/carousel/adaptive-cruise-control.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "HEAD-UP DISPLAY (TAMPILAN HEAD-UP) (SGX Only)",
        content:
          "Tetap fokus di jalan dengan informasi perjalanan di depan mata, tanpa harus mengalihkan penglihatan.",
        imageUrl: "/images/fronx/carousel/head-up-display.webp",
        carDetailCarouselId: carouselSecurity.id,
      },
      {
        title: "Pedestrian Safety",
        content:
          "Struktur bodi yang dirancang untuk menyerap energi dan mengurangi dampak pada pejalan kaki jika terjadi kecelakaan.",
        imageUrl: "/images/fronx/carousel/pedestrian-safety.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Immobilizer & Security Alarm System",
        content:
          "Perangkat keamanan elektronik yang membantu mencegah mesin mobil menyala kecuali jika kunci yang sesuai digunakan.",
        imageUrl: "/images/fronx/carousel/immbolizier-and-alarm-system.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "ABS",
        content:
          "Teknologi ini akan mengendalikan mesin dan rem untuk membantu Anda mengendalikan kendaraan saat pengereman darurat dan di jalan licin.",
        imageUrl: "/images/fronx/carousel/abs.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Electronic Stability Program (ESP®)",
        content:
          "Secara otomatis mengambil alih mesin torsi dan rem agar Anda tetap memiliki kontrol di jalur yang licin atau ketika memutar setir dengan tajam.",
        imageUrl: "/images/fronx/carousel/electronic-stability.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Minimum Turning Radius",
        content:
          "Dengan radius putar mobil paling kecil pada kelasnya di 4.8m, gerak dengan mudah diperjalanan kota dan parkiran yang sempit.",
        imageUrl: "/images/fronx/carousel/minimum-turning-radius.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "NOISE, VIBRATION, HARSHNESS (NVH) REDUCTION",
        content:
          "Kenyamanan kabin yang luar biasa dengan indeks artikulasi yang tinggi, memberikan keheningan yang menenangkan.",
        imageUrl: "/images/fronx/carousel/nvh.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "6 Airbags",
        content:
          "Kabin yang mengutamakan keselamatan dengan dual front, side dan curtain airbag untuk semua penumpang di semua tipe Fronx.",
        imageUrl: "/images/fronx/carousel/6-airbags.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Tect Body",
        content:
          "Rangka Total Eﬀective Control Technology yang ringan dirancang oleh Suzuki untuk meredam energi benturan saat kecelakaan.",
        imageUrl: "/images/fronx/carousel/tect-body.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Seatbelt Pretensioners",
        content:
          "Dilengkapi dengan mekanisme yang segera menarik kembali sabuk saat terjadi kecelakaan, serta mengurangi dampak pada dada penumpang.",
        imageUrl: "/images/fronx/carousel/seatbelt-pretensioners.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "Isofix",
        content:
          "Pasang ISOFIX child seat dengan mudah untuk memastikan keamanan si kecil selama perjalanan.",
        imageUrl: "/images/fronx/carousel/isofix.webp",
        carDetailCarouselId: carouselSafety.id,
      },
      {
        title: "K15C + SMART HYBRID VEHICLE BY SUZUKI (SHVS) (SGX & GX Only)*",
        content:
          "Inovasi Suzuki lewat teknologi pintar Integrated Starter Generator (ISG) dengan baterai Lithium-ION yang menyimpan energi saat kendaraan melambat dan memberikan tambahan daya ke mesin saat akselerasi, juga memberikan efisiensi terbaik dengan fitur Engine Auto Stop saat kendaraan berhenti.   Konsumsi BBM yang semakin irit dan ramah lingkungan, ditambah fitur pintar, memberikan pengalaman berkendara yang lebih baik. *Tipe GL Menggunakan Mesin K15B",
        imageUrl: "/images/fronx/carousel/k15c-hybrid.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
      {
        title: "6AT Transmission (SGX & GX Only)",
        content:
          "Sensasi mobil sporty dan dinamis dengan daya transmisi 6AT yang halus dan lebih efisien pada kecepatan tinggi.",
        imageUrl: "/images/fronx/carousel/6at-transmission.webp",
        carDetailCarouselId: carouselPerformance.id,
      },
    ],
  });

  console.log(
    `  ✓ CarDetailCarousel + content seeded for fronx (${carouselSecurity.variant} / ${carouselSafety.variant} / ${carouselPerformance.variant})`,
  );
}

async function main() {
  console.log("🌱 Starting seed...\n");
  // for (const car of CARS) {
  //   await seedCar(car);
  // }

  // await seedColorFronx();
  // await seedImage("fronx");
  // await seedImageContent("fronx");
  // await seedTestimonials();
  // await seedDetailBanner();
  await seedDetailCarousel();

  console.log("\n✅ Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
