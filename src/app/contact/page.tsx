import Image from "next/image";
import SALES_ADVISOR_IMAGE from "../../../public/images/sales-profile.jpeg";
import WhatsappIcon from "../../assets/icons/whatsapp";
import { WHATSAPP_NUMBER } from "../../constants/whatsapp";

const SALES_ADVISOR_NAME = "Zulham Fauzi";

export default function ContactPage() {
  return (
    <main className="bg-white">
      <section className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-suzuki">
            Contact Suzuki
          </p>
          <h1 className="mt-3 font-suzuki-pro-headline text-4xl text-foreground md:text-5xl">
            Temukan dan atur semua model Suzuki.
          </h1>
          <p className="mt-4 text-base text-gray-600 md:text-lg">
            Dapatkan rekomendasi model, detail promo terbaru, dan petunjuk
            kredit dari sales advisor kami.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 border border-gray-200 bg-gray-50 p-6 md:grid-cols-[2fr_1fr] md:p-10">
          <div>
            <div className="relative w-full max-w-2xl pt-10 pb-10">
              <div
                className="absolute inset-x-0 top-1/2 h-px bg-gray-300 -translate-y-1/2"
                aria-hidden
              />
              <div className="relative flex justify-center">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-50 bg-gray-200 text-2xl font-bold text-gray-700">
                  <Image
                    src={SALES_ADVISOR_IMAGE}
                    alt={SALES_ADVISOR_NAME}
                    width={96}
                    height={96}
                  />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-foreground">
              {SALES_ADVISOR_NAME}
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">
              Saya siap membantu Anda memilih mobil Suzuki yang tepat untuk
              kebutuhan sehari-hari, rencana keluarga, dan anggaran Anda.
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
            </div>
          </div>

          <aside className="border border-gray-200 bg-white p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Mengapa menghubungi kami
            </p>
            <ul className="mt-4 space-y-3 text-sm text-gray-600">
              <li>Respons cepat untuk pemesanan test drive.</li>
              <li>Promo dan simulasi kredit terbaru.</li>
              <li>Bantuan membandingkan varian sebelum pembelian.</li>
            </ul>
          </aside>
        </div>
      </section>
    </main>
  );
}
