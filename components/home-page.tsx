"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Toast Notification ────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="hsl(38,55%,50%)" strokeWidth="1.5"/>
        <path d="M10 6v4M10 13v1" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </div>
  );
}

function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const show = (msg: string) => setMessage(msg);
  const hide = () => setMessage(null);
  return { message, show, hide };
}

// ─── Coming Soon Handler ───────────────────────────────────────────────────────
function ComingSoonLink({
  href,
  children,
  className,
  external,
  onNotImplemented,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  onNotImplemented: (msg: string) => void;
}) {
  const internalNotImplemented = [
    // "/academy", // implemented
    // "/impact", // implemented
    // "/individuals", // implemented
    // "/teams", // implemented
    // "/organizations", // implemented
    "/clients",
    "/case-study",
    "/subscribe",
    "/join",
  ];

  const isNotImplemented = internalNotImplemented.some((p) => href.startsWith(p));

  if (isNotImplemented) {
    return (
      <button
        onClick={() => onNotImplemented("This page is coming soon! We're working hard to bring it to life.")}
        className={className}
      >
        {children}
      </button>
    );
  }

  if (external || href.startsWith("http")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

// ─── Navigation ───────────────────────────────────────────────────────────────
function Navigation({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "About", href: "/about" },
    { label: "Insight", href: "/insight" },
    { label: "Impact", href: "/impact" },
    { label: "Academy", href: "/academy" },
    { label: "Assessments", href: "/assessments" },
    { label: "Contact", href: "#contact", scroll: true },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-navy shadow-2xl py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" onClick={() => scrollTo("hero")} className="flex items-center gap-3 group">
          <img
            src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            className="h-12 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.scroll ? (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold-light transition-colors duration-300"
              >
                {link.label}
              </button>
            ) : (
              <ComingSoonLink
                key={link.label}
                href={link.href}
                external={link.external}
                onNotImplemented={onNotImplemented}
                className="font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold-light transition-colors duration-300"
              >
                {link.label}
              </ComingSoonLink>
            )
          )}
          <a
            href="https://beingatfullpotential.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-5 py-2.5 border border-gold text-gold hover:bg-gold hover:text-navy font-body text-sm tracking-widest uppercase transition-all duration-300"
          >
            Take Assessment
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-6 flex flex-col gap-1.5">
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) =>
            link.scroll ? (
              <button
                key={link.label}
                onClick={() => scrollTo(link.href)}
                className="font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold text-left py-2 border-b border-white/10"
              >
                {link.label}
              </button>
            ) : (
              <ComingSoonLink
                key={link.label}
                href={link.href}
                external={link.external}
                onNotImplemented={(msg) => { onNotImplemented(msg); setMobileOpen(false); }}
                className="font-body text-sm tracking-widest uppercase text-white/80 hover:text-gold text-left py-2 border-b border-white/10 block w-full"
              >
                {link.label}
              </ComingSoonLink>
            )
          )}
          <a
            href="https://beingatfullpotential.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 px-5 py-3 border border-gold text-gold text-center font-body text-sm tracking-widest uppercase"
          >
            Take Assessment
          </a>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ─────────────────────────────────────────────────────────────
