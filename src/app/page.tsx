"use client";

import Image from "next/image";

import Articles from "./articles";
import Contact from "./contact";
import DealerAndService from "./dealer";
import Hero from "./hero";
import Testimonials from "./testimonials";

import Link from "next/link";
import SuzukiFronxBannerImage from "../../public/images/fronx-banner.webp";
import FindYourSuzukiSection from "./find-you-suzuki";

export default function HomePage() {
  return (
    <main id="landing-page" className="w-full h-full min-h-screen">
      <Hero />
      <FindYourSuzukiSection />
      <Articles />
      <Link
        href="/cars/fronx"
        className="container mx-auto block w-full cursor-pointer"
      >
        <Image
          src={SuzukiFronxBannerImage}
          alt="Suzuki Jimny"
          width={1535}
          height={1000}
          className="w-full h-auto"
        />
      </Link>
      <Testimonials />
      <DealerAndService />
      <Contact />
    </main>
  );
}
