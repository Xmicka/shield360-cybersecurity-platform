import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSubscription } from "../context/subscriptionContext";
import { MODULES, getNextPlan } from "../config/services";
import UpgradeModal from "./UpgradeModal";

interface NavItem {
    slug: string;
    name: string;
    shortName: string;
    icon: string;
    color: string;
    internalRoute: string;
    deployedUrl: string;
    locked?: boolean;
    isActive?: boolean;
}

export default function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, setPlan, hasAccess, canUse, role, getRemainingUses, getModuleLimit } = useSubscription();
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleName: string; deployedUrl: string; isUsageLimited?: boolean; usageInfo?: { used: number; limit: number } }>({
        open: false,
        moduleName: "",
        deployedUrl: "",
    });

    const handleModuleClick = (slug: string, name: string, deployedUrl: string, internalRoute: string) => {
        if (canUse(slug)) {
            navigate(internalRoute);
        } else if (hasAccess(slug)) {
            const limit = getModuleLimit(slug);
            const remaining = getRemainingUses(slug);
            setUpgradeModal({ open: true, moduleName: name, deployedUrl, isUsageLimited: true, usageInfo: { used: limit - remaining, limit } });
        } else {
            setUpgradeModal({ open: true, moduleName: name, deployedUrl });
        }
    };

    const handleUpgrade = () => {
        const nextPlan = getNextPlan(plan);
        setPlan(nextPlan);
        if (upgradeModal.deployedUrl) {
            const mod = MODULES.find(m => m.deployedUrl === upgradeModal.deployedUrl);
            if (mod) navigate(mod.internalRoute);
        }
        setUpgradeModal((prev) => ({ ...prev, open: false }));
    };

    const renderItem = (mod: NavItem, isLink: boolean) => {
        const isActive = mod.isActive ?? location.pathname === mod.internalRoute;
        const locked = mod.locked ?? false;
        const baseStyle: React.CSSProperties = {
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 500,
            color: locked ? "var(--color-text-muted)" : isActive ? "var(--color-brand-blue)" : "var(--color-text-secondary)",
            background: isActive ? "rgba(107,163,190,0.10)" : "transparent",
            border: "1px solid transparent",
            transition: "background 0.2s ease, color 0.2s ease",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
            position: "relative",
        };
        const inner = (
            <>
                {isActive && (
                    <div
                        style={{
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            width: 3,
                            height: 20,
                            borderRadius: "0 4px 4px 0",
                            background: mod.color,
                        }}
                    />
                )}
                <div
                    style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: locked ? "rgba(0,0,0,0.04)" : `${mod.color}18`,
                        border: `1px solid ${locked ? "var(--color-border)" : mod.color + "30"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: locked ? "var(--color-text-muted)" : mod.color }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                    </svg>
                </div>
                <span style={{ flex: 1 }}>{mod.shortName}</span>
                {locked ? (
                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "var(--color-text-muted)" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: isActive ? mod.color : "var(--color-text-muted)" }} fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                )}
            </>
        );

        if (isLink) {
            return (
                <Link key={mod.slug} to={mod.internalRoute} style={baseStyle} className="hover:bg-black/[0.03]">
                    {inner}
                </Link>
            );
        }
        return (
            <button
                key={mod.slug}
                onClick={() => handleModuleClick(mod.slug, mod.name, mod.deployedUrl, mod.internalRoute)}
                style={baseStyle}
                className="hover:bg-black/[0.03]"
            >
                {inner}
            </button>
        );
    };

    const sectionLabel: React.CSSProperties = {
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "var(--color-text-muted)",
        padding: "0 14px",
        marginBottom: 10,
    };

    return (
        <>
            <motion.aside
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="hidden lg:flex"
                style={{
                    position: "fixed",
                    left: 0,
                    top: "var(--navbar-height, 64px)",
                    bottom: 0,
                    width: "var(--sidebar-width, 248px)",
                    flexDirection: "column",
                    zIndex: 40,
                    background: "rgba(250,249,247,0.95)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRight: "1px solid var(--color-border)",
                }}
            >
                <div style={{ flex: 1, padding: "24px 12px", overflowY: "auto" }}>
                    {/* Overview */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={sectionLabel}>Overview</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <Link
                                to="/dashboard"
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "10px 14px",
                                    borderRadius: 12,
                                    fontSize: 13,
                                    fontWeight: 500,
                                    color: location.pathname === "/dashboard" ? "var(--color-brand-blue)" : "var(--color-text-secondary)",
                                    background: location.pathname === "/dashboard" ? "rgba(107,163,190,0.10)" : "transparent",
                                    position: "relative",
                                }}
                                className="hover:bg-black/[0.03]"
                            >
                                {location.pathname === "/dashboard" && (
                                    <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: "0 4px 4px 0", background: "var(--color-brand-blue)" }} />
                                )}
                                <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(107,163,190,0.10)", border: "1px solid rgba(107,163,190,0.20)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "var(--color-brand-blue)" }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                                    </svg>
                                </div>
                                <span style={{ flex: 1 }}>Dashboard</span>
                            </Link>

                            {role === "admin" && (
                                <Link
                                    to="/admin"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "10px 14px",
                                        borderRadius: 12,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: location.pathname === "/admin" ? "var(--color-brand-lavender)" : "var(--color-text-secondary)",
                                        background: location.pathname === "/admin" ? "rgba(184,169,201,0.12)" : "transparent",
                                        position: "relative",
                                    }}
                                    className="hover:bg-black/[0.03]"
                                >
                                    {location.pathname === "/admin" && (
                                        <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 20, borderRadius: "0 4px 4px 0", background: "var(--color-brand-lavender)" }} />
                                    )}
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(184,169,201,0.12)", border: "1px solid rgba(184,169,201,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "var(--color-brand-lavender)" }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                                        </svg>
                                    </div>
                                    <span style={{ flex: 1 }}>Admin Panel</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Free */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={sectionLabel}>Free Modules</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {MODULES.filter((m) => m.tier === "free").map((mod) =>
                                renderItem(
                                    {
                                        slug: mod.slug,
                                        name: mod.name,
                                        shortName: mod.shortName,
                                        icon: mod.icon,
                                        color: mod.color,
                                        internalRoute: mod.internalRoute,
                                        deployedUrl: mod.deployedUrl,
                                        isActive: location.pathname === mod.internalRoute || location.pathname.startsWith(mod.internalRoute + "/"),
                                    },
                                    false
                                )
                            )}
                        </div>
                    </div>

                    {/* Premium */}
                    <div style={{ marginBottom: 28 }}>
                        <p style={sectionLabel}>Premium Modules</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {MODULES.filter((m) => m.tier === "professional").map((mod) =>
                                renderItem(
                                    {
                                        slug: mod.slug,
                                        name: mod.name,
                                        shortName: mod.shortName,
                                        icon: mod.icon,
                                        color: mod.color,
                                        internalRoute: mod.internalRoute,
                                        deployedUrl: mod.deployedUrl,
                                        locked: !hasAccess(mod.slug),
                                        isActive: location.pathname === mod.internalRoute,
                                    },
                                    false
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div style={{ padding: 12, borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 8 }}>
                    {plan !== "free" ? (
                        <div
                            style={{
                                padding: 14,
                                borderRadius: 14,
                                textAlign: "center",
                                background: "rgba(107,163,190,0.06)",
                                border: "1px solid rgba(107,163,190,0.18)",
                            }}
                        >
                            <p style={{ fontSize: 10, color: "var(--color-text-muted)", marginBottom: 2, textTransform: "uppercase", letterSpacing: "0.15em" }}>Current Plan</p>
                            <p style={{ fontSize: 14, fontWeight: 700, color: plan === "enterprise" ? "var(--color-brand-lavender)" : "var(--color-brand-blue)", textTransform: "capitalize" }}>{plan}</p>
                        </div>
                    ) : (
                        <Link
                            to="/pricing"
                            style={{
                                display: "block",
                                padding: 14,
                                borderRadius: 14,
                                textAlign: "center",
                                background: "linear-gradient(135deg, rgba(107,163,190,0.10), rgba(184,169,201,0.10))",
                                border: "1px solid rgba(107,163,190,0.20)",
                                cursor: "pointer",
                            }}
                            className="hover:shadow-md"
                        >
                            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--color-brand-blue)" }}>Upgrade Plan</p>
                            <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 2 }}>From $50/mo</p>
                        </Link>
                    )}
                    <div
                        style={{
                            padding: "8px 14px",
                            borderRadius: 10,
                            textAlign: "center",
                            background: "rgba(0,0,0,0.02)",
                            border: "1px solid var(--color-border)",
                        }}
                    >
                        <span style={{ fontSize: 10, color: "var(--color-text-muted)" }}>Shield360 </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-brand-blue)" }}>v1.0</span>
                    </div>
                </div>
            </motion.aside>

            <UpgradeModal
                isOpen={upgradeModal.open}
                onClose={() => setUpgradeModal((prev) => ({ ...prev, open: false }))}
                moduleName={upgradeModal.moduleName}
                onUpgrade={handleUpgrade}
                isUsageLimited={upgradeModal.isUsageLimited}
                usageInfo={upgradeModal.usageInfo}
            />
        </>
    );
}
