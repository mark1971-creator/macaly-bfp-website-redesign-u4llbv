"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { profileExtras } from "@/components/profile-extras";

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
    { label: "ABOUT", href: "/about", impl: true },
    { label: "INSIGHT", href: "/insight", impl: true },
    { label: "IMPACT", href: "/impact", impl: true },
    { label: "ACADEMY", href: "/academy", impl: true },
    { label: "ASSESSMENTS", href: "/assessments", impl: true },
    { label: "CONTACT", href: "/#contact", impl: true },
  ];
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/wp-content/uploads/2019/11/Logo-light.png"
            alt="BEING at Full Potential" width={120} height={48} className="h-10 w-auto object-contain" />
        </Link>
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            if (!link.impl) return (
              <button key={link.label} onClick={() => onNotImplemented("This page is coming soon!")}
                className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">{link.label}</button>
            );
            return (
              <Link key={link.label} href={link.href}
                className="font-body text-xs tracking-[0.15em] text-white/70 hover:text-white transition-colors">{link.label}</Link>
            );
          })}
        </nav>
        <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
          className="hidden lg:block font-body text-xs tracking-[0.15em] border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-white transition-all">
          TAKE ASSESSMENT
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-white p-2" aria-label="Toggle menu">
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all ${mobileOpen ? "opacity-0" : ""}`} />
          <div className={`w-6 h-0.5 bg-white transition-all ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>
      {mobileOpen && (
        <div className="lg:hidden bg-navy border-t border-white/10 px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => {
            if (!link.impl) return <button key={link.label}
              onClick={() => { setMobileOpen(false); onNotImplemented("This page is coming soon!"); }}
              className="font-body text-sm tracking-[0.12em] text-white/70 text-left">{link.label}</button>;
            return <Link key={link.label} href={link.href} onClick={() => setMobileOpen(false)}
              className="font-body text-sm tracking-[0.12em] text-white">{link.label}</Link>;
          })}
          <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
            className="font-body text-sm tracking-[0.12em] border border-gold text-gold px-4 py-2.5 text-center mt-2">TAKE ASSESSMENT</a>
        </div>
      )}
    </header>
  );
}

