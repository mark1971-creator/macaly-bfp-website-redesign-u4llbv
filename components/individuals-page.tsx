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
          <Image src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
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
          <Image src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
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

const journey = [
  {
    step: "01",
    title: "Take the Assessment",
    body: "Complete the free Human Potential Assessment online. It takes 20–30 minutes and covers multiple dimensions of how you are currently expressing your unique potential.",
  },
  {
    step: "02",
    title: "Receive Your Profile",
    body: "Get a personalised multi-dimensional report revealing where you are today, where your energy is flowing, and which areas hold the greatest untapped potential.",
  },
  {
    step: "03",
    title: "1-on-1 Debrief",
    body: "A one-hour coaching session to make sense of your results together — bringing tremendous clarity on key areas to focus on for your next chapter.",
  },
  {
    step: "04",
    title: "Your Coaching Roadmap",
    body: "Based on the discovery phase, we define the most efficient coaching pathway to enable your growth — moving forward from a place of inner being.",
  },
];


const testimonials = [
  {
    quote: "I knew your process would be different than others to plan forward, but I did not expect the power it has in pulling out new insights.",
    name: "Andreas Schurek",
    role: "Managing Director, TNS Switzerland",
  },
  {
    quote: "What you have created at Being at Full Potential is a gift to all of us. Thank you for walking this journey alongside us. This week was evidence of transformation.",
    name: "Laura Saldivar Luna",
    role: "Chief People Officer, Teach for America",
  },
  {
    quote: "The HP Assessment Tool is a gateway to new possibilities, bedded in the essence of who we are and could be. It touches those deep and delicate places that foster the strength to create bold changes.",
    name: "Training Participant",
    role: "Human Potential Certification Training",
  },
];

export default function IndividualsPage() {
  const [toast, setToast] = useState<string | null>(null);
  console.log("IndividualsPage rendered");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3971223/pexels-photo-3971223.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Silhouette of a person by a calm lake at dusk"
          fill className="object-cover" priority
        />
        <div className="absolute inset-0 bg-navy/75" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundSize: "200px 200px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-20">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Link href="/" className="font-body text-[10px] tracking-[0.25em] text-white/40 hover:text-white/60 transition-colors uppercase">Home</Link>
            <span className="text-white/20 text-xs">›</span>
            <Link href="/impact" className="font-body text-[10px] tracking-[0.25em] text-white/40 hover:text-white/60 transition-colors uppercase">Impact</Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-[10px] tracking-[0.25em] text-gold/70 uppercase">Individuals</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] text-gold/80 uppercase mb-6">Personal Transformation</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-7">
            Come Home To<br />
            <em className="not-italic text-gold">Who You Really Are</em>
          </h1>
          <p className="font-body text-base md:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-12">
            We believe every person is gifted with abundant potential. We support you in
            re-connecting with the essence of who you are and why you are here — so that
            the most uniquely you version of yourself can fully show up in work and life.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Take the Free Assessment
            </a>
            <a href="#journey"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/40 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all">
              How It Works
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-body text-[9px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── THE CHALLENGE ────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-28">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-5">Our Belief</p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-light text-white mb-7 leading-tight">
            Much Potential Remains<br className="hidden md:block" /> Unexpressed
          </h2>
          <p className="font-body text-base text-white/55 leading-relaxed max-w-3xl mx-auto mb-8">
            Some people are in tune with their greatest potential and have found ways to integrate it into their lives —
            bringing them enormous fulfillment and impact. Others are aware of their unique gifts but haven&apos;t yet
            found ways to fully realize them. And many of us go through life without really knowing the extent of our
            potential, leaving much of it untapped.
          </p>
          <p className="font-body text-base text-white/70 leading-relaxed max-w-2xl mx-auto italic">
            &ldquo;We support you in re-connecting with the essence of <strong className="not-italic text-white">who you are</strong> and
            <strong className="not-italic text-white"> why you are here</strong> — so that aspects of your greatest potential, that may have been
            unexpressed for many years, will re-surface and guide your next steps.&rdquo;
          </p>
        </div>
      </section>

      {/* ── HPA DIMENSIONS ──────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">The Tool</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6 leading-tight">
                The Human Potential<br />
                <em className="not-italic text-gold">Assessment</em>
              </h2>
              <p className="font-body text-base text-foreground/65 leading-relaxed mb-6">
                Our unique measurement tool maps the different dimensions of your human potential — making it
                immediately clear where you are today, where your energy is most alive, and which areas carry
                the greatest opportunity for growth.
              </p>
              <p className="font-body text-base text-foreground/65 leading-relaxed mb-8">
                The resulting profile gives you and your coach a shared, data-grounded language for the
                work ahead — removing guesswork and accelerating your development.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
                  className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-8 py-4 hover:bg-gold/80 transition-colors text-center">
                  Take It Free
                </a>
                <Link href="/academy"
                  className="font-body text-xs tracking-[0.2em] uppercase border border-navy/30 text-navy px-8 py-4 hover:border-navy hover:bg-navy/5 transition-all text-center">
                  Become a Certified Coach
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Image
                src="https://assets.macaly-user-data.dev/cdn-cgi/image/format=webp,width=2000,height=2000,fit=scale-down,quality=90,anim=true/c3icnrwiugzfahhbqx42cw8x/u4llbvnely5jgcx59ux6d1j6/FVNiGhw8gQNsmcODtTLbv.png"
                alt="The Human Potential House — Being Inspired, Being Abundant, Being in Service, Being Aware"
                width={580}
                height={680}
                className="w-full max-w-lg rounded-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── THE JOURNEY ─────────────────────────────────────────────────────── */}
      <section id="journey" className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">The Process</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">
              Your Journey with Us
            </h2>
            <p className="font-body text-base text-white/55 leading-relaxed max-w-xl mx-auto">
              A structured yet deeply personal pathway — from first insight to lasting transformation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/8">
            {journey.map((j) => (
              <div key={j.step} className="bg-navy p-8 hover:bg-white/5 transition-colors duration-300 group">
                <p className="font-display text-4xl text-gold/20 group-hover:text-gold/40 transition-colors mb-6">{j.step}</p>
                <h3 className="font-display text-xl font-light text-white mb-4">{j.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{j.body}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="https://beingatfullpotential.subkit.com/grow-with-me-1-on-1-human-potential-coaching-9lfxk"
              target="_blank" rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase border border-gold/40 text-gold/80 px-8 py-4 hover:border-gold hover:text-gold transition-all inline-block">
              Sign Up for 1-on-1 Coaching
            </a>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Impact Stories</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">
              What Participants Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white border border-border p-8 flex flex-col hover:border-gold/25 hover:shadow-lg transition-all duration-300">
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
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-5">Begin Your Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6 leading-tight">
            Ready to Discover<br />Your Full Potential?
          </h2>
          <p className="font-body text-base text-foreground/60 leading-relaxed mb-10 max-w-xl mx-auto">
            The free Individual Assessment is your first step. It takes 20–30 minutes,
            and delivers an immediate, personalised profile of where you are today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Take the Free Assessment
            </a>
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/30 text-navy px-10 py-4 hover:border-navy hover:bg-navy/5 transition-all">
              Talk to a Coach
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
