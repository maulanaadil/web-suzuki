"use client";

import { ChevronUp, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import { SVGProps } from "react";
import SuzukiLogo from "../assets/icons/suzuki-logo";
import WhatsappIcon from "../assets/icons/whatsapp";
import { WHATSAPP_NUMBER } from "../constants/whatsapp";

const socialLinks = [
  {
    label: "Facebook",
    href: "https://facebook.com/suzukiindonesia",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://instagram.com/suzukiindonesia",
    Icon: Instagram,
  },
  {
    label: "Whatsapp",
    href: `https://wa.me/${WHATSAPP_NUMBER}`,
    Icon: (props: SVGProps<SVGSVGElement>) => (
      <WhatsappIcon size={24} color="#003478" {...props} />
    ),
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white">
      <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
        <Link
          href="/"
          className="shrink-0 text-primary-suzuki hover:opacity-80 transition-opacity"
          aria-label="Suzuki Indonesia Home"
        >
          <SuzukiLogo width={140} height={28} className="text-primary-suzuki" />
        </Link>

        <div className="flex flex-col gap-4 md:items-end md:text-right max-w-md md:max-w-sm">
          <div className="flex flex-wrap gap-6 items-center">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={`${href}?from=suzuki-website`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-foreground text-sm flex items-center gap-2 hover:text-primary-suzuki hover:underline underline-offset-2 transition-colors"
              >
                <span>{label}</span>
                <span className="text-primary-suzuki">
                  <Icon />
                </span>
              </a>
            ))}
          </div>

          <div className="font-sans text-foreground text-sm space-y-1">
            <p className="font-semibold">Suzuki Indonesia</p>
            <p className="font-normal">Address</p>
            <p className="font-normal leading-relaxed">
              Jl. Raya Bekasi Km. 19
              <br />
              Pulogadung, Jakarta Timur
              <br />
              (13920), DKI Jakarta, Indonesia
            </p>
            <p className="font-normal pt-1">Telephone: (+021) 2955 4800</p>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className="bg-foreground border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="font-sans text-white text-sm">
            © 2026 Suzuki Indonesia. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded bg-background text-foreground hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
