export type ScrapedSpecRow = {
  group: string;
  key: string;
  value: string;
};

export type ScrapedVariant = {
  name: string;
  transmission?: string;
  engine?: string;
  drivetrain?: string;
  isHybrid: boolean;
  specs: ScrapedSpecRow[];
};

export type ScrapedColor = {
  name: string;
  hexCodePrimary?: string;
  hexCodeSecondary?: string;
  imageUrl?: string;
};

export type ScrapedCarModel = {
  slug: string;
  name: string;
  tagline?: string;
  vehicleType?: "PASSENGER" | "COMMERCIAL";
  category?:
    | "SUV"
    | "MPV"
    | "CITY_CAR"
    | "COMMERCIAL"
    | "HATCHBACK"
    | "SEDAN"
    | "CROSSOVER"
    | "OTHER";
  heroImage?: string;
  imageUrls: string[];
  variants: ScrapedVariant[];
  colors: ScrapedColor[];
};

export type OtrPriceRow = {
  rowNo: number;
  modelName: string;
  normalizedModelKey: string;
  variantName: string;
  otrPrice: bigint;
  discount?: bigint;
  netPrice?: bigint;
};