const heroSlides = [
  {
    eyebrow: "Case Study",
    title: "Strengthening Company Culture Through Inner Development",
    subtitle: "A Siam Computing & Being at Full Potential Partnership — IDG Measurement & Alignment.",
    cta: { label: "Read More", href: "/case-studies/siam-computing" },
    bg: "from-[#0d1b3e] via-[#1e3a6e] to-[#0d1b3e]",
    bgImage: "https://images.pexels.com/photos/32159928/pexels-photo-32159928.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    eyebrow: "The World Needs You",
    title: "Showcase Your Uniqueness & Live Up to Your Full Potential",
    subtitle: "We believe this is a basic human right. Access our platform for Human Potential Development — free and available to all.",
    cta: { label: "Unlock Your Potential", href: "https://beingatfullpotential.io/" },
    bg: "from-[#1a2f1a] via-[#1e3a2e] to-[#0d1b3e]",
    bgImage: "https://images.pexels.com/photos/9665186/pexels-photo-9665186.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
  {
    eyebrow: "Academy",
    title: "Become a Certified Human Potential Coach",
    subtitle: "This certification equips you with leading-edge Human Potential tools so you can help clients discover the transformational leader within.",
    cta: { label: "More Information", href: "/academy" },
    bg: "from-[#2e1a0e] via-[#3d2510] to-[#0d1b3e]",
    bgImage: "https://images.pexels.com/photos/5646319/pexels-photo-5646319.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  },
];

function HeroSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = (idx: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setIsAnimating(false);
    }, 300);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % heroSlides.length);
    }, 6000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const slide = heroSlides[current];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay"
    >
      {/* Background photo */}
      <div
        key={`bg-${current}`}
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
        style={{ backgroundImage: `url('${slide.bgImage}')` }}
      />
      {/* Gradient colour overlay — preserves brand hues while letting photo show through */}
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.bg} opacity-80`} />

      {/* Radial gold glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 md:pt-0">
        {/* Eyebrow */}
        <p
          key={`eyebrow-${current}`}
          className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6 animate-fade-in"
        >
          {slide.eyebrow}
        </p>

        {/* Title */}
        <h1
          key={`title-${current}`}
          className="font-display text-5xl md:text-7xl font-light text-white leading-tight mb-8 animate-fade-in-up"
        >
          {slide.title}
        </h1>

        {/* Subtitle */}
        <p
          key={`sub-${current}`}
          className="font-body text-lg text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in delay-200"
        >
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div
          key={`cta-${current}`}
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-300"
        >
          {slide.cta.href.startsWith("/") ? (
            <Link
              href={slide.cta.href}
              className="px-8 py-4 bg-gold text-navy font-body text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300 font-bold"
            >
              {slide.cta.label}
            </Link>
          ) : (
            <a
              href={slide.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-gold text-navy font-body text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300 font-bold"
            >
              {slide.cta.label}
            </a>
          )}
          <a
            href="https://beingatfullpotential.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-white/40 text-white font-body text-sm tracking-widest uppercase hover:border-white hover:bg-white/10 transition-all duration-300"
          >
            Explore Platform
          </a>
        </div>

        {/* Slide indicators */}
        <div className="flex justify-center gap-2 mt-16">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`transition-all duration-300 ${
                i === current
                  ? "w-8 h-1.5 bg-gold"
                  : "w-2 h-1.5 bg-white/30 hover:bg-white/60"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
        <span className="font-body text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/40 to-transparent" />
      </div>
    </section>
  );
}

// ─── Vision Section ────────────────────────────────────────────────────────────
function VisionSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section id="vision" className="py-32 bg-cream">
      <div className="max-w-4xl mx-auto px-6">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Vision</p>
        <h2 className="font-display text-5xl md:text-6xl font-light text-navy leading-tight mb-8">
          Every Human,
          <br />
          <em className="text-shimmer not-italic">BEING at Full Potential</em>
        </h2>
        <div className="w-16 h-px bg-gold mb-8" />
        <p className="font-body text-base text-navy/70 leading-relaxed mb-4">
          BEING at Full Potential specializes in <strong className="text-navy">Human Potential development</strong> to enable breakthroughs in employee engagement, innovation and ultimately the bottom line.
        </p>
        <p className="font-body text-base text-navy/70 leading-relaxed mb-4">
          At the core of our approach is an extensive assessment tool that measures the different dimensions of Human Potential realization — making it easier for organizations to take meaningful action.
        </p>
        <p className="font-body text-base text-navy/70 leading-relaxed mb-10">
          Our work has expanded globally and we now serve clients in North America, Latin America, Europe and India.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <ComingSoonLink
            href="/about"
            onNotImplemented={onNotImplemented}
            className="px-8 py-4 bg-navy text-white font-body text-sm tracking-widest uppercase hover:bg-navy/80 transition-all duration-300"
          >
            Learn More About Us
          </ComingSoonLink>
          <a
            href="https://beingatfullpotential.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border border-navy text-navy font-body text-sm tracking-widest uppercase hover:bg-navy hover:text-white transition-all duration-300"
          >
            Take the Assessment
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Thought Leadership Section ────────────────────────────────────────────────
const articles = [
  {
    image: "https://images.pexels.com/photos/17485657/pexels-photo-17485657.png?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    title: "Is our approach to Human Potential Development scientifically validated?",
    date: "January 23, 2023",
    excerpt:
      "As more and more people are starting to realize that Inner Development & growth is a pre-requisite to achieving the change we want to see in the outside world...",
    href: "/thoughtleadership/human-potential-model-validation",
  },
  {
    image: "https://images.pexels.com/photos/12489156/pexels-photo-12489156.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    title: "Countering the threat of AI: Being fully HUMAN is the next competitive advantage",
    date: "August 25, 2023",
    excerpt:
      "Just a few years ago, it would have been hard to imagine how quickly Artificial Intelligence could become part of our lives. Now we see rapid adoption of tools like Chat GPT...",
    href: "/thoughtleadership/countering-the-threat-of-ai",
  },
  {
    image: "https://images.pexels.com/photos/14692664/pexels-photo-14692664.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    title: "Improving Employee Experience through Workplace Actualization",
    date: "June 14, 2023",
    excerpt:
      "HR leaders are increasingly talking about the importance of Employee Experience as the key to organizational breakthroughs. According to a recent Gartner study, it is the 3rd priority...",
    href: "/thoughtleadership/improving-employee-experience",
  },
];

function InsightSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section id="insight" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Get Inspired</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-navy mb-6">Thought Leadership</h2>
          <p className="font-body text-base text-navy/60 max-w-2xl mx-auto leading-relaxed">
            We believe <strong className="text-navy">shifts in mindsets</strong> is what drives progress &amp; innovation. We relentlessly challenge existing beliefs about success, performance and happiness.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <a
              key={i}
              href={article.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block bg-cream hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/9] overflow-hidden bg-navy/5">
                <img
                  src={article.image}
                  alt={article.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <p className="font-body text-xs text-gold mb-3">{article.date}</p>
                <h3 className="font-display text-xl font-semibold text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
                  {article.title}
                </h3>
                <p className="font-body text-sm text-navy/60 leading-relaxed mb-4">{article.excerpt}</p>
                <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">
                  Read More →
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/thoughtleadership"
            className="px-8 py-4 border border-navy text-navy font-body text-sm tracking-widest uppercase hover:bg-navy hover:text-white transition-all duration-300 inline-block"
          >
            Explore All Articles
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Services / Impact Section ─────────────────────────────────────────────────
function ImpactSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const services = [
    { label: "Individuals", icon: "○", href: "/individuals", desc: "Personal transformation and self-actualization journeys" },
    { label: "Teams", icon: "◎", href: "/teams", desc: "Collective intelligence and team potential unlocking" },
    { label: "Organizations", icon: "◈", href: "/organizations", desc: "Culture transformation and systemic change at scale" },
    { label: "Education", icon: "◇", href: "/education", desc: "Building student character and human potential" },
  ];

  return (
    <section id="impact" className="py-32 bg-navy relative overflow-hidden grain-overlay">
      {/* Background decoration */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/5 blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Champion Change</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-8">
            We Believe Every Person Is Gifted With{" "}
            <em className="text-gold-light not-italic">Abundant Potential</em>
          </h2>
          <div className="w-16 h-px bg-gold mb-8" />
          <p className="font-body text-base text-white/70 leading-relaxed mb-4">
            Our approach to Human Potential realization aspires to elevate our state of BEING.
          </p>
          <p className="font-body text-base text-white/70 leading-relaxed mb-4">
            Some people are in tune with their greatest potential and have found ways to integrate it into their lives. This not only brings them enormous fulfillment but is also the most effective way to have impact and contribute to the world in a meaningful way.
          </p>
          <p className="font-body text-sm text-white/60 leading-relaxed mb-8 uppercase tracking-wider">
            Our unique Human Potential Assessment Tool delivers breakthrough insights for:
          </p>
          <ComingSoonLink
            href="/impact"
            onNotImplemented={onNotImplemented}
            className="px-8 py-4 bg-gold text-navy font-body text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300 font-bold"
          >
            Learn How We Can Serve You
          </ComingSoonLink>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {services.map((s, i) => (
            <ComingSoonLink
              key={i}
              href={s.href}
              onNotImplemented={onNotImplemented}
              className="group p-6 border border-white/10 hover:border-gold/50 hover:bg-white/5 transition-all duration-300 text-left"
            >
              <div className="text-gold text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">{s.icon}</div>
              <h3 className="font-display text-xl text-white mb-2">{s.label}</h3>
              <p className="font-body text-xs text-white/50 leading-relaxed">{s.desc}</p>
            </ComingSoonLink>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ──────────────────────────────────────────────────────
const testimonials = [
  {
    quote: "What you have created at Being at Full Potential is a gift to all of us. Thank you for walking this journey alongside our Human Assets Team. This week was evidence of transformation. Thank you for holding this space, which makes possible what previously felt impossible. I'm beyond grateful that our paths have crossed in life.",
    name: "Laura Saldivar Luna",
    role: "Chief People Officer, Teach for America",
  },
  {
    quote: "Thank you for bringing 'the third dimension' into the conversation and helping us see our collective greatness.",
    name: "Virginie Helias",
    role: "Vice President Sustainability, Procter & Gamble",
  },
  {
    quote: "At Omega we are truly inspired by your approach to Human potential development. We are proud to be in a true partnership with Being at Full Potential.",
    name: "Dr. Saravanavasan KS",
    role: "Vice President, Talent Development, Omega Healthcare Management Services",
  },
  {
    quote: "What a magical experience last week with our team. I would love to discover and see how the work within the team could be continued.",
    name: "Michael Dawkins",
    role: "Programme Director, SingularityU",
  },
  {
    quote: "I knew your process would be different than others to plan forward, but I did not expect the power it has in pulling out new insights.",
    name: "Andreas Schurek",
    role: "Managing Director, TNS Switzerland",
  },
  {
    quote: "The HP Assessment Tool is not just another HR, leadership or personal growth tool. It is a gateway to new possibilities, that are bedded in the essence of who we are and could be.",
    name: "Training Participant",
    role: "Human Potential Certification Training",
  },
  {
    quote: "I am SO impressed with the HP instrument to stimulate powerful conversations! Simply opening up questions about a few dimensions on the instrument and inviting inquiry into the intersections revealed by it led to a GREAT conversation!",
    name: "Training Participant",
    role: "Human Potential Certification Training",
  },
  {
    quote: "I admit to having been sceptical at first about the process and the likely benefits it would bring but I'm fully converted into believing that I can bring about significant improvements to the way we work.",
    name: "Paul Gardner",
    role: "Owner, Budgens supermarket, London",
  },
];

function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-32 bg-warm">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Testimonials</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-16">
          What They Say About Our Work
        </h2>

        <div className="relative min-h-[260px] flex items-center justify-center">
          <div key={current} className="animate-fade-in">
            {/* Quote mark */}
            <div className="font-display text-8xl text-gold/20 leading-none select-none mb-4">&ldquo;</div>
            <blockquote className="font-display text-2xl md:text-3xl font-light text-navy leading-relaxed mb-8 italic">
              {t.quote}
            </blockquote>
            <div className="w-12 h-px bg-gold mx-auto mb-6" />
            <p className="font-body font-bold text-navy text-sm">{t.name}</p>
            <p className="font-body text-xs text-navy/60 mt-1">{t.role}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={prev}
            className="w-10 h-10 border border-navy/20 hover:border-gold hover:text-gold text-navy/40 transition-all duration-300 flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-navy/20 hover:bg-gold/50"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 border border-navy/20 hover:border-gold hover:text-gold text-navy/40 transition-all duration-300 flex items-center justify-center"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── Team Section ──────────────────────────────────────────────────────────────
const teamMembers = [
  {
    name: "Peter Leong",
    location: "New Zealand",
    email: "peter@beingatfullpotential.nz",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/08/Peter-150x150.jpg",
    bio: "Facilitating transformational change in the field of organisational development, change management, integral leadership development, and full potential youth empowerment.",
    href: "mailto:peter@beingatfullpotential.nz",
  },
  {
    name: "Amrita Singh",
    location: "India",
    email: "amrita@backtosource.in",
    image: "https://beingatfullpotential.com/wp-content/uploads/2025/02/amrita-singh-3-150x150.jpg",
    bio: "Amrita bears the unique ability to empathize, energize and encourage individuals. Her style of facilitation is empowering as she supports her audience to access their inner wisdom.",
    href: "https://www.linkedin.com/in/amritaasingh/",
  },
  {
    name: "Andrew Thornton",
    location: "United Kingdom",
    email: "andrew@heartinbusiness.org",
    image: "https://beingatfullpotential.com/wp-content/uploads/2021/08/andrew.jpg",
    bio: "I believe that businesses run with a Heart deliver better results for all stakeholders — a happier, better place to work for employees, customers and communities.",
    href: "mailto:andrew@heartinbusiness.org",
  },
];

function TeamSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section id="team" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Team</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-navy mb-6">
            Human Potential Coaches
          </h2>
          <p className="font-body text-base text-navy/60 max-w-2xl mx-auto leading-relaxed">
            We are an interconnected web of visionary coaches and change agents spread across the globe, striving for a world where each person can fully express their unique potential.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <a
              key={i}
              href={member.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group text-center p-8 bg-cream hover:shadow-xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-6 ring-2 ring-gold/30 group-hover:ring-gold transition-all duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-display text-2xl text-navy mb-1 group-hover:text-gold transition-colors duration-300">
                {member.name}
              </h3>
              <p className="font-body text-xs tracking-widest uppercase text-gold mb-4">{member.location}</p>
              <p className="font-body text-sm text-navy/60 leading-relaxed mb-4">{member.bio}</p>
              <p className="font-body text-xs text-navy/40">{member.email}</p>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <ComingSoonLink
            href="/team"
            onNotImplemented={onNotImplemented}
            className="px-8 py-4 border border-navy text-navy font-body text-sm tracking-widest uppercase hover:bg-navy hover:text-white transition-all duration-300"
          >
            Meet the Full Team
          </ComingSoonLink>
        </div>
      </div>
    </section>
  );
}

// ─── Academy Section ───────────────────────────────────────────────────────────
function AcademySection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section id="academy" className="py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Academy</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-navy mb-6">
            Certification &amp; Training Programs
          </h2>
          <p className="font-body text-base text-navy/60 max-w-2xl mx-auto leading-relaxed">
            Whether you are a Coach, Team Coach, Change Agent, Leader, Manager or Teacher — we support you in realizing your Full Human Potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Event 1 */}
          <a
            href="/academy/idg-certification"
            className="group bg-white p-8 hover:shadow-xl transition-all duration-500 border-l-2 border-gold"
          >
            <span className="inline-block font-body text-xs tracking-widest uppercase text-gold bg-gold/10 px-3 py-1 mb-4">Online · 6 Weeks</span>
            <div className="aspect-[3/1] overflow-hidden mb-4 bg-navy flex items-center justify-center">
              <img
                src="https://innerdevelopmentgoals.org/wp-content/uploads/2024/11/IDG_Logo_Horizontal_Tag_BW_Neg-600x328.png"
                alt="Inner Development Goals"
                className="h-16 w-auto object-contain group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="font-display text-2xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
              6-Week IDG Coach Certification Training
            </h3>
            <p className="font-body text-sm text-navy/60 leading-relaxed mb-4">
              Get certified to administer the IDG Measurement Tool. Measure inner development, coach leaders on their SDG journey, and quantify your impact.
            </p>
            <p className="font-body text-xs text-navy/40 mb-4">September 17 – October 15, 2025</p>
            <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">Register Now →</span>
          </a>

          {/* Event 2 */}
          <a
            href="/academy/apply"
            className="group bg-white p-8 hover:shadow-xl transition-all duration-500 border-l-2 border-gold"
          >
            <span className="inline-block font-body text-xs tracking-widest uppercase text-gold bg-gold/10 px-3 py-1 mb-4">Online • ICF Approved</span>
            <div className="aspect-[3/1] overflow-hidden mb-4 bg-navy/5">
              <img
                src="https://images.pexels.com/photos/5711372/pexels-photo-5711372.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                alt="Human Potential Coach Certification"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <h3 className="font-display text-2xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors duration-300">
              Human Potential Coach Certification Training — ICF Approved, 25 CCEUs
            </h3>
            <p className="font-body text-sm text-navy/60 leading-relaxed mb-4">
              HPCC consists of 11 immersive modules that help unlock and amplify human potential, equipping you with transformational coaching tools.
            </p>
            <p className="font-body text-xs text-navy/40 mb-4">October 20 – December 1, 2026</p>
            <span className="font-body text-xs tracking-widest uppercase text-gold group-hover:underline">Apply Now →</span>
          </a>
        </div>

        <div className="text-center mt-12">
          <ComingSoonLink
            href="/academy"
            onNotImplemented={onNotImplemented}
            className="px-8 py-4 bg-navy text-white font-body text-sm tracking-widest uppercase hover:bg-navy/80 transition-all duration-300"
          >
            Discover More Events
          </ComingSoonLink>
        </div>
      </div>
    </section>
  );
}

// ─── Standards of Being Section ────────────────────────────────────────────────
function StandardsSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section className="relative py-40 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/29347337/pexels-photo-29347337.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940')`,
        }}
      />
      <div className="absolute inset-0 bg-navy/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Standards of Being</p>
        <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-8">
          Allowing
        </h2>
        <div className="w-16 h-px bg-gold mx-auto mb-8" />
        <p className="font-body text-lg text-white/80 leading-relaxed mb-10">
          We trust in the resourcefulness of each person, and we accept others&rsquo; truth as perfect for them. We are not prone to control, because we know that everyone is on a unique and perfect journey. Whenever the energy is heavy or not flowing, rather than push through, we pause to listen &amp; sense into the wisdom of the moment.
        </p>
        <ComingSoonLink
          href="/about"
          onNotImplemented={onNotImplemented}
          className="px-8 py-4 border border-white/60 text-white font-body text-sm tracking-widest uppercase hover:border-gold hover:text-gold transition-all duration-300"
        >
          See More
        </ComingSoonLink>
      </div>
    </section>
  );
}

