/**
 * Single source of truth for prices and booking rules, shared by every locale.
 *
 * Values come from the live booking widget on ridegudauri.com (English config, 2026-11-24).
 * The live site uses different deposits on its EN and KA/RU forms, so every amount
 * marked UNCONFIRMED must be checked with the owner (see kb/conflicts_and_open_questions.md).
 * When the backend lands, this file is replaced by an API response with the same shape.
 */

export type ServiceSlug =
  | "ski-instructor"
  | "snowmobile"
  | "paragliding"
  | "quad-bike"
  | "rafting"
  | "transfers-and-tours";

export type PricingMode =
  /** price × quantity (per person, per boat, per snowmobile) */
  | "per_unit"
  /** one price per booking, quantity does not change it */
  | "per_booking"
  /** several vehicle types, each with its own quantity */
  | "multi";

export interface ServiceOption {
  key: string;
  /** null = price not published ("on request"); never rendered as 0 */
  price: number | null;
  /** online part per unit (per_unit/multi) or per booking (per_booking) */
  deposit: number;
  route?: { from: string; to: string };
}

export interface ExtraField {
  key: string;
  options: string[];
}

export interface TimeWindow {
  /** 1-12; omitted = all months */
  months?: number[];
  from: string;
  to: string;
}

export interface ServicePricing {
  slug: ServiceSlug;
  mode: PricingMode;
  options: ServiceOption[];
  minQty: number;
  maxQty: number;
  extras: ExtraField[];
  /** "slots" = choose from available start times, "free" = any time within window */
  timeMode: "slots" | "free";
  windows: TimeWindow[];
  stepMinutes: number;
  season: "winter" | "summer" | "all-year";
  image: string;
  gallery: string[];
  facts: { minAge?: number };
}

export const BOOKING_RULES = {
  /** booking must be at least this many hours before start */
  leadHours: 12,
  /** bookable this many days ahead */
  horizonDays: 120,
  currency: "GEL",
  symbol: "₾",
  /** display rates used by the old widget: 1 unit = x GEL */
  rates: { GEL: 1, USD: 2.6, EUR: 3.02 } as Record<string, number>,
} as const;

export const SERVICES: ServicePricing[] = [
  {
    slug: "ski-instructor",
    mode: "per_booking",
    options: [
      { key: "h1", price: 150, deposit: 50 },
      { key: "h2", price: 280, deposit: 50 },
      { key: "h3", price: 400, deposit: 50 },
      // UNCONFIRMED: 4-6 hour lessons exist in the old form with price 0
      { key: "h4", price: null, deposit: 0 },
      { key: "h5", price: null, deposit: 0 },
      { key: "h6", price: null, deposit: 0 },
    ],
    minQty: 1,
    maxQty: 5,
    extras: [
      { key: "lessonType", options: ["ski", "snowboard"] },
      { key: "level", options: ["beginner", "experienced"] },
    ],
    timeMode: "slots",
    windows: [{ from: "10:00", to: "17:00" }],
    stepMinutes: 30,
    season: "winter",
    image: "/images/ski-lesson.jpg",
    gallery: ["/images/gondola-snowboarders.png", "/images/gudauri-ski-map.jpg"],
    facts: { minAge: 3 },
  },
  {
    slug: "snowmobile",
    mode: "per_unit",
    options: [
      // UNCONFIRMED: EN form charges the full price online for 15 min and 1 h
      { key: "m15", price: 150, deposit: 150 },
      { key: "m30", price: 250, deposit: 100 },
      { key: "h1", price: 400, deposit: 400 },
    ],
    minQty: 1,
    maxQty: 5,
    extras: [],
    timeMode: "free",
    windows: [{ from: "10:00", to: "18:00" }],
    stepMinutes: 30,
    season: "winter",
    image: "/images/snowmobile.jpg",
    gallery: ["/images/snowmobile-2.webp"],
    facts: {},
  },
  {
    slug: "paragliding",
    mode: "per_unit",
    options: [{ key: "flight", price: 350, deposit: 100 }], // UNCONFIRMED deposit (KA/RU form: 50 flat)
    minQty: 1,
    maxQty: 50,
    extras: [],
    timeMode: "free",
    windows: [
      { months: [4, 5, 6, 7, 8, 9, 10], from: "10:00", to: "18:00" },
      { from: "10:00", to: "17:00" },
    ],
    stepMinutes: 30,
    season: "all-year",
    image: "/images/paragliding.jpg",
    gallery: ["/images/paragliding-tandem.jpg"],
    facts: {},
  },
  {
    slug: "quad-bike",
    mode: "multi",
    options: [
      { key: "quad", price: 150, deposit: 50 },
      { key: "buggy2", price: 300, deposit: 50 },
      { key: "buggy3", price: 500, deposit: 100 },
      { key: "buggy4", price: 600, deposit: 200 }, // UNCONFIRMED
      { key: "buggy6", price: 600, deposit: 200 }, // UNCONFIRMED: same price as buggy4
    ],
    minQty: 1,
    maxQty: 4,
    extras: [],
    timeMode: "free",
    windows: [{ from: "10:00", to: "17:00" }],
    stepMinutes: 30,
    season: "all-year",
    image: "/images/quad-group.webp",
    gallery: ["/images/quad-bikes.jpg"],
    facts: {},
  },
  {
    slug: "rafting",
    mode: "per_unit",
    options: [
      { key: "m30", price: 300, deposit: 100 },
      { key: "h1", price: 500, deposit: 100 },
    ],
    minQty: 1,
    maxQty: 5,
    extras: [],
    timeMode: "slots",
    windows: [{ from: "10:00", to: "17:00" }],
    stepMinutes: 30,
    season: "summer",
    image: "/images/rafting.webp",
    gallery: [],
    facts: {},
  },
  {
    slug: "transfers-and-tours",
    mode: "per_booking",
    options: [
      { key: "p1", price: 300, deposit: 100, route: { from: "gudauri", to: "tbilisi" } },
      { key: "p2", price: 500, deposit: 100, route: { from: "tbilisiAirport", to: "hotelGudauri" } },
    ],
    minQty: 1,
    maxQty: 12,
    extras: [{ key: "vehicle", options: ["sedan", "jeep", "minivan", "minibus", "bus"] }],
    timeMode: "free",
    windows: [{ from: "10:00", to: "17:00" }],
    stepMinutes: 30,
    season: "all-year",
    image: "/images/transfer.jpg",
    gallery: [],
    facts: {},
  },
];

