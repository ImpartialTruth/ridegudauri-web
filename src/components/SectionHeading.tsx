export default function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <Tag className="mt-3 text-3xl leading-tight text-ink sm:text-4xl">{title}</Tag>
      {text && <p className="mt-4 text-lg leading-relaxed text-stone">{text}</p>}
    </div>
  );
}
