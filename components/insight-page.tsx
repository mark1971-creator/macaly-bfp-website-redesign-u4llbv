"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SafeImg } from "@/components/safe-img";
import {
  getFeaturedInsightArticle,
  getInsightArticleHighlights,
} from "@/lib/articles";

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

// ─── Content data ──────────────────────────────────────────────────────────────
const featuredArticle = (() => {
  const a = getFeaturedInsightArticle();
  if (!a) {
    return {
      image: "/images/article-fallback.jpg",
      title: "Thought Leadership",
      date: "",
      excerpt: "",
      href: "/thoughtleadership",
      tag: "Insight",
    };
  }
  return {
    image: a.image,
    title: a.title,
    date: a.date,
    excerpt: a.excerpt,
    href: a.href,
    tag: "Thought Leadership",
  };
})();

const articles = getInsightArticleHighlights(3).map((a) => ({
  image: a.image,
  title: a.title,
  date: a.date,
  tag: "Insight",
  excerpt: a.excerpt,
  href: a.href,
}));

const videos = [
  {
    id: "CKyEUPsbnGw",
    title: "Being at Full Potential Introduction",
    description: "An overview of the BEING at Full Potential story, philosophy, and global impact.",
  },
  {
    id: "S9H02gLVCwo",
    title: "The CEO's Transformational Journey",
    description: "A leader's journey from performance-driven management to conscious, full-potential leadership.",
  },
  {
    id: "lG63mgOuhh8",
    title: "Heart in Business Research Project",
    description: "Exploring how heart-centered leadership drives better results for all stakeholders.",
  },
];

