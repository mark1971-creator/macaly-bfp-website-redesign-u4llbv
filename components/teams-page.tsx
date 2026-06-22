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

const tensions = [
  "Rally behind an inspiring long-term vision while delivering short-term results",
  "Resolve interpersonal conflict in a way that strengthens rather than fractures",
  "Align individual talents and passions with the collective purpose of the team",
  "Unlock cross-functional synergies that command-and-control leadership cannot reach",
  "Remain true to team values in the face of external pressures",
];

const mindsets = [
  {
    num: "01",
    title: "Standards of Being",
    body: "Measures how well the team creates sustained conditions for trust, respect, and openness to new thinking. The foundation everything else rests on.",
  },
  {
    num: "02",
    title: "Collectively Embody a Meaningful Purpose",
    body: "Measures the team's ability to rally behind a meaningful shared purpose and create concrete project opportunities to bring it to life.",
  },
  {
    num: "03",
    title: "Opportunity Seeking",
    body: "Measures the team's ability to practice the third way — to re-frame situations, problems, and options to find the win-win where others see only conflict.",
  },
  {
    num: "04",
    title: "Help Each Other Shine in Their Wholeness",
    body: "Measures the team's ability to see people in their wholeness — functional expertise is a part of that, but far from all of it — and assign responsibilities accordingly.",
  },
  {
    num: "05",
    title: "Unconditional Dependability",
    body: "Measures the team's ability to rely on each other, follow through on commitments, set the right expectations, and communicate proactively.",
  },
];

const testimonials = [
  {
    quote: "The Being at Full Potential Team Facilitation process takes you through multiple levels of learning and tools for training teams — you also put it into practice during the training and therefore learn directly through experience.",
    name: "Team Facilitation Participant",
    role: "Full Potential Team Programme",
  },
  {
    quote: "You created a superb learning environment. A safe space to show up in our full Being. Thank you for that!",
    name: "Team Facilitation Participant",
    role: "Full Potential Team Programme",
  },
  {
    quote: "The Full Potential Team Facilitation Training reveals that real change is not just a matter of doing but that something else is needed. For me it was a very inspiring and stunning experience, that can be applied to any organisation.",
    name: "Team Facilitation Participant",
    role: "Full Potential Team Programme",
  },
];

const process = [
  { step: "01", title: "Team Assessment", body: "Each team member completes the Human Potential Assessment independently — establishing a baseline for each of the 5 team mindsets." },
  { step: "02", title: "Individual Profiles", body: "Every team member receives a personalised spider diagram showing how they currently contribute to the 5 collective mindsets." },
  { step: "03", title: "Collective Sense-Making", body: "A facilitated session where the team explores their combined profile together — turning individual data into collective insight." },
  { step: "04", title: "Team Development Roadmap", body: "Concrete commitments and actions co-created by the team — rooted in their unique strengths and anchored in a shared purpose." },
];

export default function TeamsPage() {
  const [toast, setToast] = useState<string | null>(null);
  console.log("TeamsPage rendered");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/6146697/pexels-photo-6146697.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Diverse group of people forming a united circle with hands together"
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
            <span className="font-body text-[10px] tracking-[0.25em] text-gold/70 uppercase">Teams</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] text-gold/80 uppercase mb-6">Collective Potential</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-7">
            Unlock Your Team&apos;s<br />
            <em className="not-italic text-gold">Full Potential</em>
          </h1>
          <p className="font-body text-base md:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-12">
            What if the tension your team is experiencing is not a problem to be solved,
            but an invitation to go deeper? We help teams transform complexity into collective
            breakthroughs — unlocking motivation, creativity, and resilience that runs far
            deeper than any process improvement can reach.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Request a Team Assessment
            </Link>
            <a href="#mindsets"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/40 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all">
              The 5 Mindsets
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-body text-[9px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── THE CHALLENGE ────────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">The Challenge</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6 leading-tight">
                Why Teams Fall Short<br />
                <em className="not-italic text-gold">of Their Potential</em>
              </h2>
              <p className="font-body text-base text-foreground/65 leading-relaxed mb-6">
                The tensions and complexities inherent in today&apos;s organisational dynamics prevent
                teams from realizing their full potential. Trying to address these tensions with
                a command-and-control style of leadership will, more often than not, make things
                worse — creating toxic dynamics and threatening the stability of the entire system.
              </p>
              <p className="font-body text-base text-foreground/65 leading-relaxed">
                What if instead, we could hold the difficulty long enough to drop deeper than
                what the surface suggests? What if the conversation that evolved out of that tension
                was the very thing that could transform it?
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {tensions.map((t, i) => (
                <div key={i} className="flex items-start gap-4 bg-secondary border border-border p-5 hover:border-gold/25 transition-all duration-300">
                  <div className="w-6 h-6 rounded-full border border-gold/30 flex items-center justify-center shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-gold/60" />
                  </div>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 5 MINDSETS ──────────────────────────────────────────────────────── */}
      <section id="mindsets" className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">Our Research</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">
              The 5 Mindsets of a<br />Full Potential Team
            </h2>
            <p className="font-body text-base text-white/55 leading-relaxed max-w-2xl mx-auto">
              Through research and field practice across organisations on four continents, we identified
              five mindsets that consistently distinguish exceptional teams from good ones.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/8">
            {mindsets.map((m, i) => (
              <div key={m.num} className={`bg-navy p-8 hover:bg-white/5 transition-colors duration-300 group ${i === 4 ? "lg:col-span-1 md:col-span-2 lg:col-auto" : ""}`}>
                <p className="font-display text-4xl text-gold/15 group-hover:text-gold/30 transition-colors mb-6">{m.num}</p>
                <h3 className="font-display text-xl font-light text-white mb-4 leading-snug">{m.title}</h3>
                <p className="font-body text-sm text-white/50 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESS ─────────────────────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Our Approach</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">
              How the Team Assessment Works
            </h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              A four-step facilitation journey that turns individual data into collective momentum.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p) => (
              <div key={p.step} className="bg-white border border-border p-8 flex flex-col hover:border-gold/30 hover:shadow-lg transition-all duration-300">
                <p className="font-display text-4xl text-gold/30 mb-6">{p.step}</p>
                <h3 className="font-display text-lg font-light text-navy mb-4">{p.title}</h3>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Team Voices</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">What Teams Say</h2>
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
            Ready to Unlock Your<br />Team&apos;s Collective Power?
          </h2>
          <p className="font-body text-base text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Reach out to begin a conversation about your team&apos;s context and how a Full Potential
            Team Assessment can support your next stage of growth.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Request a Team Assessment
            </Link>
            <Link href="/academy"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/30 text-white/70 px-10 py-4 hover:border-white hover:text-white transition-all">
              Train as a Team Coach
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
