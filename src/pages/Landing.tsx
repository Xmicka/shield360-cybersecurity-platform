import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import Aurora from "../components/backgrounds/Aurora";
import { MODULES } from "../config/services";

const moduleCards = MODULES.map((mod) => ({
    title: mod.name,
    desc: mod.description,
    icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6}>
            <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
        </svg>
    ),
    color: mod.color,
    tag: mod.tag,
    deployedUrl: mod.deployedUrl,
    tier: mod.tier,
    features: mod.features,
}));

const containerStagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const childFade = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};
const fadeInUp = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const eyebrow: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: "var(--color-brand-blue)",
    marginBottom: 14,
};

const sectionDivider: React.CSSProperties = {
    height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,0,0,0.08), transparent)",
};

export default function Landing() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

    return (
        <div className="relative" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
            {/* ─── Navbar ─── */}
            <motion.nav
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ padding: "16px 24px" }}
            >
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 100,
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }} className="group">
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #6ba3be 0%, #8aab96 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(107,163,190,0.25)",
                        }}>
                            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#fff" }} fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>Shield360</span>
                    </Link>
                    <div className="hidden md:flex" style={{ alignItems: "center", gap: 28, fontSize: 13, color: "var(--color-text-secondary)" }}>
                        <Link to="/about" className="hover:text-black">About</Link>
                        <Link to="/pricing" className="hover:text-black">Pricing</Link>
                        <Link to="/contact" className="hover:text-black">Contact</Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Link to="/login" style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "8px 14px" }} className="hover:text-black">Sign In</Link>
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            {/* ─── Hero ─── */}
            <section ref={heroRef} className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh", padding: "120px 24px 80px" }}>
                <Aurora colorStops={["#d4e8f0", "#e8d4f0", "#d4eee0"]} speed={0.4} blend="mix-blend-multiply" />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center w-full" >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15, duration: 0.4 }}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            padding: "8px 16px", borderRadius: 100,
                            background: "rgba(255,255,255,0.7)",
                            border: "1px solid var(--color-border)",
                            backdropFilter: "blur(12px)",
                            marginBottom: 32,
                            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-secondary)", letterSpacing: "0.02em" }}>
                            AI-Driven Cybersecurity Platform for SMEs
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        style={{
                            fontSize: "clamp(40px, 6vw, 84px)",
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: "-0.035em",
                            marginBottom: 24,
                            color: "var(--color-text-primary)",
                            maxWidth: 900,
                            margin: "0 auto 24px",
                        }}
                    >
                        Unified security.{" "}
                        <span className="gradient-text" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>
                            Complete visibility.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        style={{ fontSize: 18, color: "var(--color-text-secondary)", maxWidth: 640, margin: "0 auto 36px", lineHeight: 1.6 }}
                    >
                        Threat intelligence, behaviour analytics, phishing simulation, and compliance enforcement —
                        unified into one calm, intelligent platform.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}
                    >
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: "14px 28px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                            Start Free Trial
                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link to="/login" className="btn-ghost" style={{ fontSize: 15, padding: "14px 28px" }}>
                            Sign In
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        style={{ marginTop: 64, display: "flex", justifyContent: "center", position: "relative", zIndex: 5 }}
                    >
                        <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                width: 26, height: 42,
                                border: "1.5px solid rgba(0,0,0,0.15)",
                                borderRadius: 100,
                                display: "flex", justifyContent: "center", paddingTop: 8,
                                background: "rgba(255,255,255,0.5)",
                            }}
                        >
                            <div style={{ width: 3, height: 8, background: "var(--color-brand-blue)", borderRadius: 100 }} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── Stats Bar ─── */}
            <motion.section {...fadeInUp} className="relative z-10" style={{ padding: "0 24px 80px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <div className="glass-card" style={{ padding: "36px 40px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 32 }}>
                            {[
                                { value: "99.7%", label: "Threat Detection", color: "var(--color-brand-blue)" },
                                { value: "< 5s", label: "Response Time", color: "var(--color-brand-lavender)" },
                                { value: "1,247", label: "Attacks Blocked", color: "var(--color-brand-peach)" },
                                { value: "24/7", label: "Active Monitoring", color: "var(--color-brand-sage)" },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <p style={{ fontSize: 32, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.03em", marginBottom: 4 }}>
                                        {stat.value}
                                    </p>
                                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.12em", color: stat.color }}>
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ─── Modules ─── */}
            <section className="relative z-10" style={{ padding: "60px 24px 100px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.div {...fadeInUp} style={{ textAlign: "center", marginBottom: 56 }}>
                        <p style={eyebrow}>Security Modules</p>
                        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em", marginBottom: 14 }}>
                            Four pillars of intelligent defence
                        </h2>
                        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 540, margin: "0 auto", lineHeight: 1.6 }}>
                            Each module is independently developed and deployed. Shield360 unifies them into a single operational dashboard.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}
                    >
                        {moduleCards.map((mod) => (
                            <motion.div key={mod.title} variants={childFade}>
                                <a href={mod.deployedUrl} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ display: "block", padding: 32, position: "relative", overflow: "hidden" }}>
                                    <div style={{
                                        position: "absolute", top: 0, left: 0, right: 0, height: 3,
                                        background: mod.color,
                                        opacity: 0.6,
                                        borderRadius: "20px 20px 0 0",
                                    }} />

                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                                        <div style={{
                                            width: 48, height: 48, borderRadius: 14,
                                            background: `${mod.color}15`,
                                            border: `1px solid ${mod.color}30`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: mod.color, flexShrink: 0,
                                        }}>
                                            {mod.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-text-muted)" }}>
                                                    {mod.tag}
                                                </span>
                                                <span style={{
                                                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                                    color: mod.tier === "free" ? "var(--color-brand-sage)" : "var(--color-brand-lavender)",
                                                    background: mod.tier === "free" ? "rgba(138,171,150,0.12)" : "rgba(184,169,201,0.15)",
                                                    padding: "2px 8px", borderRadius: 6,
                                                }}>
                                                    {mod.tier}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", marginTop: 6, letterSpacing: "-0.01em" }}>
                                                {mod.title}
                                            </h3>
                                        </div>
                                    </div>

                                    <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: 18 }}>
                                        {mod.desc}
                                    </p>

                                    <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
                                        {mod.features.map((f) => (
                                            <span key={f} style={{
                                                fontSize: 11, fontWeight: 600, color: mod.color,
                                                background: `${mod.color}10`, border: `1px solid ${mod.color}25`,
                                                padding: "4px 10px", borderRadius: 100,
                                            }}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: mod.color }}>
                                        <span>Launch module</span>
                                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                        </svg>
                                    </div>
                                </a>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
                <div style={sectionDivider} />
            </div>

            {/* ─── How It Works ─── */}
            <section className="relative z-10" style={{ padding: "100px 24px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <motion.div {...fadeInUp} style={{ textAlign: "center", marginBottom: 56 }}>
                        <p style={eyebrow}>How It Works</p>
                        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em" }}>
                            Three steps to total protection
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}
                    >
                        {[
                            { step: "01", title: "Connect", subtitle: "Your components", desc: "Plug in your team's independent security microservices via simple API URLs.", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101", color: "var(--color-brand-blue)" },
                            { step: "02", title: "Monitor", subtitle: "In real-time", desc: "Shield360 aggregates data from all connected components into a single dashboard.", icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5", color: "var(--color-brand-lavender)" },
                            { step: "03", title: "Protect", subtitle: "With intelligence", desc: "Get actionable insights, automated alerts, and AI-driven recommendations.", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z", color: "var(--color-brand-sage)" },
                        ].map((item, i) => (
                            <motion.div key={i} variants={childFade} className="glass-card" style={{ padding: 28, textAlign: "center", position: "relative" }}>
                                <div style={{ position: "absolute", top: 16, right: 18, fontSize: 11, fontWeight: 700, color: item.color, opacity: 0.5, letterSpacing: "0.05em" }}>
                                    {item.step}
                                </div>
                                <div style={{
                                    width: 56, height: 56, borderRadius: 16, margin: "0 auto 16px",
                                    background: `${item.color}15`,
                                    border: `1px solid ${item.color}30`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 24, height: 24, color: item.color }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 4, letterSpacing: "-0.02em" }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: 13, fontWeight: 500, color: item.color, marginBottom: 12 }}>
                                    {item.subtitle}
                                </p>
                                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
                <div style={sectionDivider} />
            </div>

            {/* ─── Pricing Teaser ─── */}
            <section className="relative z-10" style={{ padding: "100px 24px" }}>
                <motion.div {...fadeInUp} style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <p style={eyebrow}>Pricing</p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em", marginBottom: 14 }}>
                        Security that scales with you
                    </h2>
                    <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.6 }}>
                        Start free with essential modules. Upgrade for full coverage and unlimited enterprise-grade security.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 36, maxWidth: 720, margin: "0 auto 36px" }}>
                        {[
                            { name: "Starter", price: "Free", desc: "Endpoint + Shadow IT · 10/mo", color: "var(--color-brand-blue)", popular: false },
                            { name: "Professional", price: "$50", period: "/mo", desc: "All 4 modules · usage limits", color: "var(--color-brand-lavender)", popular: true },
                            { name: "Enterprise", price: "$120", period: "/mo", desc: "Unlimited everything", color: "var(--color-brand-peach)", popular: false },
                        ].map((p) => (
                            <div key={p.name} className="glass-card" style={{
                                padding: 24, textAlign: "center", minHeight: 180,
                                border: p.popular ? "1px solid rgba(184,169,201,0.4)" : undefined,
                            }}>
                                {p.popular && (
                                    <span style={{
                                        display: "inline-block", fontSize: 9, fontWeight: 700,
                                        textTransform: "uppercase", letterSpacing: "0.15em",
                                        color: "var(--color-brand-lavender)", background: "rgba(184,169,201,0.15)",
                                        padding: "3px 10px", borderRadius: 100, marginBottom: 10,
                                    }}>
                                        Most Popular
                                    </span>
                                )}
                                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 6 }}>{p.name}</p>
                                <p style={{ fontSize: 30, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.03em", marginBottom: 6 }}>
                                    {p.price}{p.period && <span style={{ fontSize: 14, color: "var(--color-text-muted)", fontWeight: 400 }}>{p.period}</span>}
                                </p>
                                <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Link to="/pricing" className="btn-primary" style={{ fontSize: 14, padding: "12px 26px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                        Compare Plans
                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </section>

            {/* ─── CTA ─── */}
            <section className="relative z-10" style={{ padding: "40px 24px 100px" }}>
                <motion.div {...fadeInUp} style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="glass-card" style={{
                        padding: "60px 40px", textAlign: "center", position: "relative", overflow: "hidden",
                        background: "linear-gradient(135deg, #ffffff 0%, #f4f2ef 100%)",
                    }}>
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--color-brand-blue), var(--color-brand-lavender))", borderRadius: "20px 20px 0 0" }} />
                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em", marginBottom: 12 }}>
                                Ready to secure your organisation?
                            </h2>
                            <p style={{ fontSize: 16, color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto 28px", lineHeight: 1.6 }}>
                                Get started with Shield360 and bring unified cybersecurity intelligence to your business.
                            </p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                                <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: "13px 28px" }}>Create Free Account</Link>
                                <Link to="/pricing" className="btn-ghost" style={{ fontSize: 15, padding: "13px 28px" }}>View Pricing</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="relative z-10" style={{ background: "var(--color-bg-surface)", borderTop: "1px solid var(--color-border)", padding: "56px 24px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 40, marginBottom: 32 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "linear-gradient(135deg, #6ba3be, #8aab96)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#fff" }} fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>Shield360</span>
                            </div>
                            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.65, maxWidth: 240 }}>
                                AI-driven cybersecurity made accessible for small and medium enterprises worldwide.
                            </p>
                        </div>
                        {[
                            { title: "Platform", links: [{ label: "Dashboard", to: "/dashboard" }, { label: "Pricing", to: "/pricing" }, { label: "Documentation", to: "#" }] },
                            { title: "Company", links: [{ label: "About", to: "/about" }, { label: "Contact", to: "/contact" }, { label: "Careers", to: "#" }] },
                            { title: "Legal", links: [{ label: "Privacy", to: "#" }, { label: "Terms", to: "#" }, { label: "Security", to: "#" }] },
                        ].map((col) => (
                            <div key={col.title}>
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--color-text-muted)", marginBottom: 14 }}>
                                    {col.title}
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {col.links.map((link) => (
                                        <Link key={link.label} to={link.to} style={{ fontSize: 13, color: "var(--color-text-secondary)" }} className="hover:text-black">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: 20, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                        <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>© 2025 Shield360. All rights reserved.</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                            <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
