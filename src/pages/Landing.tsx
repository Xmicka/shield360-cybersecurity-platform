import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";
import { MODULES } from "../config/services";

const moduleCards = MODULES.map((mod) => ({
    title: mod.name,
    desc: mod.description,
    icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
        </svg>
    ),
    gradient: mod.gradient,
    color: mod.color,
    tag: mod.tag,
    deployedUrl: mod.deployedUrl,
    tier: mod.tier,
    features: mod.features,
}));

const containerStagger = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
};
const childFade = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function Landing() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="relative">
            <AnimatedBackground />

            {/* ─── Navbar ─── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ padding: "16px 24px" }}
            >
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    background: "rgba(7, 11, 22, 0.7)",
                    backdropFilter: "blur(20px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
                }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #00f0ff, #7c3aed)",
                            padding: 2, display: "flex",
                        }}>
                            <div style={{
                                flex: 1, borderRadius: 8, background: "#070b16",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#00f0ff" }} fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Shield360</span>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 13, color: "#94a3b8" }}>
                        <Link to="/about" style={{ transition: "color 0.2s" }} className="hover:text-white">About</Link>
                        <Link to="/pricing" style={{ transition: "color 0.2s" }} className="hover:text-white">Pricing</Link>
                        <Link to="/contact" style={{ transition: "color 0.2s" }} className="hover:text-white">Contact</Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Link to="/login" style={{ fontSize: 13, color: "#94a3b8", padding: "8px 16px" }} className="hover:text-white">Sign In</Link>
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }}>Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            {/* ─── Hero ─── */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ padding: "0 32px" }}>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "2s" }} />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center" >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: 10,
                            padding: "10px 20px", borderRadius: 100,
                            background: "rgba(10,15,30,0.5)", border: "1px solid rgba(255,255,255,0.06)",
                            marginBottom: 40,
                        }}
                    >
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                        <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>AI-Driven Cybersecurity Platform for SMEs</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        style={{ fontSize: "clamp(40px, 6vw, 76px)", fontWeight: 800, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24 }}
                    >
                        <span style={{ color: "#fff" }}>Unified Security.</span>
                        <br />
                        <span className="gradient-text">Complete Visibility.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        style={{ fontSize: 18, color: "#94a3b8", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7 }}
                    >
                        Shield360 aggregates threat intelligence, behaviour analytics, phishing simulation, and compliance enforcement into one{" "}
                        <span style={{ color: "#fff", fontWeight: 500 }}>intelligent platform</span>.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}
                    >
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: "16px 32px", display: "flex", alignItems: "center", gap: 8 }}>
                            Start Free Trial
                            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link to="/login" className="btn-ghost" style={{ fontSize: 15, padding: "16px 32px" }}>Sign In →</Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        style={{ marginTop: 80 }}
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            style={{
                                width: 28, height: 44, border: "2px solid #334155", borderRadius: 100,
                                margin: "0 auto", display: "flex", justifyContent: "center", paddingTop: 10,
                            }}
                        >
                            <div style={{ width: 3, height: 8, background: "#00f0ff", borderRadius: 100 }} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── Stats Bar ─── */}
            <motion.section {...fadeInUp} className="relative z-10" style={{ padding: "0 32px 80px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <div className="glass" style={{ padding: "40px 48px", borderRadius: 24 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32 }}>
                            {[
                                { value: "99.7%", label: "Threat Detection", color: "#00f0ff" },
                                { value: "< 5s", label: "Response Time", color: "#a78bfa" },
                                { value: "1,247", label: "Attacks Blocked", color: "#f43f5e" },
                                { value: "24/7", label: "Active Monitoring", color: "#34d399" },
                            ].map((stat, i) => (
                                <div key={i} style={{ textAlign: "center" }}>
                                    <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 4 }}>
                                        {stat.value}
                                    </p>
                                    <p style={{ fontSize: 12, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: stat.color }}>
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ─── Modules Section ─── */}
            <section className="relative z-10" style={{ padding: "80px 32px 100px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.div {...fadeInUp} style={{ textAlign: "center", marginBottom: 72 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "#00f0ff", marginBottom: 16 }}>
                            Security Modules
                        </p>
                        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
                            Four pillars of <span className="gradient-text">intelligent defence</span>
                        </h2>
                        <p style={{ fontSize: 16, color: "#64748b", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
                            Each module is independently developed and deployed. Shield360 unifies them into a single operational dashboard.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}
                    >
                        {moduleCards.map((mod) => (
                            <motion.div key={mod.title} variants={childFade}>
                                <a href={mod.deployedUrl} target="_blank" rel="noopener noreferrer" className="glass-card" style={{ display: "block", padding: 36, position: "relative", overflow: "hidden" }}>
                                    {/* Top accent line */}
                                    <div style={{
                                        position: "absolute", top: 0, left: 0, right: 0, height: 2,
                                        background: `linear-gradient(90deg, ${mod.color}, transparent)`,
                                        opacity: 0.4,
                                    }} />

                                    {/* Header: Icon + Tag/Title */}
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
                                        <div style={{
                                            width: 52, height: 52, borderRadius: 16,
                                            background: `linear-gradient(135deg, ${mod.color}15, ${mod.color}08)`,
                                            border: `1px solid ${mod.color}20`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            color: mod.color, flexShrink: 0,
                                        }}>
                                            {mod.icon}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569" }}>
                                                    {mod.tag}
                                                </span>
                                                <span style={{
                                                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                                    color: mod.tier === "free" ? "#22d3ee" : "#a855f7",
                                                    background: mod.tier === "free" ? "rgba(34,211,238,0.1)" : "rgba(168,85,247,0.1)",
                                                    padding: "2px 8px", borderRadius: 6,
                                                }}>
                                                    {mod.tier}
                                                </span>
                                            </div>
                                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginTop: 4, letterSpacing: "-0.01em" }}>
                                                {mod.title}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7, marginBottom: 20 }}>
                                        {mod.desc}
                                    </p>

                                    {/* Feature pills */}
                                    <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                                        {mod.features.map((f) => (
                                            <span key={f} style={{
                                                fontSize: 11, fontWeight: 600, color: mod.color,
                                                background: `${mod.color}0a`, border: `1px solid ${mod.color}18`,
                                                padding: "5px 12px", borderRadius: 8,
                                            }}>
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    {/* CTA */}
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: "#475569" }}>
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

            {/* ─── Divider ─── */}
            <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>

            {/* ─── How It Works ─── */}
            <section className="relative z-10" style={{ padding: "100px 32px" }}>
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <motion.div {...fadeInUp} style={{ textAlign: "center", marginBottom: 72 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "#00f0ff", marginBottom: 16 }}>
                            How It Works
                        </p>
                        <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                            Three steps to total protection
                        </h2>
                    </motion.div>

                    <motion.div
                        variants={containerStagger}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-50px" }}
                        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}
                    >
                        {[
                            {
                                step: "01", title: "Connect", subtitle: "Your Components",
                                desc: "Plug in your team's independent security microservices via simple API URLs. Each component runs independently.",
                                icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101",
                                color: "#00f0ff",
                            },
                            {
                                step: "02", title: "Monitor", subtitle: "In Real-Time",
                                desc: "Shield360 aggregates data from all connected components into a single real-time admin dashboard.",
                                icon: "M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5",
                                color: "#a78bfa",
                            },
                            {
                                step: "03", title: "Protect", subtitle: "With Intelligence",
                                desc: "Get actionable insights, automated alerts, and AI-driven recommendations across your entire security posture.",
                                icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
                                color: "#34d399",
                            },
                        ].map((item, i) => (
                            <motion.div key={i} variants={childFade} className="glass-card" style={{ padding: 36, textAlign: "center", position: "relative" }}>
                                {/* Step number badge */}
                                <div style={{
                                    position: "absolute", top: 20, right: 20,
                                    fontSize: 11, fontWeight: 800, color: item.color, opacity: 0.5,
                                    letterSpacing: "0.05em",
                                }}>
                                    {item.step}
                                </div>

                                {/* Icon */}
                                <div style={{
                                    width: 64, height: 64, borderRadius: 20, margin: "0 auto 24px",
                                    background: `linear-gradient(135deg, ${item.color}12, ${item.color}06)`,
                                    border: `1px solid ${item.color}18`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, color: item.color }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h3 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 4, letterSpacing: "-0.02em" }}>
                                    {item.title}
                                </h3>
                                <p style={{ fontSize: 14, fontWeight: 500, color: item.color, marginBottom: 16, opacity: 0.7 }}>
                                    {item.subtitle}
                                </p>

                                {/* Desc */}
                                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>
                                    {item.desc}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ─── Divider ─── */}
            <div className="relative z-10" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 32px" }}>
                <div style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            </div>

            {/* ─── Pricing Teaser ─── */}
            <section className="relative z-10" style={{ padding: "100px 32px" }}>
                <motion.div {...fadeInUp} style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "#00f0ff", marginBottom: 16 }}>
                        Pricing
                    </p>
                    <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
                        Enterprise security, <span className="gradient-text">completely free</span>
                    </h2>
                    <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto 48px", lineHeight: 1.7 }}>
                        Start with two essential modules at no cost. Upgrade instantly to unlock the full suite — no payment required.
                    </p>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
                        {[
                            { name: "Free", price: "$0", desc: "Endpoint Scanner + Shadow IT", color: "#22d3ee", popular: false },
                            { name: "Premium", price: "$0", desc: "Full security suite — all 4 modules", color: "#a855f7", popular: true },
                        ].map((p) => (
                            <div key={p.name} className="glass-card" style={{
                                padding: 32, textAlign: "center",
                                border: p.popular ? "1px solid rgba(168,85,247,0.2)" : undefined,
                            }}>
                                {p.popular && (
                                    <span style={{
                                        display: "inline-block", fontSize: 9, fontWeight: 800,
                                        textTransform: "uppercase", letterSpacing: "0.15em",
                                        color: "#a855f7", background: "rgba(168,85,247,0.1)",
                                        padding: "4px 12px", borderRadius: 6, marginBottom: 12,
                                    }}>
                                        Recommended
                                    </span>
                                )}
                                <p style={{ fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8 }}>{p.name}</p>
                                <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 4 }}>
                                    {p.price}<span style={{ fontSize: 14, color: "#475569", fontWeight: 400 }}>/forever</span>
                                </p>
                                <p style={{ fontSize: 13, color: "#64748b" }}>{p.desc}</p>
                            </div>
                        ))}
                    </div>

                    <Link to="/pricing" className="btn-primary" style={{ fontSize: 14, padding: "14px 32px", display: "inline-flex", alignItems: "center", gap: 8 }}>
                        Compare Plans
                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>
                </motion.div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className="relative z-10" style={{ padding: "40px 32px 100px" }}>
                <motion.div {...fadeInUp} style={{ maxWidth: 900, margin: "0 auto" }}>
                    <div className="glass-card" style={{ padding: "72px 48px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                        {/* Background glow */}
                        <div style={{
                            position: "absolute", inset: 0,
                            background: "radial-gradient(ellipse at 50% 0%, rgba(0,240,255,0.06) 0%, transparent 60%)",
                        }} />
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, transparent, #00f0ff40, #7c3aed40, transparent)" }} />

                        <div style={{ position: "relative", zIndex: 1 }}>
                            <h2 style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", marginBottom: 16 }}>
                                Ready to secure your organisation?
                            </h2>
                            <p style={{ fontSize: 16, color: "#64748b", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
                                Get started with Shield360 and bring unified cybersecurity intelligence to your business.
                            </p>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
                                <Link to="/signup" className="btn-primary" style={{ fontSize: 15, padding: "16px 32px" }}>Create Free Account</Link>
                                <Link to="/pricing" className="btn-ghost" style={{ fontSize: 15, padding: "16px 32px" }}>View Pricing</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="relative z-10" style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "56px 32px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, marginBottom: 40 }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: 8,
                                    background: "linear-gradient(135deg, #00f0ff, #7c3aed)",
                                    padding: 1.5, display: "flex",
                                }}>
                                    <div style={{
                                        flex: 1, borderRadius: 6, background: "#070b16",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                    }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#00f0ff" }} fill="currentColor">
                                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                        </svg>
                                    </div>
                                </div>
                                <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Shield360</span>
                            </div>
                            <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.7, maxWidth: 260 }}>
                                AI-driven cybersecurity made accessible for small and medium enterprises worldwide.
                            </p>
                        </div>
                        {[
                            { title: "Platform", links: [{ label: "Dashboard", to: "/dashboard" }, { label: "Pricing", to: "/pricing" }, { label: "Documentation", to: "#" }] },
                            { title: "Company", links: [{ label: "About", to: "/about" }, { label: "Contact", to: "/contact" }, { label: "Careers", to: "#" }] },
                            { title: "Legal", links: [{ label: "Privacy", to: "#" }, { label: "Terms", to: "#" }, { label: "Security", to: "#" }] },
                        ].map((col) => (
                            <div key={col.title}>
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 16 }}>
                                    {col.title}
                                </p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {col.links.map((link) => (
                                        <Link key={link.label} to={link.to} style={{ fontSize: 13, color: "#64748b" }} className="hover:text-white">
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <p style={{ fontSize: 12, color: "#334155" }}>© 2025 Shield360 Cybersecurity Platform. Bachelor's Final Project.</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                            <span style={{ fontSize: 12, color: "#475569" }}>All systems operational</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
