"use client";

import { ChevronRight, PlusIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import SuzukiHeroImage from "../../public/images//suzuki-hero.webp";
import JimnyImage from "../../public/images/jimny.webp";

const heroCtaLinks = [
  {
    label: "Products",
    href: "/cars",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Reviews",
    href: "/reviews",
  },
];

export default function Hero() {
  return (
    <div id="hero-section" className="relative min-h-screen">
      <div className="grid grid-cols-2 min-h-screen">
        {/* left section */}
        <div className="relative">
          <Image
            src={SuzukiHeroImage}
            alt="hero-section-1"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 right-0 w-full max-w-xl h-40">
            <div className="w-full h-full bg-foreground/50 backdrop-blur-md  grid grid-cols-2">
              <div className="relative w-full h-full min-h-0 overflow-hidden">
                <Image
                  src={JimnyImage}
                  alt="hero-section-2"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5 flex flex-col gap-2 justify-center">
                <p className="text-semibold font-suzuki-pro-headline text-white text-2xl">
                  Jimny gear to ProClaim
                </p>
                <p className="font-sans text-white text-sm">
                  Carve your own legendary path.
                </p>
                <button className="flex items-center gap-3.5 mt-4">
                  <div className="p-2 rounded-full bg-white flex items-center justify-center">
                    <PlusIcon className="w-4 h-4 text-black" />
                  </div>
                  <p className="font-sans text-white text-sm">Explore</p>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="relative bg-foreground w-full h-full flex flex-col justify-center gap-6 pb-10 pt-28 px-15 ">
          <p className="font-suzuki-pro-headline text-white text-7xl">
            The joy of driving is back.
          </p>
          <p className="font-sans text-gray-200 text-sm">
            Find your perfect Suzuki car today and experience unmatched
            performance, cutting-edge technology, and stylish design for every
            journey. Discover the full range of Suzuki vehicles built to meet
            your lifestyle, with special offers and exclusive features waiting
            for you.
          </p>
          <Link
            href="/cars"
            className="flex items-center gap-3.5 mt-4 group cursor-pointer"
          >
            <div className="p-4 rounded-full bg-transparent border border-gray-500 flex items-center justify-center group-hover:bg-white group-hover:text-primary-suzuki transition-all duration-300">
              <ChevronRight className="w-6 h-6 text-white group-hover:text-primary-suzuki transition-all duration-300" />
            </div>
            <p className="font-sans text-white text-sm group-hover:text-white transition-all duration-300">
              Discover more
            </p>
          </Link>

          <div className="w-full h-px bg-gray-500/80 mt-20" />

          <div className="flex items-center gap-4 justify-evenly w-full mt-10">
            {heroCtaLinks.map((link) => (
              <Link
                href={link.href}
                key={link.label}
                className="flex items-center gap-3.5 mt-4 group cursor-pointer"
              >
                <div className="p-2.5 rounded-full bg-transparent border border-gray-500 flex items-center justify-center group-hover:bg-white group-hover:text-primary-suzuki transition-all duration-300">
                  <ChevronRight className="w-4 h-4 text-white group-hover:text-primary-suzuki transition-all duration-300" />
                </div>
                <p className="font-sans text-white text-sm group-hover:text-white transition-all duration-300">
                  {link.label}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
