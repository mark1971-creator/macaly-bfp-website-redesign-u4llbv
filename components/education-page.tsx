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
        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>
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
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-xs tracking-[0.15em] border border-gold text-gold px-5 py-2.5 text-center hover:bg-gold hover:text-white transition-all mt-2">
            TAKE ASSESSMENT
          </a>
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

const idgDimensions = [
  {
    letter: "I",
    label: "Being",
    subtitle: "Inner compass & integrity",
    items: ["Self-awareness", "Presence", "Openness & learning mindset", "Self-care", "Authenticity"],
  },
  {
    letter: "D",
    label: "Thinking",
    subtitle: "Cognitive skills",
    items: ["Critical thinking", "Complexity awareness", "Perspective skills", "Sense-making", "Long-term orientation"],
  },
  {
    letter: "G",
    label: "Relating",
    subtitle: "Caring for others & the world",
    items: ["Appreciation", "Connectedness", "Humility", "Empathy & compassion", "Mobilising others"],
  },
  {
    letter: "S",
    label: "Collaborating",
    subtitle: "Social skills",
    items: ["Communication", "Co-creation", "Inclusive mindset", "Trust", "Conflict transformation"],
  },
  {
    letter: "+",
    label: "Acting",
    subtitle: "Driving change",
    items: ["Courage", "Creativity", "Optimism", "Perseverance", "Visionary"],
  },
];

const bookHighlights = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
    title: "Education ReEnlightened",
    body: "A visionary framework that invites educators, schools, and learning institutions to reimagine education from the inside out — placing human potential at the centre.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "Coming Home to Who You Are",
    body: "The book explores what it means to educate the whole human being — integrating inner development, self-knowledge, and purpose into the heart of learning.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
    title: "A Global Movement",
    body: "Aligned with the UN Sustainable Development Goals, the Inner Development Goals initiative is gaining momentum in schools, universities, and learning organisations worldwide.",
  },
];

