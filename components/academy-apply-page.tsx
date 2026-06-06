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

// ─── Nav ──────────────────────────────────────────────────────────────────────
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
              className={`font-body text-xs tracking-[0.15em] transition-colors ${link.href === "/academy" ? "text-gold" : "text-white/70 hover:text-white"}`}>
              {link.label}
            </Link>
          ))}
        </nav>
        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>
        <button className="lg:hidden text-white p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
          <Image src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential" width={110} height={44} className="h-9 w-auto object-contain mb-5" />
          <p className="font-body text-sm text-white/40 leading-relaxed max-w-xs">
            Partnering with transformation catalysts and change agents to deliver greater impact.
          </p>
        </div>
        <div>
          <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-5">Navigate</p>
          <div className="flex flex-col gap-3">
            {[{ label: "About", href: "/about" }, { label: "Academy", href: "/academy" }, { label: "Impact", href: "/impact" }, { label: "Assessments", href: "/assessments" }].map((link) => (
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

// ─── Application Form ─────────────────────────────────────────────────────────
type FormState = "idle" | "submitting" | "success" | "error";

function ApplicationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organisation: "",
    role: "",
    coachingBackground: "",
    motivation: "",
    heardFrom: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "hpcc",
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          organisation: form.organisation,
          role: form.role,
          coachingBackground: form.coachingBackground,
          motivation: form.motivation,
          heardFrom: form.heardFrom,
        }),
      });

      if (!res.ok) throw new Error("Send failed");
      setStatus("success");
    } catch (err) {
      console.error("HPCC application error:", err);
      setStatus("error");
    }
  };
  if (status === "error") {
    return (
      <div className="bg-white border border-border p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-navy mb-3">Something Went Wrong</h3>
        <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-sm mx-auto mb-6">
          Your application couldn't be submitted. Please email us directly at{" "}
          <a href="mailto:mark@beingatfullpotential.com" className="text-gold hover:underline">mark@beingatfullpotential.com</a>.
        </p>
        <button onClick={() => setStatus("idle")}
          className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-8 py-3 hover:border-navy hover:text-navy transition-all">
          Try Again
        </button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-white border border-border p-10 text-center">
        <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12l4 4L19 7" stroke="hsl(38,55%,50%)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="font-display text-2xl text-navy mb-3">Application Received</h3>
        <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-sm mx-auto mb-6">
          Thank you for your application. We have received it and will be in touch within 3 business days.
        </p>
        <Link href="/academy"
          className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-8 py-3 hover:border-navy hover:text-navy transition-all inline-block">
          Back to Academy
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-border p-8 lg:p-10 space-y-6">
      {/* Name row */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">First Name *</label>
          <input
            type="text" name="firstName" required value={form.firstName} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="Your first name"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Last Name *</label>
          <input
            type="text" name="lastName" required value={form.lastName} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="Your last name"
          />
        </div>
      </div>

      {/* Email + Phone */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Email Address *</label>
          <input
            type="email" name="email" required value={form.email} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Phone Number *</label>
          <input
            type="tel" name="phone" required value={form.phone} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="+1 234 567 890"
          />
        </div>
      </div>

      {/* Organisation + Role */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Organisation</label>
          <input
            type="text" name="organisation" value={form.organisation} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="Company / institution"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Your Role</label>
          <input
            type="text" name="role" value={form.role} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="e.g. Executive Coach, HR Director"
          />
        </div>
      </div>

      {/* Coaching background */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Coaching / Facilitation Background *</label>
        <select
          name="coachingBackground" required value={form.coachingBackground} onChange={handleChange}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors appearance-none"
        >
          <option value="">Select an option…</option>
          <option value="Certified coach (ICF or equivalent)">Certified coach (ICF or equivalent)</option>
          <option value="Coaching experience, not yet certified">Coaching experience, not yet certified</option>
          <option value="Facilitator / OD practitioner">Facilitator / OD practitioner</option>
          <option value="HR or L&D professional">HR or L&D professional</option>
          <option value="Leader / manager with coaching interest">Leader / manager with coaching interest</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Motivation */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Why do you want to join this programme? *</label>
        <textarea
          name="motivation" required value={form.motivation} onChange={handleChange} rows={4}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors resize-none"
          placeholder="Tell us about your motivation and what you hope to gain…"
        />
      </div>

      {/* Heard from */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">How did you hear about us?</label>
        <select
          name="heardFrom" value={form.heardFrom} onChange={handleChange}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors appearance-none"
        >
          <option value="">Select an option…</option>
          <option value="Colleague / referral">Colleague / referral</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Google search">Google search</option>
          <option value="Existing BEING at Full Potential client">Existing BEING at Full Potential client</option>
          <option value="Social media">Social media</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full font-body text-xs tracking-[0.2em] uppercase bg-gold text-white py-4 hover:bg-gold/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Preparing your application…" : "Submit Application"}
      </button>

      <p className="font-body text-xs text-foreground/40 text-center leading-relaxed">
        We review all applications personally and respond within 3 business days.
      </p>
    </form>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function AcademyApplyPage() {
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end bg-navy overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/5711372/pexels-photo-5711372.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Human Potential Coach Certification Training"
          fill className="object-cover opacity-30" priority
        />
        <div className="absolute inset-0 bg-navy/90" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 pt-36 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">Home</Link>
            <span className="text-white/20 text-xs">›</span>
            <Link href="/academy" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">Academy</Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">Apply</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-5">ICF Approved · 25 CCEUs</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-[1.05] max-w-3xl mb-5">
            Human Potential Coach<br />
            <span className="text-gold italic">Certification Training</span>
          </h1>
          <p className="font-body text-base text-white/55 max-w-xl leading-relaxed">
            Apply for the October – December 2026 cohort. Places are limited — we review every application personally.
          </p>
        </div>
      </section>

      {/* ── COHORT STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: "7 weeks", label: "Programme Length" },
              { value: "11", label: "Immersive Modules" },
              { value: "25", label: "ICF CCEUs" },
              { value: "2h / week", label: "Live Zoom Sessions" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-6 text-center">
                <p className="font-display text-2xl md:text-3xl font-light text-gold mb-1">{s.value}</p>
                <p className="font-body text-[10px] tracking-[0.18em] text-white/50 uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ──────────────────────────────────────────────────────── */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_480px] gap-16 items-start">

            {/* Left: programme details */}
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">The Programme</p>
              <h2 className="font-display text-4xl font-light text-navy mb-6 leading-tight">
                What You Will Gain
              </h2>
              <p className="font-body text-base text-foreground/65 leading-relaxed mb-8">
                The Human Potential Coach Certification (HPCC) is an immersive 11-module online programme
                that equips you with the Human Potential Assessment framework, transformational coaching tools,
                and the skills to help individuals and organisations unleash their full potential.
              </p>

              {/* What's included */}
              <div className="space-y-4 mb-10">
                {[
                  { title: "11 Live Online Modules over 7 Weeks", desc: "One 2-hour Zoom session per week — immersive, combining theory, practice, and peer learning, with each session building on the last." },
                  { title: "Human Potential Assessment Certification", desc: "Full accreditation to debrief and apply the Individual, Team, and Organisational HP Assessments with your clients." },
                  { title: "25 ICF-Approved CCEUs", desc: "Continuing Coach Education Units recognised by the International Coaching Federation." },
                  { title: "Personal HP Assessment Debrief", desc: "Your own individual Human Potential Assessment with a personal debrief session included." },
                  { title: "Global Alumni Network", desc: "Join 200+ certified coaches across 4 continents — a living community of practice." },
                  { title: "Ongoing Support", desc: "Access to materials, peer supervision, and continued connection with the BEING at Full Potential community." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4 bg-white border border-border p-5 hover:border-gold/30 transition-colors">
                    <div className="w-5 h-5 mt-0.5 rounded-full border border-gold/40 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-gold" />
                    </div>
                    <div>
                      <h4 className="font-display text-base text-navy mb-1">{item.title}</h4>
                      <p className="font-body text-sm text-foreground/60 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Schedule */}
              <div className="bg-navy p-8 mb-10">
                <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-4">Schedule</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Start date", value: "October 20, 2026" },
                    { label: "End date", value: "December 1, 2026" },
                    { label: "Session time", value: "8:00 – 10:00 AM (CET)" },
                    { label: "Format", value: "Online · Zoom · 2h/week" },
                    { label: "Duration", value: "7 weeks" },
                    { label: "Language", value: "English" },
                    { label: "Places", value: "Limited cohort" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="font-body text-[10px] tracking-[0.2em] text-white/40 uppercase mb-1">{item.label}</p>
                      <p className="font-display text-base text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who it's for */}
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Who This Is For</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Experienced coaches seeking a deeper methodology",
                    "Facilitators & internal change agents",
                    "HR & L&D professionals",
                    "Leaders passionate about human potential",
                    "Consultants in organisational development",
                    "Social entrepreneurs & change-makers",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-secondary border border-border px-4 py-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span className="font-body text-sm text-foreground/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: application form */}
            <div className="lg:sticky lg:top-28">
              <div className="mb-6">
                <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Apply for Oct–Dec 2026</p>
                <h2 className="font-display text-3xl font-light text-navy leading-tight">
                  Reserve Your Place
                </h2>
              </div>
              <ApplicationForm />
            </div>

          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ───────────────────────────────────────────────────────── */}
      <section className="bg-navy py-16 lg:py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <svg width="32" height="24" viewBox="0 0 28 20" fill="none" className="text-gold/30 mx-auto mb-6">
            <path d="M0 20V12C0 5.333 3.333 1.333 10 0l1.6 2.4C8.533 3.467 6.8 5.467 6.4 8.4H12V20H0zm16 0V12C16 5.333 19.333 1.333 26 0l1.6 2.4C24.533 3.467 22.8 5.467 22.4 8.4H28V20H16z" fill="currentColor" />
          </svg>
          <p className="font-display text-xl md:text-2xl font-light text-white/80 leading-relaxed italic mb-8">
            &ldquo;The Human Potential Coach certification course not only helps individuals understand and interpret the report,
            but also enables one to go deep into oneself. It allows for Allowing.&rdquo;
          </p>
          <p className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">Abhishek Joshi · HPCC Cohort 2026</p>
        </div>
      </section>

      {/* ── BACK TO ACADEMY ───────────────────────────────────────────────────── */}
      <section className="bg-background py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-foreground/60">Have questions before applying?</p>
          <div className="flex gap-4">
            <Link href="/academy"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-8 py-3 hover:border-navy hover:text-navy transition-all">
              Back to Academy
            </Link>
            <a href="mailto:mark@beingatfullpotential.com?subject=HPCC Question — Oct 2026"
              className="font-body text-xs tracking-[0.2em] uppercase bg-navy text-white px-8 py-3 hover:bg-navy/80 transition-colors">
              Ask a Question
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}