"use client";

import Image from "next/image";

import SuzukiHeroImage from "../../public/images//suzuki-hero.webp";
import BannerCarImage2 from "../../public/images/banner-cta-2.webp";
import BannerCarImage from "../../public/images/banner-cta.webp";
import JimnyImage from "../../public/images/jimny.webp";
import Button from "../components/button";
import { WHATSAPP_NUMBER } from "../constants/whatsapp";

export default function Hero() {
  return (
    <div id="hero-section" className="relative min-h-screen -mt-20">
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
              <div className="p-5 flex flex-col gap-1 justify-center">
                <p className="text-semibold font-suzuki-pro-headline text-white text-lg">
                  Taklukan medan dengan Jimny
                </p>
                <p className="font-sans text-white text-xs">
                  Mobil untuk segala medan.
                </p>
                <Button
                  label="Klik disini"
                  href="/cars/jimny"
                  className="w-48 mt-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* right section */}
        <div className="relative bg-white w-full h-full flex flex-col">
          <div className="relative h-full">
            <div className="absolute top-72 left-20 h-full flex flex-col gap-4 z-30">
              <p className="font-suzuki-pro-headline text-white text-xl w-10/12">
                Eksplore produk kami
              </p>
              <Button label="Cari sekarang" href="/cars" />
            </div>
            <Image
              src={BannerCarImage}
              alt="banner-car"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-full">
            <div className="absolute top-64 left-20 h-full flex flex-col gap-4 z-30">
              <p className="font-suzuki-pro-headline text-white text-xl w-10/12">
                Hubungi untuk mendapatkan penawaran terbaik
              </p>
              <Button
                label="Hubungi sekarang"
                onClick={() =>
                  window.open(
                    `https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Suzuki,%20saya%20ingin%20bertanya%20tentang%20mobil`,
                    "_blank",
                  )
                }
              />
            </div>
            <div className="relative h-full bg-foreground/50 backdrop-blur-md z-20"></div>
            <Image
              src={BannerCarImage2}
              alt="banner-car-2"
              fill
              className="object-cover"
            />
          </div>
          {/* <p className="font-suzuki-pro-headline text-white text-7xl">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
