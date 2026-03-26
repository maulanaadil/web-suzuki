import { ChevronRight } from "lucide-react";

const dealerMapEmbed =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.4368540471655!2d107.77797017507909!3d-6.957683668119986!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68c500b460afab%3A0x7cecc2f19f0f1560!2sSuzuki%20Rancaekek%20PT.Nusantara%20Jaya%20Sentosa!5e0!3m2!1sen!2sid!4v1773599673566!5m2!1sen!2sid";

const dealerInfo = {
  name: "Suzuki Rancaekek PT. Nusantara Jaya Sentosa",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Suzuki+Rancaekek+PT.Nusantara+Jaya+Sentosa",
};

export default function DealerAndService() {
  return (
    <div
      id="dealer-and-service-section"
      className="w-full bg-white py-16 container mx-auto px-4"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dealer: map + info */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
            Dealer
          </p>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="relative w-full aspect-4/3 min-h-[280px]">
              <iframe
                src={dealerMapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Suzuki Rancaekek - PT. Nusantara Jaya Sentosa location"
                className="absolute inset-0 w-full h-full"
              />
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <p className="font-sans font-semibold text-foreground">
                {dealerInfo.name}
              </p>
              <a
                href={dealerInfo.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 text-sm font-sans text-primary-suzuki hover:underline"
              >
                <ChevronRight className="w-4 h-4" />
                View on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Service Center */}
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold font-suzuki-pro-headline text-foreground">
            Service Center
          </p>
          <div className="rounded-xl border border-gray-200 shadow-sm p-6 min-h-[200px] flex flex-col justify-center">
            <p className="font-sans text-gray-600">
              Visit our service center for maintenance, repairs, and genuine
              parts. Same location as our dealer for your convenience.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