const books = [
  {
    image: "/images/books/coming-home-to-who-you-are.jpg",
    title: "Coming Home to Who You Are",
    author: "Mark Vandeneijnde & M. Aurelius Higgs",
    href: "https://www.amazon.com/dp/B0DYNQ1KVP",
  },
  {
    image: "/images/books/being-entrepreneur.jpg",
    title: "The BEING Entrepreneur",
    author: "Mark Vandeneijnde",
    href: "https://www.amazon.com/BEING-Entrepreneur-Inside-Out-Approach-Entrepreneurship/dp/B08L9V448T/",
  },
  {
    image: "/images/books/being-leader.jpg",
    title: "The BEING Leader",
    author: "Sujith Ravindran",
    href: "https://www.amazon.com/The-BEING-Leader-Tracing-Legendary/dp/0993721028/",
  },
  {
    image: "/images/books/mystical-laws-abundance.jpg",
    title: "Mystical Laws of Abundance",
    author: "Sujith Ravindran",
    href: "https://www.amazon.com/Mystical-Laws-Abundance-Guide-Effortless-ebook/dp/B07FPW54V9/",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function InsightPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const showToast = (msg: string) => setToast(msg);
  const hideToast = () => setToast(null);

  const [subscribeError, setSubscribeError] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Newsletter signup:", name, email);
    setSubscribeError(false);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) throw new Error("Subscribe failed");
      setSubscribed(true);
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Newsletter signup error:", err);
      setSubscribeError(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={hideToast} />}
      <Nav onNotImplemented={showToast} />

      {/* ── HERO ───────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy overflow-hidden">
        {/* Nature background image */}
        <SafeImg
          src="https://images.pexels.com/photos/9348873/pexels-photo-9348873.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Misty mountains at sunrise"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Navy overlay — preserves text legibility while letting nature breathe */}
        <div className="absolute inset-0 bg-navy/75" />
        {/* Decorative rings */}
        <div className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none opacity-[0.07]">
          <div className="absolute inset-0 rounded-full border border-gold" />
          <div className="absolute inset-[12%] rounded-full border border-gold" />
          <div className="absolute inset-[24%] rounded-full border border-gold" />
          <div className="absolute inset-[36%] rounded-full border border-gold" />
          <div className="absolute inset-[48%] rounded-full border border-gold" />
        </div>
        {/* Gold accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Insight</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Access{" "}
            <span className="text-gold">New Horizons</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-2xl leading-relaxed mt-6">
            We believe shifts in mindsets drive progress and innovation. We relentlessly challenge existing beliefs about success, performance, happiness — and the constructs that limit meaningful change.
          </p>
        </div>
      </section>

      {/* ── FEATURED ARTICLE ───────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-10">Featured Story</p>

          <Link
            href={featuredArticle.href}
            className="group grid lg:grid-cols-2 gap-0 overflow-hidden border border-border hover:border-gold/30 hover:shadow-2xl transition-all duration-500 bg-white"
          >
            <div className="relative aspect-[16/9] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-navy/5">
              <Image
                src={featuredArticle.image}
                alt={featuredArticle.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-navy/10" />
            </div>
            <div className="flex flex-col justify-center p-10 lg:p-14">
              <span className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-4 inline-block">
                {featuredArticle.tag}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-light text-navy leading-[1.15] mb-6 group-hover:text-gold transition-colors duration-300">
                {featuredArticle.title}
              </h2>
              <p className="font-body text-sm text-foreground/65 leading-relaxed mb-6">
                {featuredArticle.excerpt}
              </p>
              <div className="flex items-center gap-4">
                <div className="w-6 h-px bg-gold" />
                <span className="font-body text-xs text-gold/70">{featuredArticle.date}</span>
              </div>
              <span className="font-body text-xs tracking-[0.2em] uppercase text-gold mt-6 group-hover:underline">
                Read Full Article →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── THOUGHT LEADERSHIP ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Thought Leadership</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15]">
                Articles &amp; Research
              </h2>
            </div>
            <Link
              href="/thoughtleadership"
              className="hidden md:block font-body text-xs tracking-[0.2em] border border-navy text-navy px-6 py-3 hover:bg-navy hover:text-white transition-all"
            >
              VIEW ALL
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.title}
                href={article.href}
                className="group bg-white overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-navy/5">
                  <SafeImg
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="font-body text-xs tracking-[0.15em] text-gold uppercase">{article.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-gold/40" />
                    <span className="font-body text-xs text-foreground/40">{article.date}</span>
                  </div>
                  <h3 className="font-display text-xl font-light text-navy leading-snug mb-3 group-hover:text-gold transition-colors duration-300 flex-1">
                    {article.title}
                  </h3>
                  <p className="font-body text-sm text-foreground/60 leading-relaxed mb-5">{article.excerpt}</p>
                  <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link
              href="/thoughtleadership"
              className="font-body text-xs tracking-[0.2em] border border-navy text-navy px-8 py-4 hover:bg-navy hover:text-white transition-all inline-block"
            >
              VIEW ALL ARTICLES
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDEOS ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute left-[-200px] bottom-[-200px] w-[600px] h-[600px] pointer-events-none opacity-5">
          <div className="absolute inset-0 rounded-full border border-white" />
          <div className="absolute inset-[15%] rounded-full border border-white" />
          <div className="absolute inset-[30%] rounded-full border border-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Watch</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15]">
                Videos
              </h2>
            </div>
            <a
              href="https://www.youtube.com/@MarkVandeneijnde"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:block font-body text-xs tracking-[0.2em] border border-white/30 text-white/70 px-6 py-3 hover:border-gold hover:text-gold transition-all"
            >
              YOUTUBE CHANNEL
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="group flex flex-col">
                <div className="relative aspect-video bg-navy/60 overflow-hidden border border-white/10 group-hover:border-gold/30 transition-colors">
                  {playingVideo === video.id ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  ) : (
                    <>
                      <SafeImg
                        src={`https://img.youtube.com/vi/${video.id}/hqdefault.jpg`}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-navy/40 group-hover:bg-navy/20 transition-colors" />
                      {/* Play button */}
                      <button
                        onClick={() => setPlayingVideo(video.id)}
                        className="absolute inset-0 flex items-center justify-center"
                        aria-label={`Play ${video.title}`}
                      >
                        <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/50 transition-all backdrop-blur-sm">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="ml-1">
                            <path d="M6 4l12 6-12 6V4z" fill="white" />
                          </svg>
                        </div>
                      </button>
                    </>
                  )}
                </div>
                <div className="pt-5">
                  <h3 className="font-display text-lg font-light text-white mb-2 group-hover:text-gold transition-colors">
                    {video.title}
                  </h3>
                  <p className="font-body text-sm text-white/50 leading-relaxed">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <a
              href="https://www.youtube.com/@MarkVandeneijnde"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] border border-white/30 text-white/70 px-8 py-4 hover:border-gold hover:text-gold transition-all inline-block"
            >
              YOUTUBE CHANNEL
            </a>
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-12">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">What&apos;s On</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15]">
              Upcoming Events
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Event 1 — IDG */}
            <a
              href="/academy/idg-certification"
              className="group bg-white p-8 hover:shadow-xl transition-all duration-500 border-l-2 border-gold flex flex-col"
            >
              <span className="inline-block font-body text-xs tracking-widest uppercase text-gold bg-gold/10 px-3 py-1 mb-4 self-start">Online · 6 Weeks</span>
              <div className="aspect-[3/1] overflow-hidden mb-4 bg-navy flex items-center justify-center">
                <SafeImg
                  src="https://innerdevelopmentgoals.org/wp-content/uploads/2024/11/IDG_Logo_Horizontal_Tag_BW_Neg-600x328.png"
                  alt="Inner Development Goals"
                  className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                6-Week IDG Coach Certification Training
              </h3>
              <p className="font-body text-sm text-navy/60 leading-relaxed mb-4 flex-1">
                Get certified to administer the IDG Measurement Tool. Measure inner development, coach leaders on their SDG journey, and quantify your impact.
              </p>
              <p className="font-body text-xs text-navy/40 mb-4">September 17 – October 15, 2025</p>
              <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">Register Now →</span>
            </a>

            {/* Event 2 — HPCC */}
            <a
              href="/academy/apply"
              className="group bg-white p-8 hover:shadow-xl transition-all duration-500 border-l-2 border-gold flex flex-col"
            >
              <span className="inline-block font-body text-xs tracking-widest uppercase text-gold bg-gold/10 px-3 py-1 mb-4 self-start">Online · ICF Approved</span>
              <div className="aspect-[3/1] overflow-hidden mb-4 bg-navy/5">
                <SafeImg
                  src="https://images.pexels.com/photos/5711372/pexels-photo-5711372.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt="Human Potential Coach Certification"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <h3 className="font-display text-2xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                Human Potential Coach Certification Training — ICF Approved, 25 CCEUs
              </h3>
              <p className="font-body text-sm text-navy/60 leading-relaxed mb-4 flex-1">
                HPCC consists of 11 immersive modules that help unlock and amplify human potential, equipping you with transformational coaching tools.
              </p>
              <p className="font-body text-xs text-navy/40 mb-4">October 20 – December 1, 2026</p>
              <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">Apply Now →</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── BOOKS & PUBLICATIONS ───────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Publications</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15]">
              Books &amp; Research
            </h2>
            <p className="font-body text-foreground/60 mt-4 max-w-xl mx-auto leading-relaxed">
              Deep dives into Human Potential, conscious leadership, and the inner journey of transformation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {books.map((book) => (
              <a
                key={book.title}
                href={book.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center text-center"
              >
                <div className="relative w-full aspect-[2/3] mb-5 overflow-hidden shadow-lg group-hover:shadow-2xl transition-shadow duration-500">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/20 transition-colors duration-300 flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity font-body text-xs tracking-[0.2em] text-white uppercase bg-gold px-4 py-2">
                      Purchase
                    </span>
                  </div>
                </div>
                <h3 className="font-display text-base font-light text-navy mb-1 group-hover:text-gold transition-colors">
                  {book.title}
                </h3>
                <p className="font-body text-xs text-foreground/50">{book.author}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ─────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-white" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Stay Connected</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="font-body text-white/60 leading-relaxed mb-10">
            Hear about upcoming events, new articles, and inspiration for your Human Potential journey.
          </p>

          {subscribed ? (
            <div className="border border-gold/30 bg-gold/10 px-8 py-6 text-center">
              <p className="font-display text-xl text-white italic">Thank you for subscribing!</p>
              <p className="font-body text-sm text-white/60 mt-2">We'll be in touch with inspiration and updates.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="font-body text-sm px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold/60 transition-colors"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="font-body text-sm px-5 py-4 bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-gold/60 transition-colors"
              />
              <button
                type="submit"
                className="font-body text-xs tracking-[0.2em] bg-gold text-white px-8 py-4 hover:bg-gold/90 transition-colors"
              >
                SUBSCRIBE
              </button>
              {subscribeError && (
                <p className="font-body text-xs text-red-300 mt-2">
                  Something went wrong. Please try again or email mark@beingatfullpotential.com
                </p>
              )}
            </form>
          )}
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
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.
              </p>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Navigate</h4>
              <div className="space-y-3">
                {[
                  { label: "About", href: "/about", impl: true },
                  { label: "Insight", href: "/insight", impl: true },
                  { label: "Impact", href: "/impact", impl: true },
                  { label: "Academy", href: "/academy", impl: false },
                  { label: "Our Team", href: "/team", impl: true },
                ].map((l) =>
                  l.impl ? (
                    <Link key={l.label} href={l.href} className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <button key={l.label} onClick={() => showToast(`${l.label} page is coming soon!`)}
                      className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Connect</h4>
              <div className="space-y-3">
                <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Assessment Platform
                </a>
                <a href="https://www.facebook.com/BeingAtFullPotential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="https://twitter.com/beingatFP" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Twitter / X
                </a>
                <a href="https://www.linkedin.com/company/being-at-full-potential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <Link href="/#contact" className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-white/30">
              © 2026 BEING at Full Potential. All rights reserved.
            </p>
            <p className="font-display text-sm italic text-white/30">
              Every Human, BEING at Full Potential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
