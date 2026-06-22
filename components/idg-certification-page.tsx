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
          <Image src="/wp-content/uploads/2019/11/Logo-light.png"
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
          <Image src="/wp-content/uploads/2019/11/Logo-light.png"
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

// ─── Registration Form ────────────────────────────────────────────────────────
type FormState = "idle" | "submitting" | "success" | "error";

function RegistrationForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    invoicing: "",
    interest: "",
  });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    console.log("IDG Certification registration submitted:", form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "idg",
          name: `${form.firstName} ${form.lastName}`,
          email: form.email,
          mobile: form.phone,
          country: form.country,
          interest: form.interest,
          invoicing: form.invoicing,
        }),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("success");
    } catch (err) {
      console.error("IDG registration error:", err);
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
          Your registration couldn't be submitted. Please email us directly at{" "}
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
        <h3 className="font-display text-2xl text-navy mb-3">Registration Received</h3>
        <p className="font-body text-sm text-foreground/60 leading-relaxed max-w-sm mx-auto mb-6">
          Thank you for registering. We have received your details and will be in touch shortly.
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
      {/* Interest */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">I would like to register *</label>
        <select
          name="interest" required value={form.interest} onChange={handleChange}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors appearance-none"
        >
          <option value="">Select an option…</option>
          <option value="Yes — I want to register">Yes — I want to register</option>
          <option value="Maybe later — keep me informed">Maybe later — keep me informed</option>
        </select>
      </div>

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

      {/* Email */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Email Address *</label>
        <input
          type="email" name="email" required value={form.email} onChange={handleChange}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
          placeholder="you@example.com"
        />
      </div>

      {/* Phone + Country */}
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Mobile Number *</label>
          <input
            type="tel" name="phone" required value={form.phone} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="+1 555 000 0000"
          />
        </div>
        <div>
          <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">Country of Residence *</label>
          <input
            type="text" name="country" required value={form.country} onChange={handleChange}
            className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors"
            placeholder="e.g. Netherlands"
          />
        </div>
      </div>

      {/* Invoicing */}
      <div>
        <label className="font-body text-[10px] tracking-[0.2em] text-foreground/50 uppercase block mb-2">How would you like to be invoiced? *</label>
        <select
          name="invoicing" required value={form.invoicing} onChange={handleChange}
          className="w-full border border-border px-4 py-3 font-body text-sm text-navy bg-background focus:outline-none focus:border-gold/60 transition-colors appearance-none"
        >
          <option value="">Select an option…</option>
          <option value="Individual">Individual</option>
          <option value="Company / Organisation">Company / Organisation</option>
        </select>
        <p className="font-body text-xs text-foreground/40 mt-2">
          If invoicing a company, we will follow up to collect billing details & any reference numbers.
        </p>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full font-body text-xs tracking-[0.2em] uppercase bg-gold text-white py-4 hover:bg-gold/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? "Preparing your registration…" : "Submit Registration"}
      </button>

      <p className="font-body text-xs text-foreground/40 text-center leading-relaxed">
        Your registration will open in your email client, pre-filled and ready to send.
        We will confirm your place and send payment details within 2 business days.
      </p>
    </form>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function IDGCertificationPage() {
  const [toast, setToast] = useState<string | null>(null);
  console.log("IDGCertificationPage rendered");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end bg-navy overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="IDG Coach Certification Training"
          fill className="object-cover opacity-25" priority
        />
        <div className="absolute inset-0 bg-navy/90" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
        />
        {/* Gold line top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 pt-36 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center gap-3 mb-8">
            <Link href="/" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">Home</Link>
            <span className="text-white/20 text-xs">›</span>
            <Link href="/academy" className="font-body text-xs tracking-[0.2em] text-white/40 hover:text-gold/70 transition-colors uppercase">Academy</Link>
            <span className="text-white/20 text-xs">›</span>
            <span className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">IDG Certification</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-5">Online · 6 Weeks</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-white leading-[1.05] max-w-3xl mb-5">
            6-Week IDG Coach<br />
            <span className="text-gold italic">Certification Training</span>
          </h1>
          <p className="font-body text-base text-white/55 max-w-xl leading-relaxed">
            Equip yourself with the IDG Measurement Tool and coaching modalities to open new doorways in organisations, support leaders on their inner development journey, and quantify your impact in the context of advancing the 17 SDGs.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────────────────────────── */}
      <section className="bg-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: "6 weeks", label: "Programme Length" },
              { value: "25", label: "IDG Capacities" },
              { value: "$995", label: "Investment" },
              { value: "17", label: "SDGs Addressed" },
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
                This certification training equips you with the IDG Measurement Tool and associated coaching modalities. By bringing more objectivity to the highly subjective world of Inner Development, you make it easier to champion and act on it — especially within an organisational context.
              </p>

              {/* Benefits */}
              <div className="space-y-4 mb-10">
                {[
                  { title: "Administer the IDG Measurement Tool", desc: "Help your clients interpret the findings and translate them into a highly customised inner development plan." },
                  { title: "Demonstrate Business & SDG Impact", desc: "Clearly show how a greater focus on Inner Development drives employee engagement, innovation, quality education, climate action, and partnerships for the goals." },
                  { title: "New Coaching Techniques", desc: "Add to your coaching toolkit techniques for creating psychologically safe environments that enhance generative conversations." },
                  { title: "Community of Pioneers", desc: "Join a community of like-minded change agents to practice and deepen into the learning together." },
                  { title: "Your Own Inner Growth", desc: "Gain insights that allow you to access even more of your own inner potential and grow into your next stage of personal development as a coach & facilitator." },
                  { title: "Access to IDG Platform", desc: "Full access to the IDG measurement platform where you can generate client reports. No additional licence fees for individual 1-1 use." },
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

              {/* Schedule & Investment */}
              <div className="bg-navy p-8 mb-10">
                <p className="font-body text-[10px] tracking-[0.25em] text-gold/60 uppercase mb-4">Schedule & Investment</p>
                <div className="grid sm:grid-cols-2 gap-5">
                  {[
                    { label: "Start date", value: "September 17, 2025" },
                    { label: "End date", value: "October 15, 2025" },
                    { label: "Duration", value: "6 weeks" },
                    { label: "Format", value: "Online · Zoom" },
                    { label: "Investment", value: "$995" },
                    { label: "Global South", value: "$695" },
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
              <div className="mb-10">
                <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">Who This Is For</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    "Change agents & sustainability champions",
                    "Coaches wanting more rigour & measurability",
                    "Consultants supporting SDG-aligned organisations",
                    "HR & L&D professionals",
                    "Leaders championing Inner Development",
                    "Facilitators of organisational transformation",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3 bg-secondary border border-border px-4 py-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                      <span className="font-body text-sm text-foreground/70">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Facilitators */}
              <div>
                <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-6">Meet the Facilitators</p>
                <div className="space-y-6">
                  <div className="bg-white border border-border p-6">
                    <h4 className="font-display text-lg text-navy mb-1">Mark Vandeneijnde</h4>
                    <p className="font-body text-[10px] tracking-[0.2em] text-gold uppercase mb-3">Co-founder, BEING at Full Potential</p>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">
                      Mark assists leaders in companies and organisations in questioning their most ingrained assumptions about business, looking at the future with fresh eyes, and courageously expanding their role in society. As creator of the Human Potential Assessment & IDG Measurement Tool, Mark makes it possible for organisational leaders to bring more objectivity and action-ability to Inner Development work.
                    </p>
                  </div>
                  <div className="bg-white border border-border p-6">
                    <h4 className="font-display text-lg text-navy mb-1">Peter Kirk</h4>
                    <p className="font-body text-[10px] tracking-[0.2em] text-gold uppercase mb-3">Co-facilitator · Coach & PMO Professional</p>
                    <p className="font-body text-sm text-foreground/60 leading-relaxed">
                      Certified HR Coach and PMO Professional passionate about empowering individuals and teams to make value-aligned decisions, overcome challenges, and thrive with purpose, collaboration and a touch of humour. With expertise in coaching, leadership development and project management (PMP®, Prosci®, IDG Coaching), Peter guides human-centred change and business transformation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: registration form */}
            <div className="lg:sticky lg:top-28">
              <div className="mb-6">
                <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-3">Sep – Oct 2025 Cohort</p>
                <h2 className="font-display text-3xl font-light text-navy leading-tight">
                  Register Your Place
                </h2>
              </div>
              <RegistrationForm />
            </div>

          </div>
        </div>
      </section>

      {/* ── QUOTE ─────────────────────────────────────────────────────────────── */}
      <section className="bg-navy py-16 lg:py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <svg width="32" height="24" viewBox="0 0 28 20" fill="none" className="text-gold/30 mx-auto mb-6">
            <path d="M0 20V12C0 5.333 3.333 1.333 10 0l1.6 2.4C8.533 3.467 6.8 5.467 6.4 8.4H12V20H0zm16 0V12C16 5.333 19.333 1.333 26 0l1.6 2.4C24.533 3.467 22.8 5.467 22.4 8.4H28V20H16z" fill="currentColor" />
          </svg>
          <p className="font-display text-xl md:text-2xl font-light text-white/80 leading-relaxed italic mb-8">
            &ldquo;If you can measure it, you can manage it. By bringing more objectivity to the highly subjective world of Inner Development we make it easier to champion and act on it — especially in an organisational context.&rdquo;
          </p>
          <p className="font-body text-xs tracking-[0.2em] text-gold/70 uppercase">Mark Vandeneijnde · Co-founder, BEING at Full Potential</p>
        </div>
      </section>

      {/* ── BACK TO ACADEMY ───────────────────────────────────────────────────── */}
      <section className="bg-background py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-sm text-foreground/60">Have questions before registering?</p>
          <div className="flex gap-4">
            <Link href="/academy"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-8 py-3 hover:border-navy hover:text-navy transition-all">
              Back to Academy
            </Link>
            <a href="mailto:mark@beingatfullpotential.com?subject=IDG Certification Question"
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
