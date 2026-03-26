import React from "react";
import WhatsappIcon from "../assets/icons/whatsapp";
import { WHATSAPP_NUMBER } from "../constants/whatsapp";

export default function Contact() {
  return (
    <section
      id="contact-section"
      className="w-full container mx-auto py-16 bg-white flex flex-col items-center"
    >
      <div className="w-full max-w-3xl relative pt-12 pb-12">
        {/* Horizontal line */}
        <div
          className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"
          aria-hidden
        />
        {/* Profile circle centered on the line */}
        <div className="relative flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 border-4 border-white shrink-0 overflow-hidden">
            FI
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 text-center -mt-2">
        <h2 className="text-2xl font-bold font-sans text-foreground">Fauzi</h2>
        <p className="text-base font-sans text-gray-500 max-w-md">
          I&apos;m here to help you find the perfect Suzuki car for your needs.
        </p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?from=suzuki-website`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-white font-sans text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <WhatsappIcon className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </section>
  );
}
