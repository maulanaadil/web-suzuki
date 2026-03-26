import { PhoneCall } from "lucide-react";

import WhatsappIcon from "../../assets/icons/whatsapp";
import { WHATSAPP_NUMBER } from "../../constants/whatsapp";

const SALES_ADVISOR_NAME = "Fauzi";
const SALES_ADVISOR_PHONE = "+62 813-2570-2219";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="container mx-auto px-4 py-16 md:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-suzuki">
            Contact Suzuki
          </p>
          <h1 className="mt-3 font-suzuki-pro-headline text-4xl text-foreground md:text-5xl">
            Let&apos;s find your next Suzuki
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Get model recommendations, latest promo details, and financing
            guidance from our sales advisor.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 rounded-3xl border border-gray-200 bg-gray-50 p-6 md:grid-cols-[2fr_1fr] md:p-10">
          <div>
            <div className="relative w-full max-w-2xl pt-10 pb-10">
              <div
                className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"
                aria-hidden
              />
              <div className="relative flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-50 bg-gray-200 text-2xl font-bold text-gray-700">
                  FI
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground">
              {SALES_ADVISOR_NAME}
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              I&apos;m here to help you choose the right Suzuki car for your
              daily needs, family plans, and budget.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?from=suzuki-website`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <WhatsappIcon className="h-5 w-5" />
                Chat on WhatsApp
              </a>
              <a
                href={`tel:${WHATSAPP_NUMBER}`}
                className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-100"
              >
                <PhoneCall className="h-4 w-4" />
                {SALES_ADVISOR_PHONE}
              </a>
            </div>
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Why contact us
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Fast response for test-drive booking.</li>
              <li>Up-to-date promo and financing simulation.</li>
              <li>Help comparing variants before purchase.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
