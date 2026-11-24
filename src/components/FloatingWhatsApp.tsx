import { SITE } from "@/config/site";
import { WhatsApp } from "./Icons";

export default function FloatingWhatsApp({ label }: { label: string }) {
  return (
    <a
      href={SITE.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="pulse-ring fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-[var(--shadow-lift)] transition-transform hover:scale-110 sm:bottom-7 sm:right-7"
    >
      <WhatsApp width={28} height={28} />
    </a>
  );
}
