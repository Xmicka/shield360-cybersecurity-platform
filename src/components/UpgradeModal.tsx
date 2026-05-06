import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleName: string;
    onUpgrade: () => void;
    /** If true, user has access but hit usage limit */
    isUsageLimited?: boolean;
    usageInfo?: { used: number; limit: number };
}

export default function UpgradeModal({ isOpen, onClose, moduleName, onUpgrade, isUsageLimited, usageInfo }: UpgradeModalProps) {
    // Close on Escape (a11y)
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    const accent = isUsageLimited ? "var(--color-brand-sage)" : "var(--color-brand-lavender-dark)";
    const accentSoft = isUsageLimited ? "rgba(143,191,150,0.14)" : "rgba(155,130,204,0.14)";
    const accentBorder = isUsageLimited ? "rgba(143,191,150,0.30)" : "rgba(155,130,204,0.32)";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100]"
                        style={{ background: "rgba(40, 32, 60, 0.32)", backdropFilter: "blur(14px) saturate(1.2)", WebkitBackdropFilter: "blur(14px) saturate(1.2)" }}
                    />

                    {/* Modal */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="upgrade-modal-title"
                        initial={{ opacity: 0, scale: 0.96, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 12 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
                    >
                        <div
                            className="relative overflow-hidden"
                            style={{
                                background: "var(--color-bg-cream-light, #FAF6EE)",
                                border: "1px solid var(--color-border)",
                                borderRadius: 24,
                                padding: "36px 32px 28px",
                                boxShadow: "0 24px 60px rgba(60, 40, 90, 0.18), 0 6px 20px rgba(0,0,0,0.06)",
                            }}
                        >
                            {/* Soft gradient accent at top */}
                            <div
                                aria-hidden
                                style={{
                                    position: "absolute", top: 0, left: 0, right: 0, height: 3,
                                    background: "linear-gradient(90deg, #B8A1E6 0%, #6BA3BE 50%, #8FBF96 100%)",
                                }}
                            />
                            {/* Floating soft blob */}
                            <div
                                aria-hidden
                                style={{
                                    position: "absolute", top: -80, right: -40, width: 220, height: 220,
                                    background: accentSoft, borderRadius: "50%", filter: "blur(60px)",
                                }}
                            />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                style={{
                                    position: "absolute", top: 14, right: 14,
                                    width: 32, height: 32, borderRadius: 10,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    background: "transparent", border: "1px solid transparent",
                                    color: "var(--color-text-muted)", cursor: "pointer",
                                    transition: "all 0.18s ease",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(0,0,0,0.04)";
                                    e.currentTarget.style.color = "var(--color-text-primary)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "transparent";
                                    e.currentTarget.style.color = "var(--color-text-muted)";
                                }}
                            >
                                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="relative" style={{ zIndex: 1, textAlign: "center" }}>
                                {/* Eyebrow */}
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: accent, marginBottom: 18 }}>
                                    {isUsageLimited ? "Limit Reached" : "Upgrade"}
                                </p>

                                {/* Icon */}
                                <div
                                    aria-hidden
                                    style={{
                                        width: 64, height: 64, borderRadius: 18,
                                        margin: "0 auto 22px",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        background: accentSoft,
                                        border: `1px solid ${accentBorder}`,
                                    }}
                                >
                                    {isUsageLimited ? (
                                        <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, color: accent }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, color: accent }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                        </svg>
                                    )}
                                </div>

                                {/* Headline */}
                                <h2
                                    id="upgrade-modal-title"
                                    style={{
                                        fontFamily: "var(--font-display)",
                                        fontSize: "clamp(26px, 3.5vw, 32px)",
                                        fontWeight: 400,
                                        lineHeight: 1.15,
                                        letterSpacing: "-0.02em",
                                        color: "var(--color-text-primary)",
                                        marginBottom: 12,
                                    }}
                                >
                                    {isUsageLimited ? (
                                        <>Monthly limit <span style={{ fontStyle: "italic", color: accent }}>reached</span></>
                                    ) : (
                                        <>Unlock <span style={{ fontStyle: "italic", color: accent }}>{moduleName}</span></>
                                    )}
                                </h2>

                                {/* Body */}
                                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: 22, maxWidth: 360, marginLeft: "auto", marginRight: "auto" }}>
                                    {isUsageLimited ? (
                                        <>
                                            You&apos;ve used{" "}
                                            <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>
                                                {usageInfo ? `${usageInfo.used} of ${usageInfo.limit}` : "all"}
                                            </span>{" "}
                                            of your monthly runs for{" "}
                                            <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{moduleName}</span>.
                                            Upgrade for higher limits or unlimited access.
                                        </>
                                    ) : (
                                        <>
                                            <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>{moduleName}</span> is part of a higher tier.
                                            Upgrade to <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Shield360 Professional</span> or above to continue.
                                        </>
                                    )}
                                </p>

                                {/* Benefits */}
                                <ul style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 26, textAlign: "left", maxWidth: 320, marginLeft: "auto", marginRight: "auto" }}>
                                    {[
                                        "Full access to all 4 security modules",
                                        "Higher monthly usage limits",
                                        "Advanced AI-driven analytics",
                                        "Priority support & SLA guarantee",
                                    ].map((feat) => (
                                        <li key={feat} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--color-text-secondary)" }}>
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: accent, marginTop: 3, flexShrink: 0 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span>{feat}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Buttons */}
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        onClick={onClose}
                                        className="btn-ghost"
                                        style={{ flex: 1, padding: "12px 0", fontSize: 14 }}
                                    >
                                        Maybe later
                                    </button>
                                    <button
                                        onClick={onUpgrade}
                                        className="btn-primary"
                                        style={{ flex: 1, padding: "12px 0", fontSize: 14, fontWeight: 600 }}
                                    >
                                        Upgrade now
                                    </button>
                                </div>

                                <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 16, letterSpacing: "0.02em" }}>
                                    Demo mode — instant activation, no payment required.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
