"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "../lib/style";

type ButtonProps = {
  label?: string;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit";
  onClick?: () => void;
};

const baseClasses = (variant: "primary" | "secondary") =>
  cn(
    "inline-flex w-75 flex-col gap-0 text-left outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent cursor-pointer",
    variant === "primary"
      ? "focus-visible:ring-white/40"
      : "focus-visible:ring-foreground/40",
  );

export default function Button({
  label = "Button",
  href,
  className = "",
  variant = "primary",
  type = "button",
  onClick,
}: ButtonProps) {
  const row = (
    <>
      <div className="flex w-full items-center justify-between gap-6 pb-1.5">
        <span
          className={cn(
            "text-sm font-bold tracking-[0.12em] text-white sm:text-xs",
            variant === "primary" ? "text-white" : "text-foreground",
          )}
        >
          {label}
        </span>
        <ChevronRight
          className={cn(
            "size-5 shrink-0 text-white sm:size-6",
            variant === "primary" ? "text-white" : "text-foreground",
          )}
          strokeWidth={2.25}
          aria-hidden
        />
      </div>
      <div className="flex h-px w-full">
        <div
          className={cn(
            "h-full min-w-0 flex-[0.82]",
            variant === "primary" ? "bg-white" : "bg-foreground",
          )}
        />
        <div
          className={cn(
            "h-full flex-[0.18]",
            variant === "primary" ? "bg-white/75" : "bg-foreground/75",
          )}
        />
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn(baseClasses(variant), className)}>
        {row}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(baseClasses(variant), className)}
    >
      {row}
    </button>
  );
}
