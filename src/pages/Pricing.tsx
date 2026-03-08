import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { FREE_MODULES, PREMIUM_MODULES, MODULES } from "../config/services";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

const tiers = [
    {
        id: "free" as const,
        name: "Free",
        price: "0",
        description: "Essential security tools to get started",
        color: "#22d3ee",
        gradient: "from-cyan-400 to-blue-500",
        modules: FREE_MODULES,
        features: [
            "Endpoint Risk Scanner",
            "Shadow IT & Asset Vulnerability Dashboard",
            "Basic security metrics dashboard",
            "Cross-module activity feed",
            "Community support",
        ],
    },
    {
        id: "premium" as const,
        name: "Premium",
        price: "0",
        description: "Full suite for complete cybersecurity coverage",
        color: "#a855f7",
        gradient: "from-purple-400 to-pink-500",
        popular: true,
        modules: PREMIUM_MODULES,
        features: [
            "Everything in Free, plus:",
            "Compliance Assistant (ISO 27001, GDPR, SOC 2)",
            "Spear Phishing Simulation Engine",
            "Admin control panel",
            "Module toggle management",
            "Priority support",
        ],
    },
];

export default function Pricing() {
    const { plan: currentPlan, setPlan } = useSubscription();

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            {/* Navbar */}
            <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80" /><div className="absolute inset-[2px] rounded-[10px] bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg></div></div>
                        <span className="text-lg font-bold text-white tracking-tight">Shield360</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-ghost text-sm !py-2.5 !px-5">Sign In</Link>
                        <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Pricing</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                            Enterprise security, <span className="gradient-text">completely free</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Start with essential tools at no cost. Upgrade instantly to unlock the full security suite — no payment required for this demo.
                        </p>
                    </motion.div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {tiers.map((tier, i) => {
                            const isCurrent = currentPlan === tier.id;
                            const isPopular = tier.popular;

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="relative"
                                    style={{
                                        background: "rgba(10,14,26,0.6)",
                                        backdropFilter: "blur(20px)",
                                        border: `1px solid ${isPopular ? "rgba(168,85,247,0.25)" : "rgba(148,163,184,0.06)"}`,
                                        borderRadius: 24,
                                        padding: 40,
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Recommended</span>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: 28 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{tier.name}</h3>
                                        <p style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>{tier.description}</p>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                            <span style={{ fontSize: 48, fontWeight: 800, color: "#f1f5f9" }}>${tier.price}</span>
                                            <span style={{ fontSize: 14, color: "#64748b" }}>/forever</span>
                                        </div>
                                    </div>

                                    {/* Included modules */}
                                    <div style={{ marginBottom: 24 }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 12 }}>
                                            Included Modules
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {tier.modules.map((mod) => (
                                                <div key={mod.slug} style={{
                                                    display: "flex", alignItems: "center", gap: 10,
                                                    padding: "10px 14px", borderRadius: 12,
                                                    background: "rgba(148,163,184,0.03)",
                                                    border: "1px solid rgba(148,163,184,0.06)",
                                                }}>
                                                    <span style={{ fontSize: 16 }}>{mod.icon}</span>
                                                    <div>
                                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{mod.shortName}</p>
                                                        <p style={{ fontSize: 11, color: "#64748b" }}>{mod.tag}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32, flex: 1 }}>
                                        {tier.features.map((f) => (
                                            <li key={f} style={{ display: "flex", alignItems: "start", gap: 12, fontSize: 14 }}>
                                                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: tier.color, marginTop: 2, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                <span style={{ color: "#94a3b8" }}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    {isCurrent ? (
                                        <div style={{
                                            textAlign: "center", padding: "14px 0", borderRadius: 16,
                                            background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
                                            color: "#34d399", fontSize: 14, fontWeight: 600,
                                        }}>
                                            ✓ Current Plan
                                        </div>
                                    ) : tier.id === "premium" ? (
                                        <button
                                            onClick={() => setPlan("premium")}
                                            className="btn-primary"
                                            style={{ width: "100%", textAlign: "center", padding: "14px 0", borderRadius: 16, fontSize: 14, fontWeight: 600 }}
                                        >
                                            Upgrade Now — It's Free
                                        </button>
                                    ) : (
                                        <Link
                                            to="/signup"
                                            style={{
                                                display: "block", textAlign: "center", padding: "14px 0", borderRadius: 16,
                                                border: "1px solid rgba(148,163,184,0.1)",
                                                color: "#f1f5f9", fontSize: 14, fontWeight: 600,
                                                transition: "all 0.2s",
                                            }}
                                            className="hover:border-cyan-400/30 hover:bg-cyan-400/5"
                                        >
                                            Get Started Free
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Module comparison table */}
                    <motion.div {...fadeIn} style={{ marginTop: 80 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", textAlign: "center", marginBottom: 32 }}>
                            Module Access Comparison
                        </h3>
                        <div style={{
                            background: "rgba(10,14,26,0.6)",
                            backdropFilter: "blur(20px)",
                            border: "1px solid rgba(148,163,184,0.06)",
                            borderRadius: 20,
                            overflow: "hidden",
                        }}>
                            {/* Header row */}
                            <div style={{
                                display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                                padding: "16px 24px",
                                borderBottom: "1px solid rgba(148,163,184,0.06)",
                                background: "rgba(148,163,184,0.02)",
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Module</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#22d3ee", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Free</span>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#a855f7", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>Premium</span>
                            </div>
                            {MODULES.map((mod, i) => (
                                <div key={mod.slug} style={{
                                    display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
                                    padding: "16px 24px",
                                    borderBottom: i < MODULES.length - 1 ? "1px solid rgba(148,163,184,0.04)" : "none",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <span style={{ fontSize: 16 }}>{mod.icon}</span>
                                        <span style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 500 }}>{mod.shortName}</span>
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        {mod.tier === "free" ? (
                                            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#22d3ee", display: "inline-block" }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                        ) : (
                                            <span style={{ fontSize: 16, color: "#334155" }}>—</span>
                                        )}
                                    </div>
                                    <div style={{ textAlign: "center" }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#a855f7", display: "inline-block" }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div {...fadeIn} className="mt-16 text-center">
                        <div className="inline-flex flex-wrap justify-center gap-8 text-sm text-slate-500">
                            {["No credit card required", "Instant activation", "Cancel anytime", "Demo platform"].map((t) => (
                                <div key={t} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span>{t}</span></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
