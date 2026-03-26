import { load } from "cheerio";
import type { ScrapedCarModel, ScrapedColor, ScrapedSpecRow, ScrapedVariant } from "./types";

const SUZUKI_CARS_INDEX_URL = "https://auto.suzuki.co.id/cars";
const MODEL_LINK_PREFIX = "/cars/";

const colorHintKeywords = [
  "BLACK",
  "WHITE",
  "SILVER",
  "GRAY",
  "GREY",
  "BLUE",
  "RED",
  "GREEN",
  "YELLOW",
  "BROWN",
  "ORANGE",
  "BEIGE",
  "TWO TONE",
  "2TONE",
];

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function slugFromUrl(url: string): string {
  const parts = new URL(url).pathname.split("/").filter(Boolean);
  return parts[parts.length - 1] ?? "";
}

function inferCategory(slug: string): ScrapedCarModel["category"] {
  if (slug.includes("carry") || slug === "apv") return "COMMERCIAL";
  if (slug.includes("ertiga")) return "MPV";
  if (slug.includes("jimny") || slug.includes("vitara") || slug.includes("fronx") || slug.includes("xl7")) {
    return "SUV";
  }
  if (slug.includes("s-presso")) return "CITY_CAR";
  return "OTHER";
}

function inferVehicleType(category: ScrapedCarModel["category"]): ScrapedCarModel["vehicleType"] {
  return category === "COMMERCIAL" ? "COMMERCIAL" : "PASSENGER";
}

function inferVehicleTypeFromText(value: string | undefined, fallbackCategory: ScrapedCarModel["category"]) {
  const upper = (value ?? "").toUpperCase();
  if (upper.includes("COMMERCIAL")) return "COMMERCIAL";
  if (upper.includes("PASSENGER")) return "PASSENGER";
  return inferVehicleType(fallbackCategory);
}

function inferTransmission(variantName: string): string | undefined {
  const upper = variantName.toUpperCase();
  if (upper.includes("AT")) return "AT";
  if (upper.includes("MT")) return "MT";
  if (upper.includes("CVT")) return "CVT";
  return undefined;
}

