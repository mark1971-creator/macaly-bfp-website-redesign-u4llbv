"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] bg-navy text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-fade-in">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
        <circle cx="10" cy="10" r="9" stroke="hsl(38,55%,50%)" strokeWidth="1.5" />
        <path d="M10 6v4M10 13v1" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="font-body text-sm">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-xs">✕</button>
    </div>
  );
}

// ─── Navigation ────────────────────────────────────────────────────────────────
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
                <button
                  key={link.label}
                  onClick={() => onNotImplemented("This page is coming soon — we're building it now!")}
                  className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors"
                >
                  {link.label}
                </button>
              );
            }
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`font-body text-xs tracking-[0.15em] transition-colors ${
                  link.href === "/about"
                    ? "text-gold-light"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <a
          href="https://beingatfullpotential.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] bg-transparent border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all"
        >
          TAKE ASSESSMENT
        </a>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            if (!link.implemented) {
              return (
                <button key={link.label} onClick={() => { setMobileOpen(false); onNotImplemented("This page is coming soon!"); }}
                  className="font-body text-sm tracking-[0.12em] text-white/70 text-left">
                  {link.label}
                </button>
              );
            }
            return (
              <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
                className="font-body text-sm tracking-[0.12em] text-white">
                {link.label}
              </Link>
            );
          })}
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-sm tracking-[0.12em] border border-gold text-gold px-4 py-2.5 text-center mt-2">
            TAKE ASSESSMENT
          </a>
        </div>
      )}
    </header>
  );
}

// ─── Standards of Being data ───────────────────────────────────────────────────
const standards = [
  {
    number: "01",
    title: "Allowing",
    body: "We trust in the resourcefulness of each person, and we accept others' truth as perfect for them. We are not prone to control, because we know that everyone is on a unique and perfect journey. Whenever the energy is heavy or not flowing, rather than push through, we pause to listen & sense into the wisdom of the moment.",
  },
  {
    number: "02",
    title: "Being Fully Human",
    body: "Although we continuously strive to be at our full potential, we recognize that no matter how evolved we are, there is always more to grow into. We embrace, without judgment, all aspects of the human experience and recognize that only then can we access and unleash our full potential.",
  },
  {
    number: "03",
    title: "Open Source",
    body: "We see ourselves as conduits rather than creators of the tools, frameworks and training programs that have manifested through us. We claim nothing through copyrights and, whenever possible, adopt an open source approach to evolving this work — so our partners can freely build on and expand the impact of this work in the world.",
  },
  {
    number: "04",
    title: "Transcended Listening",
    body: "Everyday we practice the act of being present to others, suspending our judgment and reactive thinking. Instead of being triggered, we let others' input transform us into action and unforeseen breakthroughs. We listen with kindness to the deeper and subtler levels of meaning and emotions within others.",
  },
];

// ─── Mission pillars ───────────────────────────────────────────────────────────
const missions = [
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="hsl(38,55%,50%)" strokeWidth="1.5" />
        <circle cx="18" cy="18" r="8" stroke="hsl(38,55%,50%)" strokeWidth="1" opacity="0.5" />
        <circle cx="18" cy="18" r="3" fill="hsl(38,55%,50%)" />
      </svg>
    ),
    label: "Self-Realization",
    body: "We hold space for each other, and the wider world, to continuously express more of who we are and find creative ways to integrate our full selves into all aspects of our life.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 4L22 14H32L24 20L27 30L18 24L9 30L12 20L4 14H14L18 4Z" stroke="hsl(38,55%,50%)" strokeWidth="1.5" fill="none" />
      </svg>
    ),
    label: "Thought-Leadership",
    body: "We relentlessly explore the edge of human awareness & organizational practices, pioneer new frameworks, quantify the unquantifiable, and bring this science into the mainstream as our new collective lived reality.",
  },
  {
    icon: (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M9 18C9 13.03 13.03 9 18 9" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M27 18C27 22.97 22.97 27 18 27" stroke="hsl(38,55%,50%)" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="18" cy="9" r="2.5" fill="hsl(38,55%,50%)" />
        <circle cx="18" cy="27" r="2.5" fill="hsl(38,55%,50%)" />
        <circle cx="9" cy="18" r="2.5" fill="hsl(38,55%,50%)" />
        <circle cx="27" cy="18" r="2.5" fill="hsl(38,55%,50%)" />
      </svg>
    ),
    label: "Co-Create the New",
    body: "We are pioneers of new organizational bodies that create the conditions for a new generation of conscious change-makers to collaborate across boundaries, in service of a greater good.",
  },
];

// ─── Featured team members ─────────────────────────────────────────────────────
const featuredTeam = [
  {
    name: "Mark Vandeneijnde",
    location: "Switzerland",
    image: "/wp-content/uploads/2019/02/mark.jpg",
    bio: "Mark's keen sense of insight and market understanding were the source of many breakthrough initiatives during his 10-year corporate career. Co-founder of BEING at Full Potential.",
  },
  {
    name: "Peter Leong",
    location: "New Zealand",
    image: "/wp-content/uploads/2021/08/Peter-150x150.jpg",
    bio: "Facilitating transformational change in the field of organisational development, change management, integral leadership development, and full potential youth empowerment.",
  },
  {
    name: "Amrita Singh",
    location: "India",
    image: "/wp-content/uploads/2025/02/amrita-singh-3-150x150.jpg",
    bio: "Amrita bears the unique ability to empathize, energize and encourage individuals. Her style of facilitation is empowering as she supports her audience to access their inner wisdom.",
  },
  {
    name: "Andrew Thornton",
    location: "United Kingdom",
    image: "/wp-content/uploads/2021/08/andrew.jpg",
    bio: "I believe that businesses run with a Heart deliver better results for all stakeholders — a happier, better place to work for employees, customers and communities.",
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => setToast(msg);
  const hideToast = () => setToast(null);

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={hideToast} />}
      <Nav onNotImplemented={showToast} />

      {/* ── HERO ───────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[60vh] flex items-end bg-navy overflow-hidden">
        {/* Nature background image */}
        <Image
          src="https://images.pexels.com/photos/13534014/pexels-photo-13534014.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Aerial view of misty mountains and lush forest at sunrise"
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-20 pt-40 w-full">
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-6 uppercase">About Us</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-4xl mb-6">
            Every Human,<br />
            <span className="text-gold italic">BEING at Full Potential.</span>
          </h1>
          <p className="font-body text-lg text-white/60 max-w-2xl leading-relaxed mt-6">
            Are you ready to express yours?
          </p>
        </div>
      </section>

      {/* ── WHO WE ARE ─────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Who We Are</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15] mb-8">
            We believe that expressing our Human Potential is a{" "}
            <span className="text-gold italic">basic human right.</span>
          </h2>
          <div className="w-16 h-px bg-gold mb-10" />
          <div className="space-y-5 text-foreground/70 font-body text-base leading-relaxed">
            <p>
              BEING at Full Potential is dedicated to a world where the{" "}
              <strong className="text-navy font-semibold">HUMAN POTENTIAL</strong> of every individual
              and organization is fully realized.
            </p>
            <p>
              We are a global assessment, training and coaching organization committed to unlocking
              HUMAN POTENTIAL by bringing the attention back to the essence of{" "}
              <strong className="text-navy font-semibold">WHO WE ARE</strong> and{" "}
              <strong className="text-navy font-semibold">WHY WE ARE HERE.</strong>
            </p>
            <p>
              From this state of BEING our clients easily see through the complexities and chaos of
              their worlds, enabling them to move forward with a greater sense of purpose and meaning.
            </p>
            <p className="text-navy font-medium">
              Our global community of 200+ trained and certified coaches and consultants help bring
              this vision to life.
            </p>
          </div>
          <div className="mt-10">
            <Link
              href="/impact"
              className="font-body text-xs tracking-[0.2em] bg-navy text-white px-8 py-4 hover:bg-navy/80 transition-colors inline-block"
            >
              LEARN WHAT WE DO
            </Link>
          </div>
        </div>
      </section>

      {/* ── GLOBAL STATS ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "4", label: "Continents" },
              { value: "200+", label: "Certified Coaches" },
              { value: "2010", label: "Founded" },
              { value: "3", label: "Global HQs" },
            ].map((stat) => (
              <div key={stat.label} className="py-8">
                <div className="font-display text-5xl md:text-6xl font-light text-gold mb-3">
                  {stat.value}
                </div>
                <div className="font-body text-xs tracking-[0.2em] text-white/60 uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GLOBAL COMMUNITY ───────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative aspect-[3/2] overflow-hidden shadow-xl">
                <Image
                  src="/wp-content/uploads/2019/05/IMG-20180412-WA0011.jpg"
                  alt="BEING at Full Potential global community"
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/20 to-transparent" />
              </div>
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold/25 -z-10" />
            </div>

            <div className="order-1 lg:order-2">
              <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Our Reach</p>
              <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15] mb-8">
                A global community across{" "}
                <span className="text-gold italic">4 continents.</span>
              </h2>
              <div className="space-y-5 text-foreground/70 font-body text-base leading-relaxed">
                <p>
                  Across 4 continents we support individuals in their leadership by strengthening the BEING
                  and equip leaders from the for-profit, not-for-profit, political, educational and other
                  sectors in making{" "}
                  <strong className="text-navy">HUMAN POTENTIAL REALIZATION</strong> the centerpiece of
                  transformation within their organizations and institutions.
                </p>
                <p>
                  We invest heavily in research on human-centric innovations and collaborate with academia
                  and industry to develop solutions that help individuals and organizations fully take
                  advantage of their immense HUMAN POTENTIAL.
                </p>
                <p>
                  We are headquartered in Canada with branches in Europe and India, with regional
                  partnerships in South America, United Kingdom and New Zealand.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ──────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Our Story</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15] mb-12">
            Born from a decade of corporate experience
          </h2>

          {/* Timeline divider */}
          <div className="flex items-center gap-4 mb-12 justify-center">
            <div className="h-px bg-gold/30 flex-1 max-w-[100px]" />
            <div className="font-display text-2xl text-gold italic">2010</div>
            <div className="h-px bg-gold/30 flex-1 max-w-[100px]" />
          </div>

          <div className="text-foreground/70 font-body text-base leading-relaxed space-y-5 text-left max-w-3xl mx-auto">
            <p>
              BEING at Full Potential was founded in 2010 by{" "}
              <strong className="text-navy">Sujith Ravindran</strong> and{" "}
              <strong className="text-navy">Mark Vandeneijnde.</strong> Having both spent a decade in
              leadership positions within large multinationals, they were well aware of the challenges
              organizations faced in harnessing the full HUMAN POTENTIAL of their workforce.
            </p>
            <p>
              With employee engagement at an all-time low, it was clear that a significant shift needed
              to take place in terms of how one looks at any organization's most valuable resource — its
              PEOPLE.
            </p>
            <p>
              They noticed that the command-and-control paradigm — which had been so effective in driving
              productivity in the past — needed to be replaced with a more inspiring and allowing way of
              being with each other in organizations.
            </p>
            <p className="font-semibold text-navy text-lg font-display italic">
              This insight gave birth to BEING at Full Potential.
            </p>
          </div>
        </div>
      </section>

      {/* ── OUR MISSION ────────────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-navy relative overflow-hidden">
        {/* Decorative rings */}
        <div className="absolute left-[-200px] top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none opacity-5">
          <div className="absolute inset-0 rounded-full border border-white" />
          <div className="absolute inset-[15%] rounded-full border border-white" />
          <div className="absolute inset-[30%] rounded-full border border-white" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Our Mission</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] max-w-3xl mx-auto">
              The foundation of everything we do
            </h2>
            <p className="font-body text-white/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              Our mission statements guide us as we explore new frontiers of human potential development
              and value creation in service of our vision: Every Human, Being at Full Potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {missions.map((m) => (
              <div
                key={m.label}
                className="border border-white/10 p-8 hover:border-gold/40 transition-all group"
              >
                <div className="mb-6 group-hover:scale-110 transition-transform w-fit">{m.icon}</div>
                <h3 className="font-display text-2xl font-light text-white mb-4 group-hover:text-gold-light transition-colors">
                  {m.label}
                </h3>
                <p className="font-body text-sm text-white/60 leading-relaxed">{m.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STANDARDS OF BEING ─────────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">How We Show Up</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15]">
              Standards of Being
            </h2>
            <p className="font-body text-foreground/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              Standards are Codes of Conduct — practices, principles, shared agreements. They are the
              means to bring our mission to life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {standards.map((s) => (
              <div
                key={s.number}
                className="group flex gap-6 p-8 border border-border hover:border-gold/30 hover:shadow-lg transition-all bg-white"
              >
                <div className="font-display text-5xl font-light text-gold/20 group-hover:text-gold/40 transition-colors leading-none shrink-0 mt-1">
                  {s.number}
                </div>
                <div>
                  <h3 className="font-display text-2xl font-light text-navy mb-4">{s.title}</h3>
                  <p className="font-body text-sm text-foreground/65 leading-relaxed">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET THE TEAM PREVIEW ──────────────────────────────────────────────── */}
      <section className="py-24 lg:py-32 bg-secondary">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-6">Our People</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-navy leading-[1.15]">
              Human Potential Coaches
            </h2>
            <p className="font-body text-foreground/60 mt-4 max-w-2xl mx-auto leading-relaxed">
              An interconnected web of visionary coaches and change agents spread across the globe,
              striving for a world where each person can fully express their unique potential.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredTeam.map((member) => (
              <div
                key={member.name}
                className="group bg-white overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="flex justify-center pt-8 pb-4 bg-secondary">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden ring-2 ring-gold/20 group-hover:ring-gold/50 transition-all">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <div className="p-6 pt-4">
                  <h3 className="font-display text-xl font-light text-navy mb-1">{member.name}</h3>
                  <p className="font-body text-xs tracking-[0.2em] text-gold uppercase mb-3">
                    {member.location}
                  </p>
                  <p className="font-body text-sm text-foreground/65 leading-relaxed">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/team"
              className="font-body text-xs tracking-[0.2em] border border-navy text-navy px-10 py-4 hover:bg-navy hover:text-white transition-all inline-block"
            >
              MEET THE FULL TEAM
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA / NEWSLETTER ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[800px] h-[800px] rounded-full border border-white" />
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <Image
            src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential"
            width={120}
            height={48}
            className="h-12 w-auto object-contain mx-auto mb-10 opacity-80"
          />
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] mb-6">
            Begin your Human Potential journey
          </h2>
          <p className="font-body text-white/60 leading-relaxed mb-10">
            Is this the beginning of your journey? We look forward to hearing from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/#contact"
              className="font-body text-xs tracking-[0.2em] bg-gold text-white px-10 py-4 hover:bg-gold/90 transition-colors"
            >
              GET IN TOUCH
            </Link>
            <a
              href="https://beingatfullpotential.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs tracking-[0.2em] border border-white/40 text-white px-10 py-4 hover:border-gold hover:text-gold transition-all"
            >
              TAKE THE ASSESSMENT
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-[#141210] border-t border-gold/15 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Image
                src="/wp-content/uploads/2019/11/Logo-light.png"
                alt="BEING at Full Potential"
                width={120}
                height={48}
                className="h-10 w-auto object-contain mb-4"
              />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                Specializing in Human Potential development to enable breakthroughs in employee
                engagement, innovation and the bottom line.
              </p>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Navigate</h4>
              <div className="space-y-3">
                {[
                  { label: "About", href: "/about", impl: true },
                  { label: "Insight", href: "/insight", impl: true },
                  { label: "Impact", href: "/impact", impl: true },
                  { label: "Academy", href: "/academy", impl: false },
                  { label: "Our Team", href: "/team", impl: false },
                  { label: "Our Clients", href: "/clients", impl: false },
                ].map((l) =>
                  l.impl ? (
                    <Link key={l.label} href={l.href} className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  ) : (
                    <button key={l.label} onClick={() => showToast(`${l.label} page is coming soon!`)}
                      className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                      {l.label}
                    </button>
                  )
                )}
              </div>
            </div>

            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Connect</h4>
              <div className="space-y-3">
                <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Assessment Platform
                </a>
                <a href="https://www.facebook.com/BeingAtFullPotential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="https://twitter.com/beingatFP" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Twitter / X
                </a>
                <a href="https://www.linkedin.com/company/being-at-full-potential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  LinkedIn
                </a>
                <Link href="/#contact" className="block font-body text-sm text-white/60 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-white/30">
              © 2026 BEING at Full Potential. All rights reserved.
            </p>
            <p className="font-display text-sm italic text-white/30">
              Every Human, BEING at Full Potential
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
