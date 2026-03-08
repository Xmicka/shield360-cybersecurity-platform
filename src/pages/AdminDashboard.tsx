import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";
import { MODULES } from "../config/services";
import type { ModuleConfig } from "../config/services";
import UpgradeModal from "../components/UpgradeModal";
import {
    getTotalUserCount,
    getTotalLaunchCount,
    getModuleLaunchStats,
    getRecentActivity,
    getRecentUsers,
    logActivity,
    logModuleLaunch,
} from "../services/firestoreService";
import type { ActivityLog, UserProfile } from "../services/firestoreService";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function AdminDashboard() {
    const { plan, setPlan, role, setRole, hasAccess, enabledModules, toggleModule } = useSubscription();
    const { user } = useAuth();
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleName: string; deployedUrl: string }>({
        open: false,
        moduleName: "",
        deployedUrl: "",
    });

    // Real Firestore stats
    const [totalUsers, setTotalUsers] = useState<number | null>(null);
    const [totalLaunches, setTotalLaunches] = useState<number | null>(null);
    const [launchStats, setLaunchStats] = useState<Record<string, number>>({});
    const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
    const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const [users, launches, modStats, activity, newUsers] = await Promise.all([
                    getTotalUserCount(),
                    getTotalLaunchCount(),
                    getModuleLaunchStats(),
                    getRecentActivity(10),
                    getRecentUsers(5),
                ]);
                if (!cancelled) {
                    setTotalUsers(users);
                    setTotalLaunches(launches);
                    setLaunchStats(modStats);
                    setRecentActivity(activity);
                    setRecentUsers(newUsers);
                }
            } catch {
                // Firestore not configured — use fallback values
            } finally {
                if (!cancelled) setStatsLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const handleModuleLaunch = (mod: ModuleConfig) => {
        if (hasAccess(mod.slug)) {
            window.open(mod.deployedUrl, "_blank", "noopener,noreferrer");
            if (user) {
                logModuleLaunch({
                    userId: user.uid,
                    userEmail: user.email || "",
                    moduleSlug: mod.slug,
                    moduleName: mod.name,
                }).catch(() => {});
                logActivity({
                    userId: user.uid,
                    userEmail: user.email || "",
                    event: `Admin launched ${mod.name}`,
                    module: mod.name,
                    severity: "info",
                }).catch(() => {});
            }
        } else {
            setUpgradeModal({ open: true, moduleName: mod.name, deployedUrl: mod.deployedUrl });
        }
    };

    const handleUpgrade = () => {
        setPlan("premium");
        setUpgradeModal((prev) => ({ ...prev, open: false }));
        if (upgradeModal.deployedUrl) {
            window.open(upgradeModal.deployedUrl, "_blank", "noopener,noreferrer");
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>
                    Admin Panel
                </h1>
                <p style={{ fontSize: 14, color: "#64748b" }}>
                    Manage modules, subscription tier, and platform settings
                </p>
            </motion.div>

            {/* Quick Controls */}
            <motion.div {...fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {/* Plan Switcher */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 12 }}>
                        Current Plan
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => setPlan("free")}
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                background: plan === "free" ? "rgba(34,211,238,0.1)" : "rgba(255,255,255,0.03)",
                                border: plan === "free" ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                color: plan === "free" ? "#22d3ee" : "#64748b",
                            }}
                        >
                            Free
                        </button>
                        <button
                            onClick={() => setPlan("premium")}
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                background: plan === "premium" ? "linear-gradient(135deg, rgba(34,211,238,0.15), rgba(168,85,247,0.15))" : "rgba(255,255,255,0.03)",
                                border: plan === "premium" ? "1px solid rgba(34,211,238,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                color: plan === "premium" ? "#22d3ee" : "#64748b",
                            }}
                        >
                            Premium
                        </button>
                    </div>
                </div>

                {/* Role Switcher */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 12 }}>
                        User Role
                    </p>
                    <div style={{ display: "flex", gap: 8 }}>
                        <button
                            onClick={() => setRole("admin")}
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                background: role === "admin" ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.03)",
                                border: role === "admin" ? "1px solid rgba(168,85,247,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                color: role === "admin" ? "#a855f7" : "#64748b",
                            }}
                        >
                            Admin
                        </button>
                        <button
                            onClick={() => setRole("user")}
                            style={{
                                flex: 1,
                                padding: "10px 16px",
                                borderRadius: 10,
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "all 0.2s",
                                background: role === "user" ? "rgba(59,130,246,0.1)" : "rgba(255,255,255,0.03)",
                                border: role === "user" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(255,255,255,0.06)",
                                color: role === "user" ? "#3b82f6" : "#64748b",
                            }}
                        >
                            User
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="glass-card" style={{ padding: 24 }}>
                    <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 12 }}>
                        Platform Status
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                            <span style={{ fontSize: 13, color: "#34d399", fontWeight: 600 }}>All Systems Online</span>
                        </div>
                    </div>
                    <p style={{ fontSize: 12, color: "#475569", marginTop: 8 }}>
                        {enabledModules.length} of {MODULES.length} modules enabled
                    </p>
                </div>
            </motion.div>

            {/* Module Management */}
            <motion.div {...fadeIn}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Module Management</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>
                    Enable/disable modules and launch their deployed dashboards
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {MODULES.map((mod) => {
                        const accessible = hasAccess(mod.slug);
                        const enabled = enabledModules.includes(mod.slug);
                        const locked = mod.tier === "premium" && plan !== "premium";

                        return (
                            <motion.div
                                key={mod.slug}
                                whileHover={{ y: -2 }}
                                className="glass-card"
                                style={{ padding: 24, position: "relative", overflow: "hidden" }}
                            >
                                {/* Top accent */}
                                <div
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: 2,
                                        background: `linear-gradient(90deg, ${mod.color}, transparent)`,
                                        opacity: accessible ? 0.6 : 0.2,
                                    }}
                                />

                                {/* Header */}
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                        <div
                                            style={{
                                                width: 44,
                                                height: 44,
                                                borderRadius: 12,
                                                background: accessible ? `${mod.color}12` : "rgba(51,65,85,0.1)",
                                                border: `1px solid ${accessible ? mod.color + "25" : "rgba(51,65,85,0.15)"}`,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                style={{ width: 22, height: 22, color: accessible ? mod.color : "#475569" }}
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>
                                                {mod.shortName}
                                            </h4>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <span
                                                    style={{
                                                        fontSize: 10,
                                                        fontWeight: 700,
                                                        textTransform: "uppercase",
                                                        letterSpacing: "0.05em",
                                                        padding: "2px 8px",
                                                        borderRadius: 6,
                                                        background: mod.tier === "free" ? "rgba(52,211,153,0.1)" : "rgba(168,85,247,0.1)",
                                                        color: mod.tier === "free" ? "#34d399" : "#a855f7",
                                                    }}
                                                >
                                                    {mod.tier}
                                                </span>
                                                {locked && (
                                                    <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#475569" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Toggle Switch */}
                                    <button
                                        onClick={() => toggleModule(mod.slug)}
                                        style={{
                                            width: 44,
                                            height: 24,
                                            borderRadius: 12,
                                            background: enabled ? "rgba(34,211,238,0.2)" : "rgba(51,65,85,0.3)",
                                            border: `1px solid ${enabled ? "rgba(34,211,238,0.3)" : "rgba(51,65,85,0.3)"}`,
                                            cursor: "pointer",
                                            position: "relative",
                                            transition: "all 0.2s",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 18,
                                                height: 18,
                                                borderRadius: "50%",
                                                background: enabled ? "#22d3ee" : "#475569",
                                                position: "absolute",
                                                top: 2,
                                                left: enabled ? 22 : 2,
                                                transition: "all 0.2s",
                                            }}
                                        />
                                    </button>
                                </div>

                                {/* Description */}
                                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, marginBottom: 16 }}>
                                    {mod.description}
                                </p>

                                {/* Feature pills */}
                                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
                                    {mod.features.map((f) => (
                                        <span
                                            key={f}
                                            style={{
                                                fontSize: 10,
                                                fontWeight: 600,
                                                color: accessible ? mod.color : "#475569",
                                                background: accessible ? `${mod.color}0a` : "rgba(51,65,85,0.1)",
                                                border: `1px solid ${accessible ? mod.color + "18" : "rgba(51,65,85,0.15)"}`,
                                                padding: "3px 10px",
                                                borderRadius: 6,
                                            }}
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>

                                {/* Launch / Upgrade Button */}
                                <button
                                    onClick={() => handleModuleLaunch(mod)}
                                    style={{
                                        width: "100%",
                                        padding: "10px 16px",
                                        borderRadius: 10,
                                        fontSize: 13,
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        background: accessible
                                            ? `linear-gradient(135deg, ${mod.color}15, ${mod.color}08)`
                                            : "linear-gradient(135deg, rgba(168,85,247,0.08), rgba(34,211,238,0.08))",
                                        border: `1px solid ${accessible ? mod.color + "25" : "rgba(168,85,247,0.15)"}`,
                                        color: accessible ? mod.color : "#a855f7",
                                    }}
                                >
                                    {accessible ? (
                                        <>
                                            Launch Dashboard
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                                                />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                                />
                                            </svg>
                                            Upgrade to Unlock
                                        </>
                                    )}
                                </button>

                                {/* Deployed URL info */}
                                <p style={{ fontSize: 10, color: "#334155", marginTop: 8, fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                    {mod.deployedUrl}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Tier Info */}
            <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>

                {/* Platform Analytics (Real Data from Firestore) */}
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>Platform Analytics</h3>
                <p style={{ fontSize: 13, color: "#64748b", marginBottom: 20 }}>Live data from Firestore</p>

                {statsLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
                        <div className="w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        {/* Stat Cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
                            <div style={{ padding: 20, borderRadius: 14, background: "rgba(34,211,238,0.04)", border: "1px solid rgba(34,211,238,0.1)" }}>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>
                                    Registered Users
                                </p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#22d3ee" }}>
                                    {totalUsers ?? 0}
                                </p>
                            </div>
                            <div style={{ padding: 20, borderRadius: 14, background: "rgba(168,85,247,0.04)", border: "1px solid rgba(168,85,247,0.1)" }}>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>
                                    Total Module Launches
                                </p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#a855f7" }}>
                                    {totalLaunches ?? 0}
                                </p>
                            </div>
                            <div style={{ padding: 20, borderRadius: 14, background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}>
                                <p style={{ fontSize: 10, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: 4 }}>
                                    Modules Enabled
                                </p>
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#34d399" }}>
                                    {enabledModules.length} / {MODULES.length}
                                </p>
                            </div>
                        </div>

                        {/* Per-module launch counts */}
                        <div style={{ marginBottom: 24 }}>
                            <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 12 }}>Module Launch Breakdown</p>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                                {MODULES.map((mod) => (
                                    <div key={mod.slug} style={{ padding: 14, borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                                        <p style={{ fontSize: 11, color: "#64748b", marginBottom: 4 }}>{mod.shortName}</p>
                                        <p style={{ fontSize: 20, fontWeight: 800, color: mod.color }}>{launchStats[mod.slug] ?? 0}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity Feed (from Firestore) */}
                        {recentActivity.length > 0 && (
                            <div style={{ marginBottom: 24 }}>
                                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 12 }}>Recent Activity</p>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    {recentActivity.map((act, i) => {
                                        const sevColors: Record<string, { text: string; bg: string }> = {
                                            critical: { text: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
                                            high: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
                                            medium: { text: "#a855f7", bg: "rgba(168,85,247,0.1)" },
                                            info: { text: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
                                        };
                                        const sev = sevColors[act.severity] || sevColors.info;
                                        return (
                                            <div key={i} style={{
                                                display: "flex", alignItems: "center", gap: 12,
                                                padding: "10px 8px",
                                                borderBottom: i < recentActivity.length - 1 ? "1px solid rgba(148,163,184,0.04)" : "none",
                                            }}>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ fontSize: 13, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{act.event}</p>
                                                    <p style={{ fontSize: 11, color: "#475569" }}>{act.userEmail} • {act.module}</p>
                                                </div>
                                                <span style={{
                                                    fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                                                    color: sev.text, background: sev.bg,
                                                    padding: "3px 8px", borderRadius: 6, flexShrink: 0,
                                                }}>
                                                    {act.severity}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Recent Users */}
                        {recentUsers.length > 0 && (
                            <div>
                                <p style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, marginBottom: 12 }}>Recently Registered Users</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {recentUsers.map((u, i) => (
                                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)" }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2))",
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                fontSize: 12, fontWeight: 700, color: "#f1f5f9",
                                            }}>
                                                {u.displayName?.charAt(0)?.toUpperCase() || "?"}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ fontSize: 13, color: "#f1f5f9", fontWeight: 600 }}>{u.displayName}</p>
                                                <p style={{ fontSize: 11, color: "#64748b" }}>{u.email} • {u.organization || "No org"}</p>
                                            </div>
                                            <span style={{
                                                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                                                padding: "2px 8px", borderRadius: 6,
                                                background: u.plan === "premium" ? "rgba(168,85,247,0.1)" : "rgba(34,211,238,0.1)",
                                                color: u.plan === "premium" ? "#a855f7" : "#22d3ee",
                                            }}>
                                                {u.plan}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </motion.div>

            {/* Subscription Tiers */}
            <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Subscription Tiers</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Compare what's included in each tier</p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    {/* Free Tier */}
                    <div
                        style={{
                            padding: 24,
                            borderRadius: 16,
                            background: plan === "free" ? "rgba(34,211,238,0.04)" : "rgba(255,255,255,0.02)",
                            border: plan === "free" ? "1px solid rgba(34,211,238,0.15)" : "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div>
                                <h4 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Free</h4>
                                <p style={{ fontSize: 12, color: "#64748b" }}>Essential security tools</p>
                            </div>
                            <span style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9" }}>
                                $0<span style={{ fontSize: 12, color: "#64748b" }}>/mo</span>
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {MODULES.filter((m) => m.tier === "free").map((m) => (
                                <div key={m.slug} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span style={{ color: "#94a3b8" }}>{m.shortName}</span>
                                </div>
                            ))}
                            {MODULES.filter((m) => m.tier === "premium").map((m) => (
                                <div key={m.slug} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#334155" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span style={{ color: "#334155" }}>{m.shortName}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Premium Tier */}
                    <div
                        style={{
                            padding: 24,
                            borderRadius: 16,
                            background: plan === "premium"
                                ? "linear-gradient(135deg, rgba(34,211,238,0.06), rgba(168,85,247,0.06))"
                                : "rgba(255,255,255,0.02)",
                            border: plan === "premium"
                                ? "1px solid rgba(34,211,238,0.2)"
                                : "1px solid rgba(255,255,255,0.06)",
                        }}
                    >
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                            <div>
                                <h4 style={{ fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Premium</h4>
                                <p style={{ fontSize: 12, color: "#64748b" }}>Complete security suite</p>
                            </div>
                            <span style={{ fontSize: 24, fontWeight: 800, color: "#22d3ee" }}>
                                Pro<span style={{ fontSize: 12, color: "#64748b" }}> tier</span>
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            {MODULES.map((m) => (
                                <div key={m.slug} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#34d399" }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                    <span style={{ color: "#94a3b8" }}>{m.shortName}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Upgrade Modal */}
            <UpgradeModal
                isOpen={upgradeModal.open}
                onClose={() => setUpgradeModal((prev) => ({ ...prev, open: false }))}
                moduleName={upgradeModal.moduleName}
                onUpgrade={handleUpgrade}
            />
        </div>
    );
}
