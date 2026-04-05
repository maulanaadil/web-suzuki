"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";

type CompareVariant = {
  id: string;
  name: string;
  priceText: string;
};

type CompareColor = {
  id: string;
  name: string;
  imageUrl: string | null;
  hexCodePrimary: string | null;
  hexCodeSecondary: string | null;
};

function getSwatchStyle(color: CompareColor): CSSProperties {
  const primary = color.hexCodePrimary ?? "#d1d5db";
  const secondary = color.hexCodeSecondary;

  if (secondary) {
    return {
      background: `linear-gradient(135deg, ${primary} 0%, ${primary} 50%, ${secondary} 50%, ${secondary} 100%)`,
    };
  }

  return { backgroundColor: primary };
}

export default function VariantCompareClient({
  modelName,
  heroImage,
  variants,
  colors,
}: {
  modelName: string;
  heroImage: string | null;
  variants: CompareVariant[];
  colors: CompareColor[];
}) {
  const defaultColor = colors[0] ?? null;
  const [selectedColorByVariant, setSelectedColorByVariant] = useState<Record<string, string | null>>(
    Object.fromEntries(variants.map((variant) => [variant.id, defaultColor?.id ?? null])),
  );

  const colorById = useMemo(() => new Map(colors.map((color) => [color.id, color])), [colors]);

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {variants.map((variant) => {
        const selectedColorId = selectedColorByVariant[variant.id];
        const selectedColor = (selectedColorId ? colorById.get(selectedColorId) : null) ?? defaultColor;
        const selectedImage = selectedColor?.imageUrl ?? heroImage ?? "https://placehold.co/640x360/e5e7eb/9ca3af?text=Suzuki";

        return (
          <article key={variant.id} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="rounded-xl border border-gray-200 px-3 py-2">
              <p className="text-sm font-sans uppercase text-gray-500">{modelName}</p>
              <p className="font-sans font-semibold text-foreground">{variant.name}</p>
            </div>

            <div className="relative mt-3 w-full aspect-video rounded-xl bg-gray-50">
              <Image src={selectedImage} alt={variant.name} fill className="object-contain" unoptimized />
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 mb-2">
                {colors.slice(0, 8).map((color) => {
                  const isActive = selectedColor?.id === color.id;
                  return (
                    <button
                      key={`${variant.id}-${color.id}`}
                      type="button"
                      onClick={() =>
                        setSelectedColorByVariant((prev) => ({
                          ...prev,
                          [variant.id]: color.id,
                        }))
                      }
                      className={`w-5 h-5 rounded-full border transition-all ${
                        isActive ? "border-foreground ring-1 ring-foreground" : "border-gray-300"
                      }`}
                      style={getSwatchStyle(color)}
                      aria-label={`Select ${color.name}`}
                      title={color.name}
                    />
                  );
                })}
              </div>

              <p className="text-xs font-sans uppercase text-gray-500">{selectedColor?.name ?? "Color option"}</p>
              <p className="mt-1 font-sans text-2xl font-bold text-foreground">{variant.priceText}</p>
              <p className="mt-1 text-xs font-sans text-gray-500">OTR D.K.I Jakarta</p>
            </div>
          </article>
        );
      })}
    </section>
  );
}