function extractImageUrls(html: string): string[] {
  const matches = html.match(/https?:\/\/[^"' )]+/g) ?? [];
  const candidates = matches.filter((url) => {
    const lower = url.toLowerCase();
    return (
      (lower.includes("cloudfront.net") || lower.includes("auto.suzuki.co.id")) &&
      (lower.includes(".png") || lower.includes(".jpg") || lower.includes(".jpeg") || lower.includes(".webp"))
    );
  });
  return [...new Set(candidates)];
}

function extractNextDataPayload(html: string): Record<string, unknown> | null {
  const marker = '<script id="__NEXT_DATA__" type="application/json">';
  const start = html.indexOf(marker);
  if (start === -1) return null;
  const end = html.indexOf("</script>", start);
  if (end === -1) return null;

  try {
    const json = html.slice(start + marker.length, end);
    const payload = JSON.parse(json);
    return payload?.props?.pageProps?.data?.props?.data ?? null;
  } catch {
    return null;
  }
}

function extractVariants(lines: string[], modelName: string): ScrapedVariant[] {
  const upperModel = modelName.toUpperCase();
  const rows = lines
    .map((line) => normalizeWhitespace(line))
    .filter((line) => line.toUpperCase().includes(upperModel))
    .filter((line) => /(?:AT|MT|CVT|HYBRID|2TONE|GX|SGX|GL|GX|GA|FD|PS)/i.test(line))
    .slice(0, 12);

  const deduped = [...new Set(rows)];
  if (deduped.length === 0) {
    return [
      {
        name: `${modelName} Base`,
        transmission: undefined,
        isHybrid: false,
        specs: [],
      },
    ];
  }

  return deduped.map((name) => ({
    name,
    transmission: inferTransmission(name),
    isHybrid: /HYBRID|SHVS|HEV/i.test(name),
    specs: [],
  }));
}

function extractColors(lines: string[]): ScrapedColor[] {
  const colorLike = lines
    .map((line) => normalizeWhitespace(line))
    .filter((line) => line.length >= 3 && line.length <= 48)
    .filter((line) => colorHintKeywords.some((keyword) => line.toUpperCase().includes(keyword)));

  const deduped = [...new Set(colorLike)];
  return deduped.slice(0, 12).map((name) => ({ name: titleCase(name) }));
}

function extractSpecs(lines: string[]): ScrapedSpecRow[] {
  const rows: ScrapedSpecRow[] = [];
  const interestingKeys = [
    "Ground Clearance",
    "Berat",
    "Sistem Pengereman",
    "Spesifikasi Mesin",
    "Transmisi",
    "Ukuran Ban",
    "ISOFIX",
    "6 Airbags",
    "ABS",
    "ESP",
    "Hill Hold Control",
    "Rear Parking Sensor",
  ];

  for (let index = 0; index < lines.length; index += 1) {
    const current = normalizeWhitespace(lines[index] ?? "");
    if (!current) continue;
    const found = interestingKeys.find((key) => current.toLowerCase().startsWith(key.toLowerCase()));
    if (!found) continue;

    const next = normalizeWhitespace(lines[index + 1] ?? "");
    if (!next) continue;
    rows.push({
      group: found.includes("Control") || found.includes("ABS") || found.includes("Airbags") ? "KEY_FEATURES" : "PERFORMANCE",
      key: found,
      value: next,
    });
  }

  return rows;
}

function specsFromNextDataArray(
  rows: Array<{ featureName?: string; v1?: string; v2?: string; v3?: string }>,
  group: string,
): ScrapedSpecRow[] {
  return rows
    .map((row) => {
      const key = normalizeWhitespace(row.featureName ?? "");
      const value = normalizeWhitespace(row.v1 ?? row.v2 ?? row.v3 ?? "");
      if (!key || !value) return null;
      return { group, key, value };
    })
    .filter((entry): entry is ScrapedSpecRow => entry !== null);
}

async function fetchPage(url: string): Promise<{ html: string; lines: string[] }> {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; web-suzuki-bot/1.0)",
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url} (${response.status})`);
  }
  const html = await response.text();
  const text = load(html).text();
  const lines = text
    .split("\n")
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean);
  return { html, lines };
}

export async function fetchSuzukiModelUrls(): Promise<string[]> {
  const { html } = await fetchPage(SUZUKI_CARS_INDEX_URL);
  const $ = load(html);

  const hrefs = $("a[href]")
    .toArray()
    .map((anchor) => String($(anchor).attr("href") ?? ""))
    .filter((href) => href.startsWith(MODEL_LINK_PREFIX))
    .filter((href) => href !== "/cars" && href !== "/cars/")
    .map((href) => new URL(href, SUZUKI_CARS_INDEX_URL).toString());

  const unique = [...new Set(hrefs)];
  return unique.filter((url) => slugFromUrl(url) !== "");
}

export async function fetchSuzukiModelDetail(modelUrl: string): Promise<ScrapedCarModel> {
  const { html, lines } = await fetchPage(modelUrl);
  const slug = slugFromUrl(modelUrl);
  const nextData = extractNextDataPayload(html) as
    | {
        model_name?: string;
        vehicle_type?: string;
        variants?: Array<{
          variant_name?: string;
          transmission_type?: string;
          engine_cc?: string;
          propulsion?: string;
          colors?: Array<{
            color_name?: string;
            hex_code?: string;
            hex_code2?: string;
            image?: string;
          }>;
        }>;
        sortedPerformance?: Array<{ featureName?: string; v1?: string; v2?: string; v3?: string }>;
        sortedFeatures?: Array<{ featureName?: string; v1?: string; v2?: string; v3?: string }>;
        updated_images?: Array<{ Key?: string }>;
      }
    | null;

  const headerLine = lines.find((line) => /^#?\s*[A-Za-z0-9 -]{3,}$/.test(line) && line.toUpperCase() === line);
  const nameFromData = normalizeWhitespace(nextData?.model_name ?? "");
  const name = nameFromData || titleCase((headerLine ?? slug.replace(/-/g, " ")).replace(/^#+\s*/, ""));

  const tagline = lines.find(
    (line) => line.length <= 120 && /marvelous|every mile|memory|journey|drive/i.test(line),
  );
  const category = inferCategory(slug);
  const nextImageUrls =
    nextData?.updated_images
      ?.map((entry) => entry.Key)
      .filter((value): value is string => Boolean(value))
      .map((value) => `https://d37ehbjruvijch.cloudfront.net/${value}`) ?? [];
  const imageUrls = [...new Set([...nextImageUrls, ...extractImageUrls(html)])];

  const specsFromData = [
    ...specsFromNextDataArray(nextData?.sortedPerformance ?? [], "PERFORMANCE"),
    ...specsFromNextDataArray(nextData?.sortedFeatures ?? [], "KEY_FEATURES"),
  ];
  const specs = specsFromData.length > 0 ? specsFromData : extractSpecs(lines);

  const colorsFromData: ScrapedColor[] = [];
  for (const variant of nextData?.variants ?? []) {
    for (const color of variant.colors ?? []) {
      const nameValue = normalizeWhitespace(color.color_name ?? "");
      if (!nameValue) continue;
      const imagePath = normalizeWhitespace(color.image ?? "");
      colorsFromData.push({
        name: titleCase(nameValue),
        hexCodePrimary: normalizeWhitespace(color.hex_code ?? "") || undefined,
        hexCodeSecondary: normalizeWhitespace(color.hex_code2 ?? "") || undefined,
        imageUrl: imagePath ? `https://d37ehbjruvijch.cloudfront.net/${imagePath}` : undefined,
      });
    }
  }
  const colorsFallback = extractColors(lines);
  const colors = (colorsFromData.length > 0 ? colorsFromData : colorsFallback).filter(
    (color, index, all) => all.findIndex((entry) => entry.name === color.name) === index,
  );

  const variantsFromData: ScrapedVariant[] = [];
  for (const variant of nextData?.variants ?? []) {
    const variantName = normalizeWhitespace(variant.variant_name ?? "");
    if (!variantName) continue;
    const engineCc = normalizeWhitespace(variant.engine_cc ?? "");
    variantsFromData.push({
      name: variantName,
      transmission: normalizeWhitespace(variant.transmission_type ?? "") || inferTransmission(variantName),
      engine: engineCc ? `${engineCc} cc` : undefined,
      drivetrain: normalizeWhitespace(variant.propulsion ?? "") || undefined,
      isHybrid: /HYBRID|SHVS|HEV/i.test(variantName),
      specs,
    });
  }

  const variantsFallback = extractVariants(lines, name).map((variant) => ({
    ...variant,
    specs,
  }));
  const variants = (variantsFromData.length > 0 ? variantsFromData : variantsFallback).filter(
    (variant, index, all) => all.findIndex((entry) => entry.name === variant.name) === index,
  );

  return {
    slug,
    name,
    tagline,
    category,
    vehicleType: inferVehicleTypeFromText(nextData?.vehicle_type, category),
    heroImage: imageUrls[0],
    imageUrls,
    variants,
    colors,
  };
}

export async function scrapeAllSuzukiModels(): Promise<ScrapedCarModel[]> {
  const urls = await fetchSuzukiModelUrls();
  const modelUrls = urls.filter((url) => !url.endsWith("/cars"));
  const results: ScrapedCarModel[] = [];

  for (const modelUrl of modelUrls) {
    try {
      const model = await fetchSuzukiModelDetail(modelUrl);
      results.push(model);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[suzuki-web-source] failed to scrape ${modelUrl}: ${message}`);
    }
  }

  return results;
}