export const getService = (slug: string) => SERVICES.find((s) => s.slug === slug);

/** Lowest published price, for "from X ₾" labels. */
export const fromPrice = (s: ServicePricing) =>
  Math.min(...s.options.filter((o) => o.price !== null).map((o) => o.price as number));

export interface PriceBreakdown {
  total: number;
  payOnline: number;
  payOnArrival: number;
}

/**
 * Port of depositFor()/renderPrice() from the old rgd-booking.js.
 * For "multi", pass quantities per option key; otherwise pass one option + quantity.
 * Returns null when any selected option has no published price.
 */
export function calculatePrice(
  s: ServicePricing,
  selection: { optionKey?: string; qty?: number; items?: Record<string, number> },
): PriceBreakdown | null {
  let total = 0;
  let online = 0;

  if (s.mode === "multi") {
    const items = Object.entries(selection.items ?? {}).filter(([, q]) => q > 0);
    if (!items.length) return null;
    for (const [key, qty] of items) {
      const o = s.options.find((x) => x.key === key);
      if (!o || o.price === null) return null;
      total += o.price * qty;
      online += o.deposit * qty;
    }
  } else {
    const o = s.options.find((x) => x.key === selection.optionKey);
    if (!o || o.price === null) return null;
    const qty = Math.max(s.minQty, selection.qty ?? s.minQty);
    if (s.mode === "per_unit") {
      total = o.price * qty;
      online = o.deposit * qty;
    } else {
      total = o.price;
      online = o.deposit;
    }
  }
  online = Math.min(total, Math.max(0, online));
  return { total, payOnline: online, payOnArrival: total - online };
}

/** Start-time window that applies on a given date. */
export function windowFor(s: ServicePricing, date: Date): TimeWindow {
  const m = date.getMonth() + 1;
  return s.windows.find((w) => !w.months || w.months.includes(m)) ?? s.windows[s.windows.length - 1];
}

/** All start times inside the window, e.g. ["10:00","10:30",...]. */
export function startTimes(s: ServicePricing, date: Date): string[] {
  const w = windowFor(s, date);
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));
  const out: string[] = [];
  for (let t = toMin(w.from); t <= toMin(w.to); t += s.stepMinutes) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`);
  }
  return out;
}
