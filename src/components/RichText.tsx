/**
 * Renders the line-based text stored in the KB:
 *  "## x" → h2, "### x" → h3, "- x" → list item.
 * Runs of short plain lines that follow a line ending in ":" become a list
 * (the legal pages store bullet lists that way).
 */
type Block = { type: "h2" | "h3" | "p"; text: string } | { type: "ul"; items: string[] };

function parse(lines: string[]): Block[] {
  const out: Block[] = [];
  let list: string[] | null = null;
  let listMode = false;
  const flush = () => {
    if (list?.length) out.push({ type: "ul", items: list });
    list = null;
  };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) continue;
    if (l.startsWith("## ") || l.startsWith("### ")) {
      flush();
      listMode = false;
      out.push({ type: l.startsWith("### ") ? "h3" : "h2", text: l.replace(/^#+\s*/, "") });
      continue;
    }
    if (l.startsWith("- ")) {
      (list ??= []).push(l.slice(2));
      continue;
    }
    const short = l.length < 70 && !/[.!?]$/.test(l);
    if (listMode && short) {
      (list ??= []).push(l);
      continue;
    }
    flush();
    listMode = l.endsWith(":");
    out.push({ type: "p", text: l });
  }
  flush();
  return out;
}

export default function RichText({ lines, className = "prose-rg" }: { lines: string[]; className?: string }) {
  return (
    <div className={className}>
      {parse(lines).map((b, i) => {
        if (b.type === "ul")
          return (
            <ul key={i}>
              {b.items.map((it, j) => (
                <li key={j}>{it}</li>
              ))}
            </ul>
          );
        if (b.type === "h2") return <h2 key={i}>{b.text}</h2>;
        if (b.type === "h3") return <h3 key={i}>{b.text}</h3>;
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