export default function EducationPage() {
  const [toast, setToast] = useState<string | null>(null);
  console.log("EducationPage rendered");

  return (
    <div className="min-h-screen bg-background">
      <Nav />
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.pexels.com/photos/19554793/pexels-photo-19554793.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
          alt="Historic university building surrounded by autumn foliage"
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
            <span className="font-body text-[10px] tracking-[0.25em] text-gold/70 uppercase">Education</span>
          </div>
          <p className="font-body text-[10px] tracking-[0.35em] text-gold/80 uppercase mb-6">Human-Centric Learning</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05] mb-7">
            Education<br />
            <em className="not-italic text-gold">ReEnlightened</em>
          </h1>
          <p className="font-body text-base md:text-lg text-white/65 leading-relaxed max-w-2xl mx-auto mb-12">
            What if education were designed around the full expression of human potential? Discover how the
            Inner Development Goals and our book <em>Coming Home to Who You Are</em> are reshaping learning
            from the inside out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/education"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Explore the Book
            </Link>
            <a href="#idg"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/40 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all">
              Inner Development Goals
            </a>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-12 bg-white/40" />
          <span className="font-body text-[9px] tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        </div>
      </section>

      {/* ── BOOK HIGHLIGHTS ──────────────────────────────────────────────────── */}
      <section className="bg-background py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">The Book</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-5">
              Coming Home to<br />Who You Are
            </h2>
            <p className="font-body text-base text-foreground/60 leading-relaxed max-w-2xl mx-auto">
              A vision for education that starts with the being of the learner — not just the content they consume.
              Written by Mark Vandeneijnde, this book bridges inner development and institutional learning design.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bookHighlights.map((item) => (
              <div key={item.title} className="bg-white border border-border p-8 hover:border-gold/30 hover:shadow-lg transition-all duration-400">
                <div className="text-gold mb-5 opacity-80">{item.icon}</div>
                <h3 className="font-display text-xl font-light text-navy mb-3">{item.title}</h3>
                <p className="font-body text-sm text-foreground/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/education"
              className="font-body text-xs tracking-[0.2em] uppercase border border-navy/25 text-navy/60 px-10 py-4 hover:border-navy hover:text-navy transition-all inline-block">
              Learn More About the Book
            </Link>
          </div>
        </div>
      </section>

      {/* ── INNER DEVELOPMENT GOALS ──────────────────────────────────────────── */}
      <section id="idg" className="bg-navy py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">IDGs</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-5">
              The Inner Development<br />Goals Framework
            </h2>
            <p className="font-body text-base text-white/55 max-w-2xl mx-auto leading-relaxed">
              The IDGs are a non-profit initiative identifying 23 inner capacities that humans need to develop
              in order to address the complex challenges of our time — from personal wellbeing to the
              UN Sustainable Development Goals.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/8">
            {idgDimensions.map((dim) => (
              <div key={dim.label} className="bg-navy p-7 hover:bg-white/5 transition-colors duration-300 group">
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center mb-5 group-hover:border-gold/70 transition-colors">
                  <span className="font-display text-lg text-gold/60 group-hover:text-gold transition-colors">{dim.letter}</span>
                </div>
                <p className="font-body text-[10px] tracking-[0.2em] text-gold/60 uppercase mb-1">{dim.subtitle}</p>
                <h3 className="font-display text-xl font-light text-white mb-4">{dim.label}</h3>
                <ul className="space-y-1.5">
                  {dim.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-gold/40 shrink-0" />
                      <span className="font-body text-xs text-white/50">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="https://innerdevelopmentgoals.org/" target="_blank" rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/20 text-white/50 px-10 py-4 hover:border-white hover:text-white transition-all inline-block">
              Visit innerdevelopmentgoals.org ↗
            </a>
          </div>
        </div>
      </section>

      {/* ── HOW WE SUPPORT EDUCATION ─────────────────────────────────────────── */}
      <section className="bg-secondary py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="font-body text-[10px] tracking-[0.3em] text-gold uppercase mb-4">How We Work</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-6">
                Bringing Human Potential<br />Into Learning Institutions
              </h2>
              <p className="font-body text-base text-foreground/60 leading-relaxed mb-6">
                We partner with schools, universities, and corporate learning teams to integrate human potential
                development into their programmes — using the IDG framework, our book, and our coaching methodology
                as complementary resources.
              </p>
              <p className="font-body text-base text-foreground/60 leading-relaxed mb-10">
                Whether you are a school leader looking to inspire teachers, a university integrating wellbeing
                into curricula, or a corporate L&D team building inner-oriented leadership development —
                we can support your journey.
              </p>
              <Link href="/#contact"
                className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors inline-block">
                Start a Conversation
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Schools & Educators", desc: "Embedding inner development in day-to-day teaching practice" },
                { label: "Universities", desc: "Curriculum design that centres whole-person development" },
                { label: "Corporate L&D", desc: "Leadership programmes grounded in inner capacities" },
                { label: "Social Sector", desc: "Building resilience and purpose in mission-driven teams" },
              ].map((item) => (
                <div key={item.label} className="bg-white border border-border p-6 hover:border-gold/30 hover:shadow-md transition-all duration-300">
                  <h3 className="font-display text-base font-light text-navy mb-2">{item.label}</h3>
                  <p className="font-body text-xs text-foreground/55 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section className="bg-navy py-20 lg:py-24 border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-[10px] tracking-[0.3em] text-gold/70 uppercase mb-4">Get in Touch</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Bring Human-Centric<br />Learning to Your Institution?
          </h2>
          <p className="font-body text-base text-white/55 leading-relaxed mb-10">
            Whether you want to explore the book, integrate the IDGs, or design a bespoke learning journey —
            we&apos;d love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] uppercase bg-gold text-white px-10 py-4 hover:bg-gold/80 transition-colors">
              Contact Us
            </Link>
            <Link href="/impact"
              className="font-body text-xs tracking-[0.2em] uppercase border border-white/30 text-white px-10 py-4 hover:border-white hover:bg-white/5 transition-all">
              Back to Impact
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
