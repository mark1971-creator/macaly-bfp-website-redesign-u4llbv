"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SafeImg } from "@/components/safe-img";

// ─── Types ──────────────────────────────────────────────────────────────────
type ImageTextContent =
  | { type: "paragraph"; text: string }
  | { type: "ul"; items: string[] };

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "blockquote"; text: string }
  | { type: "image"; src: string; alt: string; caption: string }
  | {
      type: "skill-grid";
      variant: "icon" | "photo";
      items: Array<{ image: string; name: string; description: string }>;
    }
  | {
      type: "image-text-split";
      src: string;
      alt: string;
      content: ImageTextContent[];
    }
  | {
      type: "quote-grid";
      columns?: 2 | 3;
      italic?: boolean;
      items: Array<{ title: string; quote: string }>;
    };

export interface ArticleData {
  slug: string;
  title: string;
  date: string;
  author: string;
  image: string;
  blocks: Block[];
  sourceUrl: string;
  type: "article" | "case-study";
}

// ─── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navLinks = [
    { label: "ABOUT", href: "/about" },
    { label: "INSIGHT", href: "/insight" },
    { label: "IMPACT", href: "/impact" },
    { label: "ACADEMY", href: "/academy" },
    { label: "ASSESSMENTS", href: "/assessments" },
    { label: "CONTACT", href: "/#contact" },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            width={120}
            height={48}
            className="h-10 w-auto object-contain"
          />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <a
          href="https://beingatfullpotential.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all"
        >
          TAKE ASSESSMENT
        </a>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm tracking-[0.12em] text-white"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://beingatfullpotential.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-sm tracking-[0.12em] border border-gold text-gold px-4 py-2.5 text-center mt-2"
          >
            TAKE ASSESSMENT
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Heading helpers ─────────────────────────────────────────────────────────
function autoTitle(text: string): string {
  const stripped = text.replace(/:$/, "").trim();
  if (stripped === stripped.toLowerCase()) {
    return stripped.replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return stripped;
}

// ─── Skill Grid Block ────────────────────────────────────────────────────────
function SkillGridBlock({
  block,
}: {
  block: Extract<Block, { type: "skill-grid" }>;
}) {
  const isIcon = block.variant === "icon";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
      {block.items.map((item, i) => (
        <div key={i} className="flex flex-col items-center text-center gap-4">
          {isIcon ? (
            <div className="w-44 h-44 rounded-full overflow-hidden shrink-0 border border-foreground/10 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <SafeImg
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <div className="w-full aspect-[4/3] overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <SafeImg
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h4 className="font-display text-xl font-semibold text-navy leading-snug">
            {item.name}
          </h4>
          <p className="font-body text-[16px] text-foreground/75 leading-relaxed">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─── Quote Grid Block ─────────────────────────────────────────────────────────
function QuoteGridBlock({
  block,
}: {
  block: Extract<Block, { type: "quote-grid" }>;
}) {
  const cols = block.columns ?? 3;
  const isItalic = block.italic !== false;
  const colClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-6 my-10`}>
      {block.items.map((item, i) => (
        <div
          key={i}
          className="border border-gold/40 rounded-sm p-6 flex flex-col gap-4"
        >
          <h4 className="font-display text-xl font-semibold text-navy leading-snug">
            {item.title}
          </h4>
          <p
            className={`font-body text-[16px] text-foreground/75 leading-relaxed ${isItalic ? "italic" : ""}`}
            dangerouslySetInnerHTML={{ __html: item.quote }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Image Text Split Block ───────────────────────────────────────────────────
function ImageTextSplitBlock({
  block,
}: {
  block: Extract<Block, { type: "image-text-split" }>;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 my-10 items-start">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <SafeImg
          src={block.src}
          alt={block.alt}
          className="w-full rounded-sm object-cover"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            el.style.display = "none";
          }}
        />
      </div>
      <div className="pt-2">
        {block.content.map((c, i) => {
          if (c.type === "paragraph") {
            return (
              <p
                key={i}
                className="font-body text-[17px] text-foreground/80 leading-[1.85] mb-4"
                dangerouslySetInnerHTML={{ __html: c.text }}
              />
            );
          }
          if (c.type === "ul") {
            return (
              <ul key={i} className="mb-5 space-y-2 ml-1">
                {c.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 font-body text-[17px] text-foreground/80 leading-relaxed"
                  >
                    <span className="mt-[9px] shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

// ─── Block renderer ─────────────────────────────────────────────────────────
function RenderBlock({ block, index }: { block: Block; index: number }) {
  if (block.type === "skill-grid") {
    return <SkillGridBlock block={block} />;
  }

  if (block.type === "quote-grid") {
    return <QuoteGridBlock block={block} />;
  }

  if (block.type === "image-text-split") {
    return <ImageTextSplitBlock block={block} />;
  }

  if (block.type === "heading") {
    const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    const sizeMap: Record<number, string> = {
      1: "font-display text-3xl md:text-4xl font-light text-navy leading-tight mt-12 mb-2",
      2: "font-display text-2xl md:text-3xl font-light text-navy leading-tight mt-10 mb-4",
      3: "font-display text-xl md:text-2xl font-light text-navy mt-8 mb-3",
      4: "font-body text-lg font-semibold text-navy mt-6 mb-2",
      5: "font-body text-base font-semibold text-navy/80 mt-5 mb-2",
      6: "font-body text-sm font-semibold uppercase tracking-wider text-gold mt-4 mb-2",
    };

    // Detect numbered headings: "1. Title Text" or "2. Something"
    const numberedMatch = block.text.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      const [, num, title] = numberedMatch;
      const cleanTitle = autoTitle(title);
      const isLarge = block.level <= 1;
      return (
        <div className={`flex items-start gap-5 ${isLarge ? "mt-10 mb-5" : "mt-8 mb-4"}`}>
          <span className={`shrink-0 font-display text-gold leading-none ${isLarge ? "text-4xl pt-0.5" : "text-2xl pt-1"}`}>
            {num.padStart(2, "0")}
          </span>
          <Tag className={`${sizeMap[block.level] || sizeMap[2]} mt-0 mb-0`}>
            {cleanTitle}
          </Tag>
        </div>
      );
    }

    const cleanText = autoTitle(block.text);

    if (block.level === 1) {
      return (
        <Tag className={sizeMap[1]}>
          {cleanText}
        </Tag>
      );
    }

    return (
      <Tag className={sizeMap[block.level] || sizeMap[2]}>
        {cleanText}
      </Tag>
    );
  }

  if (block.type === "paragraph") {
    // Skip lines that look like author bylines (short, contain "|" and date-like text)
    if (block.text.match(/^\s*by .+\|\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i)) {
      return null;
    }
    return (
      <p className="font-body text-[17px] text-foreground/80 leading-[1.85] mb-5">
        {block.text}
      </p>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="mb-6 space-y-2 ml-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 font-body text-[17px] text-foreground/80 leading-relaxed">
            <span className="mt-[9px] shrink-0 w-1.5 h-1.5 rounded-full bg-gold" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
  }

  if (block.type === "ol") {
    return (
      <ol className="mb-6 space-y-2 ml-1">
        {block.items.map((item, i) => (
          <li key={i} className="flex items-start gap-3 font-body text-[17px] text-foreground/80 leading-relaxed">
            <span className="shrink-0 font-display text-gold text-lg leading-none mt-0.5 w-6 text-right">{i + 1}.</span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === "blockquote") {
    return (
      <blockquote className="my-8 pl-6 border-l-2 border-gold">
        <p className="font-display text-xl md:text-2xl font-light text-navy/80 italic leading-relaxed">
          {block.text}
        </p>
      </blockquote>
    );
  }

  if (block.type === "image" && block.src) {
    return (
      <figure className="my-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <SafeImg
          src={block.src}
          alt={block.alt || ""}
          className="w-full rounded-sm object-cover"
          onError={(e) => {
            const fig = e.currentTarget.closest("figure") as HTMLElement | null;
            if (fig) fig.style.display = "none";
          }}
        />
        {block.caption && (
          <figcaption className="mt-2 text-center font-body text-sm text-foreground/40 italic">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return null;
}

// ─── Wide block types ─────────────────────────────────────────────────────────
const WIDE_BLOCK_TYPES = new Set(["skill-grid", "image-text-split", "quote-grid"]);

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#141210] border-t border-gold/15 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <Link href="/">
            <Image
              src="/wp-content/uploads/2019/11/Logo-light.png"
              alt="BEING at Full Potential"
              width={120}
              height={48}
              className="h-10 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
          <nav className="flex flex-wrap items-center justify-center gap-6">
            {[
              { label: "About", href: "/about" },
              { label: "Insight", href: "/insight" },
              { label: "Impact", href: "/impact" },
              { label: "Academy", href: "/academy" },
              { label: "Assessments", href: "/assessments" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-body text-xs tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors uppercase"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="font-body text-xs text-white/25">
            © {new Date().getFullYear()} BEING at Full Potential
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Progress bar ────────────────────────────────────────────────────────────
function ReadingProgress() {
  return null; // Can enhance later
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function ArticleDetailContent({
  article,
  backHref,
  backLabel,
}: {
  article: ArticleData;
  backHref: string;
  backLabel: string;
}) {
  const contentBlocks = article.blocks;

  const formattedDate = article.date
    ? new Date(article.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-navy overflow-hidden pt-20">
        {/* Decorative rings */}
        <div className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none opacity-[0.06]">
          <div className="absolute inset-0 rounded-full border border-gold" />
          <div className="absolute inset-[14%] rounded-full border border-gold" />
          <div className="absolute inset-[28%] rounded-full border border-gold" />
          <div className="absolute inset-[42%] rounded-full border border-gold" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 lg:px-12 pt-14 pb-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-10">
            <Link
              href={backHref}
              className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase"
            >
              {backLabel}
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-xs tracking-[0.2em] text-gold/60 uppercase line-clamp-1 max-w-[200px]">
              {article.title}
            </span>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mb-6 flex-wrap">
            {article.type === "case-study" && (
              <span className="font-body text-[10px] tracking-[0.2em] uppercase bg-gold/15 text-gold px-3 py-1.5 border border-gold/20">
                Case Study
              </span>
            )}
            {article.date && (
              <span className="font-body text-xs text-white/40">{formattedDate}</span>
            )}
            {article.author && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="font-body text-xs text-white/40">{article.author}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl md:text-5xl lg:text-[52px] font-light text-white leading-[1.08] mb-0">
            {article.title}
          </h1>
        </div>
      </section>

      {/* Hero image — outside the navy banner */}
      {article.image && (
        <div className="w-full bg-background">
          <div className="max-w-4xl mx-auto px-6 lg:px-12 pt-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <SafeImg
              src={article.image}
              alt={article.title}
              className="w-full object-cover rounded-sm"
            />
          </div>
        </div>
      )}

      {/* ── ARTICLE BODY ─────────────────────────────────────────────────── */}
      <article className="bg-background py-14 lg:py-20">
        {contentBlocks.map((block, i) => {
          const isWide = WIDE_BLOCK_TYPES.has(block.type);
          return (
            <div
              key={i}
              className={
                isWide
                  ? "max-w-5xl mx-auto px-6 lg:px-12"
                  : "max-w-3xl mx-auto px-6 lg:px-12"
              }
            >
              <RenderBlock block={block} index={i} />
            </div>
          );
        })}
      </article>

      {/* ── CTA STRIP ────────────────────────────────────────────────────── */}
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Continue Exploring</p>
          <h2 className="font-display text-2xl md:text-4xl font-light text-white mb-8">
            More Thought Leadership
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={backHref}
              className="font-body text-xs tracking-[0.2em] uppercase border border-gold text-gold px-8 py-3.5 hover:bg-gold hover:text-white transition-all"
            >
              ← Back to {backLabel}
            </Link>
            <Link
              href="/thoughtleadership"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/20 text-white/60 px-8 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              All Articles
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