// ─── Clients Section ───────────────────────────────────────────────────────────
const clients = [
  { name: "Procter & Gamble", logo: "https://beingatfullpotential.com/wp-content/uploads/2019/05/PG.png" },
  { name: "Teach for America", logo: "https://beingatfullpotential.com/wp-content/uploads/2019/05/TFA.jpg" },
  { name: "Omega Healthcare", logo: "https://beingatfullpotential.com/wp-content/uploads/2019/05/Omega.png" },
  { name: "AKQA", logo: "https://beingatfullpotential.com/wp-content/uploads/2019/05/akqa.png" },
];

function ClientsSection({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section className="py-24 bg-white border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Our Clients</p>
          <h2 className="font-display text-4xl font-light text-navy">We Have Worked With</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
          {clients.map((client, i) => (
            <div
              key={i}
              className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 filter"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="h-12 w-auto object-contain max-w-[140px]"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <ComingSoonLink
            href="/clients"
            onNotImplemented={onNotImplemented}
            className="font-body text-sm tracking-widest uppercase text-navy/50 hover:text-gold transition-colors duration-300 underline underline-offset-4"
          >
            See More Clients
          </ComingSoonLink>
        </div>
      </div>
    </section>
  );
}

// ─── Contact Section ───────────────────────────────────────────────────────────
function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    console.log("Contact form submitted:", form);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...form }),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Contact form error:", err);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="py-32 bg-navy relative overflow-hidden grain-overlay">
      <div className="absolute top-0 left-1/4 w-72 h-72 rounded-full bg-gold/5 blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        {/* Info */}
        <div>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-4">Get in Touch</p>
          <h2 className="font-display text-5xl md:text-6xl font-light text-white leading-tight mb-6">
            Begin Your Human Potential Journey
          </h2>
          <div className="w-16 h-px bg-gold mb-8" />
          <p className="font-body text-base text-white/70 leading-relaxed mb-10">
            Is this the beginning of your Human Potential journey? We look forward to hearing from you.
          </p>

          <div className="space-y-4">
            <a
              href="mailto:mark@beingatfullpotential.com"
              className="flex items-center gap-4 text-white/70 hover:text-gold transition-colors duration-300 group"
            >
              <span className="w-10 h-10 border border-white/20 group-hover:border-gold flex items-center justify-center text-gold transition-colors duration-300">
                @
              </span>
              <span className="font-body text-sm">mark@beingatfullpotential.com</span>
            </a>
          </div>

          <div className="flex gap-4 mt-10">
            <a
              href="https://www.facebook.com/BeingAtFullPotential"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold text-white/50 flex items-center justify-center transition-all duration-300 font-body text-xs"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://twitter.com/beingatFP"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold text-white/50 flex items-center justify-center transition-all duration-300 font-body text-xs"
              aria-label="Twitter/X"
            >
              𝕏
            </a>
            <a
              href="https://www.linkedin.com/company/being-at-full-potential"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 border border-white/20 hover:border-gold hover:text-gold text-white/50 flex items-center justify-center transition-all duration-300 font-body text-xs"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-white/10 p-8">
          {status === "error" ? (
            <div className="text-center py-12">
              <div className="text-red-400 text-4xl mb-4">✕</div>
              <h3 className="font-display text-2xl text-white mb-2">Something Went Wrong</h3>
              <p className="font-body text-sm text-white/60">Your message couldn't be sent. Please email us directly at mark@beingatfullpotential.com</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 font-body text-xs tracking-widest uppercase text-gold hover:underline"
              >
                Try Again
              </button>
            </div>
          ) : status === "sent" ? (
            <div className="text-center py-12">
              <div className="text-gold text-4xl mb-4">✓</div>
              <h3 className="font-display text-2xl text-white mb-2">Message Sent</h3>
              <p className="font-body text-sm text-white/60">Thank you! We'll be in touch soon.</p>
              <button
                onClick={() => setStatus("idle")}
                className="mt-6 font-body text-xs tracking-widest uppercase text-gold hover:underline"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-white/50 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-transparent border border-white/20 focus:border-gold px-4 py-3 text-white font-body text-sm outline-none transition-colors duration-300 placeholder-white/20"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-white/50 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent border border-white/20 focus:border-gold px-4 py-3 text-white font-body text-sm outline-none transition-colors duration-300 placeholder-white/20"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block font-body text-xs tracking-widest uppercase text-white/50 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-transparent border border-white/20 focus:border-gold px-4 py-3 text-white font-body text-sm outline-none transition-colors duration-300 placeholder-white/20 resize-none"
                  placeholder="Tell us about your journey..."
                />
              </div>
              <button
                type="submit"
                disabled={status === "sending"}
                className="w-full py-4 bg-gold text-navy font-body text-sm tracking-widest uppercase hover:bg-gold-light transition-all duration-300 font-bold disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────
function Footer({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#141210] py-16 border-t border-gold/15">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <img
              src="https://beingatfullpotential.com/wp-content/uploads/2019/11/Logo-light.png"
              alt="BEING at Full Potential"
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.
            </p>
          </div>

          {/* Nav */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-gold mb-6">Navigate</h4>
            <ul className="space-y-3">
              {[
                { label: "About", href: "/about" },
                { label: "Insight", href: "/insight" },
                { label: "Impact", href: "/impact" },
                { label: "Academy", href: "/academy" },
                { label: "Our Team", href: "/team" },
                { label: "Our Clients", href: "/clients" },
              ].map((link) => (
                <li key={link.label}>
                  <ComingSoonLink
                    href={link.href}
                    onNotImplemented={onNotImplemented}
                    className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </ComingSoonLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-body text-xs tracking-widest uppercase text-gold mb-6">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://beingatfullpotential.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                >
                  Assessment Platform
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/BeingAtFullPotential"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/beingatFP"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                >
                  Twitter / X
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/being-at-full-potential"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <button
                  onClick={() => scrollTo("contact")}
                  className="font-body text-sm text-white/50 hover:text-gold transition-colors duration-300"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body text-xs text-white/30">
            © {new Date().getFullYear()} BEING at Full Potential. All rights reserved.
          </p>
          <p className="font-body text-xs text-white/20 italic font-display">
            Every Human, BEING at Full Potential
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Specialties CTA Banner ────────────────────────────────────────────────────
function SpecialtiesBanner({ onNotImplemented }: { onNotImplemented: (msg: string) => void }) {
  return (
    <section className="py-20 bg-gold relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full border-2 border-navy" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-navy" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="font-body text-xs tracking-[0.3em] uppercase text-navy/60 mb-4">Programs</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-navy mb-4">
          Certification &amp; Training Programs
        </h2>
        <p className="font-body text-base text-navy/70 mb-8">
          Get in touch for a free consultation
        </p>
        <ComingSoonLink
          href="/impact"
          onNotImplemented={onNotImplemented}
          className="px-8 py-4 bg-navy text-white font-body text-sm tracking-widest uppercase hover:bg-navy/90 transition-all duration-300 font-bold"
        >
          Get Started
        </ComingSoonLink>
      </div>
    </section>
  );
}

// ─── Main HomePage Component ───────────────────────────────────────────────────
export default function HomePage() {
  const toast = useToast();

  return (
    <>
      <Navigation onNotImplemented={toast.show} />

      <main>
        <HeroSection onNotImplemented={toast.show} />
        <VisionSection onNotImplemented={toast.show} />
        <InsightSection onNotImplemented={toast.show} />
        <ImpactSection onNotImplemented={toast.show} />
        <AcademySection onNotImplemented={toast.show} />
        <TestimonialsSection />
        <TeamSection onNotImplemented={toast.show} />
        <StandardsSection onNotImplemented={toast.show} />
        <ClientsSection onNotImplemented={toast.show} />
        <ContactSection />
      </main>

      <Footer onNotImplemented={toast.show} />

      {toast.message && <Toast message={toast.message} onClose={toast.hide} />}
    </>
  );
}
