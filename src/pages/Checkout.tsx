import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams, Navigate } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";
import { MODULES, getPlanById } from "../config/services";
import type { PlanType } from "../config/services";
import { logActivity } from "../services/firestoreService";

/**
 * Checkout is currently a free-plan activation flow + a "contact sales"
 * funnel for paid tiers. Real payment processing (Stripe) is intentionally
 * NOT wired here — server-side webhook is the only place that should mutate
 * a user's plan in production.
 */
export default function Checkout() {
    const [searchParams] = useSearchParams();
    const rawPlan = searchParams.get("plan") || "professional";
    const targetPlan = getPlanById(rawPlan as PlanType);

    const { setPlan, plan: currentPlan } = useSubscription();
    const { user } = useAuth();

    // Invalid plan id → bounce to pricing
    if (!targetPlan) return <Navigate to="/pricing" replace />;

    const alreadyOnPlan = currentPlan === targetPlan.id;
    const isFree = targetPlan.price === 0;
    const isEnterprise = targetPlan.id === "enterprise";

    const [step, setStep] = useState<"confirm" | "processing" | "success">(alreadyOnPlan ? "success" : "confirm");

    const handleActivateFree = () => {
        setStep("processing");
        setTimeout(() => {
            setPlan(targetPlan.id);
            setStep("success");
            if (user) {
                logActivity({
                    userId: user.uid,
                    userEmail: user.email || "",
                    event: `Activated ${targetPlan.name} plan`,
                    module: "platform",
                    severity: "info",
                }).catch(() => {});
            }
        }, 800);
    };

    /* ─── Success ─── */
    if (step === "success") {
        const modulesUnlocked = Object.keys(targetPlan.moduleLimits).length;
        return (
            <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-bg-base)" }}>
                <motion.div initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{
                    padding: 48, maxWidth: 460, textAlign: "center",
                }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15, type: "spring" }} style={{
                        width: 72, height: 72, borderRadius: "50%",
                        background: "rgba(143,191,150,0.16)",
                        border: "1px solid rgba(143,191,150,0.32)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 22px",
                    }}>
                        <svg viewBox="0 0 24 24" style={{ width: 34, height: 34, color: "var(--color-brand-sage)" }} fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </motion.div>
                    <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 3.5vw, 32px)", fontWeight: 400, color: "var(--color-text-primary)", marginBottom: 10, letterSpacing: "-0.02em" }}>
                        You&apos;re on <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>{targetPlan.name}</span>
                    </h2>
                    <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
                        {modulesUnlocked} security {modulesUnlocked === 1 ? "module is" : "modules are"} now available from your dashboard.
                    </p>
                    <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px" }}>
                        Go to dashboard
                        <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </motion.div>
            </div>
        );
    }

    /* ─── Processing (only used for free-plan activation) ─── */
    if (step === "processing") {
        return (
            <div className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-bg-base)" }}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
                    <div style={{ width: 56, height: 56, margin: "0 auto 22px", borderRadius: "50%", border: "3px solid var(--color-border)", borderTopColor: "var(--color-brand-lavender-dark)" }} className="animate-spin" />
                    <h2 style={{ fontSize: 18, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 6 }}>Activating {targetPlan.name}…</h2>
                    <p style={{ fontSize: 13, color: "var(--color-text-muted)" }}>Setting up your dashboard.</p>
                </motion.div>
            </div>
        );
    }

    /* ─── Confirm step ─── */
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: "var(--color-bg-base)" }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{
                width: "100%", maxWidth: 580, padding: 40, position: "relative", overflow: "hidden",
            }}>
                <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, #B8A1E6 0%, #6BA3BE 50%, #8FBF96 100%)" }} />

                <Link to="/pricing" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--color-text-muted)", marginBottom: 24 }} className="hover:text-black">
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to pricing
                </Link>

                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-brand-lavender-dark)", marginBottom: 12 }}>
                    {isFree ? "Activate" : isEnterprise ? "Talk to sales" : "Upgrade"}
                </p>
                <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 36px)", fontWeight: 400, color: "var(--color-text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
                    {isFree ? "Start with " : "Move up to "}
                    <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>{targetPlan.name}</span>
                </h1>
                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
                    {targetPlan.description}
                </p>

                {/* Pricing summary */}
                <div style={{
                    padding: "18px 22px", borderRadius: 16, marginBottom: 22,
                    background: "rgba(0,0,0,0.025)", border: "1px solid var(--color-border)",
                }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Shield360 {targetPlan.name}</span>
                        <div>
                            <span style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                                {isFree ? "Free" : `$${targetPlan.price}`}
                            </span>
                            {!isFree && <span style={{ fontSize: 14, color: "var(--color-text-muted)" }}>/{targetPlan.period}</span>}
                        </div>
                    </div>
                </div>

                {/* What you unlock */}
                <div style={{ marginBottom: 26 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-text-muted)", marginBottom: 12 }}>
                        What you&apos;ll unlock
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {MODULES.map((mod) => {
                            const limit = targetPlan.moduleLimits[mod.slug];
                            const included = limit !== undefined;
                            if (!included) return null;
                            return (
                                <div key={mod.slug} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "11px 14px", borderRadius: 12,
                                    background: "rgba(0,0,0,0.025)",
                                    border: "1px solid var(--color-border)",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: mod.color, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                    </svg>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }}>{mod.name}</p>
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
                                        color: limit === -1 ? "var(--color-brand-sage)" : "var(--color-text-primary)",
                                        background: limit === -1 ? "rgba(143,191,150,0.16)" : "rgba(0,0,0,0.05)",
                                        padding: "3px 10px", borderRadius: 100,
                                    }}>
                                        {limit === -1 ? "Unlimited" : `${limit}/mo`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA — splits by tier */}
                {isFree ? (
                    <button
                        onClick={handleActivateFree}
                        className="btn-primary"
                        style={{ width: "100%", padding: "14px 0", fontSize: 14, fontWeight: 600 }}
                    >
                        Activate {targetPlan.name}
                    </button>
                ) : (
                    <>
                        <Link
                            to={`/contact?subject=${encodeURIComponent(`Upgrade to ${targetPlan.name} (${rawPlan})`)}`}
                            className="btn-primary"
                            style={{ width: "100%", padding: "14px 0", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                        >
                            Contact sales to upgrade
                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <p style={{ fontSize: 12, color: "var(--color-text-muted)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                            Self-serve checkout is rolling out soon. In the meantime our team will activate your plan within one business day.
                        </p>
                    </>
                )}

            </motion.div>
        </div>
    );
}
