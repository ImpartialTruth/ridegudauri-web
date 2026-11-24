// Generates src/content/generated.json from the knowledge base in ../kb.
// Run: npm run content
// Public-facing text only: no bot price blocks, no DISCREPANCY lines.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const KB = path.resolve(here, "../../kb");
const OUT = path.resolve(here, "../src/content/generated.json");

const chunks = fs
  .readFileSync(path.join(KB, "chunks.jsonl"), "utf8")
  .split("\n")
  .filter(Boolean)
  .map((l) => JSON.parse(l));

const LOCALES = ["en", "ka", "ru"];
const SERVICES = ["ski-instructor", "snowmobile", "paragliding", "quad-bike", "rafting", "transfers-and-tours"];

const byId = (id) => chunks.find((c) => c.id === id);
const lines = (t) => t.split("\n").map((l) => l.trim()).filter(Boolean);

// Overrides: align public copy with the booking model (deposit online, balance on site)
// and remove services that are not offered (jeep tours, horse riding).
const FAQ_FIX = {
  en: {
    remove: [", jeep tours, and horse riding", ""],
    pay: "When you book online you pay a booking fee to secure your spot; the exact amount is shown in the booking form before you confirm. The remaining balance is paid in person at the meeting point before the activity begins. Please check with our team for any payment details specific to your reservation.",
  },
  ka: {
    remove: [", ჯიპ-ტურები და ცხენით ჯირითი", ""],
    pay: "ონლაინ დაჯავშნისას იხდით ჯავშნის საფასურს ადგილის დასაჯავშნად; ზუსტი თანხა ჩანს დაჯავშნის ფორმაში დადასტურებამდე. დარჩენილი თანხა იხდება შეხვედრის ადგილზე, აქტივობის დაწყებამდე. გადახდის დეტალები შეგიძლიათ გადაამოწმოთ ჩვენს გუნდთან.",
  },
  ru: {
    remove: [", джип-туры и конные прогулки", ""],
    pay: "При онлайн-бронировании вы оплачиваете сбор за бронирование, чтобы закрепить место; точная сумма видна в форме до подтверждения. Остаток оплачивается лично на месте встречи перед началом активности. Детали оплаты можно уточнить у нашей команды.",
  },
};
// Small wording fixes in the source text
const TEXT_FIX = [
  [/(Ride Gudauri)\s*\.\s*/g, "$1. "],
  [/ride\.Every/g, "ride. Every"],
  [/times\.For/g, "times. For"],
  [/one snowmobile\.If/g, "one snowmobile. If"],
];
const fix = (s) => TEXT_FIX.reduce((acc, [a, b]) => acc.replace(a, b), s);

const out = { generatedFrom: "kb/chunks.jsonl", crawled: chunks[0]?.crawled, locales: {} };

for (const lang of LOCALES) {
  const L = {};

  // ---------- services (description paragraphs only)
  L.services = {};
  for (const slug of SERVICES) {
    const c = byId(`${lang}/service-${slug}`);
    const ls = lines(c.text);
    const title = ls[0].replace(/^#\s*/, "");
    const desc = [];
    for (const l of ls.slice(1)) {
      if (l.startsWith("## ")) break; // generated price block starts here
      if (/^- /.test(l) || l.length < 40) continue; // ski chips (rendered from config instead)
      if (/booking notice|დაჯავშნის შესახებ|бронировани.*:$|Важная информация/i.test(l)) break;
      desc.push(fix(l));
    }
    L.services[slug] = { title, description: desc, url: c.url };
  }

  // ---------- FAQ
  L.faq = chunks
    .filter((c) => c.lang === lang && c.topic === "faq")
    .map((c) => {
      const m = c.text.match(/^FAQ \[(.*?)\]\nQ: (.*?)\nA: ([\s\S]*)$/);
      let a = m[3].trim();
      const num = c.id.split("faq-")[1];
      if (num === "02") a = a.replace(FAQ_FIX[lang].remove[0], FAQ_FIX[lang].remove[1]);
      if (num === "07" || num === "14") a = FAQ_FIX[lang].pay;
      return { id: num, category: m[1].replace(/​/g, "").trim(), q: m[2].trim(), a: lines(a) };
    });

  // ---------- company
  const about = lines(byId(`${lang}/company-about`).text);
  const sections = [];
  let cur = null;
  for (const l of about) {
    if (l.startsWith("# ")) continue;
    if (l.startsWith("## ")) {
      if (/About|შესახებ|Инструкторы|инструктор|ინსტრუქტორ/i.test(l) && /\(/.test(l)) break; // team list
      cur = { heading: l.slice(3), paragraphs: [] };
      sections.push(cur);
    } else if (cur) cur.paragraphs.push(l);
  }
  L.about = sections.filter((s) => s.paragraphs.length);
  const overview = lines(byId(`${lang}/company-overview`).text);
  L.overview = { heading: overview[0].replace(/^##\s*/, ""), paragraphs: overview.slice(1) };

  // ---------- legal docs (merge chunks in order, strip doc header)
  for (const topic of ["terms", "privacy"]) {
    const parts = chunks
      .filter((c) => c.lang === lang && c.topic === topic)
      .sort((a, b) => a.id.localeCompare(b.id));
    const body = [];
    for (const p of parts) for (const l of lines(p.text)) if (!l.startsWith("# ")) body.push(l);
    L[topic] = { title: parts[0].title, blocks: body };
  }

  // ---------- blog
  const BLOG_IMG = {
    "a-calm-flight-above-caucasus": "/images/paragliding-tandem.jpg",
    "quad-bike-adventures-in-gudauri": "/images/quad-bikes.jpg",
    "snowmobiling-in-gudauri": "/images/snowmobile.jpg",
    "ski-lessons-in-gudauri-learn-to-ski-with": "/images/ski-lesson.jpg",
    "rafting-in-georgia-discover-the-countrys": "/images/rafting.webp",
    "travel-comfortably-with-ride-gudauri": "/images/transfer.jpg",
  };
  const SLUG = {
    "a-calm-flight-above-caucasus": "a-calm-flight-above-caucasus",
    "quad-bike-adventures-in-gudauri": "quad-bike-adventures-in-gudauri",
    "snowmobiling-in-gudauri": "snowmobiling-in-gudauri",
    "ski-lessons-in-gudauri-learn-to-ski-with": "ski-lessons-in-gudauri",
    "rafting-in-georgia-discover-the-countrys": "rafting-in-georgia",
    "travel-comfortably-with-ride-gudauri": "travel-comfortably-with-ride-gudauri",
  };
  L.blog = chunks
    .filter((c) => c.lang === lang && c.topic === "blog")
    .map((c) => {
      const key = c.id.split("/blog-")[1];
      const ls = lines(c.text);
      const title = ls[0].replace(/^#\s*/, "");
      const body = ls.slice(1).filter((l) => !/^[A-Za-zА-Яа-яა-ჰ]+$/.test(l) || l.length > 30);
      const firstPara = body.find((l) => !l.startsWith("#") && !l.startsWith("- ")) ?? "";
      return { slug: SLUG[key], title, image: BLOG_IMG[key], date: "2026-08-12", excerpt: firstPara, body };
    });

  out.locales[lang] = L;
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("wrote", path.relative(process.cwd(), OUT));
