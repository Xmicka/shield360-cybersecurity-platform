import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { PLANS, MODULES } from "../config/services";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

export default function Pricing() {
    const { plan: currentPlan } = useSubscription();

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            {/* Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
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

            <div className="relative z-10" style={{ padding: "128px 32px 96px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Pricing</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                            Security that <span className="gradient-text">scales with you</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">
                            Start free with essential tools. Upgrade for full coverage and unlimited access to enterprise-grade cybersecurity.
                        </p>
                    </motion.div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {PLANS.map((tier, i) => {
                            const isCurrent = currentPlan === tier.id;
                            const isPopular = tier.popular;

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.5 }}
                                    className="relative"
                                    style={{
                                        background: "rgba(10,14,26,0.6)",
                                        backdropFilter: "blur(20px)",
                                        border: `1px solid ${isPopular ? "rgba(168,85,247,0.3)" : "rgba(148,163,184,0.06)"}`,
                                        borderRadius: 24,
                                        padding: "36px 28px",
                                        display: "flex",
                                        flexDirection: "column",
                                        ...(isPopular ? { transform: "scale(1.03)", boxShadow: "0 0 60px rgba(168,85,247,0.08)" } : {}),
                                    }}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                                        </div>
                                    )}

                                    <div style={{ marginBottom: 24 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>{tier.name}</h3>
                                        </div>
                                        <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>{tier.tagline}</p>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                            <span style={{ fontSize: 44, fontWeight: 800, color: "#f1f5f9" }}>
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span style={{ fontSize: 14, color: "#64748b" }}>/{tier.period}</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{tier.description}</p>
                                    </div>

                                    {/* Included modules */}
                                    <div style={{ marginBottom: 20 }}>
                                        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 10 }}>
                                            Modules & Limits
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                            {MODULES.map((mod) => {
                                                const limit = tier.moduleLimits[mod.slug];
                                                const included = limit !== undefined;
                                                return (
                                                    <div key={mod.slug} style={{
                                                        display: "flex", alignItems: "center", gap: 8,
                                                        padding: "8px 10px", borderRadius: 10,
                                                        background: included ? "rgba(148,163,184,0.03)" : "transparent",
                                                        border: included ? "1px solid rgba(148,163,184,0.06)" : "1px solid transparent",
                                                        opacity: included ? 1 : 0.35,
                                                    }}>
                                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: included ? mod.color : "#334155", flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} /></svg>
                                                        <span style={{ fontSize: 12, fontWeight: 500, color: included ? "#e2e8f0" : "#475569", flex: 1 }}>{mod.shortName}</span>
                                                        {included && (
                                                            <span style={{
                                                                fontSize: 10, fontWeight: 700, color: limit === -1 ? "#34d399" : tier.color,
                                                                background: limit === -1 ? "rgba(52,211,153,0.1)" : `${tier.color}15`,
                                                                padding: "2px 8px", borderRadius: 6,
                                                            }}>
                                                                {limit === -1 ? "Unlimited" : `${limit}/mo`}
                                                            </span>
                                                        )}
                                                        {!included && (
                                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#334155" }} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, flex: 1 }}>
                                        {tier.features.map((f) => (
                                            <li key={f} style={{ display: "flex", alignItems: "start", gap: 10, fontSize: 13 }}>
                                                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: tier.color, marginTop: 2, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                <span style={{ color: "#94a3b8" }}>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* CTA */}
                                    {isCurrent ? (
                                        <div style={{
                                            textAlign: "center", padding: "12px 0", borderRadius: 14,
                                            background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)",
                                            color: "#34d399", fontSize: 13, fontWeight: 600,
                                        }}>
                                            ✓ Current Plan
                                        </div>
                                    ) : tier.id === "free" ? (
                                        <Link
                                            to="/signup"
                                            style={{
                                                display: "block", textAlign: "center", padding: "12px 0", borderRadius: 14,
                                                border: "1px solid rgba(148,163,184,0.1)",
                                                color: "#f1f5f9", fontSize: 13, fontWeight: 600,
                                                transition: "all 0.2s",
                                            }}
                                            className="hover:border-cyan-400/30 hover:bg-cyan-400/5"
                                        >
                                            Get Started Free
                                        </Link>
                                    ) : (
                                        <Link
                                            to={`/checkout?plan=${tier.id}`}
                                            className="btn-primary"
                                            style={{
                                                width: "100%", textAlign: "center", padding: "12px 0", borderRadius: 14,
                                                fontSize: 13, fontWeight: 600, display: "block",
                                            }}
                                        >
                                            {tier.id === "enterprise" ? "Contact Sales" : `Upgrade to ${tier.name}`}
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
                                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                padding: "16px 24px",
                                borderBottom: "1px solid rgba(148,163,184,0.06)",
                                background: "rgba(148,163,184,0.02)",
                            }}>
                                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Module</span>
                                {PLANS.map((p) => (
                                    <span key={p.id} style={{ fontSize: 12, fontWeight: 700, color: p.color, textTransform: "uppercase", letterSpacing: "0.1em", textAlign: "center" }}>
                                        {p.name}
                                    </span>
                                ))}
                            </div>
                            {MODULES.map((mod, i) => (
                                <div key={mod.slug} style={{
                                    display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                    padding: "16px 24px",
                                    borderBottom: i < MODULES.length - 1 ? "1px solid rgba(148,163,184,0.04)" : "none",
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: mod.color, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} /></svg>
                                        <span style={{ fontSize: 14, color: "#f1f5f9", fontWeight: 500 }}>{mod.shortName}</span>
                                    </div>
                                    {PLANS.map((p) => {
                                        const limit = p.moduleLimits[mod.slug];
                                        const included = limit !== undefined;
                                        return (
                                            <div key={p.id} style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                {included ? (
                                                    <span style={{
                                                        fontSize: 11, fontWeight: 700,
                                                        color: limit === -1 ? "#34d399" : p.color,
                                                        background: limit === -1 ? "rgba(52,211,153,0.1)" : `${p.color}12`,
                                                        padding: "3px 10px", borderRadius: 6,
                                                    }}>
                                                        {limit === -1 ? "∞" : `${limit}/mo`}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: 16, color: "#334155" }}>-</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div {...fadeIn} className="mt-16 text-center">
                        <div className="inline-flex flex-wrap justify-center gap-8 text-sm text-slate-500">
                            {["No credit card for free tier", "Instant activation", "Cancel anytime", "30-day money-back guarantee"].map((t) => (
                                <div key={t} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span>{t}</span></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
