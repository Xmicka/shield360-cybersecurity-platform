import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";
import { PREMIUM_MODULES } from "../config/services";

export default function Checkout() {
    const { setPlan, plan } = useSubscription();
    const [step, setStep] = useState<"confirm" | "processing" | "success">(plan === "premium" ? "success" : "confirm");

    const handleUpgrade = () => {
        setStep("processing");
        setTimeout(() => {
            setPlan("premium");
            setStep("success");
        }, 1500);
    };

    if (step === "success") {
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
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>You're on Premium!</h2>
                    <p style={{ fontSize: 14, color: "#64748b", marginBottom: 8 }}>
                        All <span style={{ color: "#a855f7", fontWeight: 600 }}>4 security modules</span> are unlocked.
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
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>Activating Premium</h2>
                    <p style={{ fontSize: 13, color: "#64748b" }}>Unlocking all security modules...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{
                width: "100%", maxWidth: 520,
                background: "rgba(10,14,26,0.6)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(148,163,184,0.06)", borderRadius: 24,
                padding: 40, position: "relative", overflow: "hidden",
            }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #22d3ee, #a855f7)" }} />

                <Link to="/pricing" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b", marginBottom: 28 }} className="hover:text-cyan-400">
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                    Back to pricing
                </Link>

                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Upgrade to Premium</h2>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 28 }}>Unlock all 4 security modules — completely free for this demo.</p>

                {/* What you get */}
                <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", color: "#475569", marginBottom: 12 }}>
                        Premium unlocks
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {PREMIUM_MODULES.map((mod) => (
                            <div key={mod.slug} style={{
                                display: "flex", alignItems: "center", gap: 12,
                                padding: "12px 16px", borderRadius: 14,
                                background: "rgba(148,163,184,0.03)",
                                border: "1px solid rgba(148,163,184,0.06)",
                            }}>
                                <span style={{ fontSize: 16 }}>{mod.icon}</span>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>{mod.name}</p>
                                    <p style={{ fontSize: 11, color: "#64748b" }}>{mod.tag}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleUpgrade}
                    className="btn-primary"
                    style={{ width: "100%", padding: "16px 0", fontSize: 15, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 16 }}
                >
                    <svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" /></svg>
                    Activate Premium — Free
                </button>

                <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 16 }}>
                    No payment required — this is a demo platform. Click to instantly unlock.
                </p>
            </motion.div>
        </div>
    );
}
