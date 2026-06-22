import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site-data";

export function FloatingWhatsApp() {
  return (
    <a
      href={waLink("Hi! I'd like to know more.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl animate-pulse-ring transition hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
