"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import SuzukiHeroImage from "../../public/images//suzuki-hero.webp";
import BannerCarImage2 from "../../public/images/banner-cta-2.webp";
import BannerCarImage from "../../public/images/banner-cta.webp";
import Button from "../components/button";
import { WHATSAPP_NUMBER } from "../constants/whatsapp";

type CarItem = {
  slug: string;
  name: string;
  imageUrl: string | null;
};

export default function Hero() {
  const [featuredCar, setFeaturedCar] = useState<CarItem | null>(null);

  useEffect(() => {
    fetch("/api/cars")
      .then((res) => res.json())
      .then((json) => {
        const cars: CarItem[] = json.data ?? [];
        if (cars.length > 0) {
          setFeaturedCar(cars[Math.floor(Math.random() * cars.length)]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div id="hero-section" className="relative min-h-screen -mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
        {/* left / top section */}
        <div className="relative min-h-[60vh] md:min-h-0">
          <Image
            src={SuzukiHeroImage}
            alt="hero-section-1"
            fill
            className="object-cover"
          />
          {featuredCar && (
            <div className="absolute bottom-0 left-0 right-0 md:right-0 md:left-auto md:max-w-xl h-32 sm:h-36 md:h-40">
              <div className="w-full h-full bg-foreground/50 backdrop-blur-md grid grid-cols-2">
                <div className="relative w-full h-full min-h-0 overflow-hidden">
                  {featuredCar.imageUrl && (
                    <Image
                      src={featuredCar.imageUrl}
                      alt={featuredCar.name}
                      width={300}
                      height={200}
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-3 sm:p-5 flex flex-col gap-1 justify-center">
                  <p className="text-semibold font-suzuki-pro-headline text-white text-sm sm:text-lg">
                    Temukan {featuredCar.name}
                  </p>
                  <p className="font-sans text-white text-xs hidden sm:block">
                    Mobil untuk segala medan.
                  </p>
                  <Button
                    label="Klik disini"
                    href={`/cars/${featuredCar.slug}`}
                    className="w-36 sm:w-48 mt-2 sm:mt-4"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* right / bottom section */}
        <div className="relative bg-white w-full h-full flex flex-col">
          <div className="relative h-[40vh] md:h-full">
            <div className="absolute bottom-8 left-6 sm:left-10 md:bottom-auto md:top-72 md:left-20 flex flex-col gap-3 md:gap-4 z-30">
              <p className="font-suzuki-pro-headline text-white text-lg md:text-xl w-10/12">
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
          <div className="relative h-[40vh] md:h-full">
            <div className="absolute bottom-8 left-6 sm:left-10 md:bottom-auto md:top-64 md:left-20 flex flex-col gap-3 md:gap-4 z-30">
              <p className="font-suzuki-pro-headline text-white text-lg md:text-xl w-10/12">
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
        </div>
      </div>
    </div>
  );
}
