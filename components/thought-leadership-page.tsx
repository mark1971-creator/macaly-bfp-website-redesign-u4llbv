"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { SafeImg } from "@/components/safe-img";
import { getLibraryArticles } from "@/lib/articles";

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="hsl(38,55%,50%)" strokeWidth="1.5" />
        <path d="M10 6v4M10 13v1" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────────
function Nav({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "ABOUT", href: "/about", implemented: true },
    { label: "INSIGHT", href: "/insight", implemented: true },
    { label: "IMPACT", href: "/impact", implemented: true },
    { label: "ACADEMY", href: "/academy", implemented: true },
    { label: "ASSESSMENTS", href: "/assessments", implemented: true },
    { label: "CONTACT", href: "/#contact", implemented: true },
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

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            if (!link.implemented) {
              return (
                <button key={link.label}
                  onClick={() => onNotImplemented("This page is coming soon — we're building it now!")}
                  className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">
                  {link.label}
                </button>
              );
            }
            return (
              <Link key={link.label} href={link.href}
                className={`font-body text-xs tracking-[0.15em] transition-colors ${
                  link.href === "/insight" ? "text-gold-light" : "text-white/70 hover:text-white"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            if (!link.implemented) return (
              <button key={link.label} onClick={() => { setMobileOpen(false); onNotImplemented("This page is coming soon!"); }}
                className="font-body text-sm tracking-[0.12em] text-white/70 text-left">{link.label}</button>
            );
            return (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-[0.12em] text-white">{link.label}</Link>
            );
          })}
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-sm tracking-[0.12em] border border-gold text-gold px-4 py-2.5 text-center mt-2">
            TAKE ASSESSMENT
          </a>
        </div>
      )}
    </header>
  );
}


// Article data from lib/article-content.json
const allArticles = getLibraryArticles();

const ARTICLES_PER_PAGE = 12;

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ThoughtLeadershipPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | "all">("all");
  const [visibleCount, setVisibleCount] = useState(ARTICLES_PER_PAGE);

  const showToast = (msg: string) => setToast(msg);
  const hideToast = () => setToast(null);

  // Derive unique years for filter
  const years = useMemo(() => {
    const unique = Array.from(new Set(allArticles.map((a) => a.year))).sort((a, b) => b - a);
    return unique;
  }, []);

  // Filtered articles
  const filtered = useMemo(() => {
    if (selectedYear === "all") return allArticles;
    return allArticles.filter((a) => a.year === selectedYear);
  }, [selectedYear]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  // Reset visible count when year filter changes
  const handleYearChange = (year: number | "all") => {
    setSelectedYear(year);
    setVisibleCount(ARTICLES_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={hideToast} />}
      <Nav onNotImplemented={showToast} />

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[52vh] flex items-end bg-navy overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 bg-navy" />
        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Decorative rings */}
        <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.08]">
          <div className="absolute inset-0 rounded-full border border-gold" />
          <div className="absolute inset-[14%] rounded-full border border-gold" />
          <div className="absolute inset-[28%] rounded-full border border-gold" />
          <div className="absolute inset-[42%] rounded-full border border-gold" />
        </div>
        {/* Left decorative line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/insight" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">
              Insight
            </Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">Thought Leadership</span>
          </div>

          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Archive</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Thought{" "}
            <span className="text-gold">Leadership</span>
          </h1>
          <p className="font-body text-lg text-white/55 max-w-2xl leading-relaxed">
            {allArticles.length} articles and case studies spanning a decade of research, reflection and insight on human potential, conscious leadership, and organizational transformation.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ────────────────────────────────────────────────────────── */}
      <section className="sticky top-20 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-hide">
            <span className="font-body text-xs tracking-[0.15em] text-foreground/40 uppercase shrink-0 mr-2">Filter:</span>
            <button
              onClick={() => handleYearChange("all")}
              className={`font-body text-xs tracking-[0.1em] px-4 py-2 border transition-all shrink-0 ${
                selectedYear === "all"
                  ? "border-navy bg-navy text-white"
                  : "border-border text-foreground/60 hover:border-navy/40 hover:text-navy"
              }`}
            >
              All Years
              <span className="ml-1.5 text-[10px] opacity-60">({allArticles.length})</span>
            </button>
            {years.map((year) => {
              const count = allArticles.filter((a) => a.year === year).length;
              return (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`font-body text-xs tracking-[0.1em] px-4 py-2 border transition-all shrink-0 ${
                    selectedYear === year
                      ? "border-gold bg-gold text-white"
                      : "border-border text-foreground/60 hover:border-gold/40 hover:text-gold"
                  }`}
                >
                  {year}
                  <span className="ml-1.5 text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ARTICLES GRID ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {/* Result count */}
          <div className="flex items-center justify-between mb-10">
            <p className="font-body text-sm text-foreground/50">
              Showing{" "}
              <span className="text-navy font-medium">{Math.min(visibleCount, filtered.length)}</span>
              {" "}of{" "}
              <span className="text-navy font-medium">{filtered.length}</span>
              {" "}articles
              {selectedYear !== "all" && (
                <span className="text-gold"> · {selectedYear}</span>
              )}
            </p>
            {selectedYear !== "all" && (
              <button
                onClick={() => handleYearChange("all")}
                className="font-body text-xs tracking-[0.1em] text-gold/70 hover:text-gold transition-colors uppercase"
              >
                ← Clear filter
              </button>
            )}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {visible.map((article) => (
              <Link
                key={article.href}
                href={article.href}
                className="group bg-white overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col border border-border hover:border-gold/20"
              >
                {/* Image */}
                <div className="relative aspect-[16/9] overflow-hidden bg-navy/5 shrink-0">
                  <SafeImg
                    src={article.image}
                    alt={article.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Meta row */}
                  <div className="flex items-center gap-2 mb-4 flex-wrap">
                    <span className="font-body text-[10px] tracking-[0.15em] text-gold/80 uppercase bg-gold/8 px-2 py-0.5">
                      {article.year}
                    </span>
                    {article.tag && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gold/30" />
                        <span className="font-body text-[10px] tracking-[0.15em] text-navy/70 uppercase bg-navy/5 px-2 py-0.5">
                          {article.tag}
                        </span>
                      </>
                    )}
                    <span className="w-1 h-1 rounded-full bg-gold/30" />
                    <span className="font-body text-xs text-foreground/40 truncate">{article.author}</span>
                  </div>

                  {/* Title */}
                  <h2 className="font-display text-lg font-light text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-300 flex-1">
                    {article.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="font-body text-sm text-foreground/55 leading-relaxed mb-5 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Footer row */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="font-body text-[11px] text-foreground/35">{article.date}</span>
                    <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="text-center mt-14">
              <button
                onClick={() => setVisibleCount((c) => c + ARTICLES_PER_PAGE)}
                className="font-body text-xs tracking-[0.2em] uppercase border border-navy text-navy px-10 py-4 hover:bg-navy hover:text-white transition-all"
              >
                Load More Articles
                <span className="ml-2 text-[10px] opacity-50">
                  ({filtered.length - visibleCount} remaining)
                </span>
              </button>
            </div>
          )}

          {/* All loaded state */}
          {!hasMore && filtered.length > ARTICLES_PER_PAGE && (
            <div className="text-center mt-14">
              <div className="inline-flex items-center gap-4">
                <div className="w-12 h-px bg-gold/40" />
                <span className="font-body text-xs tracking-[0.2em] text-foreground/40 uppercase">All articles shown</span>
                <div className="w-12 h-px bg-gold/40" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <div className="w-[700px] h-[700px] rounded-full border border-white" />
          <div className="absolute w-[500px] h-[500px] rounded-full border border-white" />
          <div className="absolute w-[300px] h-[300px] rounded-full border border-white" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Go Deeper</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] mb-6">
            Ready to Put These Ideas<br />
            <span className="text-gold">Into Practice?</span>
          </h2>
          <p className="font-body text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Our assessments, coaching programs, and certifications help leaders translate insight into lasting transformation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://beingatfullpotential.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] bg-gold text-white px-8 py-4 hover:bg-gold/90 transition-colors uppercase"
            >
              Take the Assessment
            </a>
            <Link
              href="/insight"
              className="font-body text-xs tracking-[0.2em] border border-white/30 text-white/70 px-8 py-4 hover:border-gold hover:text-gold transition-all uppercase"
            >
              Back to Insight
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#141210] border-t border-gold/15 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Image
                src="/wp-content/uploads/2019/11/Logo-light.png"
                alt="BEING at Full Potential"
                width={120}
                height={48}
                className="h-10 w-auto object-contain mb-6"
              />
              <p className="font-body text-sm text-white/40 leading-relaxed">
                Empowering conscious leaders and organizations to realize their full human potential since 2010.
              </p>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-5">Explore</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "About", href: "/about" },
                  { label: "Insight", href: "/insight" },
                  { label: "Thought Leadership", href: "/thoughtleadership" },
                  { label: "Assessments", href: "https://beingatfullpotential.io/" },
                ].map((link) => (
                  <a key={link.label} href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-5">Contact</p>
              <div className="flex flex-col gap-2">
                <a href="mailto:mark@beingatfullpotential.com"
                  className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">
                  mark@beingatfullpotential.com
                </a>
                <p className="font-body text-sm text-white/30 mt-2">
                  Global HQs on 3 continents
                </p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-xs text-white/25">
              © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
            </p>
            <a href="https://beingatfullpotential.com" target="_blank" rel="noopener noreferrer"
              className="font-body text-xs text-white/25 hover:text-white/50 transition-colors">
              beingatfullpotential.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
