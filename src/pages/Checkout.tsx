import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";
import { PLANS, MODULES, getPlanById } from "../config/services";
import type { PlanType } from "../config/services";
import { logActivity } from "../services/firestoreService";

export default function Checkout() {
    const [searchParams] = useSearchParams();
    const targetPlanId = (searchParams.get("plan") || "professional") as PlanType;
    const targetPlan = getPlanById(targetPlanId) || PLANS[1]; // default to Professional

    const { setPlan, plan: currentPlan } = useSubscription();
    const { user } = useAuth();

    const alreadyOnPlan = currentPlan === targetPlan.id;
    const [step, setStep] = useState<"confirm" | "processing" | "success">(alreadyOnPlan ? "success" : "confirm");

    const handleUpgrade = () => {
        setStep("processing");
        setTimeout(() => {
            setPlan(targetPlan.id);
            setStep("success");
            // Log upgrade to Firestore
            if (user) {
                logActivity({
                    userId: user.uid,
                    userEmail: user.email || "",
                    event: `Upgraded to ${targetPlan.name}`,
                    module: "platform",
                    severity: "info",
                }).catch(() => {});
            }
        }, 1800);
    };

    if (step === "success") {
        const modulesUnlocked = Object.keys(targetPlan.moduleLimits).length;
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{
                    background: "rgba(10,14,26,0.6)", backdropFilter: "blur(20px)",
                    border: "1px solid rgba(148,163,184,0.06)", borderRadius: 24,
                    padding: 48, maxWidth: 440, textAlign: "center",
                }}>
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} style={{
                        width: 80, height: 80, borderRadius: "50%",
                        background: "rgba(52,211,153,0.1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 24px",
                    }}>
                        <svg viewBox="0 0 24 24" style={{ width: 40, height: 40, color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </motion.div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>
                        You're on {targetPlan.name}!
                    </h2>
                    <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                        <span style={{ color: targetPlan.color, fontWeight: 600 }}>{modulesUnlocked} security modules</span> are now available.
                    </p>
                    <p style={{ fontSize: 12, color: "#475569", marginBottom: 32 }}>Access everything from your dashboard — modules open in their deployed environments.</p>
                    <Link to="/dashboard" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                        Go to Dashboard
                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (step === "processing") {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center" }}>
                    <div style={{ position: "relative", width: 80, height: 80, margin: "0 auto 32px" }}>
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid rgba(34,211,238,0.2)" }} />
                        <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#22d3ee" }} className="animate-spin" />
                        <div style={{ position: "absolute", inset: 8, borderRadius: "50%", border: "2px solid transparent", borderTopColor: "#a855f7", animationDirection: "reverse", animationDuration: "1.5s" }} className="animate-spin" />
                    </div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Activating {targetPlan.name}</h2>
                    <p style={{ fontSize: 13, color: "#64748b" }}>Setting up your subscription...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
                width: "100%", maxWidth: 560,
                background: "rgba(10,14,26,0.6)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(148,163,184,0.06)", borderRadius: 24,
                padding: 40, position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #22d3ee, #a855f7)" }} />

                <Link to="/pricing" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", marginBottom: 28 }} className="hover:text-cyan-400">
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Back to pricing
                </Link>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>
                        Upgrade to {targetPlan.name}
                    </h2>
                    <div style={{
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                        color: targetPlan.color, background: `${targetPlan.color}15`,
                        padding: "4px 12px", borderRadius: 8,
                    }}>
                        {targetPlan.name}
                    </div>
                </div>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>{targetPlan.description}</p>

                {/* Pricing summary */}
                <div style={{
                    padding: "20px 24px", borderRadius: 16, marginBottom: 24,
                    background: "rgba(148,163,184,0.03)", border: "1px solid rgba(148,163,184,0.06)",
                }}>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 14, color: "#94a3b8" }}>Shield360 {targetPlan.name}</span>
                        <div>
                            <span style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9" }}>${targetPlan.price}</span>
                            <span style={{ fontSize: 13, color: "#64748b" }}>/{targetPlan.period}</span>
                        </div>
                    </div>
                    <div style={{ borderTop: "1px solid rgba(148,163,184,0.06)", paddingTop: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                            <span style={{ color: "#64748b" }}>Billed monthly</span>
                            <span style={{ color: "#f1f5f9", fontWeight: 600 }}>${targetPlan.price}/mo</span>
                        </div>
                    </div>
                </div>

                {/* What you unlock */}
                <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 12 }}>
                        What you'll unlock
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {MODULES.map((mod) => {
                            const limit = targetPlan.moduleLimits[mod.slug];
                            const included = limit !== undefined;
                            if (!included) return null;
                            return (
                                <div key={mod.slug} style={{
                                    display: "flex", alignItems: "center", gap: 12,
                                    padding: "12px 16px", borderRadius: 14,
                                    background: "rgba(148,163,184,0.03)",
                                    border: "1px solid rgba(148,163,184,0.06)",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, color: mod.color, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} /></svg>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{mod.name}</p>
                                        <p style={{ fontSize: 11, color: "#64748b" }}>{mod.tag}</p>
                                    </div>
                                    <span style={{
                                        fontSize: 10, fontWeight: 700,
                                        color: limit === -1 ? "#34d399" : targetPlan.color,
                                        background: limit === -1 ? "rgba(52,211,153,0.1)" : `${targetPlan.color}15`,
                                        padding: "3px 10px", borderRadius: 6,
                                    }}>
                                        {limit === -1 ? "Unlimited" : `${limit}/mo`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <button
                    onClick={handleUpgrade}
                    className="btn-primary"
                    style={{ width: "100%", padding: "16px 0", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16 }}
                >
                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                    Activate {targetPlan.name} — ${targetPlan.price}/mo
                </button>

                <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 16 }}>
                    Secure checkout · Cancel anytime · 30-day money-back guarantee
                </p>
            </motion.div>
        </div>
    );
}
