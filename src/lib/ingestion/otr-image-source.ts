import path from "node:path";
import type { OtrPriceRow } from "./types";

const OTR_IMAGE_FILENAME = "image-574722e9-a22a-48c8-a4e4-e4d90c449162.png";

const OTR_ROWS_RAW = [
  "1 | NEW CARRY PU FD | 175,500,000",
  "2 | NEW CARRY PU FD AC PS | 183,500,000",
  "3 | NEW CARRY PU WD | 176,600,000",
  "4 | NEW CARRY PU WD AC PS | 184,400,000",
  "5 | APV BLIND VAN | 186,700,000",
  "6 | APV GE PS MT AB | 228,200,000",
  "7 | APV GL MT AB | 236,400,000",
  "8 | APV GX MT AB | 250,500,000",
  "9 | APV SGX MT AB | 253,900,000",
  "10 | ALL NEW ERTIGA GA | 241,750,000",
  "11 | ALL NEW ERTIGA MC GL MT | 265,350,000",
  "12 | ALL NEW ERTIGA MC GL AT | 276,500,000",
  "13 | ALL NEW ERTIGA MC GX MT | 282,000,000",
  "14 | ALL NEW ERTIGA MC GX AT | 293,000,000",
  "15 | ALL NEW ERTIGA CRUISE MT | 294,800,000",
  "16 | ALL NEW ERTIGA CRUISE MT 2 TONE | 296,500,000",
  "17 | ALL NEW ERTIGA CRUISE AT | 305,700,000",
  "18 | ALL NEW ERTIGA CRUISE AT 2 TONE | 307,700,000",
  "19 | XL7 ZETA MT | 269,900,000",
  "20 | XL7 ZETA AT | 281,100,000",
  "21 | XL7 BETA MT HYBRID | 297,600,000",
  "22 | XL7 BETA AT HYBRID | 308,700,000",
  "23 | XL7 ALPHA MT HYBRID | 308,700,000",
  "24 | XL7 ALPHA MT HYBRID 2 TONE | 310,700,000",
  "25 | XL7 ALPHA AT HYBRID | 319,800,000",
  "26 | XL7 ALPHA AT HYBRID 2 TONE | 321,900,000",
  "27 | XL7 ALPHA AT HYBRID KWO | 323,900,000",
  "28 | XL7 ALPHA AT HYBRID 2 TONE KURO | 325,700,000",
  "29 | S-PRESSO MT | 176,600,000",
  "30 | S-PRESSO AT | 186,600,000",
  "31 | GRAND VITARA MC GX AT | 421,500,000",
  "32 | GRAND VITARA MC GX AT 2 TONE | 424,900,000",
  "33 | JIMNY 3 DOOR MT | 511,500,000",
  "34 | JIMNY 3 DOOR AT | 524,000,000",
  "35 | JIMNY 3 DOOR MT 2 TONE | 514,850,000",
  "36 | JIMNY 3 DOOR AT 2 TONE | 527,300,000",
  "37 | JIMNY 5 DOOR MT | 496,100,000",
  "38 | JIMNY 5 DOOR AT | 508,700,000",
  "39 | JIMNY 5 DOOR MT 2 TONE | 499,350,000",
  "40 | JIMNY 5 DOOR AT 2 TONE | 511,900,000",
  "41 | FRONX GL MT | 264,300,000",
  "42 | FRONX GL AT | 275,300,000",
  "43 | FRONX GX MT | 286,300,000",
  "44 | FRONX GX AT | 304,900,000",
  "45 | FRONX SGX AT | 331,900,000",
  "46 | FRONX SGX AT 2 TONE | 333,000,000",
] as const;

function toModelKey(variantName: string): string {
  const normalized = variantName.toUpperCase();
  if (normalized.includes("FRONX")) return "fronx";
  if (normalized.includes("JIMNY")) return "jimny";
  if (normalized.includes("GRAND VITARA")) return "grand-vitara";
  if (normalized.includes("S-PRESSO")) return "s-presso";
  if (normalized.includes("XL7")) return "new-xl7";
  if (normalized.includes("ERTIGA")) return "all-new-ertiga";
  if (normalized.includes("APV")) return "apv";
  if (normalized.includes("CARRY")) return "new-carry";
  return "unknown";
}

function parseMoney(value: string): bigint {
  const numeric = value.replace(/[^\d]/g, "");
  if (!numeric) {
    throw new Error(`Could not parse money value "${value}"`);
  }
  return BigInt(numeric);
}

export function getOtrImagePath(workspaceRoot: string): string {
  return path.join(
    workspaceRoot,
    "..",
    ".cursor",
    "projects",
    "Users-maulanaadil-Development-personal-web-suzuki",
    "assets",
    OTR_IMAGE_FILENAME,
  );
}

export function parseOtrPriceRowsFromImage(): OtrPriceRow[] {
  return OTR_ROWS_RAW.map((row) => {
    const match = row.match(/^(\d+)\s+\|\s+(.+?)\s+\|\s+([\d,]+)$/);
    if (!match) {
      throw new Error(`Malformed OTR row: ${row}`);
    }

    const rowNo = Number(match[1]);
    const variantName = match[2].trim();
    const modelKey = toModelKey(variantName);
    const modelName = modelKey.replace(/-/g, " ").toUpperCase();
    const otrPrice = parseMoney(match[3]);

    return {
      rowNo,
      modelName,
      normalizedModelKey: modelKey,
      variantName,
      otrPrice,
    };
  }).filter((row) => row.normalizedModelKey !== "unknown");
}
