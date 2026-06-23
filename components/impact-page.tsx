"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SafeImg } from "@/components/safe-img";
import { getCaseStudyCards } from "@/lib/articles";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

// ─── Toast ──────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="hsl(38,55%,50%)" strokeWidth="1.5" />
        <path d="M10 6v4M10 13v1" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </div>
  );
}

// ─── Navigation ─────────────────────────────────────────────────────────────
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
                  link.href === "/impact" ? "text-gold-light" : "text-white/70 hover:text-white"
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
                className="font-body text-sm tracking-[0.12em] text-white/80">{link.label}</Link>
            );
          })}
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-xs tracking-[0.15em] border border-gold text-gold px-5 py-2.5 text-center hover:bg-gold hover:text-white transition-all mt-2">
            TAKE ASSESSMENT
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#141210] border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-3 gap-12">
        <div>
          <Image
            src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            width={120}
            height={48}
            className="h-10 w-auto object-contain mb-6 opacity-80"
          />
          <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            Partnering with transformation catalysts and change agents to deliver greater impact.
          </p>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-5">Navigate</p>
          <div className="flex flex-col gap-3">
            {[
              { label: "About", href: "/about" },
              { label: "Insight", href: "/insight" },
              { label: "Impact", href: "/impact" },
              { label: "Assessments", href: "https://beingatfullpotential.io/", external: true },
            ].map((link) => (
              link.external
                ? <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
                    className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">{link.label}</a>
                : <Link key={link.label} href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-5">Contact</p>
          <a href="mailto:mark@beingatfullpotential.com"
            className="font-body text-sm text-white/50 hover:text-white/80 transition-colors block mb-3">
            mark@beingatfullpotential.com
          </a>
          <p className="font-body text-xs text-white/30 leading-relaxed">
            Global HQs in Europe, Americas & Asia-Pacific
          </p>
        </div>
      </div>
      <div className="border-t border-white/5 py-6">
        <p className="font-body text-xs text-white/25 text-center tracking-wide">
          © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Data ────────────────────────────────────────────────────────────────────
const stats = [
  { value: "200+", label: "Certified Coaches" },
  { value: "4", label: "Continents" },
  { value: "15+", label: "Years of Impact" },
  { value: "3", label: "Global HQs" },
];

const servicePillars = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5 23c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Individuals",
    subtitle: "Personal Transformation",
    body: "We coach individual change-makers, social entrepreneurs and organizational leaders to maximize their impact — helping you reconnect with the essence of who you are and fully express it in all aspects of your life.",
    href: "/individuals",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="9" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="19" cy="10" r="3.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M1 22c0-4.42 3.58-8 8-8M19 14c4.42 0 8 3.58 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M11 22c0-3.31 2.69-6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Teams",
    subtitle: "Collective Potential",
    body: "By going to the essence of what drives team performance, we help unlock the collective motivation, creativity, well-being, and resilience of your team — making the whole greater than the sum of its parts.",
    href: "/teams",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="12" width="22" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 12V9a5 5 0 0110 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="14" cy="18.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
    title: "Organizations",
    subtitle: "Cultural Transformation",
    body: "By creating a culture that promotes creativity, collaboration and trust, we help you unlock the next paradigm of value creation — leading naturally to breakthroughs in innovation, employee engagement, and performance.",
    href: "/organizations",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M4 11l10-6 10 6-10 6-10-6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8 13.5v5c0 2.21 2.69 4 6 4s6-1.79 6-4v-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M22 11v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Education",
    subtitle: "Human-Centric Learning",
    body: "Learn more about our book: Coming Home to Who You Are — Education ReEnlightened, and how the Inner Development Goals can support more human-centric learning journeys.",
    href: "/education",
    bookCta: true,
  },
];

const clientStories = [
  {
    name: "Andrew Thornton",
    role: "Owner, Thornton Budgens Supermarket",
    videoId: "_GYsorSLm3g",
    title: "Realizing Human Potential @ Thornton Budgens",
  },
  {
    name: "Laura Saldivar Luna",
    role: "Chief People Officer, Teach for America",
    videoId: "dmDgdhHuVE8",
    title: "Transformational Leadership at Teach for America",
  },
  {
    name: "Tanya Gonzalez",
    role: "Executive Director, Sacred Heart Center",
    videoId: "b5luUXhLGAc",
    title: "Transformational Leadership at Sacred Heart Center",
  },
  {
    name: "Dr. KS Saravanavasan",
    role: "VP Talent Development, Omega HMS",
    videoId: "0dvER8fIX0I",
    title: "Transformational Leadership at Omega HMS",
  },
];

const caseStudyResults: Record<
  string,
  Array<{ metric: string; label: string }>
> = {
  "siam-computing": [
    { metric: "IDG", label: "Inner Development Goals integrated into culture" },
    { metric: "Alignment", label: "Measured culture–values alignment" },
    { metric: "Engagement", label: "Stronger team collaboration & trust" },
    { metric: "Innovation", label: "Human-centric approach to tech services" },
  ],
  "omega-hms": [
    { metric: "+70%", label: "growth in existing client business" },
    { metric: "+30%", label: "growth in new client business" },
    { metric: "78 → 85", label: "Customer Orientation score" },
    { metric: "74 → 81", label: "Compassion score" },
  ],
  "business-case-human-potential-realisation": [
    { metric: "-7% → +5%", label: "like-for-like sales turnaround" },
    { metric: "+55%", label: "average employee service length" },
    { metric: "64%", label: "Human Potential score (8pts above benchmark)" },
    { metric: "+1.5pts", label: "gross margin improvement" },
  ],
};

const caseStudies = getCaseStudyCards().map((study) => ({
  image: study.image,
  client: study.client,
  sector: study.sector,
  title: study.title,
  summary: study.summary,
  results: caseStudyResults[study.slug] ?? [],
  href: study.href,
}));

function CaseStudyCard({ cs }: { cs: (typeof caseStudies)[0] }) {
  return (
    <Link
      href={cs.href}
      className="group bg-white/5 border border-white/10 hover:border-gold/30 overflow-hidden flex flex-col h-full transition-all duration-400 hover:bg-white/8"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-navy/30 shrink-0">
        <SafeImg
          src={cs.image}
          alt={cs.title}
          className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
        <div className="absolute bottom-4 left-5">
          <span className="font-body text-[10px] tracking-[0.2em] text-gold/80 uppercase bg-navy/70 backdrop-blur-sm px-3 py-1">
            {cs.sector}
          </span>
        </div>
      </div>

      <div className="p-7 flex flex-col flex-1">
        <p className="font-body text-xs tracking-[0.15em] text-gold/60 uppercase mb-2">{cs.client}</p>
        <h3 className="font-display text-2xl font-light text-white mb-4 group-hover:text-gold transition-colors duration-300">
          {cs.title}
        </h3>
        <p className="font-body text-sm text-white/50 leading-relaxed mb-7">{cs.summary}</p>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {cs.results.map((r) => (
            <div key={r.label} className="bg-white/5 border border-white/8 p-4">
              <p className="font-display text-xl text-gold mb-1">{r.metric}</p>
              <p className="font-body text-[11px] text-white/40 leading-snug">{r.label}</p>
            </div>
          ))}
        </div>

        <span className="font-body text-xs tracking-widest uppercase text-gold/60 group-hover:text-gold transition-colors mt-auto">
          Read Full Case Study →
        </span>
      </div>
    </Link>
  );
}

function CaseStudiesCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 md:-ml-6">
          {caseStudies.map((cs) => (
            <CarouselItem
              key={cs.href}
              className="pl-4 md:pl-6 basis-full lg:basis-1/2"
            >
              <CaseStudyCard cs={cs} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold text-white/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Previous case study"
        >
          ←
        </button>

        <div className="flex gap-2">
          {Array.from({ length: snapCount || caseStudies.length }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-white/20 hover:bg-gold/50"
              }`}
              aria-label={`Case study slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold text-white/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Next case study"
        >
          →
        </button>
      </div>
    </div>
  );
}

const testimonials = [
  {
    quote:
      "Together with HR, I have reviewed and endorsed the Being At Full Potential methodology and believe it could be a great enabler in our journey as a Team. You will therefore understand why I entirely trust the solidity of the self-assessment survey.",
    name: "Virginie Helias",
    title: "Vice President Global Sustainability",
    org: "Procter & Gamble",
  },
  {
    quote:
      "What you have created at Being at Full Potential is a gift to all of us. This week was evidence of transformation. Thank you for holding this space, which makes possible what previously felt impossible.",
    name: "Laura Saldivar Luna",
    title: "Chief People Officer",
    org: "Teach for America",
  },
  {
    quote:
      "What a magical experience last week with our team. I would love to discover and see how the work within the team could be continued.",
    name: "Michael Dawkins",
    title: "Programme Director",
    org: "SingularityU",
  },
  {
    quote:
      "We as Omega truly are inspired by your intent and we are experiencing a true partnership. We are really proud to have partnered with you.",
    name: "Saravanavasan KS",
    title: "Senior Director Human Resources",
    org: "Omega Healthcare Management Services",
  },
  {
    quote:
      "I knew your process would be different than other ways to plan forward, but I failed to comprehend its power for pulling out new insights.",
    name: "Andreas Schurek",
    title: "Managing Director",
    org: "TNS Switzerland",
  },
  {
    quote:
      "I very much appreciated your sense of warmth, openness and continuous training and improvement as we delivered the Human Potential Assessment with our client.",
    name: "Rodrigo Martinez-Romero",
    title: "Coordinator",
    org: "Institute for Centered Growth, Mexico",
  },
  {
    quote:
      "I admit to having been sceptical at first, but I'm fully converted into believing that I can bring about significant improvements to the way we work in our store.",
    name: "Paul Gardner",
    title: "Owner",
    org: "Budgens Supermarket, London",
  },
  {
    quote:
      "The HP Assessment Tool is not just another HR tool. It is a gateway to new possibilities bedded in the essence of who we are and could be — fostering the strength to create bold and transformational changes.",
    name: "Training Participant",
    title: "Human Potential Certification Training",
    org: "",
  },
];

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="bg-white border border-border p-7 flex flex-col h-full hover:border-gold/20 hover:shadow-md transition-all duration-300">
      <div className="font-display text-5xl text-gold/25 leading-none mb-4 select-none">"</div>
      <p className="font-body text-sm text-foreground/70 leading-relaxed flex-1 mb-6 italic">
        {t.quote}
      </p>
      <div className="pt-4 border-t border-border">
        <p className="font-display text-base text-navy">{t.name}</p>
        <p className="font-body text-xs text-foreground/50 mt-0.5">
          {t.title}{t.org ? ` · ${t.org}` : ""}
        </p>
      </div>
    </div>
  );
}

function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snapCount, setSnapCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      setSnapCount(api.scrollSnapList().length);
    };

    onSelect();
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api.off("reInit", onSelect);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div>
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {testimonials.map((t, i) => (
            <CarouselItem
              key={i}
              className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <TestimonialCard t={t} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          type="button"
          onClick={() => api?.scrollPrev()}
          className="w-10 h-10 border border-navy/20 hover:border-gold hover:text-gold text-navy/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Previous testimonial"
        >
          ←
        </button>

        <div className="flex gap-2">
          {Array.from({ length: snapCount || testimonials.length }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === current ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-navy/20 hover:bg-gold/50"
              }`}
              aria-label={`Testimonial slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => api?.scrollNext()}
          className="w-10 h-10 border border-navy/20 hover:border-gold hover:text-gold text-navy/40 transition-all duration-300 flex items-center justify-center"
          aria-label="Next testimonial"
        >
          →
        </button>
      </div>
    </div>
  );
}

const trustedOrgs = [
  { name: "Procter & Gamble", logo: "/images/clients/procter-gamble.png" },
  { name: "Teach for America", logo: "/images/clients/teach-for-america.jpg" },
  { name: "Omega Healthcare", logo: "/images/clients/omega-healthcare.png" },
  { name: "Reckitt", logo: "/images/clients/reckitt.png" },
  { name: "Motilal Oswal", logo: "/images/clients/motilal-oswal.png" },
  { name: "Essel Propack", logo: "/images/clients/essel-propack.png" },
  { name: "SingularityU", logo: "/images/clients/singularityu.png" },
  { name: "TNS Switzerland", logo: "/images/clients/tns-switzerland.png" },
  { name: "Thornton's Budgens", logo: "/images/clients/thorntons-budgens.png" },
];

// ─── Video Card ──────────────────────────────────────────────────────────────
function VideoCard({ story }: { story: typeof clientStories[0] }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="flex flex-col bg-white border border-border overflow-hidden group">
      <div className="relative aspect-video bg-navy/10 overflow-hidden">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1`}
            title={story.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <SafeImg
              src={`https://img.youtube.com/vi/${story.videoId}/maxresdefault.jpg`}
              alt={story.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-navy/40" />
            {/* Play button */}
            <button
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
              aria-label={`Play ${story.title}`}
            >
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-xl group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M8 5.5l9 5.5-9 5.5V5.5z" fill="currentColor" className="text-navy group-hover:text-white transition-colors" />
                </svg>
              </div>
            </button>
          </>
        )}
      </div>
      <div className="p-5">
        <p className="font-display text-base font-light text-navy leading-snug mb-2">{story.name}</p>
        <p className="font-body text-xs text-foreground/50">{story.role}</p>
      </div>
    </div>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function ImpactPage() {
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav onNotImplemented={showToast} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy overflow-hidden">
        {/* Nature background image */}
        <SafeImg
          src="https://images.pexels.com/photos/34392630/pexels-photo-34392630.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/75" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Rings */}
        <div className="absolute right-[-6%] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-[0.08]">
          <div className="absolute inset-0 rounded-full border border-gold" />
          <div className="absolute inset-[14%] rounded-full border border-gold" />
          <div className="absolute inset-[28%] rounded-full border border-gold" />
          <div className="absolute inset-[42%] rounded-full border border-gold" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/20 to-transparent" />
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Real Results</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Transformational{" "}
            <span className="text-gold">Impact</span>
          </h1>
          <p className="font-body text-lg text-white/55 max-w-2xl leading-relaxed">
            From individual leaders to global organizations — here is what becomes possible when human potential is truly unleashed.
          </p>
        </div>
      </section>



      {/* ── WHO WE SERVE ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Our Work</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">Who We Serve</h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              We partner with transformation catalysts and change agents.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicePillars.map((pillar) => (
              <Link key={pillar.title} href={pillar.href} className="group bg-white border border-border p-7 hover:border-gold/30 hover:shadow-lg transition-all duration-400 flex flex-col">
                <div className="text-gold mb-5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {pillar.icon}
                </div>
                <p className="font-body text-[10px] tracking-[0.2em] text-gold/70 uppercase mb-2">{pillar.subtitle}</p>
                <h3 className="font-display text-xl font-light text-navy mb-3">{pillar.title}</h3>
                <div className="font-body text-sm text-foreground/60 leading-relaxed mb-5 flex-1 space-y-3">
                  {pillar.body.split("\n\n").map((para, i) => (
                    <p key={i} className={para.startsWith('"') ? "italic text-foreground/50" : ""}>{para}</p>
                  ))}
                </div>
                <span className="font-body text-xs tracking-widest uppercase text-gold/70 group-hover:text-gold transition-colors mt-auto">
                  {(pillar as { bookCta?: boolean }).bookCta ? "Explore the Book →" : "Learn More →"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-secondary border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <p className="font-body text-[10px] tracking-[0.3em] text-foreground/40 uppercase text-center mb-10">
            Trusted by organizations worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
            {trustedOrgs.map((org) => (
              <div
                key={org.name}
                className="flex items-center justify-center group"
                title={org.name}
              >
                <SafeImg
                  src={org.logo}
                  alt={org.name}
                  className="h-10 w-auto max-w-[140px] object-contain opacity-50 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENT STORIES ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">In Their Own Words</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">Client Stories</h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              Leaders share their experience of transformation — in their own words.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clientStories.map((story) => (
              <VideoCard key={story.videoId} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
        {/* Background detail */}
        <div className="absolute left-[-10%] bottom-[-20%] w-[600px] h-[600px] rounded-full border border-gold/6 pointer-events-none" />
        <div className="absolute left-[-5%] bottom-[-10%] w-[400px] h-[400px] rounded-full border border-gold/6 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Deep Dives</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">Case Studies</h2>
            <p className="font-body text-base text-white/50 max-w-xl mx-auto leading-relaxed">
              Detailed accounts of transformation, with measurable results.
            </p>
          </div>

          <CaseStudiesCarousel />
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">What They Say</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">Voices of Transformation</h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              The words of those who have experienced what becomes possible at full potential.
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-secondary border-y border-border">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-4">Start Your Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6">
            Ready to Amplify Your Impact?
          </h2>
          <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
            Take the Human Potential Assessment and discover where your greatest leverage points are — for yourself, your team, or your entire organization.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://beingatfullpotential.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase bg-navy text-white px-10 py-4 hover:bg-navy/80 transition-colors"
            >
              Take the Assessment
            </a>
            <Link
              href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy text-navy px-10 py-4 hover:bg-navy hover:text-white transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
