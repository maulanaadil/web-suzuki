import WhatsappIcon from "../assets/icons/whatsapp";
import { WHATSAPP_NUMBER } from "../constants/whatsapp";

export default function WhatsAppWidget() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo%20Suzuki,%20saya%20ingin%20bertanya%20tentang%20mobil`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat via WhatsApp"
      className="fixed right-5 bottom-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform duration-200 hover:scale-105 hover:shadow-xl"
    >
      <WhatsappIcon className="h-5 w-5" />
      <span className="hidden text-sm font-medium sm:inline">Chat WhatsApp</span>
    </a>
  );
}
