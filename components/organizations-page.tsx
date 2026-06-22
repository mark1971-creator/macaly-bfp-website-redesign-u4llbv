"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
          <Image src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential" width={120} height={48} className="h-10 w-auto object-contain" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}
              className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-px bg-white/70 transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="font-body text-xs tracking-[0.2em] text-white/70 hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[#141210] border-t border-gold/15 pt-16 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div>
          <Image src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential" width={110} height={44} className="h-9 w-auto object-contain mb-5" />
          <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            Partnering with transformation catalysts and change agents to deliver greater impact.
          </p>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-5">Navigate</p>
          <div className="flex flex-col gap-3">
            {[{ label: "About", href: "/about" }, { label: "Insight", href: "/insight" }, { label: "Impact", href: "/impact" }, { label: "Academy", href: "/academy" }, { label: "Assessments", href: "/assessments" }].map((link) => (
              <Link key={link.label} href={link.href} className="font-body text-sm text-white/50 hover:text-white/80 transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-5">Contact</p>
          <a href="mailto:mark@beingatfullpotential.com" className="font-body text-sm text-white/50 hover:text-white/80 transition-colors block mb-3">
            mark@beingatfullpotential.com
          </a>
          <p className="font-body text-xs text-white/30 leading-relaxed">Global HQs in Europe, Americas & Asia-Pacific</p>
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


const methodology = [
  {
    step: "01",
    title: "Baseline Assessment",
    body: "Deploy the Organisational Human Potential Assessment across your leadership population — establishing a clear data-driven baseline for the 8 Being Attitudes.",
  },
  {
    step: "02",
    title: "Data Interpretation",
    body: "A facilitated workshop with leadership to make sense of the data together — surfacing the cultural patterns, strengths, and critical growth edges.",
  },
  {
    step: "03",
    title: "Transformation Design",
    body: "Co-create a cultural transformation roadmap with concrete initiatives, learning journeys, and measurement milestones aligned to your 6 OPM priorities.",
  },
  {
    step: "04",
    title: "Sustained Development",
    body: "Ongoing coaching, team facilitation, and measurement cycles to embed the change — tracking progress against the OPMs over 12–24 months.",
  },
];

const testimonials = [
  {
    quote: "Together with HR, I have reviewed and endorsed the Being At Full Potential methodology and believe it could be a great enabler in our journey as a Team. I entirely trust the solidity of the self-assessment survey.",
    name: "Virginie Helias",
    role: "VP Global Sustainability, Procter & Gamble",
  },
  {
    quote: "At Omega we are truly inspired by your approach to Human Potential development. We are proud to be in a true partnership with Being at Full Potential.",
    name: "Dr. Saravanavasan KS",
    role: "VP Talent Development, Omega Healthcare",
  },
  {
    quote: "Thank you for bringing 'the third dimension' into the conversation and helping us see our collective greatness.",
    name: "Virginie Helias",
    role: "Vice President Sustainability, Procter & Gamble",
  },
];

const caseStudies = [
  {
    client: "Omega Healthcare Management Services",
    sector: "Healthcare · India",
    summary: "Used the Human Potential Assessment to redesign client-facing teams around empathy, curiosity, and collaboration — matching people to roles where their inherent potential could be fully expressed.",
    results: ["+70% growth in existing client business", "+30% growth in new client business", "Customer Orientation: 78 → 85", "Compassion score: 74 → 81"],
    href: "/case-studies/omega-hms",
  },
  {
    client: "Thornton's Budgens",
    sector: "Retail · London, UK",
    summary: "After sales declined -7% in 2014, invested in developing human potential throughout the organisation. Coaching unlocked creativity at every level, driving a full business turnaround.",
    results: ["-7% → +5% like-for-like sales turnaround", "+55% average employee service length", "64% Human Potential score (8pts above benchmark)", "+1.5pts gross margin improvement"],
    href: "/case-studies/thorntons-budgens",
  },
];

export default function OrganizationsPage() {
  const [toast, setToast] = useState<string | null>(null);
  console.log("OrganizationsPage rendered");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/5506057/pexels-photo-5506057.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Spacious coworking office with modern design and natural elements"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-navy/90" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Link href="/" className="font-body text-[10px] tracking-[0.25em] text-white/40 hover:text-white/60 transition-colors uppercase">Home</Link>
            <span className="text-white/20 text-xs">›</span>
            <Link href="/impact" className="font-body text-[10px] tracking-[0.25em] text-white/40 hover:text-white/60 transition-colors uppercase">Impact</Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-[10px] tracking-[0.25em] text-gold/70 uppercase">Organizations</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] text-gold/80 uppercase mb-6">Cultural Transformation</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-7">
            The Next Frontier<br />
            <em className="not-italic text-gold">of Value Creation</em>
          </h1>
          <p className="font-body text-base md:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-12">
            The interventions that yielded great results in the past are no longer having the same impact.
            We believe the next value creation paradigm lies in unlocking the human potential already
            present in your organisation — and we have the methodology to make it measurable.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Request an Org Assessment
            </Link>
            <a href="#iceberg"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/40 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all">
              The Iceberg Model
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-body text-[9px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── THE ICEBERG ──────────────────────────────────────────────────────── */}
      <section id="iceberg" className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Our Methodology</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">
              The Organisational<br />Performance Iceberg
            </h2>
            <p className="font-body text-base text-foreground/60 leading-relaxed max-w-2xl mx-auto">
              Visible results sit at the top. The invisible human qualities that determine everything —
              the 8 Being Attitudes — lie beneath the surface. Our methodology is designed to surface
              and develop what&apos;s below, creating lasting change above.
            </p>
          </div>

          {/* Iceberg visual */}
          <div className="max-w-5xl mx-auto">
            <Image
              src="https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/hG5bksjD6tmsPey3yhous.jpg"
              alt="The Organisational Performance Iceberg — 4 Being States, 8 Being Attitudes below the surface driving performance metrics above"
              width={1500}
              height={820}
              className="w-full h-auto"
            />
          </div>

          <div className="text-center mt-10">
            <Link href="/thoughtleadership/6-organizational-performance-metrics"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-8 py-4 hover:border-navy hover:text-navy transition-all inline-block">
              Explore the 6 OPM Framework
            </Link>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ──────────────────────────────────────────────────────── */}
      <section className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">How We Work</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">
              A Proven Four-Step<br />Transformation Methodology
            </h2>
            <p className="font-body text-base text-white/55 max-w-xl mx-auto leading-relaxed">
              Our approach is rigorous, measurable, and deeply human — anchoring cultural change in data
              while honouring the complexity of the people involved.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {methodology.map((m) => (
              <div key={m.step} className="bg-navy p-8 hover:bg-white/5 transition-colors duration-300 group">
                <p className="font-display text-4xl text-gold/15 group-hover:text-gold/35 transition-colors mb-6">{m.step}</p>
                <h3 className="font-display text-xl font-light text-white mb-4">{m.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Proven Results</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">
              Organisations We&apos;ve Helped Transform
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {caseStudies.map((cs) => (
              <div key={cs.client} className="bg-white border border-border p-8 hover:border-gold/30 hover:shadow-xl transition-all duration-500 flex flex-col">
                <div className="mb-6">
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">{cs.sector}</p>
                  <h3 className="font-display text-2xl font-light text-navy">{cs.client}</h3>
                </div>
                <p className="font-body text-sm text-foreground/65 leading-relaxed mb-7">{cs.summary}</p>
                <div className="grid grid-cols-2 gap-3 mb-7">
                  {cs.results.map((r) => (
                    <div key={r} className="bg-secondary border border-border p-3">
                      <p className="font-body text-xs text-foreground/60 leading-snug">{r}</p>
                    </div>
                  ))}
                </div>
                <Link href={cs.href}
                  className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-6 py-3 hover:border-navy hover:text-navy transition-all text-center mt-auto">
                  Read Full Case Study
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Leadership Voices</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">What Leaders Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-border p-8 flex flex-col hover:border-gold/25 hover:shadow-lg transition-all duration-300">
                <svg width="28" height="20" viewBox="0 0 28 20" fill="none" className="text-gold/30 mb-5 shrink-0">
                  <path d="M0 20V12C0 5.333 3.333 1.333 10 0l1.6 2.4C8.533 3.467 6.8 5.467 6.4 8.4H12V20H0zm16 0V12C16 5.333 19.333 1.333 26 0l1.6 2.4C24.533 3.467 22.8 5.467 22.4 8.4H28V20H16z" fill="currentColor" />
                </svg>
                <p className="font-body text-sm text-foreground/65 leading-relaxed flex-1 mb-6 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="border-t border-border pt-5">
                  <p className="font-display text-base text-navy">{t.name}</p>
                  <p className="font-body text-[11px] tracking-[0.15em] text-foreground/45 uppercase mt-0.5">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-navy py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-5">Get Started</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
            Ready to Unlock Your<br />Organisation&apos;s Next Level?
          </h2>
          <p className="font-body text-base text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Reach out to begin a conversation about your organisation&apos;s context and how the
            Organisational Human Potential Assessment can create measurable breakthroughs across
            your key performance metrics.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Request an Org Assessment
            </Link>
            <Link href="/impact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/30 text-white/70 px-10 py-4 hover:border-white hover:text-white transition-all">
              See Our Impact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
