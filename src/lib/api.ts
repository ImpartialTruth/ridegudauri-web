/**
 * Frontend ↔ backend boundary. Everything the UI sends to the server goes through
 * these functions. They are mocks today; replace the bodies with fetch() calls
 * once the backend exists. Keep the types stable.
 */
import type { ServiceSlug } from "@/config/pricing";
import type { Locale } from "@/i18n";

export interface BookingRequest {
  service: ServiceSlug;
  locale: Locale;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  optionKey?: string;
  quantity?: number;
  items?: Record<string, number>;
  extras: Record<string, string>;
  details?: string;
  customer: { name: string; phone: string; email: string };
  /** price shown to the user; the backend must recalculate and not trust it */
  quotedTotal: number | null;
}

export interface BookingResponse {
  ok: true;
  reference: string;
  /** will become a payment URL when online payment is connected */
  paymentUrl: string | null;
}

export interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  locale: Locale;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function submitBooking(req: BookingRequest): Promise<BookingResponse> {
  // TODO(backend): POST /api/bookings
  await wait(700);
  if (process.env.NODE_ENV !== "production") console.info("[mock] booking", req);
  return { ok: true, reference: "RG-" + Math.random().toString(36).slice(2, 8).toUpperCase(), paymentUrl: null };
}

export async function submitContact(req: ContactRequest): Promise<{ ok: true }> {
  // TODO(backend): POST /api/contact
  await wait(600);
  if (process.env.NODE_ENV !== "production") console.info("[mock] contact", req);
  return { ok: true };
}

/**
 * Free start times for slot-based services (ski lessons, rafting).
 * TODO(backend): GET /api/availability?service=&date= — the old site used admin-ajax.
 */
export async function getAvailability(_service: ServiceSlug, _date: string, all: string[]): Promise<string[]> {
  await wait(250);
  return all;
}
