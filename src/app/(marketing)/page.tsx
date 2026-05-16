"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Clock,
  Euro,
  ShieldAlert,
  Upload,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { motion, useInView, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Utility – animated counter hook
// ---------------------------------------------------------------------------
function useCounter(target: number, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [shouldStart, target, duration]);

  return count;
}

// ---------------------------------------------------------------------------
// Shared animation variants
// ---------------------------------------------------------------------------
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ---------------------------------------------------------------------------
// AnimatedSection – fades children up on scroll entry
// ---------------------------------------------------------------------------
function AnimatedSection({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeUp}
      style={{ transitionDelay: `${delay}ms` }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// StatCounter – individual counter in hero
// ---------------------------------------------------------------------------
function StatCounter({
  value,
  label,
  prefix = "",
  suffix = "",
  shouldStart,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  shouldStart: boolean;
}) {
  const count = useCounter(value, 2200, shouldStart);

  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-3xl md:text-4xl font-bold tracking-tight text-white font-mono tabular-nums">
        {prefix}
        {count.toLocaleString("de-DE")}
        {suffix}
      </span>
      <span className="text-sm text-white/50 uppercase tracking-widest">{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Noise overlay SVG – subtle texture on hero
// ---------------------------------------------------------------------------
function NoiseOverlay() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.03]"
      aria-hidden="true"
    >
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// GlassCard
// ---------------------------------------------------------------------------
function GlassCard({
  children,
  className = "",
  highlight = false,
}: {
  children: React.ReactNode;
  className?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "backdrop-blur-xl bg-white/5 border rounded-2xl",
        highlight
          ? "border-[#00C896]/50 shadow-[0_0_32px_rgba(0,200,150,0.15)]"
          : "border-white/10",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// HeroSection
// ---------------------------------------------------------------------------
function HeroSection() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0F1E]"
      style={{ isolation: "isolate" }}
    >
      {/* Radial glow blobs */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,200,150,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(124,92,252,0.08) 0%, transparent 50%)",
        }}
      />
      <NoiseOverlay />

      {/* Nav bar */}
      <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 md:px-12 py-5 z-20">
        <div className="flex items-center gap-2.5">
          <Image src="/symbol.png" alt="Grant-Agent AI logo" width={1258} height={842} style={{ height: '32px', width: 'auto' }} />
          <span className="text-white font-bold tracking-tight text-lg">
            Grant<span className="text-[#00C896]">Agent</span>
            <span className="text-white/40 font-light ml-1">AI</span>
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
          <a href="#how-it-works" className="hover:text-white/90 transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-white/90 transition-colors">Pricing</a>
          <a href="#trust" className="hover:text-white/90 transition-colors">Customers</a>
        </nav>
        <a
          href="/dashboard"
          className="text-sm bg-[#00C896] text-[#0A0F1E] font-bold px-4 py-2 rounded-xl hover:bg-[#00b386] transition-colors"
        >
          Get started
        </a>
      </header>

      {/* Hero content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[#00C896]/30 bg-[#00C896]/5 text-[#00C896] text-xs font-semibold tracking-wider uppercase"
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#00C896] animate-pulse" />
          EU-Sovereign · BSI C5 Compliant · German Federal Grants
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight text-white mb-6"
        >
          Stop Paying{" "}
          <span
            className="relative inline-block"
            style={{
              background: "linear-gradient(135deg, #00C896 0%, #00e5b0 50%, #7C5CFC 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            €82,000
          </span>
          <br />
          for Paperwork
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.35 }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Grant-Agent AI automates German federal innovation grants.{" "}
          <span className="text-white/90">200 hours of drafting. 4 hours with us.</span>{" "}
          Keep 100% of your grant.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.48 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <a
            href="/dashboard"
            className="group flex items-center gap-2 bg-[#00C896] text-[#0A0F1E] font-bold px-8 py-3.5 rounded-xl text-base hover:bg-[#00e5b0] transition-all duration-200 shadow-[0_0_24px_rgba(0,200,150,0.3)] hover:shadow-[0_0_36px_rgba(0,200,150,0.5)]"
          >
            Start Free Trial
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#how-it-works"
            className="flex items-center gap-2 border border-white/20 text-white px-8 py-3.5 rounded-xl text-base hover:bg-white/5 hover:border-white/40 transition-all duration-200"
          >
            Watch Demo
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.6 }}
          className="grid grid-cols-3 gap-4 max-w-2xl mx-auto"
        >
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-5">
            <StatCounter value={2300} prefix="€" suffix="M" label="disbursed" shouldStart={statsInView} />
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-5">
            <StatCounter value={4459} label="applications/year" shouldStart={statsInView} />
          </div>
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl px-4 py-5">
            <StatCounter value={86} suffix="%" label="approval rate" shouldStart={statsInView} />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0F1E] to-transparent" />
    </section>
  );
}

// ---------------------------------------------------------------------------
// PainSection
// ---------------------------------------------------------------------------
function PainSection() {
  const cards = [
    {
      icon: Clock,
      value: "200 Hours",
      body: "Average time to complete a ZIM application manually.",
      color: "text-amber-400",
      glow: "rgba(245,158,11,0.12)",
    },
    {
      icon: Euro,
      value: "€82,000",
      body: "Maximum consultant fee extracted from your grant.",
      color: "text-red-400",
      glow: "rgba(239,68,68,0.12)",
    },
    {
      icon: ShieldAlert,
      value: "IP at Risk",
      body: "Standard LLMs may ingest your pre-patent data.",
      color: "text-violet-400",
      glow: "rgba(124,92,252,0.12)",
    },
  ];

  return (
    <section className="bg-[#0A0F1E] py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            The grant process is{" "}
            <span className="text-red-400">broken by design</span>
          </h2>
          <p className="text-white/50 text-lg max-w-xl mx-auto">
            Incumbents profit from complexity. We built the alternative.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {cards.map(({ icon: Icon, value, body, color, glow }) => (
            <motion.div key={value} variants={fadeUp}>
              <GlassCard className="p-8 flex flex-col items-start gap-5 h-full group hover:border-white/20 transition-colors duration-300">
                <div
                  className="p-3 rounded-xl border border-white/10"
                  style={{ background: glow }}
                >
                  <Icon className={`h-6 w-6 ${color}`} />
                </div>
                <div>
                  <p className={`text-2xl font-bold ${color} mb-2 tracking-tight`}>{value}</p>
                  <p className="text-white/55 text-sm leading-relaxed">{body}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// SolutionSection
// ---------------------------------------------------------------------------
function SolutionSection() {
  const steps = [
    {
      icon: Upload,
      number: "01",
      title: "Upload",
      description:
        "Securely upload your R&D documentation. All data stays in German AWS Frankfurt — zero data egress to US servers.",
    },
    {
      icon: Sparkles,
      number: "02",
      title: "Generate",
      description:
        "Our fine-tuned model drafts every ZIM/EXIST section — work plan, market analysis, budget breakdown — in under 4 hours.",
    },
    {
      icon: CheckCircle2,
      number: "03",
      title: "Submit",
      description:
        "Review, e-sign, and submit directly to Projektträger Jülich or BMWK via our EASY-Online integration.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-[#0A0F1E] py-28 px-6 relative overflow-hidden">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[#00C896] text-xs font-semibold uppercase tracking-widest mb-3">
            The process
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            How Grant-Agent AI Works
          </h2>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative"
        >
          {steps.map(({ icon: Icon, number, title, description }, i) => (
            <div key={number} className="relative flex items-stretch">
              <motion.div variants={fadeUp} className="flex-1">
                <GlassCard className="p-8 flex flex-col gap-5 h-full">
                  <div className="flex items-center justify-between">
                    <div className="bg-[#00C896]/10 border border-[#00C896]/20 p-3 rounded-xl">
                      <Icon className="h-6 w-6 text-[#00C896]" />
                    </div>
                    <span className="text-4xl font-black text-white/8 select-none">{number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{description}</p>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Arrow connector — only between cards */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center w-0 relative z-10">
                  <ChevronRight
                    className="absolute -right-5 text-[#00C896]/40 h-6 w-6"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// TrustSection
// ---------------------------------------------------------------------------
function TrustSection() {
  const institutions = [
    "TU Munich",
    "Fraunhofer Institute",
    "RWTH Aachen",
    "KIT Karlsruhe",
    "HU Berlin",
  ];

  return (
    <section id="trust" className="bg-[#0A0F1E] py-28 px-6">
      <div className="max-w-4xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-white/40 text-sm mb-6 uppercase tracking-widest">
            Trusted by teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {institutions.map((name) => (
              <span key={name} className="text-white/30 font-semibold text-sm hover:text-white/60 transition-colors cursor-default">
                {name}
              </span>
            ))}
          </div>
        </AnimatedSection>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-14" />

        {/* Testimonial */}
        <AnimatedSection>
          <GlassCard className="p-10 relative overflow-hidden">
            {/* Quote mark decoration */}
            <span
              className="pointer-events-none absolute -top-4 -left-2 text-[120px] leading-none font-serif text-[#00C896]/10 select-none"
              aria-hidden="true"
            >
              "
            </span>

            <div className="relative z-10">
              <p className="text-xl md:text-2xl text-white/85 leading-relaxed font-light mb-8">
                We saved{" "}
                <span className="text-[#00C896] font-semibold">€45,000</span> in
                consultant fees and submitted our ZIM application in{" "}
                <span className="text-white font-semibold">4 hours</span> instead of
                3 weeks. The IP privacy mode was the deciding factor.
              </p>

              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#00C896]/40 to-[#7C5CFC]/40 border border-white/10 flex items-center justify-center text-sm font-bold text-white">
                  LM
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Dr. Lena M.</p>
                  <p className="text-white/40 text-xs">CTO, Deep-Tech Startup · Munich</p>
                </div>
                <div className="ml-auto">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} className="text-[#00C896] text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </AnimatedSection>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// PricingSection
// ---------------------------------------------------------------------------
function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "€0",
      period: "",
      description: "Try before you commit",
      features: [
        "1 application / month",
        "ZIM Individual only",
        "PDF export",
        "Community support",
      ],
      cta: "Start for free",
      href: "/dashboard",
      highlight: false,
    },
    {
      name: "Pro",
      price: "€199",
      period: "/ month",
      description: "For active R&D teams",
      features: [
        "Unlimited applications",
        "ZIM + EXIST + KfW",
        "IP Privacy Mode",
        "EASY-Online integration",
        "Priority support",
      ],
      cta: "Start Pro Trial",
      href: "/dashboard",
      highlight: true,
      badge: "Most Popular",
    },
    {
      name: "Enterprise",
      price: "€999",
      period: "/ month",
      description: "For agencies & research institutions",
      features: [
        "Everything in Pro",
        "White-label branding",
        "REST API access",
        "SLA 99.9% uptime",
        "Dedicated account manager",
      ],
      cta: "Contact Sales",
      href: "mailto:sales@grant-agent.ai",
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-[#0A0F1E] py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <p className="text-[#00C896] text-xs font-semibold uppercase tracking-widest mb-3">
            Transparent pricing
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            One fee. No hidden consultant take.
          </h2>
          <p className="text-white/50 text-lg max-w-lg mx-auto">
            We charge a flat subscription. You keep 100% of your grant money.
          </p>
        </AnimatedSection>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {plans.map(({ name, price, period, description, features, cta, href, highlight, badge }) => (
            <motion.div key={name} variants={fadeUp}>
              <GlassCard highlight={highlight} className="p-8 flex flex-col gap-6 h-full relative">
                {badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-[#00C896] text-[#0A0F1E] text-xs font-bold px-3 py-1 rounded-full">
                      {badge}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1">{name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-black text-white tracking-tight">{price}</span>
                    {period && <span className="text-white/40 text-sm mb-1.5">{period}</span>}
                  </div>
                  <p className="text-white/40 text-sm">{description}</p>
                </div>

                <ul className="flex flex-col gap-2.5 flex-1">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-white/65">
                      <CheckCircle2 className="h-4 w-4 text-[#00C896] mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href={href}
                  className={[
                    "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
                    highlight
                      ? "bg-[#00C896] text-[#0A0F1E] hover:bg-[#00e5b0] shadow-[0_0_20px_rgba(0,200,150,0.25)] hover:shadow-[0_0_32px_rgba(0,200,150,0.4)]"
                      : "border border-white/15 text-white/80 hover:bg-white/5 hover:border-white/30",
                  ].join(" ")}
                >
                  {cta}
                  <ChevronRight className="h-4 w-4" />
                </a>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Footer
// ---------------------------------------------------------------------------
function Footer() {
  const links = [
    { label: "Impressum", href: "/impressum" },
    { label: "Datenschutz", href: "/datenschutz" },
    { label: "AGB", href: "/agb" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "/about" },
  ];

  return (
    <footer className="bg-[#0A0F1E] border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <Image src="/symbol.png" alt="Grant-Agent AI logo" width={1258} height={842} style={{ height: '24px', width: 'auto' }} />
              <span className="text-white font-bold tracking-tight">
                Grant<span className="text-[#00C896]">Agent</span>
                <span className="text-white/40 font-light ml-1">AI</span>
              </span>
            </div>
            <p className="text-white/35 text-xs">
              Made in Berlin. Hosted in the EU.{" "}
              <span className="text-[#00C896]/60">🇩🇪</span>
            </p>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {links.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                className="text-white/35 text-sm hover:text-white/70 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-white/20 text-xs">
            © {new Date().getFullYear()} Grant-Agent AI GmbH. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Gefördert durch Bundesministerium für Wirtschaft und Klimaschutz
          </p>
        </div>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------
export default function LandingPage() {
  return (
    <main className="bg-[#0A0F1E] min-h-screen">
      <HeroSection />
      <PainSection />
      <SolutionSection />
      <TrustSection />
      <PricingSection />
      <Footer />
    </main>
  );
}
