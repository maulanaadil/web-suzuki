import React from "react";
import Image from "next/image";
import Button from "@/src/components/button";
import { cn } from "@/src/lib/style";
import { CarImageType } from "@prisma/client";

type Props = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  imageUrl: string;
  variant: CarImageType;
  className?: string;
};

export default function Banner({
  title = "Banner Title",
  description = "Banner Description",
  buttonLabel = "Banner Button Label",
  buttonHref = "#",
  imageUrl,
  variant = CarImageType.EKSTERIOR,
  className,
}: Props) {
  return (
    <div
      className={cn("flex flex-col gap-5", className)}
      data-variant={variant}
    >
      <div className="relative w-full aspect-21/9 bg-gray-100">
        <Image src={imageUrl} alt={variant} fill className="object-cover" />
      </div>
      <div className="flex items-center container mx-auto px-4 sm:flex-row flex-col">
        <div className="flex-1 w-full">
          <p className="text-3xl font-suzuki-pro-headline text-foreground">
            {title}
          </p>
        </div>

        <div className="flex-1 flex flex-col gap-5 w-full mt-4">
          <p className="text-xs font-sans font-medium text-foreground">
            {description}
          </p>
          <Button label={buttonLabel} variant="secondary" href={buttonHref} />
        </div>
      </div>
    </div>
  );
}
