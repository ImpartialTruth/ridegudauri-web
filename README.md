# Ride Gudauri — website (frontend)

New frontend for [ridegudauri.com](https://ridegudauri.com): ski school and mountain activities in Gudauri, Georgia.
The backend (bookings, payments, contact form, availability) is not built yet. The frontend calls it through one typed layer, `src/lib/api.ts`, which returns mock data today.

## Stack
- Next.js 15 (App Router, static generation) + TypeScript
- Tailwind CSS v4: design tokens live in `src/app/globals.css` (`@theme`)
- Fonts: Montserrat (Latin/Cyrillic) + Noto Sans Georgian, via `next/font`
- 3 languages: `/ka`, `/en`, `/ru`. `middleware.ts` redirects `/` using the cookie or `Accept-Language`

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run lint
```

## Structure
```
src/
  app/[locale]/        pages: home, activities, activity/[slug], about, faq, contact, blog, terms, privacy-policy
  components/          UI (Header, Footer, BookingWidget, FaqSearch, Reveal, …)
  config/pricing.ts    prices, deposits, time windows, booking rules — the single source of truth
  config/site.ts       phone, email, hours, social links
  i18n/{en,ka,ru}.ts   UI strings
  lib/content.ts       content access (today: generated JSON; later: API/CMS)
  lib/api.ts           frontend ↔ backend boundary (mocked)
  content/generated.json  page text generated from the knowledge base
scripts/build-content.mjs  regenerates content from ../kb (npm run content)
```

## Booking price logic
`calculatePrice()` in `src/config/pricing.ts` ports the old WordPress widget (`rgd-booking.js`). It returns Total, the "Pay online now" deposit, and the "Pay on arrival" balance. The booking form note is built from the same function, so the text and the math always agree.

Options without a published price (`price: null`) are shown as "on request" and never as 0 ₾.

## Open items (need the owner's confirmation)
Values marked `// UNCONFIRMED` in `src/config/pricing.ts` and `src/config/site.ts`:
- working hours: the old site showed both 10:00–17:00 and 10:00–19:00
- deposits: the old EN and KA/RU forms differ (EN values are used for now)
- ski lessons of 4–6 hours, and the 4- and 6-seat buggy prices

## Next steps
- Backend: `POST /api/bookings`, `POST /api/contact`, `GET /api/availability`, online payment
- AI chatbot (the knowledge base is ready)
