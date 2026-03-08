import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSubscription } from "../context/subscriptionContext";
import { MODULES } from "../config/services";
import UpgradeModal from "./UpgradeModal";

export default function Sidebar() {
    const location = useLocation();
    const { plan, hasAccess, role, setPlan } = useSubscription();
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleName: string; deployedUrl: string }>({
        open: false,
        moduleName: "",
        deployedUrl: "",
    });

    const handleModuleClick = (slug: string, name: string, deployedUrl: string) => {
        if (hasAccess(slug)) {
            // Open the deployed URL in a new tab
            window.open(deployedUrl, "_blank", "noopener,noreferrer");
        } else {
            // Show upgrade modal
            setUpgradeModal({ open: true, moduleName: name, deployedUrl });
        }
    };

    const handleUpgrade = () => {
        setPlan("premium");
        setUpgradeModal((prev) => ({ ...prev, open: false }));
        // After upgrading, open the module
        if (upgradeModal.deployedUrl) {
            window.open(upgradeModal.deployedUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <>
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col z-40"
                style={{
                    background: "linear-gradient(180deg, rgba(5,8,16,0.97) 0%, rgba(10,14,26,0.99) 100%)",
                    borderRight: "1px solid rgba(148,163,184,0.08)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                }}
            >
                <div style={{ flex: 1, padding: "24px 12px", overflowY: "auto" }}>
                    {/* Overview Section */}
                    <div style={{ marginBottom: 28 }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "#334155",
                                padding: "0 14px",
                                marginBottom: 10,
                            }}
                        >
                            Overview
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {/* Dashboard */}
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
                                    color: location.pathname === "/dashboard" ? "#fff" : "#64748b",
                                    background: location.pathname === "/dashboard" ? "rgba(255,255,255,0.04)" : "transparent",
                                    border: location.pathname === "/dashboard" ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                                    transition: "all 0.2s ease",
                                    position: "relative",
                                }}
                                className="hover:text-slate-300"
                            >
                                {location.pathname === "/dashboard" && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            width: 3,
                                            height: 20,
                                            borderRadius: "0 4px 4px 0",
                                            background: "#94a3b8",
                                        }}
                                    />
                                )}
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: "rgba(148,163,184,0.08)",
                                        border: "1px solid rgba(148,163,184,0.12)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#94a3b8" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                                        />
                                    </svg>
                                </div>
                                <span style={{ flex: 1 }}>Dashboard</span>
                            </Link>

                            {/* Admin Panel (only for admins) */}
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
                                        color: location.pathname === "/admin" ? "#fff" : "#64748b",
                                        background: location.pathname === "/admin" ? "rgba(255,255,255,0.04)" : "transparent",
                                        border: location.pathname === "/admin" ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                                        transition: "all 0.2s ease",
                                        position: "relative",
                                    }}
                                    className="hover:text-slate-300"
                                >
                                    {location.pathname === "/admin" && (
                                        <div
                                            style={{
                                                position: "absolute",
                                                left: 0,
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                width: 3,
                                                height: 20,
                                                borderRadius: "0 4px 4px 0",
                                                background: "#a855f7",
                                            }}
                                        />
                                    )}
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: "rgba(168,85,247,0.08)",
                                            border: "1px solid rgba(168,85,247,0.12)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#a855f7" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                                            />
                                        </svg>
                                    </div>
                                    <span style={{ flex: 1 }}>Admin Panel</span>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Free Modules */}
                    <div style={{ marginBottom: 28 }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "#334155",
                                padding: "0 14px",
                                marginBottom: 10,
                            }}
                        >
                            Free Modules
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {MODULES.filter((m) => m.tier === "free").map((mod) => (
                                <button
                                    key={mod.slug}
                                    onClick={() => handleModuleClick(mod.slug, mod.name, mod.deployedUrl)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "10px 14px",
                                        borderRadius: 12,
                                        fontSize: 13,
                                        fontWeight: 500,
                                        color: "#64748b",
                                        background: "transparent",
                                        border: "1px solid transparent",
                                        transition: "all 0.2s ease",
                                        cursor: "pointer",
                                        width: "100%",
                                        textAlign: "left",
                                    }}
                                    className="hover:text-slate-300 hover:bg-white/[0.02]"
                                >
                                    <div
                                        style={{
                                            width: 32,
                                            height: 32,
                                            borderRadius: 8,
                                            background: `${mod.color}10`,
                                            border: `1px solid ${mod.color}18`,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: mod.color }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                        </svg>
                                    </div>
                                    <span style={{ flex: 1 }}>{mod.shortName}</span>
                                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#475569" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                        />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Premium Modules */}
                    <div style={{ marginBottom: 28 }}>
                        <p
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.2em",
                                color: "#334155",
                                padding: "0 14px",
                                marginBottom: 10,
                            }}
                        >
                            Premium Modules
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {MODULES.filter((m) => m.tier === "premium").map((mod) => {
                                const locked = !hasAccess(mod.slug);
                                return (
                                    <button
                                        key={mod.slug}
                                        onClick={() => handleModuleClick(mod.slug, mod.name, mod.deployedUrl)}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            padding: "10px 14px",
                                            borderRadius: 12,
                                            fontSize: 13,
                                            fontWeight: 500,
                                            color: locked ? "#334155" : "#64748b",
                                            background: "transparent",
                                            border: "1px solid transparent",
                                            transition: "all 0.2s ease",
                                            cursor: "pointer",
                                            width: "100%",
                                            textAlign: "left",
                                        }}
                                        className="hover:text-slate-300 hover:bg-white/[0.02]"
                                    >
                                        <div
                                            style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: 8,
                                                background: locked ? "rgba(51,65,85,0.08)" : `${mod.color}10`,
                                                border: `1px solid ${locked ? "rgba(51,65,85,0.12)" : mod.color + "18"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                style={{ width: 16, height: 16, color: locked ? "#334155" : mod.color }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                            </svg>
                                        </div>
                                        <span style={{ flex: 1 }}>{mod.shortName}</span>
                                        {locked ? (
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#334155" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                                />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#475569" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                            </svg>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Bottom section */}
                <div style={{ padding: 12, borderTop: "1px solid rgba(148,163,184,0.08)", display: "flex", flexDirection: "column", gap: 8 }}>
                    {plan === "premium" ? (
                        <div
                            style={{
                                display: "block",
                                padding: 14,
                                borderRadius: 14,
                                textAlign: "center",
                                background: "rgba(10,15,30,0.6)",
                                border: "1px solid rgba(34,211,238,0.12)",
                            }}
                        >
                            <p style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Current Plan</p>
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#22d3ee" }}>Premium</p>
                        </div>
                    ) : (
                        <button
                            onClick={() => setPlan("premium")}
                            style={{
                                display: "block",
                                padding: 14,
                                borderRadius: 14,
                                textAlign: "center",
                                background: "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(168,85,247,0.06))",
                                border: "1px solid rgba(34,211,238,0.1)",
                                transition: "border-color 0.2s",
                                cursor: "pointer",
                                width: "100%",
                            }}
                            className="hover:border-cyan-400/20"
                        >
                            <p style={{ fontSize: 13, fontWeight: 700, color: "#22d3ee" }}>Upgrade to Premium</p>
                            <p style={{ fontSize: 11, color: "#475569" }}>Unlock all modules</p>
                        </button>
                    )}
                    <div
                        style={{
                            padding: "10px 14px",
                            borderRadius: 12,
                            textAlign: "center",
                            background: "rgba(10,15,30,0.4)",
                            border: "1px solid rgba(148,163,184,0.04)",
                        }}
                    >
                        <span style={{ fontSize: 10, color: "#334155" }}>Shield360 </span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#22d3ee" }}>v1.0.0-beta</span>
                    </div>
                </div>
            </motion.aside>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={upgradeModal.open}
                onClose={() => setUpgradeModal((prev) => ({ ...prev, open: false }))}
                moduleName={upgradeModal.moduleName}
                onUpgrade={handleUpgrade}
            />
        </>
    );
}