// ─── Team data ─────────────────────────────────────────────────────────────────
const teamMembers = [
  { name: "Mark Vandeneijnde", location: "Switzerland", image: "/wp-content/uploads/2019/02/mark.jpg", bio: "Mark's keen sense of insight and market understanding were the source of many breakthrough initiatives during his 10-year corporate career. Co-founder of BEING at Full Potential.", continent: "Europe" },
  { name: "Ágnes Vad", location: "Hungary", image: "/wp-content/uploads/2019/11/Agnes.png", bio: "Agnes spent more than 18 years at multinational companies in marketing leadership roles. She brings deep understanding of how the business world operates.", continent: "Europe" },
  { name: "Andrew Thornton", location: "United Kingdom", image: "/wp-content/uploads/2019/04/andrew.jpg", bio: "I believe that businesses run with a Heart deliver better results for all stakeholders — a happier, better place to work for employees, customers and communities.", continent: "Europe" },
  { name: "Ann Dinan", location: "USA", image: "/wp-content/uploads/2019/04/ann.jpg", bio: "My skills coupled with intuitive abilities allow us to take coaching to amazing places, not previously imagined, for growth!", continent: "Americas" },
  { name: "Annelieke Verkerk", location: "Netherlands", image: "/wp-content/uploads/2019/02/annelieke.jpg", bio: "Annelieke has a keen eye for human potential and the potential of organisations. She has the gift of touching the essential through deep and intelligent listening.", continent: "Europe" },
  { name: "Amrita Singh", location: "India", image: "/wp-content/uploads/2025/02/amrita-singh-3-150x150.jpg", bio: "Amrita bears the unique ability to empathize, energize and encourage individuals. Her style of facilitation is empowering as she supports her audience to access their inner wisdom.", continent: "Asia" },
  { name: "Arun Mani", location: "India", image: "/wp-content/uploads/2019/04/arun.png", bio: "Arun has helped people become a better version of themselves, especially youngsters and students who have a dilemma in finding their passion and career.", continent: "Asia" },
  { name: "Ashish Garg", location: "India", image: "/wp-content/uploads/2019/04/ashish.jpg", bio: "Career Coach for students and working professionals.", continent: "Asia" },
  { name: "Belinda Hayes", location: "New Zealand", image: "/wp-content/uploads/2020/12/1517077234793-1.jpg", bio: "Standing strong in what really matters — caring for our own wellbeing, creating organisations worth working in, and communities worth living in.", continent: "Oceania" },
  { name: "Bram Liebrand", location: "Netherlands", image: "/wp-content/uploads/2019/04/bram.jpg", bio: "Teaches from his Heart with Love!", continent: "Europe" },
  { name: "Chad Verigin", location: "Canada", image: "/wp-content/uploads/2019/04/chad.jpg", bio: "My presence during clients' self-work has been described as supportive, encouraging and transformative.", continent: "Americas" },
  { name: "Claudia Milardo", location: "Switzerland", image: "/wp-content/uploads/2019/10/claudia.jpg", bio: "Claudia's approach, attentive deep listening, the fineness of her analysis, her great human qualities and her skills in the choice of tools are widely appreciated.", continent: "Europe" },
  { name: "Clay Blacker", location: "Canada", image: "/wp-content/uploads/2019/04/clay.jpg", bio: "Clay has that incredible, down-to-earth appeal that made me feel like I was talking to a most trusted friend who really knew how to get to the heart of the issue.", continent: "Americas" },
  { name: "Daniel-Yehuda Frohwein", location: "United Kingdom", image: "/wp-content/uploads/2022/07/Daniel-1.jpg", bio: "I am passionate about integrating knowledge and experience from traditional and contemporary sources, bringing a creative and spiritual flavour to my approach.", continent: "Europe" },
  { name: "Diyanat Ali", location: "India", image: "/wp-content/uploads/2019/04/Diyanat-Ali.jpg", bio: "A Practical Coach with a decade of IT Management experience, another decade of entrepreneurship, and extensive experiential education and facilitation experience.", continent: "Asia" },
  { name: "Esther Lewenstein", location: "Switzerland", image: "/wp-content/uploads/2019/04/Esther.jpg", bio: "Coaching people in Spirituality and personal development with deep commitment to human potential realization.", continent: "Europe" },
  { name: "Eveline van Dusseldorp", location: "Netherlands", image: "/wp-content/uploads/2019/04/eveline@takealeap.nl_.jpg", bio: "Eveline possesses a unique combination of both analytical and coaching skills, using business understanding to open up the conversation on what isn't being said.", continent: "Europe" },
  { name: "Fabio Salvadori", location: "Italy", image: "/wp-content/uploads/2019/04/Fabio-Salvadori.jpg", bio: "A good listener who makes clients comfortable to share. Skilled at posing questions that bring awareness and helping clients on the journey to reach their ideal self.", continent: "Europe" },
  { name: "Fabiola Benavente", location: "Belgium", image: "/wp-content/uploads/2019/04/Fabiola.png", bio: "Fabiola's approach is a gentle nudge, reminding us of our path and helping to focus on our Work — that which makes us truly alive.", continent: "Europe" },
  { name: "Faris Khalifeh", location: "Canada", image: "/wp-content/uploads/2019/04/khali.jpg", bio: "Faris assists his clients to consciously communicate their most authentic selves, giving them the self-awareness to confidently follow their chosen path.", continent: "Americas" },
  { name: "Gabriela Carrique", location: "Mexico", image: "/wp-content/uploads/2019/04/gabriala.jpeg", bio: "An inspiring Coach who works with Teams and Executives helping them to achieve big goals by pursuing their passions and embracing their talents and potential.", continent: "Americas" },
  { name: "Hans Neff", location: "Germany", image: "/wp-content/uploads/2019/04/Hans-Neff.jpg", bio: "Enthusiastic, effective, trustworthy and connected.", continent: "Europe" },
  { name: "Hanumant Talwar", location: "India", image: "/wp-content/uploads/2023/10/Hanumant.png", bio: "In loving memory of our dear friend Hanumant. Your sensitivity for people and optimism for life continue to bless us. You are missed but your presence still inspires us.", continent: "Asia", memorial: true },
  { name: "Harmen van Dijk", location: "Netherlands", image: "/wp-content/uploads/2019/04/Harmen-van-Dijk.jpg", bio: "Harmen is warm, inspires confidence, offers security, is 100% for you, dares to follow feeling and ask difficult questions.", continent: "Europe" },
  { name: "Harrison Lennox-Wright", location: "Mexico", image: "/wp-content/uploads/2019/04/Harrison-Lennox-Wright.jpg", bio: "Focused, intense individual who pushes buttons and listens with passion and belief.", continent: "Americas" },
  { name: "Helena Roth", location: "Sweden", image: "/wp-content/uploads/2019/04/Helena-Roth.jpeg", bio: "Helena shines a light of love, deep wisdom, devotion and generosity of spirit. She creates a space for inquiry and discovery that is safe, gentle, and creative.", continent: "Europe" },
  { name: "Jahnavi Katti", location: "India", image: "/wp-content/uploads/2019/04/Jahnavi-Katti.jpg", bio: "An amazing and value-adding coach with unusual listening traits and an upbeat perspective. She has a peculiar quality of simplifying complexities into doable targets.", continent: "Asia" },
  { name: "Jannie Peters", location: "Netherlands", image: "/wp-content/uploads/2019/04/jani-peters.jpg", bio: "Jannie helps you slow down the daily grind so you can reflect and gain new insight when feeling lost or stuck.", continent: "Europe" },
  { name: "Jeroen Loosli", location: "Switzerland", image: "/wp-content/uploads/2019/11/Jeroen.jpg", bio: "Jeroen has unique competence across all dimensions of an organisation and builds bridges between and within them, with a broad range of knowledge and a calming presence.", continent: "Europe" },
  { name: "Jonathan Nungaray", location: "USA", image: "/wp-content/uploads/2023/12/Jonathan.jpg", bio: "Jonathan speaks honestly and candidly, offering effective feedback and is always willing to be part of the solution, seeing several steps ahead to identify pitfalls.", continent: "Americas" },
  { name: "Juan Araque Melgar", location: "Mexico", image: "/wp-content/uploads/2019/04/Juan-Araque-Melgar.jpg", bio: "Juan helps organizations transform into agile, people-focused organizations, serving companies that want a culture of self-learning and collective intelligence.", continent: "Americas" },
  { name: "K S Saravanavasan", location: "India", image: "/wp-content/uploads/2019/04/K-S-Saravanavasan.jpg", bio: "A trusted partner in transforming people and organizations to be successful by synchronizing individual and collective purpose.", continent: "Asia" },
  { name: "Kannan Swaminathan", location: "India", image: "/wp-content/uploads/2019/04/Kannan-Swaminathan.jpg", bio: "Kannan has a great coaching presence and creates a trusted environment for his clients to understand themselves deeply and realign their lives accordingly.", continent: "Asia" },
  { name: "Kiran Gulrajani", location: "India", image: "/wp-content/uploads/2019/04/no-name.jpeg", bio: "A gifted human being with a unique ability to sense the blocks preventing an individual's progress, and truly gifted in the art of deep listening.", continent: "Asia" },
  { name: "Luca Salvini", location: "Italy", image: "/wp-content/uploads/2019/04/Luca-Salvini.jpg", bio: "Luca combines the curiosity of an explorer, the discipline of a learner, and the compassionate listening of a coach to foster transformation and systemic change.", continent: "Europe" },
  { name: "Manuel Lopez", location: "Mexico", image: "/wp-content/uploads/2019/04/MANUEL-LOPEZ.jpg", bio: "Business consultant, trainer and coach active in Mexico and Spain, specializing in organizational communication and leadership development.", continent: "Americas" },
  { name: "Maria Elena Rosado Patron", location: "Mexico", image: "/wp-content/uploads/2019/04/MARIA-ELENA-ROSADO-PATRON.jpg", bio: "Bringing experience in human potential coaching and continuously perfecting her approach to support clients in their transformation journeys.", continent: "Americas" },
  { name: "Marie Josee Smulders", location: "Netherlands", image: "/wp-content/uploads/2019/04/Marie-Josee-Smulders.jpg", bio: "Marie Josee listens very deeply and has the unique ability to ask the right questions that call people forward into their greatest potential.", continent: "Europe" },
  { name: "Mark Anthony DeSanti", location: "Canada", image: "/wp-content/uploads/2019/04/Mark-Anthony-DeSanti.jpg", bio: "Mark was described as a 'lifeline' — his focus, gentle strategic guidance, and humor inspired clients to climb the mountain of their potential.", continent: "Americas" },
  { name: "Max Riley", location: "Global", image: "/wp-content/uploads/2019/04/Max-Riley.jpg", bio: "Max refuses to see people or organizations as problems to be solved, but rather as sources of strength and creativity to be nurtured.", continent: "Americas" },
  { name: "Mayke Vullings", location: "Netherlands", image: "/wp-content/uploads/2019/04/Mayke-Vullings.jpg", bio: "Caught in your own story, she helps you cut to the core immediately, mirroring what is directly in front of you and enabling the experience of who you truly are.", continent: "Europe" },
  { name: "Michael J. Dawkins", location: "Netherlands", image: "/wp-content/uploads/2019/04/Michael-J.-Dawkins.jpg", bio: "Living from strengths and bringing people together to create an ecosystem of gamechangers — creating a fair, equitable and sustainable world of abundance.", continent: "Europe" },
  { name: "Michiel Schuurman", location: "Netherlands", image: "/wp-content/uploads/2019/04/Michiel-Schuurman.jpg", bio: "Intrinsically motivated to help others shine, with extensive knowledge in exponential technology, entrepreneurship, and human potential.", continent: "Europe" },
  { name: "Nadene Canning", location: "Switzerland", image: "/wp-content/uploads/2019/04/Nadene-Canning.jpg", bio: "Nadene coached clients through difficult change processes with impressive results — leaving them feeling confident and empowered to move forward.", continent: "Europe" },
  { name: "Nathalie Bayol", location: "France", image: "/wp-content/uploads/2019/04/Nathalie-Bayol.jpg", bio: "Being coached by Nathalie was transformative — she helped discover strengths and abilities previously unknown, providing a toolbox for future challenges.", continent: "Europe" },
  { name: "Nidhi Arora", location: "India", image: "/wp-content/uploads/2025/03/Nidhi-picture-150x150.jpg", bio: "An authentic, reflective, and empowering coach who helps leaders gain clarity, confidence, and direction with an empathetic and non-judgmental approach.", continent: "Asia" },
  { name: "Peter Leong", location: "New Zealand", image: "/wp-content/uploads/2019/06/Peter2.jpg", bio: "Facilitating transformational change in organisational development, change management, integral leadership development, and full potential youth empowerment.", continent: "Oceania" },
  { name: "Priyanka Deshmukh", location: "India", image: "/wp-content/uploads/2025/08/Priyanka-150x150.jpg", bio: "Collaborating with thought leaders, coaches, and visionaries to serve people and organizations in a way that is more humanistic and brings more joy and satisfaction.", continent: "Asia" },
  { name: "Rob Govers", location: "Netherlands", image: "/wp-content/uploads/2019/04/Rob-Govers.jpg", bio: "Rob has a positive vibe, trusts his intuition, and has great social skills that establish a profound relationship based on trust and confidence.", continent: "Europe" },
  { name: "Rodrigo Martinez-Romero", location: "Global", image: "/wp-content/uploads/2019/04/Rodrigo-Martinez-Romero.jpg", bio: "A spiritual politics researcher studying a leadership tradition that reconciles the political and spiritual dimensions of human beings.", continent: "Americas" },
  { name: "Sally Edwards", location: "Netherlands", image: "/wp-content/uploads/2019/04/Sally-Edwards.jpg", bio: "Sally walks her talk. A real pillar of strength and inspiration for others wanting to live into their human potential.", continent: "Europe" },
  { name: "Shraddha Patel", location: "India", image: "/wp-content/uploads/2022/08/shraddha.jpg", bio: "Shraddha's intuitive approach to coaching takes you into a new world of possibilities, weaving together various practices with YOU at the center.", continent: "Asia" },
  { name: "Smruti Patel", location: "Switzerland", image: "/wp-content/uploads/2019/04/Smruti-Patel.jpg", bio: "Smruti is very insightful with a unique way of helping clients find solutions to their own challenges and confidence in their unique qualifications.", continent: "Europe" },
  { name: "Vanessa Jane Smith", location: "Netherlands", image: "/wp-content/uploads/2019/04/Vanessa-Jane-Smith.jpg", bio: "Vanessa is a deeply resourceful person who listens intensely and uses her art to draw out underlying images and understandings in the individual or group.", continent: "Europe" },
  { name: "Wiebe Zevenbergen", location: "Netherlands", image: "/wp-content/uploads/2020/06/P6160047-2-e1591776383511.jpg", bio: "In loving memory of Wiebe — the greatest example of a mature masculine leader. His energy of integrity with self, unity with others, and service to the world continues to inspire.", continent: "Europe", memorial: true },
  { name: "Yakira Flores", location: "Mexico", image: "/wp-content/uploads/2019/04/Yakira-Flores-de-la-O.jpg", bio: "Intuitive person whose experience in international companies provides good grounding to help coachees discover their path.", continent: "Americas" },
];

