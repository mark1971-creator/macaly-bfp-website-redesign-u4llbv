"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Toast ───────────────────────────────────────────────────────────────────
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

// ─── Navigation ──────────────────────────────────────────────────────────────
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
                  link.href === "/academy" ? "text-gold-light" : "text-white/70 hover:text-white"
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

// ─── Footer ──────────────────────────────────────────────────────────────────
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
              { label: "Academy", href: "/academy" },
              { label: "Assessments", href: "https://beingatfullpotential.io/", external: true },
            ].map((link) => (
              (link as { external?: boolean }).external
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
const programs = [
  {
    tag: "Individual",
    title: "I Work With Leaders",
    subtitle: "Human Potential Coach — Individual Certification",
    body: "Learn to administer the Human Potential Assessment in a professional context, help clients interpret the findings, and translate them into a highly customised development plan. Designed for 1-to-1 coaching, this course also equips you to scale the conversation to an organisational level.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="10" r="5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 27c0-5.52 4.48-10 10-10s10 4.48 10 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    href: "https://academy.beingatfullpotential.com/courses/individual-certification-training/",
    accent: "bg-navy",
  },
  {
    tag: "Organisation",
    title: "I Work With Organisations",
    subtitle: "Human Potential Coach — Organisational Certification",
    body: "Building on the individual programme, this training gives you the tools to support organisations on their journey towards a conscious culture — enabling performance breakthroughs in employee engagement, innovation, trustworthiness, and multiple bottom lines.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="4" y="16" width="7" height="12" stroke="currentColor" strokeWidth="1.4" />
        <rect x="12.5" y="10" width="7" height="18" stroke="currentColor" strokeWidth="1.4" />
        <rect x="21" y="4" width="7" height="24" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
    href: "https://academy.beingatfullpotential.com/courses/individual-certification-training/",
    accent: "bg-gold",
  },
  {
    tag: "Team",
    title: "I Work With Teams",
    subtitle: "Human Potential Team Coach Certification",
    body: "Equips you as a coach and facilitator to support teams in unleashing their FULL human potential in service of a common goal — combining powerful facilitation techniques with human potential data to anchor the 5 essential team measures and open up transformational conversations.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="10" cy="11" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="22" cy="11" r="4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 26c0-4.42 3.58-8 8-8M22 18c4.42 0 8 3.58 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M13 26c0-3.31 2.69-6 6-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    href: "https://academy.beingatfullpotential.com/courses/human-potential-team-coach-certification-training/",
    accent: "bg-navy",
  },
];

const highlights = [
  {
    title: "Debrief Human Potential Assessments",
    body: "Equip yourself to effectively debrief the Human Potential Assessment with clients, enabling new levels of awareness and growth.",
  },
  {
    title: "Build a Business Case for Human Potential",
    body: "Learn to create a compelling business case that highlights the impact of Human Potential Development in organisational contexts.",
  },
  {
    title: "Link Human Potential to Business Outcomes",
    body: "Clearly demonstrate how a focus on Human Potential Realisation drives employee engagement, trust, and innovation.",
  },
  {
    title: "Inspire the Human Dimension",
    body: "Inspire organisations and leaders to prioritise the human dimension, fostering environments where potential is fully expressed.",
  },
  {
    title: "Concrete Tools & Methodologies",
    body: "Gain practical tools that bring objectivity to the subjective nature of human beings, empowering impactful transformations.",
  },
  {
    title: "Personal Growth & Development",
    body: "Access deeper insights into your own Human Potential, enabling you to grow into your next stage of personal and professional development.",
  },
];

const testimonials = [
  {
    quote: "This is a MUST do training program for Coaches who want to take their coaching to a completely different level. A guarantee that this program will take organisations to unprecedented heights, especially in turbulent times where agility, innovation and uncertainty are at their peak.",
    name: "Prasad Palav",
    title: "Executive Coach",
  },
  {
    quote: "The Human Potential Coach certification course not only helps individuals understand and interpret the report, but also enables one to go deep into oneself. The framework is Open Source in principle — it allows the Human Potential Coach to make it their own, without the strict bindings of a specific way of getting things done; it allows for Allowing.",
    name: "Abhishek Joshi",
    title: "HPCC Cohort 2026",
  },
];

const faqs = [
  {
    q: "Who is this programme designed for?",
    a: "Experienced coaches looking to deepen their expertise, facilitators and internal change agents who work with leaders or teams, and intrapreneurs passionate about bringing human potential to the forefront of their workplace. A background in coaching or personal development is preferred.",
  },
  {
    q: "What are the key outcomes of the certification?",
    a: "Upon completion you will be certified to debrief the Human Potential Assessment, gain tools to create Being-level shifts in individuals and organisations, learn methodologies to drive engagement, collaboration, and innovation, and expand your effectiveness in coaching and leadership transformation.",
  },
  {
    q: "What makes this programme unique?",
    a: "Unlike traditional coaching programmes, this certification focuses on Being-level transformation. It emphasises unlocking the human potential of individuals, teams, and organisations to create lasting, meaningful change — at the intersection of art and science.",
  },
  {
    q: "Can this approach be used in organisational and team contexts?",
    a: "Yes, absolutely. There is a separate channel for organisations and teams to access the Human Potential Assessment, along with an analytics platform where aggregated data can be broken down for additional insight and action.",
  },
];

// ─── FAQ Accordion ───────────────────────────────────────────────────────────
function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-display text-lg font-light text-navy">{q}</span>
        <span className={`shrink-0 text-gold transition-transform duration-300 ${open ? "rotate-45" : ""}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="font-body text-sm text-foreground/65 leading-relaxed pb-5">{a}</p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AcademyPage() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Nav onNotImplemented={(msg) => setToast(msg)} />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy overflow-hidden">
        {/* Background image */}
        <Image
          src="https://images.pexels.com/photos/29347332/pexels-photo-29347332.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Misty forest trail at sunrise"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-navy/75" />
        {/* Grain texture */}
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
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">Human Potential Coach Certification</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Take Your Coaching{" "}
            <span className="text-gold italic">Practice Further</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-2xl leading-relaxed mt-6">
            Join our vibrant community of Human Potential Coaches working on 4 continents.
            Our trainings and certification programmes empower you to work with the most
            effective Human Potential Development tools and methodologies on the market.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────────────────── */}
      <section className="bg-navy py-10 border-b border-white/8">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "200+", label: "Certified Coaches" },
            { value: "4", label: "Continents" },
            { value: "15+", label: "Years of Impact" },
            { value: "3", label: "Global HQs" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl text-gold mb-1">{s.value}</p>
              <p className="font-body text-[11px] tracking-[0.2em] text-white/50 uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── PROGRAMMES ─────────────────────────────────────────────────────── */}
      <section id="programmes" className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Certification Pathways</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">
              Choose Your Focus
            </h2>
            <p className="font-body text-base text-foreground/60 max-w-xl mx-auto leading-relaxed">
              Three specialised pathways — each designed to deepen your practice in the context where you create the most impact.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((p, i) => (
              <div
                key={p.title}
                className="group bg-white border border-border hover:border-gold/30 hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Card header */}
                <div className={`${p.accent} p-8 relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full border border-white/10 translate-x-8 -translate-y-8" />
                  <p className="font-body text-[10px] tracking-[0.3em] text-white/50 uppercase mb-4">{p.tag}</p>
                  <div className="text-white/70 mb-4">{p.icon}</div>
                  <h3 className="font-display text-2xl font-light text-white group-hover:text-gold/90 transition-colors">
                    {p.title}
                  </h3>
                </div>

                {/* Card body */}
                <div className="p-8 flex flex-col flex-1">
                  <p className="font-body text-xs tracking-[0.12em] text-gold/70 uppercase mb-3">{p.subtitle}</p>
                  <p className="font-body text-sm text-foreground/65 leading-relaxed flex-1">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CERTIFICATION ──────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-gold/6 pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full border border-gold/8 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-5">Flagship Programme</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.1] mb-7">
                Human Potential Coach<br />
                <em className="not-italic text-gold">Certification (HPCC)</em>
              </h2>
              <p className="font-body text-sm text-white/55 leading-relaxed mb-8">
                11 immersive modules over 7 weeks (2h live Zoom sessions) that help unlock and amplify human potential, focusing on the deeper aspects
                of BEING that drive innovation, engagement, and collaboration. Become a Human Potential Certified
                Coach and support leaders to work and thrive from their Full Potential.
              </p>

              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-10">
                {["ICF Approved", "25 CCEUs", "11 Modules", "Online"].map((b) => (
                  <span key={b} className="font-body text-[11px] tracking-[0.15em] text-gold/80 border border-gold/25 px-4 py-2 uppercase">
                    {b}
                  </span>
                ))}
              </div>

              {/* Next cohort */}
              <div className="border-l-2 border-gold pl-5 mb-10">
                <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-2">Next Cohort</p>
                <p className="font-display text-xl text-white">October 20 – December 1, 2026</p>
                <p className="font-body text-xs text-white/45 mt-1">8:00–10:00 AM (Europe/Paris) · Online</p>
              </div>

              <a
                href="/academy/apply"
                className="inline-block font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors"
              >
                Apply Now
              </a>
            </div>

            {/* Right – highlights grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white/5 border border-white/8 p-5 hover:border-gold/20 transition-colors">
                  <div className="w-6 h-6 rounded-full bg-gold/15 flex items-center justify-center mb-4">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                  </div>
                  <h4 className="font-display text-base text-white mb-2">{h.title}</h4>
                  <p className="font-body text-xs text-white/45 leading-relaxed">{h.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHO BENEFITS ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Who Is This For?</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">HPCC Will Benefit</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <circle cx="14" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5 23c0-4.97 4.03-9 9-9s9 4.03 9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                ),
                title: "Coaches & Facilitators",
                body: "Professionals with a background in coaching, personal development, or organisational leadership looking to deepen their expertise.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <rect x="4" y="12" width="20" height="12" rx="1" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M9 12V9a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                ),
                title: "Change Agents",
                body: "Individuals interested in working with organisations and leaders to unlock their full potential, or internal agents keen to open transformational conversations.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M14 4l2.5 7.5H24l-6.5 4.72 2.5 7.5L14 19.5l-6 4.22 2.5-7.5L4 11.5h7.5L14 4z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                ),
                title: "Impact Seekers",
                body: "Those seeking actionable tools to bridge the gap between subjective human experiences and measurable organisational outcomes.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center px-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/10 text-gold mb-5">
                  {item.icon}
                </div>
                <h3 className="font-display text-xl text-navy mb-3">{item.title}</h3>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">What Participants Say</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">
              Voices From the Programme
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white border border-border p-8 flex flex-col hover:border-gold/20 hover:shadow-md transition-all">
                <div className="font-display text-5xl text-gold/25 leading-none mb-4 select-none">"</div>
                <p className="font-body text-sm text-foreground/70 leading-relaxed flex-1 mb-7 italic">{t.quote}</p>
                <div className="pt-5 border-t border-border">
                  <p className="font-display text-base text-navy">{t.name}</p>
                  <p className="font-body text-xs text-foreground/50 mt-0.5">{t.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-secondary border-y border-border">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-14">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Common Questions</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy">
              Frequently Asked
            </h2>
          </div>

          <div className="divide-y divide-border">
            {faqs.map((f) => (
              <FAQ key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold/6" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gold/10" />
        </div>
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-5">Begin Your Journey</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Become a<br />
            <em className="not-italic text-gold">Certified Human Potential Coach?</em>
          </h2>
          <p className="font-body text-sm text-white/55 leading-relaxed mb-10 max-w-xl mx-auto">
            Join 200+ certified coaches across 4 continents and gain the tools to create lasting,
            meaningful transformation — for your clients, your organisations, and yourself.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://academy.beingatfullpotential.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors"
            >
              Enrol in the Academy
            </a>
            <Link
              href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/40 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all"
            >
              Ask a Question
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
