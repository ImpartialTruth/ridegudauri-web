"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BOOKING_RULES,
  calculatePrice,
  startTimes,
  windowFor,
  type ServicePricing,
} from "@/config/pricing";
import { submitBooking, getAvailability } from "@/lib/api";
import type { Dictionary, Locale } from "@/i18n/index";
import { Calendar, Check, Minus, Plus } from "./Icons";

type T = Dictionary["booking"];

const money = (n: number) => `${n.toLocaleString("en-US").replace(/,/g, " ")} ₾`;
const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function Stepper({
  value,
  min,
  max,
  onChange,
  label,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-field bg-white p-1" role="group" aria-label={label}>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="−"
      >
        <Minus width={16} height={16} />
      </button>
      <output className="w-8 text-center font-semibold tabular-nums" aria-live="polite">
        {value}
      </output>
      <button
        type="button"
        className="grid h-10 w-10 place-items-center rounded-full hover:bg-mist disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="+"
      >
        <Plus width={16} height={16} />
      </button>
    </div>
  );
}

export default function BookingWidget({
  locale,
  service,
  t,
  serviceTitle,
}: {
  locale: Locale;
  service: ServicePricing;
  t: T;
  serviceTitle: string;
}) {
  const slug = service.slug;
  const isMulti = service.mode === "multi";

  const [date, setDate] = useState("");
  const [optionKey, setOptionKey] = useState(service.options.length === 1 ? service.options[0].key : "");
  const [qty, setQty] = useState(service.minQty);
  const [items, setItems] = useState<Record<string, number>>({});
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[] | null>(null);
  const [details, setDetails] = useState("");
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  // bookable range: now + leadHours … now + horizonDays
  const { minDate, maxDate } = useMemo(() => {
    const now = new Date();
    const min = new Date(now.getTime() + BOOKING_RULES.leadHours * 3600_000);
    const max = new Date(now.getTime() + BOOKING_RULES.horizonDays * 86400_000);
    return { minDate: iso(min), maxDate: iso(max) };
  }, []);

  /** start times for the chosen date that respect the lead time */
  const timesForDate = useMemo(() => {
    if (!date) return [];
    const d = new Date(date + "T00:00:00");
    const earliest = Date.now() + BOOKING_RULES.leadHours * 3600_000;
    return startTimes(service, d).filter((tm) => new Date(`${date}T${tm}:00`).getTime() >= earliest);
  }, [date, service]);

  useEffect(() => {
    setTime("");
    if (!date || service.timeMode !== "slots") return;
    let alive = true;
    setSlots(null);
    getAvailability(slug, date, timesForDate).then((s) => alive && setSlots(s));
    return () => {
      alive = false;
    };
  }, [date, slug, service.timeMode, timesForDate]);

  const totalItems = Object.values(items).reduce((a, b) => a + b, 0);
  const selected = service.options.find((o) => o.key === optionKey);
  const onRequest = isMulti
    ? Object.entries(items).some(([k, q]) => q > 0 && service.options.find((o) => o.key === k)?.price === null)
    : selected?.price === null;
  const price = calculatePrice(service, isMulti ? { items } : { optionKey, qty });
  const win = date ? windowFor(service, new Date(date + "T00:00:00")) : service.windows[service.windows.length - 1];

  function validate() {
    if (!date || !time) return false;
    if (isMulti ? totalItems < 1 : !optionKey) return false;
    if (service.extras.some((e) => !extras[e.key])) return false;
    if (!customer.name.trim() || !customer.phone.trim() || !/^\S+@\S+\.\S+$/.test(customer.email)) return false;
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setError(t.required);
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await submitBooking({
        service: slug,
        locale,
        date,
        startTime: time,
        optionKey: isMulti ? undefined : optionKey,
        quantity: isMulti ? undefined : qty,
        items: isMulti ? items : undefined,
        extras,
        details: details || undefined,
        customer,
        quotedTotal: price?.total ?? null,
      });
      setReference(res.reference);
    } finally {
      setSending(false);
    }
  }

  function reset() {
    setReference(null);
    setDate("");
    setTime("");
    setItems({});
    setQty(service.minQty);
    setDetails("");
  }

  if (reference) {
    return (
      <div className="card p-8 text-center" role="status">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-glacier-soft text-glacier">
          <Check width={28} height={28} />
        </span>
        <h2 className="mt-5 text-2xl text-ink">{t.successTitle}</h2>
        <p className="mt-2 text-stone">{fill(t.successText, { ref: reference })}</p>
        <button type="button" onClick={reset} className="btn btn-outline mt-6">
          {t.another}
        </button>
      </div>
    );
  }

  const chip = (active: boolean) =>
    `rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
      active ? "border-ink bg-ink text-white" : "border-field bg-white text-ink hover:border-ink"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="card overflow-hidden" aria-labelledby="booking-title">
      <div className="border-b border-line bg-mist/60 px-6 py-5">
        <h2 id="booking-title" className="text-2xl text-ink">
          {t.title}
        </h2>
        <p className="mt-1 text-sm text-stone">{serviceTitle} · {t.subtitle}</p>
      </div>

      <div className="space-y-6 p-6">
        {/* date */}
        <div>
          <label htmlFor="bk-date" className="label">
            {t.date} *
          </label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              id="bk-date"
              type="date"
              className="field !pl-10"
              min={minDate}
              max={maxDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <p className="mt-1.5 text-xs text-stone">{fill(t.leadNote, { hours: BOOKING_RULES.leadHours })}</p>
        </div>

        {/* options */}
        <fieldset>
          <legend className="label">{t.optionLabel[slug]} *</legend>
          {isMulti ? (
            <div className="space-y-2">
              {service.options.map((o) => (
                <div key={o.key} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5">
                  <div className="min-w-0">
                    <p className="font-medium text-ink">{t.options[o.key]}</p>
                    <p className="text-sm text-stone">{o.price === null ? "—" : money(o.price)}</p>
                  </div>
                  <Stepper
                    label={t.options[o.key]}
                    value={items[o.key] ?? 0}
                    min={0}
                    max={(items[o.key] ?? 0) + (service.maxQty - totalItems)}
                    onChange={(v) => setItems((s) => ({ ...s, [o.key]: v }))}
                  />
                </div>
              ))}
              <p className="text-xs text-stone">{fill(t.maxVehicles, { max: service.maxQty })}</p>
            </div>
          ) : (
            <div className={`grid gap-2 ${service.options.length > 2 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"}`}>
              {service.options.map((o) => (
                <button
                  type="button"
                  key={o.key}
                  className={chip(optionKey === o.key)}
                  aria-pressed={optionKey === o.key}
                  onClick={() => setOptionKey(o.key)}
                >
                  <span className="block font-medium">{t.options[o.key]}</span>
                  <span className={`mt-0.5 block ${optionKey === o.key ? "text-white/70" : "text-stone"}`}>
                    {o.price === null ? "—" : money(o.price)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </fieldset>

        {/* quantity */}
        {!isMulti && service.maxQty > 1 && (
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="label !mb-0" id="bk-qty">
                {t.qtyLabel[slug]}
              </p>
              {service.mode === "per_booking" && (
                <p className="text-xs text-stone">{fill(t.sameprice, { max: service.maxQty })}</p>
              )}
            </div>
            <Stepper label={t.qtyLabel[slug]} value={qty} min={service.minQty} max={service.maxQty} onChange={setQty} />
          </div>
        )}

        {/* extras */}
        {service.extras.map((ex) => (
          <fieldset key={ex.key}>
            <legend className="label">{t.extras[ex.key].label} *</legend>
            <div className="flex flex-wrap gap-2">
              {ex.options.map((opt) => (
                <button
                  type="button"
                  key={opt}
                  aria-pressed={extras[ex.key] === opt}
                  onClick={() => setExtras((s) => ({ ...s, [ex.key]: opt }))}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    extras[ex.key] === opt ? "border-ink bg-ink text-white" : "border-field bg-white hover:border-ink"
                  }`}
                >
                  {t.extras[ex.key][opt]}
                </button>
              ))}
            </div>
          </fieldset>
        ))}

        {/* start time */}
        <fieldset>
          <legend className="label">{t.startTime} *</legend>
          {!date ? (
            <p className="rounded-xl bg-mist px-4 py-3 text-sm text-stone">{t.pickDateFirst}</p>
          ) : service.timeMode === "slots" ? (
            slots === null ? (
              <p className="text-sm text-stone">…</p>
            ) : slots.length === 0 ? (
              <p className="rounded-xl bg-mist px-4 py-3 text-sm text-stone">—</p>
            ) : (
              <>
                <p className="mb-2 text-xs text-stone">{t.slotsHint}</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {slots.map((s) => (
                    <button
                      type="button"
                      key={s}
                      aria-pressed={time === s}
                      onClick={() => setTime(s)}
                      className={`rounded-lg border py-2 text-sm tabular-nums ${
                        time === s ? "border-ink bg-ink text-white" : "border-field bg-white hover:border-ink"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )
          ) : (
            <>
              <select className="field" value={time} onChange={(e) => setTime(e.target.value)} aria-label={t.startTime}>
                <option value="">—</option>
                {timesForDate.map((tm) => (
                  <option key={tm} value={tm}>
                    {tm}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs text-stone">{fill(t.freeHint, { from: win.from, to: win.to })}</p>
            </>
          )}
        </fieldset>

        {/* details */}
        <div>
          <label htmlFor="bk-details" className="label">
            {t.details}
          </label>
          <textarea
            id="bk-details"
            rows={2}
            className="field resize-none"
            placeholder={t.detailsPlaceholder}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        {/* customer */}
        <fieldset className="space-y-3">
          <legend className="label">{t.contactTitle} *</legend>
          <input className="field" autoComplete="name" placeholder={t.name} aria-label={t.name} value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <input className="field" type="tel" autoComplete="tel" placeholder={t.phone} aria-label={t.phone} value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            <input className="field" type="email" autoComplete="email" placeholder={t.email} aria-label={t.email} value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
          </div>
        </fieldset>
      </div>

      {/* price */}
      <div className="border-t border-line bg-mist/60 p-6">
        {price ? (
          <dl className="space-y-2">
            <div className="flex justify-between text-stone">
              <dt>{t.total}</dt>
              <dd className="tabular-nums">{money(price.total)}</dd>
            </div>
            <div className="flex justify-between text-lg font-semibold text-ink">
              <dt>{t.payOnline}</dt>
              <dd className="tabular-nums">{money(price.payOnline)}</dd>
            </div>
            <div className="flex justify-between text-stone">
              <dt>{t.payOnArrival}</dt>
              <dd className="tabular-nums">{money(price.payOnArrival)}</dd>
            </div>
            <p className="pt-2 text-xs leading-relaxed text-stone">
              {price.payOnArrival === 0
                ? fill(t.noteFull, { online: money(price.payOnline) })
                : fill(t.note, { online: money(price.payOnline), rest: money(price.payOnArrival) })}
            </p>
          </dl>
        ) : onRequest ? (
          <p className="text-sm text-stone">{t.onRequestNote}</p>
        ) : (
          <p className="text-sm text-stone">—</p>
        )}

        {error && (
          <p className="mt-4 rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember-dark" role="alert">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-5 w-full" disabled={sending}>
          {sending ? t.submitting : t.submit}
        </button>
        <p className="mt-3 text-center text-xs text-stone">{t.demo}</p>
      </div>
    </form>
  );
}
