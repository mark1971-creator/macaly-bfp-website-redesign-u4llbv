"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Navigation ───────────────────────────────────────────────────────────────
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
            src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
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
                  className="font-body text-xs tracking-[0.15em] text-white/50 hover:text-white/70 transition-colors cursor-not-allowed">
                  {link.label}
                </button>
              );
            }
            return (
              <Link key={link.label} href={link.href}
                className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            if (!link.implemented) {
              return (
                <button key={link.label}
                  onClick={() => { onNotImplemented("Coming soon!"); setMobileOpen(false); }}
                  className="font-body text-xs tracking-[0.2em] text-white/40 text-left">
                  {link.label}
                </button>
              );
            }
            return (
              <Link key={link.label} href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-body text-xs tracking-[0.2em] text-white/70 hover:text-white transition-colors">
                {link.label}
              </Link>
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

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#141210] border-t border-gold/15 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <Image
            src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            width={110}
            height={44}
            className="h-9 w-auto object-contain mb-5"
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
              { label: "Academy", href: "/academy" },
              { label: "Assessments", href: "/assessments" },
            ].map((link) => (
              <Link key={link.label} href={link.href}
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

// ─── Data ─────────────────────────────────────────────────────────────────────

const assessmentTiers = [
  {
    id: "individual",
    tag: "Free · Self-Discovery",
    title: "Individual",
    subtitle: "Human Potential Assessment",
    description:
      "Reconnect with the essence of who you are and why you are here. Our free online assessment reveals the 4 Being States and 23 dimensions of your unique human potential — helping you understand where you are today and identify the key areas for your next chapter of growth.",
    features: [
      "4 Being States · 23 dimensions mapped",
      "Personalised debrief report",
      "Clarity on your growth edges",
      "Free — available to all",
    ],
    cta: { label: "Take the Free Assessment", href: "https://beingatfullpotential.io/", external: true },
    secondaryCta: { label: "Explore 1-on-1 Coaching", href: "/individuals" },
    image: "https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/ZHRI1C6u3G1G0F2fJBPxs.png",
    imageAlt: "Human Potential House — 4 Being States and 23 dimensions framework",
    imageBg: "bg-white",
  },
  {
    id: "team",
    tag: "Teams & Facilitation",
    title: "Teams",
    subtitle: "Full Potential Team Assessment",
    description:
      "Unlock the collective motivation, creativity, well-being, and resilience of your team. Our assessment measures the 5 Full Potential Team Measures — delivered through an immersive facilitation process that transforms tensions into collective breakthroughs.",
    features: [
      "5 Full Potential Team Measures wheel",
      "Collective team potential profile",
      "Facilitated sense-making session",
      "Concrete team development roadmap",
    ],
    cta: { label: "Request a Team Assessment", href: "/#contact", external: false },
    secondaryCta: { label: "Explore Team Work", href: "/teams" },
    image: "https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/UsR3nSiEakqkK3u6f7irZ.jpg",
    imageAlt: "Full Potential Team Measures — 5-segment wheel diagram",
    imageBg: "bg-white",
  },
  {
    id: "organisation",
    tag: "Enterprise · Cultural Transformation",
    title: "Organisations",
    subtitle: "Organisational Human Potential Assessment",
    description:
      "Surface the invisible drivers of organisational performance. Our iceberg methodology works on the 8 Being Attitudes beneath the surface — creating measurable breakthroughs across the 6 Organisational Performance Metrics that matter most to leaders.",
    features: [
      "8 Being Attitudes measured across your culture",
      "6 Organisational Performance Metrics baseline",
      "Cross-functional alignment sessions",
      "Multi-year transformation roadmap",
    ],
    cta: { label: "Request an Org Assessment", href: "/#contact", external: false },
    secondaryCta: { label: "Read Case Studies", href: "/organizations" },
    image: "https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/WxUEW5bIXWP2TdX4DCB8i.jpg",
    imageAlt: "Human Potential Iceberg — 4 Being States, 8 Being Attitudes, and 6 Organisational Performance Metrics",
    imageBg: "bg-white",
  },
  {
    id: "idg",
    tag: "Education & Sustainability",
    title: "IDG",
    subtitle: "Inner Development Goals Assessment",
    description:
      "Measure the 25 inner capacities identified by the Inner Development Goals initiative — the human qualities needed to address the complex challenges of our time. Ideal for educational institutions, leadership programmes, and social-sector organisations.",
    features: [
      "5 IDG dimensions · 25 inner capacities",
      "Individual & collective IDG profiles",
      "Aligned with UN Sustainable Development Goals",
      "Designed for schools, universities & L&D teams",
    ],
    cta: { label: "Take the Free IDG Assessment", href: "https://idgmeasurement.beingatfullpotential.io", external: true },
    secondaryCta: { label: "Learn About Education Work", href: "/education" },
    image: "https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/H5SxPqToIxJ6I_z-Gw-ar.jpg",
    imageAlt: "IDG Framework — 5 dimensions: Being, Thinking, Relating, Collaborating, Acting",
    imageBg: "bg-white",
  },
];

const sixOPMs = [
  {
    title: "Customer Orientation",
    description: "Creating genuine value for customers through a deep understanding of their evolving needs.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 20c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M19 8h2M3 8h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Trustworthiness",
    description: "Living and leading from integrity — cultivating trust as a quality expressed from the inside out.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3l7 4v5c0 4.418-3.134 8.556-7 9.9C5.134 20.556 2 16.418 2 12V7l10-4z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M8 12l2.5 2.5L16 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Self-Leadership",
    description: "Moving from reactive to responsive — leading from a place of inner clarity and conscious choice.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M5.636 5.636l2.122 2.122M16.243 16.243l2.121 2.121M5.636 18.364l2.122-2.121M16.243 7.757l2.121-2.121" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Getting Things Done",
    description: "When the BEING comes alive, the DOING thrives — inspired execution rooted in purpose.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M9 11l2.5 2.5L16 8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    title: "Inventiveness",
    description: "Creating breakthrough ideas and radically new approaches that open previously unseen possibilities.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a7 7 0 0 1 4 12.794V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.206A7 7 0 0 1 12 2z" stroke="currentColor" strokeWidth="1.3" />
        <path d="M9 21h6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Employee Engagement",
    description: "Unlocking meaning and purpose at work — the deepest and most sustainable driver of performance.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 21C12 21 4 16 4 9.5a4.5 4.5 0 0 1 8-2.826A4.5 4.5 0 0 1 20 9.5C20 16 12 21 12 21z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const teamMindsets = [
  { title: "Standards of Being", description: "Sustained conditions for trust, respect, and openness to new thinking" },
  { title: "Meaningful Purpose", description: "Rallying behind a shared mission and creating concrete opportunities" },
  { title: "Opportunity Seeking", description: "Reframing situations to find the third way — the win-win" },
  { title: "Shine in Wholeness", description: "Seeing people in their full dimension beyond their functional role" },
  { title: "Unconditional Dependability", description: "Following through on commitments and communicating proactively" },
];

const testimonials = [
  {
    quote: "The HP Assessment Tool is not just another HR, leadership or personal growth tool. It is a gateway to new possibilities, bedded in the essence of who we are and could be. It touches those deep and delicate places in us that foster the strength to create bold and transformational changes.",
    name: "Training Participant",
    role: "Human Potential Certification Training",
  },
  {
    quote: "I am SO impressed with the HP instrument to stimulate powerful conversations! Simply opening up questions about a few dimensions on the instrument led to a GREAT conversation! I am really looking forward to future use with my clients.",
    name: "Training Participant",
    role: "Human Potential Certification Training",
  },
  {
    quote: "I admit to having been sceptical at first about the process and the likely benefits it would bring — but I'm fully converted into believing that I can bring about significant improvements to the way we work and put us in a good place for the future.",
    name: "Paul Gardner",
    role: "Owner, Budgens Supermarket, London",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Nav onNotImplemented={(msg) => setToast(msg)} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/17301679/pexels-photo-17301679.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Sunbeams piercing through clouds over a scenic mountain and valley at sunset"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/75" />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />
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

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Human Potential Assessment</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Measure What{" "}
            <span className="text-gold italic">Matters Most</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-2xl leading-relaxed mt-6">
            Most organisations measure the visible tip of the iceberg. We go deeper —
            quantifying the human qualities that drive innovation, engagement, and
            sustainable performance at every level.
          </p>
        </div>

        {/* Scroll cue — kept for a11y anchor */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-body text-[9px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── FOUR ASSESSMENT TOOLS ─────────────────────────────────────────────── */}
      <section id="assessments" className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Assessment Tools</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">
              Four Pathways to Full Potential
            </h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              Whether you are an individual, a team, an organisation, or an educational institution —
              there is a purpose-built assessment designed for your journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {assessmentTiers.map((tier) => (
              <div
                key={tier.id}
                className="bg-white border border-border flex flex-col hover:border-gold/40 hover:shadow-2xl transition-all duration-500 group overflow-hidden"
              >
                {/* Navy label strip */}
                <div className="bg-navy px-8 py-5">
                  <p className="font-body text-[10px] tracking-[0.3em] text-gold/60 uppercase mb-1">{tier.tag}</p>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-2xl font-light text-white">{tier.title}</h3>
                    <span className="font-body text-xs text-white/40 tracking-wide hidden sm:block">— {tier.subtitle}</span>
                  </div>
                </div>

                {/* Framework image */}
                <div className={`${tier.imageBg} border-b border-border px-8 pt-8 pb-6 flex items-center justify-center min-h-[260px] overflow-hidden`}>
                  <img
                    src={tier.image}
                    alt={tier.imageAlt}
                    className="max-h-[220px] w-auto object-contain group-hover:scale-[1.03] transition-transform duration-700"
                  />
                </div>

                {/* Body */}
                <div className="p-8 flex flex-col flex-1">
                  <p className="font-body text-sm text-foreground/70 leading-relaxed mb-6">{tier.description}</p>

                  <ul className="space-y-2.5 mb-8 flex-1">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-3">
                        <div className="w-4 h-4 mt-0.5 rounded-full border border-gold/40 flex items-center justify-center shrink-0">
                          <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                        </div>
                        <span className="font-body text-sm text-foreground/65">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                    {tier.cta.external ? (
                      <a href={tier.cta.href} target="_blank" rel="noopener noreferrer"
                        className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-6 py-3.5 text-center hover:bg-gold/80 transition-colors flex-1">
                        {tier.cta.label}
                      </a>
                    ) : (
                      <Link href={tier.cta.href}
                        className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-6 py-3.5 text-center hover:bg-gold/80 transition-colors flex-1">
                        {tier.cta.label}
                      </Link>
                    )}
                    <Link href={tier.secondaryCta.href}
                      className="font-body text-xs tracking-[0.2em] uppercase border border-navy/20 text-navy/60 px-6 py-3.5 text-center hover:border-navy hover:text-navy transition-all">
                      {tier.secondaryCta.label}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 OPMs ───────────────────────────────────────────────────────────── */}
      <section className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">Organisational Assessment</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">
              6 Performance Metrics<br className="hidden md:block" /> We Move the Needle On
            </h2>
            <p className="font-body text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
              When organisations work on the deeper Being Attitudes, these six business-critical metrics transform.
              This is where inner development meets the bottom line.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {sixOPMs.map((opm, i) => (
              <div
                key={opm.title}
                className="bg-navy p-8 hover:bg-white/5 transition-colors duration-300 group"
              >
                <div className="text-gold/60 group-hover:text-gold transition-colors mb-5">
                  {opm.icon}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-body text-[10px] tracking-[0.25em] text-gold/40 uppercase">0{i + 1}</span>
                  <h3 className="font-display text-xl font-light text-white">{opm.title}</h3>
                </div>
                <p className="font-body text-sm text-white/50 leading-relaxed">{opm.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/thoughtleadership/6-organizational-performance-metrics"
              className="font-body text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold/80 px-8 py-4 hover:border-gold hover:text-gold transition-all inline-block"
            >
              Read the Full OPM Framework
            </Link>
          </div>
        </div>
      </section>

      {/* ── TEAM MINDSETS ─────────────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Team Assessment</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6 leading-tight">
                The 5 Mindsets of a<br />
                <em className="not-italic text-gold">Full Potential Team</em>
              </h2>
              <p className="font-body text-base text-foreground/65 leading-relaxed mb-10">
                Through research and field practice, we identified five mindsets that consistently
                distinguish high-performing teams from the rest. Our team assessment measures
                each one and surfaces the invisible dynamics holding your team back.
              </p>
              <Link href="/#contact"
                className="font-body text-xs tracking-[0.2em] uppercase bg-navy text-white px-8 py-4 hover:bg-navy/80 transition-colors inline-block">
                Request a Team Assessment
              </Link>
            </div>

            {/* Right: mindset cards */}
            <div className="flex flex-col gap-3">
              {teamMindsets.map((m, i) => (
                <div key={m.title} className="flex items-start gap-5 bg-white border border-border p-5 hover:border-gold/30 hover:shadow-md transition-all duration-300">
                  <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center shrink-0">
                    <span className="font-body text-[10px] text-gold/80 tracking-wider">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-light text-navy mb-1">{m.title}</h4>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">{m.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">What Participants Say</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">
              Assessment in Action
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-border p-8 flex flex-col hover:border-gold/25 hover:shadow-lg transition-all duration-300">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-gold/30 mb-5 shrink-0">
                  <path d="M0 20V12C0 5.333 3.333 1.333 10 0l1.6 2.4C8.533 3.467 6.8 5.467 6.4 8.4H12V20H0zm16 0V12C16 5.333 19.333 1.333 26 0l1.6 2.4C24.533 3.467 22.8 5.467 22.4 8.4H28V20H16z" fill="currentColor"/>
                </svg>
                <p className="font-body text-sm text-foreground/65 leading-relaxed flex-1 mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t border-border pt-5">
                  <p className="font-display text-base text-navy">{t.name}</p>
                  <p className="font-body text-[11px] tracking-[0.15em] text-foreground/45 uppercase mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDY CALLOUT ────────────────────────────────────────────────── */}
      <section className="bg-navy py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="border border-gold/20 p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-3">Case Study</p>
              <h3 className="font-display text-2xl md:text-3xl font-light text-white mb-3">
                Siam Computing × IDG Measurement
              </h3>
              <p className="font-body text-sm text-white/55 leading-relaxed">
                How a technology company used the Inner Development Goals assessment to strengthen company culture,
                align teams, and amplify sustainable development impact.
              </p>
            </div>
            <Link
              href="/case-studies/siam-computing"
              className="font-body text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold/80 px-8 py-4 hover:border-gold hover:text-gold transition-all whitespace-nowrap shrink-0"
            >
              Read Case Study
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-5">Begin Your Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6 leading-tight">
            Ready to Unlock<br />Your Potential?
          </h2>
          <p className="font-body text-base text-foreground/60 leading-relaxed mb-10 max-w-xl mx-auto">
            The free Individual Assessment takes 20–30 minutes and delivers an immediate
            personalised report. For team and organisational assessments, reach out to begin
            a conversation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://beingatfullpotential.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors"
            >
              Take the Free Assessment
            </a>
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/30 text-navy px-10 py-4 hover:border-navy hover:bg-navy/5 transition-all">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
