export const SITE = {
  name: "Ride Gudauri",
  url: "https://ridegudauri.com",
  phone: "+995 591 144 114",
  phoneHref: "tel:+995591144114",
  whatsapp: "https://wa.me/995591144114",
  email: "info@ridegudauri.com",
  // UNCONFIRMED: the old site shows 10:00-17:00 in the footer and 10:00-19:00 on the Contact page
  hours: { from: "10:00", to: "19:00" },
  altitude: "2,196 m",
  // ChatGe chat widget (https://github.com/ImpartialTruth/ChatGe)
  chatWidget: {
    src: "https://chatge-production.up.railway.app/widget.js",
    botId: "d0a2ea42-32ad-438d-88c6-21155184244d",
  },
  social: {
    instagram: "https://www.instagram.com/ridegudauri",
    facebook: "https://www.facebook.com/SnowSchoolGudauri",
    tiktok: "https://www.tiktok.com/@ride.gudauri",
  },
  team: ["ana", "rezi", "gabriel", "nikoloz", "george", "ketevan", "nikusha", "bidzo"],
} as const;
