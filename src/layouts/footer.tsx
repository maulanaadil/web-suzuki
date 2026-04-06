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
    href: "https://www.facebook.com/fauzi.suzuki.2025/",
    Icon: Facebook,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/suzukibandungraya5758/",
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

const footerLinks = [
  { label: "Products", href: "/cars" },
  { label: "Articles", href: "/articles" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
  { label: "Credit Calculator", href: "/credit-calculator" },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white">
      <div className="container mx-auto px-4 py-10 sm:py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Logo + social */}
          <div className="flex flex-col gap-6">
            <Link
              href="/"
              className="shrink-0 text-primary-suzuki hover:opacity-80 transition-opacity"
              aria-label="Suzuki Indonesia Home"
            >
              <SuzukiLogo
                width={140}
                height={28}
                className="text-primary-suzuki"
              />
            </Link>

            <div className="flex flex-wrap gap-4 sm:gap-6 items-center">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={`${href}?from=suzuki-website`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-foreground text-sm flex items-center gap-2 hover:text-primary-suzuki hover:underline underline-offset-2 transition-colors"
                >
                  <span className="text-primary-suzuki">
                    <Icon />
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick links (mobile: 2-col grid, desktop: row) */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:flex sm:gap-6">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-sans text-sm text-foreground hover:text-primary-suzuki transition-colors py-1"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Address */}
          <div className="font-sans text-foreground text-sm space-y-1 max-w-xs">
            <p className="font-semibold">Suzuki Indonesia</p>
            <p className="font-normal leading-relaxed">
              Jl. Rancaekek No.km 22, Jelegong, Kec. Rancaekek, Kabupaten
              Bandung, Jawa Barat (40391)
            </p>
            <p className="font-normal pt-1">Telephone: (+62) 81325702219</p>
          </div>
        </div>
      </div>

      {/* Lower section */}
      <div className="bg-foreground border-t border-gray-200">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <p className="font-sans text-white text-xs sm:text-sm">
            © 2026 Suzuki Indonesia. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded bg-background text-foreground hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
