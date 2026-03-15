"use client";

import Link from "next/link";
import SuzukiLogo from "../assets/icons/suzuki-logo";
import { ChevronUp, Facebook, Instagram, Youtube } from "lucide-react";

const socialLinks = [
  {
    label: "Twitter",
    href: "https://twitter.com/suzukiindonesia",
    Icon: () => (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
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
    label: "Youtube",
    href: "https://youtube.com/suzukiindonesia",
    Icon: Youtube,
  },
];

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-white">
      {/* Upper section */}
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
                href={href}
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
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <p className="font-sans text-gray-600 text-sm">
            © 2026 Suzuki Indonesia. All rights reserved.
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded bg-primary-suzuki text-white hover:opacity-90 transition-opacity"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