const continents = ["All", "Europe", "Americas", "Asia", "Oceania"];

// ─── Coach Modal ────────────────────────────────────────────────────────────────
function CoachModal({ member, onClose }: { member: typeof teamMembers[0]; onClose: () => void }) {
  const [imgError, setImgError] = useState(false);
  const extras = profileExtras[member.name] ?? {};
  const specialityTags = extras.speciality?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];
  const idealClientTags = extras.idealClient?.split(",").map((s) => s.trim()).filter(Boolean) ?? [];

  // Close on Escape key
  useState(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Profile: ${member.name}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/70 backdrop-blur-sm" />

      {/* Panel — wider, scrollable */}
      <div
        className="relative bg-white max-w-2xl w-full shadow-2xl animate-fade-in flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header band */}
        <div className={`relative flex flex-col items-center pt-10 pb-8 shrink-0 ${member.memorial ? "bg-[#f8f5ef]" : "bg-secondary"}`}>
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-navy/40 hover:text-navy transition-colors"
            aria-label="Close"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Photo */}
          <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-white shadow-xl mb-4">
            {!imgError ? (
              <Image
                src={member.image}
                alt={member.name}
                width={112}
                height={112}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full bg-navy/10 flex items-center justify-center">
                <span className="font-display text-4xl text-navy/40">{member.name[0]}</span>
              </div>
            )}
          </div>

          {member.memorial && (
            <p className="font-body text-[10px] tracking-[0.25em] text-gold/80 uppercase mb-1">In Memoriam</p>
          )}
          <h2 className="font-display text-2xl font-light text-navy leading-tight text-center px-8">{member.name}</h2>

          {/* Location + city + continent + scope */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 px-6">
            {extras.city && (
              <>
                <span className="font-body text-[11px] tracking-[0.18em] text-gold uppercase">{extras.city}</span>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
              </>
            )}
            <span className="font-body text-[11px] tracking-[0.2em] text-gold uppercase">{member.location}</span>
            <span className="w-1 h-1 rounded-full bg-gold/40" />
            <span className="font-body text-[11px] tracking-[0.15em] text-foreground/40 uppercase">{member.continent}</span>
            {extras.scope && (
              <>
                <span className="w-1 h-1 rounded-full bg-gold/40" />
                <span className="font-body text-[11px] tracking-[0.15em] text-foreground/40 uppercase">{extras.scope}</span>
              </>
            )}
          </div>

          {/* Speciality tags */}
          {specialityTags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-4 px-8">
              {specialityTags.map((tag) => (
                <span key={tag} className="font-body text-[10px] tracking-[0.1em] bg-navy/8 text-navy/60 border border-navy/10 px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Bio quote */}
          <div className="px-8 pt-8 pb-6">
            <div className="w-8 h-px bg-gold/40 mb-6" />
            <p className="font-display text-base italic font-light text-foreground/70 leading-relaxed">
              &ldquo;{member.bio}&rdquo;
            </p>
          </div>

          {/* Rich profile sections */}
          {(extras.vision || extras.hpInspiration || extras.talents || extras.lifeExperiences || extras.anythingElse || idealClientTags.length > 0) && (
            <div className="px-8 pb-8 space-y-6 border-t border-border pt-6">

              {idealClientTags.length > 0 && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Ideal Client</p>
                  <div className="flex flex-wrap gap-1.5">
                    {idealClientTags.map((tag) => (
                      <span key={tag} className="font-body text-[10px] tracking-[0.1em] bg-gold/8 text-gold/80 border border-gold/20 px-2.5 py-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {extras.vision && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Vision</p>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{extras.vision}</p>
                </div>
              )}

              {extras.hpInspiration && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">What inspires me about the HP approach</p>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{extras.hpInspiration}</p>
                </div>
              )}

              {extras.talents && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Unique Talents & Gifts</p>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{extras.talents}</p>
                </div>
              )}

              {extras.lifeExperiences && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">Life Experiences</p>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed whitespace-pre-line">{extras.lifeExperiences}</p>
                </div>
              )}

              {extras.anythingElse && (
                <div>
                  <p className="font-body text-[10px] tracking-[0.25em] text-gold uppercase mb-2">About Me</p>
                  <p className="font-body text-sm text-foreground/70 leading-relaxed">{extras.anythingElse}</p>
                </div>
              )}
            </div>
          )}

          {/* Footer actions */}
          <div className="px-8 pb-8 flex flex-col sm:flex-row gap-3 border-t border-border pt-6">
            {extras.website && (
              <a
                href={extras.website.startsWith("http") ? extras.website : `https://${extras.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 font-body text-xs tracking-[0.2em] border border-gold text-gold py-3 text-center hover:bg-gold hover:text-white transition-all"
              >
                VISIT WEBSITE
              </a>
            )}

            <button
              onClick={onClose}
              className="flex-1 font-body text-xs tracking-[0.2em] border border-navy/20 text-navy/50 py-3 hover:border-navy hover:text-navy transition-all"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Coach Card ────────────────────────────────────────────────────────────────
function CoachCard({ member, onClick }: { member: typeof teamMembers[0]; onClick: () => void }) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={onClick}
      className={`group bg-white border hover:shadow-lg transition-all duration-300 flex flex-col w-full text-left cursor-pointer ${member.memorial ? "border-gold/30 hover:border-gold/60" : "border-border hover:border-gold/30"}`}
    >
      {/* Photo */}
      <div className={`flex justify-center pt-7 pb-5 w-full ${member.memorial ? "bg-[#f8f5ef]" : "bg-secondary"}`}>
        <div className="relative w-20 h-20 rounded-full overflow-hidden ring-2 ring-white shadow-md group-hover:ring-gold/30 transition-all">
          {!imgError ? (
            <Image
              src={member.image}
              alt={member.name}
              width={80}
              height={80}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-navy/10 flex items-center justify-center">
              <span className="font-display text-2xl text-navy/40">{member.name[0]}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-6 flex-1 flex flex-col">
        {member.memorial && (
          <p className="font-body text-[10px] tracking-[0.2em] text-gold/80 uppercase text-center mb-2">In Memoriam</p>
        )}
        <h3 className="font-display text-lg font-light text-navy text-center leading-tight mb-1">{member.name}</h3>
        <p className="font-body text-[11px] tracking-[0.18em] text-gold uppercase text-center mb-3">{member.location}</p>
        <p className="font-body text-xs text-foreground/60 leading-relaxed text-center flex-1 line-clamp-3">{member.bio}</p>
        <p className="font-body text-[10px] tracking-[0.15em] text-navy/30 uppercase text-center mt-3 group-hover:text-gold transition-colors">View profile →</p>
      </div>
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [toast, setToast] = useState<string | null>(null);
  const [activeContinent, setActiveContinent] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCoach, setSelectedCoach] = useState<typeof teamMembers[0] | null>(null);

  const showToast = (msg: string) => setToast(msg);
  const hideToast = () => setToast(null);

  const filtered = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchesContinent = activeContinent === "All" || m.continent === activeContinent;
      const q = search.toLowerCase();
      const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.location.toLowerCase().includes(q);
      return matchesContinent && matchesSearch;
    });
  }, [activeContinent, search]);

  const continentCounts = useMemo(() => {
    const counts: Record<string, number> = { All: teamMembers.length };
    teamMembers.forEach((m) => {
      counts[m.continent] = (counts[m.continent] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {toast && <Toast message={toast} onClose={hideToast} />}
      {selectedCoach && <CoachModal member={selectedCoach} onClose={() => setSelectedCoach(null)} />}
      <Nav onNotImplemented={showToast} />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[55vh] flex items-end bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-navy" />

        {/* Subtle radial glow */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full bg-gold/8 blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pb-16 pt-36">
          <p className="font-body text-xs tracking-[0.3em] text-gold mb-5 uppercase">Our People</p>
          <h1 className="font-display text-5xl md:text-7xl font-light text-white leading-[1.05] max-w-3xl mb-5">
            Human Potential <span className="text-gold italic">Coaches</span>
          </h1>
          <p className="font-display text-xl md:text-2xl text-white/60 italic font-light max-w-2xl">
            A global community across four continents — say hello to some of the most remarkable humans on earth.
          </p>
        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────────────── */}
      <section className="bg-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {[
              { value: "200+", label: "Certified Coaches" },
              { value: "4", label: "Continents" },
              { value: "20+", label: "Countries" },
              { value: "2010", label: "Founded" },
            ].map((s) => (
              <div key={s.label} className="py-7 px-8 text-center">
                <div className="font-display text-3xl md:text-4xl font-light text-gold mb-1">{s.value}</div>
                <div className="font-body text-[11px] tracking-[0.2em] text-white/50 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FILTERS ──────────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border sticky top-20 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Continent filters */}
          <div className="flex flex-wrap gap-2">
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => setActiveContinent(c)}
                className={`font-body text-xs tracking-[0.15em] px-4 py-2 border transition-all ${
                  activeContinent === c
                    ? "bg-navy text-white border-navy"
                    : "border-border text-foreground/60 hover:border-navy/40 hover:text-navy"
                }`}
              >
                {c}
                <span className={`ml-1.5 text-[10px] ${activeContinent === c ? "text-gold-light" : "text-foreground/40"}`}>
                  {continentCounts[c] ?? 0}
                </span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" width="14" height="14" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              placeholder="Search coaches..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-body text-sm pl-8 pr-4 py-2 border border-border bg-white focus:outline-none focus:border-gold/60 w-48 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── TEAM GRID ────────────────────────────────────────────────────────── */}
      <section className="py-16 lg:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-navy/40">No coaches found</p>
              <button onClick={() => { setSearch(""); setActiveContinent("All"); }}
                className="mt-4 font-body text-sm text-gold hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <p className="font-body text-xs text-foreground/40 tracking-[0.15em] uppercase mb-8">
                Showing {filtered.length} coach{filtered.length !== 1 ? "es" : ""}
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
                {filtered.map((member) => (
                  <CoachCard key={member.name} member={member} onClick={() => setSelectedCoach(member)} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── JOIN CTA ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden border-t border-border">
        {/* Nature background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.pexels.com/photos/36612667/pexels-photo-36612667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
            alt="Misty forest with sunlight"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-navy/80" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="font-body text-xs tracking-[0.3em] text-gold uppercase mb-5">Join Us</p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-[1.15] mb-6">
            Are you a coach ready to make an impact?
          </h2>
          <p className="font-body text-white/65 leading-relaxed mb-10 max-w-xl mx-auto">
            We're always looking for passionate coaches and change agents to join our global community. Get certified and join a movement redefining human potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/academy"
              className="font-body text-xs tracking-[0.2em] bg-gold text-white px-10 py-4 hover:bg-gold/90 transition-colors"
            >
              GET CERTIFIED
            </Link>
            <Link href="/#contact"
              className="font-body text-xs tracking-[0.2em] border border-white text-white px-10 py-4 hover:bg-white hover:text-navy transition-all">
              GET IN TOUCH
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────────────── */}
      <footer className="bg-[#141210] border-t border-gold/15 py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <Image src="/wp-content/uploads/2019/11/Logo-light.png"
                alt="BEING at Full Potential" width={120} height={48} className="h-10 w-auto object-contain mb-4" />
              <p className="font-body text-sm text-white/50 leading-relaxed">
                Specializing in Human Potential development to enable breakthroughs in employee engagement, innovation and the bottom line.
              </p>
            </div>
            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Navigate</h4>
              <div className="space-y-3">
                {[
                  { label: "About", href: "/about", impl: true },
                  { label: "Our Team", href: "/team", impl: true },
                  { label: "Insight", href: "/insight", impl: false },
                  { label: "Impact", href: "/impact", impl: true },
                  { label: "Academy", href: "/academy", impl: true },
                  { label: "Our Clients", href: "/clients", impl: false },
                ].map((l) => l.impl ? (
                  <Link key={l.label} href={l.href} className="block font-body text-sm text-white/60 hover:text-white transition-colors">{l.label}</Link>
                ) : (
                  <button key={l.label} onClick={() => showToast(`${l.label} page is coming soon!`)}
                    className="block font-body text-sm text-white/60 hover:text-white transition-colors">{l.label}</button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-body text-xs tracking-[0.2em] text-white/40 uppercase mb-5">Connect</h4>
              <div className="space-y-3">
                <a href="https://beingatfullpotential.io/" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">Assessment Platform</a>
                <a href="https://www.facebook.com/BeingAtFullPotential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">Facebook</a>
                <a href="https://twitter.com/beingatFP" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">Twitter / X</a>
                <a href="https://www.linkedin.com/company/being-at-full-potential" target="_blank" rel="noopener noreferrer"
                  className="block font-body text-sm text-white/60 hover:text-white transition-colors">LinkedIn</a>
                <Link href="/#contact" className="block font-body text-sm text-white/60 hover:text-white transition-colors">Contact Us</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-white/30">© 2026 BEING at Full Potential. All rights reserved.</p>
            <p className="font-display text-sm italic text-white/30">Every Human, BEING at Full Potential</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
