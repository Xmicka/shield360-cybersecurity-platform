import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { PLANS, MODULES } from "../config/services";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const, margin: "-60px" },
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function Pricing() {
    const { plan: currentPlan } = useSubscription();

    return (
        <div className="relative min-h-screen" style={{ background: "var(--color-bg-cream)" }}>
            <AnimatedBackground />

            {/* Glass Navbar */}
            <motion.nav
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ padding: "16px 24px" }}
            >
                <div className="glass-nav" style={{
                    maxWidth: 1200, margin: "0 auto",
                    borderRadius: 100, padding: "10px 20px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "var(--shadow-sm)",
                    // Override .glass-nav 0.75 alpha (defined in styles/animations.css, owned by Animations agent)
                    // with a more solid background so hero subtitle text behind it is not legible through the blur.
                    background: "rgba(245, 240, 232, 0.94)",
                }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #B8A1E6 0%, #3D5A47 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(184,161,230,0.35)",
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

            <div className="relative z-10" style={{ padding: "188px 24px 96px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center" style={{ marginBottom: 64 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-brand-lavender-dark)", marginBottom: 14 }}>Pricing</p>
                        <h1 className="headline-section" style={{ marginBottom: 16 }}>
                            Security that <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>scales with you</span>
                        </h1>
                        <p style={{ fontSize: 17, color: "var(--color-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.65 }}>
                            Start free with essential tools. Upgrade for full coverage and unlimited access to enterprise-grade cybersecurity.
                        </p>
                    </motion.div>

                    {/* Plan Cards */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
                        {PLANS.map((tier, i) => {
                            const isCurrent = currentPlan === tier.id;
                            const isPopular = tier.popular;
                            const isEnterprise = tier.id === "enterprise";

                            const cardBg = isEnterprise
                                ? "var(--color-bg-dark)"
                                : isPopular
                                ? "var(--color-bg-card)"
                                : "var(--color-bg-cream-light)";
                            const cardText = isEnterprise ? "var(--color-text-on-dark)" : "var(--color-text-primary)";
                            const subText = isEnterprise ? "rgba(245,240,232,0.7)" : "var(--color-text-secondary)";
                            const mutedText = isEnterprise ? "rgba(245,240,232,0.55)" : "var(--color-text-muted)";

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="card-hover"
                                    style={{
                                        background: cardBg,
                                        border: isPopular
                                            ? "2px solid var(--color-brand-lavender-dark)"
                                            : "1px solid var(--color-border)",
                                        borderRadius: 24,
                                        padding: "40px 28px 32px",
                                        position: "relative",
                                        display: "flex",
                                        flexDirection: "column",
                                        boxShadow: isPopular ? "var(--shadow-lg)" : "var(--shadow-sm)",
                                        transform: isPopular ? "translateY(-8px)" : undefined,
                                    }}
                                >
                                    {isPopular && (
                                        <div style={{
                                            position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
                                            background: "var(--color-brand-lavender-dark)", color: "#fff",
                                            padding: "6px 16px", borderRadius: 100,
                                            fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase",
                                            boxShadow: "0 4px 12px rgba(184,161,230,0.4)",
                                        }}>
                                            Most Popular
                                        </div>
                                    )}

                                    <div style={{ marginBottom: 24 }}>
                                        <h3 style={{ fontSize: 20, fontWeight: 700, color: cardText, marginBottom: 4 }}>{tier.name}</h3>
                                        <p style={{ fontSize: 13, color: subText, marginBottom: 20 }}>{tier.tagline}</p>
                                        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                                            <span style={{ fontFamily: "var(--font-display)", fontSize: 56, fontWeight: 400, color: cardText, letterSpacing: "-0.02em" }}>
                                                {tier.price === 0 ? "Free" : `$${tier.price}`}
                                            </span>
                                            {tier.price > 0 && (
                                                <span style={{ fontSize: 16, color: subText }}>/{tier.period}</span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 13, color: mutedText, marginTop: 6 }}>{tier.description}</p>
                                    </div>

                                    <div style={{ marginBottom: 24 }}>
                                        <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: mutedText, marginBottom: 12 }}>
                                            Modules & Limits
                                        </p>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                            {MODULES.map((mod) => {
                                                const limit = tier.moduleLimits[mod.slug];
                                                const included = limit !== undefined;
                                                return (
                                                    <div key={mod.slug} style={{
                                                        display: "flex", alignItems: "center", gap: 10,
                                                        padding: "8px 12px", borderRadius: 10,
                                                        background: included
                                                            ? (isEnterprise ? "rgba(245,240,232,0.06)" : "rgba(0,0,0,0.03)")
                                                            : "transparent",
                                                        opacity: included ? 1 : 0.4,
                                                    }}>
                                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: included ? mod.color : mutedText, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                                        </svg>
                                                        <span style={{ fontSize: 13, fontWeight: 500, color: cardText, flex: 1 }}>{mod.shortName}</span>
                                                        {included ? (
                                                            <span style={{
                                                                fontSize: 10, fontWeight: 700,
                                                                color: limit === -1 ? "var(--color-status-ok)" : cardText,
                                                                background: limit === -1
                                                                    ? "rgba(125,186,156,0.2)"
                                                                    : (isEnterprise ? "rgba(245,240,232,0.12)" : "rgba(0,0,0,0.06)"),
                                                                padding: "3px 10px", borderRadius: 100,
                                                            }}>
                                                                {limit === -1 ? "Unlimited" : `${limit}/mo`}
                                                            </span>
                                                        ) : (
                                                            <span style={{ fontSize: 11, color: mutedText }}>—</span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28, flex: 1 }}>
                                        {tier.features.map((f) => (
                                            <li key={f} style={{ display: "flex", alignItems: "start", gap: 10, fontSize: 13, color: subText }}>
                                                <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "var(--color-brand-lavender-dark)", marginTop: 3, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {isCurrent ? (
                                        <div style={{
                                            textAlign: "center", padding: "14px 0", borderRadius: 100,
                                            background: "rgba(125,186,156,0.15)", border: "1px solid rgba(125,186,156,0.4)",
                                            color: "var(--color-status-ok)", fontSize: 14, fontWeight: 600,
                                        }}>
                                            ✓ Current Plan
                                        </div>
                                    ) : tier.id === "free" ? (
                                        <Link to="/signup" className="btn-ghost" style={{ width: "100%", padding: "13px 0" }}>
                                            Get Started Free
                                        </Link>
                                    ) : isEnterprise ? (
                                        <Link to="/contact" style={{
                                            width: "100%", textAlign: "center", padding: "14px 0", borderRadius: 100,
                                            background: "var(--color-brand-lavender)", color: "var(--color-text-primary)",
                                            fontSize: 15, fontWeight: 600, display: "block",
                                            boxShadow: "0 4px 12px rgba(212,197,240,0.3)",
                                        }} className="btn-primary">
                                            Contact Sales
                                        </Link>
                                    ) : (
                                        <Link to={`/checkout?plan=${tier.id}`} className="btn-primary" style={{ width: "100%", padding: "13px 0" }}>
                                            Upgrade to {tier.name}
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Comparison table */}
                    <motion.div {...fadeIn} style={{ marginTop: 96 }}>
                        <div style={{ textAlign: "center", marginBottom: 36 }}>
                            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-brand-blue)", marginBottom: 12 }}>Compare</p>
                            <h3 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(26px, 3vw, 34px)",
                                fontWeight: 400,
                                color: "var(--color-text-primary)",
                                letterSpacing: "-0.02em",
                            }}>
                                Module access <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>comparison</span>
                            </h3>
                        </div>
                        <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
                            <div style={{
                                display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                padding: "18px 28px",
                                borderBottom: "1px solid var(--color-border)",
                                background: "rgba(0,0,0,0.02)",
                            }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.25em" }}>Module</span>
                                {PLANS.map((p) => (
                                    <span key={p.id} style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.25em", textAlign: "center" }}>
                                        {p.name}
                                    </span>
                                ))}
                            </div>
                            {MODULES.map((mod, i) => (
                                <div
                                    key={mod.slug}
                                    className="comparison-row"
                                    style={{
                                        display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr",
                                        padding: "16px 28px",
                                        borderBottom: i < MODULES.length - 1 ? "1px solid var(--color-border)" : "none",
                                        alignItems: "center",
                                        transition: "background 0.18s ease",
                                    }}
                                    onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.02)"; }}
                                    onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                                >
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 10,
                                            background: `${mod.color}15`,
                                            border: `1px solid ${mod.color}30`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                        }}>
                                            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: mod.color }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                            </svg>
                                        </div>
                                        <span style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500 }}>{mod.shortName}</span>
                                    </div>
                                    {PLANS.map((p) => {
                                        const limit = p.moduleLimits[mod.slug];
                                        const included = limit !== undefined;
                                        return (
                                            <div key={p.id} style={{ textAlign: "center" }}>
                                                {included ? (
                                                    <span style={{
                                                        display: "inline-block",
                                                        fontSize: 11, fontWeight: 700,
                                                        color: limit === -1 ? "var(--color-status-ok)" : "var(--color-text-primary)",
                                                        background: limit === -1 ? "rgba(125,186,156,0.18)" : "rgba(155,130,204,0.18)",
                                                        border: limit === -1 ? "1px solid rgba(125,186,156,0.30)" : "1px solid rgba(155,130,204,0.28)",
                                                        padding: "5px 14px", borderRadius: 100,
                                                        letterSpacing: "0.02em",
                                                    }}>
                                                        {limit === -1 ? "Unlimited" : `${limit}/mo`}
                                                    </span>
                                                ) : (
                                                    <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}>—</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Trust badges */}
                    <motion.div {...fadeIn} style={{ marginTop: 64, textAlign: "center" }}>
                        <div style={{ display: "inline-flex", flexWrap: "wrap", justifyContent: "center", gap: 32, fontSize: 13, color: "var(--color-text-secondary)" }}>
                            {["No credit card for free tier", "Instant activation", "Cancel anytime", "30-day money-back guarantee"].map((t) => (
                                <div key={t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                                    <span>{t}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
