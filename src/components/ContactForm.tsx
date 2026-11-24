"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import type { Locale } from "@/i18n/index";
import { Check } from "./Icons";

interface Labels {
  formTitle: string;
  name: string;
  emailField: string;
  subject: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  required: string;
}

export default function ContactForm({ locale, labels: t }: { locale: Locale; labels: Labels }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || !form.message.trim()) {
      setError(t.required);
      return;
    }
    setError("");
    setState("sending");
    await submitContact({ ...form, locale });
    setState("sent");
  }

  if (state === "sent")
    return (
      <div className="card flex items-center gap-4 p-8" role="status">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-glacier-soft text-glacier">
          <Check width={24} height={24} />
        </span>
        <p className="text-lg text-ink">{t.sent}</p>
      </div>
    );

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 p-6 sm:p-8">
      <h2 className="text-2xl text-ink">{t.formTitle}</h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="label">{t.name} *</label>
          <input id="c-name" className="field" autoComplete="name" value={form.name} onChange={set("name")} />
        </div>
        <div>
          <label htmlFor="c-email" className="label">{t.emailField} *</label>
          <input id="c-email" type="email" className="field" autoComplete="email" value={form.email} onChange={set("email")} />
        </div>
      </div>
      <div>
        <label htmlFor="c-subject" className="label">{t.subject}</label>
        <input id="c-subject" className="field" value={form.subject} onChange={set("subject")} />
      </div>
      <div>
        <label htmlFor="c-message" className="label">{t.message} *</label>
        <textarea id="c-message" rows={5} className="field resize-y" value={form.message} onChange={set("message")} />
      </div>
      {error && (
        <p className="rounded-lg bg-ember/10 px-3 py-2 text-sm text-ember-dark" role="alert">
          {error}
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? t.sending : t.send}
      </button>
    </form>
  );
}
