import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import MetricsPanel from "../components/MetricsPanel";
import { MODULES, getNextPlan } from "../config/services";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";
import UpgradeModal from "../components/UpgradeModal";
import { logModuleLaunch, logActivity } from "../services/firestoreService";

const threatTrend = [
    { name: "Jan", threats: 42, blocked: 380 },
    { name: "Feb", threats: 38, blocked: 420 },
    { name: "Mar", threats: 55, blocked: 350 },
    { name: "Apr", threats: 31, blocked: 490 },
    { name: "May", threats: 48, blocked: 410 },
    { name: "Jun", threats: 25, blocked: 520 },
];

const complianceData = [
    { name: "Compliant", value: 87 },
    { name: "Non-Compliant", value: 13 },
];
const COLORS = ["#7dba9c", "#e9e6e1"];

const activity = [
    { time: "2m", event: "Phishing email clicked by user@corp.com", module: "Spear Phishing", severity: "high" },
    { time: "8m", event: "Ransomware C2 communication blocked", module: "Endpoint Scanner", severity: "critical" },
    { time: "15m", event: "Shadow IT application detected", module: "Shadow IT", severity: "info" },
    { time: "32m", event: "Password policy violation detected", module: "Compliance", severity: "medium" },
    { time: "1h", event: "Training triggered for 3 high-risk users", module: "Spear Phishing", severity: "info" },
    { time: "2h", event: "Anomalous file access pattern detected", module: "Endpoint Scanner", severity: "medium" },
];

const sevColors: Record<string, { text: string; bg: string }> = {
    critical: { text: "#c97070", bg: "rgba(201,112,112,0.12)" },
    high: { text: "#d4a56a", bg: "rgba(212,165,106,0.14)" },
    medium: { text: "#b8a9c9", bg: "rgba(184,169,201,0.14)" },
    info: { text: "#6ba3be", bg: "rgba(107,163,190,0.12)" },
};

const fadeIn = {
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

export default function Dashboard() {
    const { plan, setPlan, hasAccess, canUse, recordUsage, getModuleLimit, getModuleUsage } = useSubscription();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleName: string; deployedUrl: string; isUsageLimited?: boolean; usageInfo?: { used: number; limit: number } }>({
        open: false,
        moduleName: "",
        deployedUrl: "",
    });

    const handleModuleClick = async (slug: string, name: string, deployedUrl: string, internalRoute: string) => {
        if (canUse(slug)) {
            await recordUsage(slug);
            navigate(internalRoute);
            if (user) {
                logModuleLaunch({
                    userId: user.uid,
                    userEmail: user.email || "",
                    moduleSlug: slug,
                    moduleName: name,
                }).catch(() => { });
                logActivity({
                    userId: user.uid,
                    userEmail: user.email || "",
                    event: `Launched ${name}`,
                    module: name,
                    severity: "info",
                }).catch(() => { });
            }
        } else if (hasAccess(slug)) {
            const limit = getModuleLimit(slug);
            const used = getModuleUsage(slug);
            setUpgradeModal({ open: true, moduleName: name, deployedUrl, isUsageLimited: true, usageInfo: { used, limit } });
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

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28, paddingTop: 8 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10, flexWrap: "wrap" }}>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.1 }}>
                        Welcome back{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}
                    </h1>
                    <span className="pill" style={{
                        background: plan === "enterprise"
                            ? "var(--color-bg-dark)"
                            : plan === "professional"
                            ? "var(--color-brand-lavender)"
                            : "var(--color-brand-sage)",
                        color: plan === "enterprise" ? "var(--color-text-on-dark)" : "var(--color-text-primary)",
                        fontSize: 11, padding: "5px 14px",
                    }}>
                        {plan === "free" ? "Free Trial" : plan === "professional" ? "Professional" : "Enterprise"}
                    </span>
                </div>
                <p style={{ fontSize: 15, color: "var(--color-text-secondary)" }}>
                    Aggregated security metrics across all connected modules
                </p>

                {plan === "free" && (
                    <div style={{
                        marginTop: 18,
                        background: "linear-gradient(135deg, rgba(212,197,240,0.4) 0%, rgba(232,213,245,0.5) 100%)",
                        border: "1px solid rgba(184,161,230,0.3)",
                        borderRadius: 16,
                        padding: "16px 20px",
                        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-brand-lavender-dark)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#fff" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                                </svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>Unlock all 4 security modules</p>
                                <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Upgrade to Professional for full coverage at $99/mo</p>
                            </div>
                        </div>
                        <button onClick={() => navigate("/pricing")} className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }}>
                            Upgrade →
                        </button>
                    </div>
                )}
            </motion.div>

            {/* Key Metrics */}
            <motion.div {...fadeIn} className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
                <MetricsPanel label="Endpoints Scanned" value={312} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>} trend="up" trendValue="+18" color="cyan" />
                <MetricsPanel label="Shadow IT Apps" value={47} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>} trend="down" trendValue="-5" color="purple" />
                <MetricsPanel label="Active Threats" value={7} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} trend="down" trendValue="-2" color="amber" />
                <MetricsPanel label="Compliance" value={87} suffix="%" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} trend="up" trendValue="+4.2%" color="emerald" />
                <MetricsPanel label="System Health" value="Online" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.6}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-5">
                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 2 }}>Threat Activity</h3>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20 }}>Threats detected vs blocked, last 6 months</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={threatTrend}>
                            <defs>
                                <linearGradient id="dbThreat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c97070" stopOpacity={0.35} /><stop offset="95%" stopColor="#c97070" stopOpacity={0} /></linearGradient>
                                <linearGradient id="dbBlocked" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#6ba3be" stopOpacity={0.35} /><stop offset="95%" stopColor="#6ba3be" stopOpacity={0} /></linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="rgba(0,0,0,0.06)" tick={{ fill: "#9b9b9b", fontSize: 11 }} />
                            <YAxis stroke="rgba(0,0,0,0.06)" tick={{ fill: "#9b9b9b", fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 12, color: "#2c2c2c", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                            <Area type="monotone" dataKey="blocked" stroke="#6ba3be" fill="url(#dbBlocked)" strokeWidth={2} />
                            <Area type="monotone" dataKey="threats" stroke="#c97070" fill="url(#dbThreat)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column" }}>
                    <div style={{ width: "100%", marginBottom: 12 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 2 }}>Compliance</h3>
                        <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>Overall posture</p>
                    </div>
                    <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
                        <ResponsiveContainer width={180} height={180}>
                            <PieChart>
                                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                    {complianceData.map((_e, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: 28, fontWeight: 700, color: "var(--color-status-ok)" }}>87%</p>
                                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-text-muted)" }}>Score</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Connected Modules */}
            <motion.div {...fadeIn}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 16 }}>Connected Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {MODULES.map((mod, i) => {
                        const accessible = hasAccess(mod.slug);
                        const usable = canUse(mod.slug);
                        const locked = !accessible;
                        const limit = getModuleLimit(mod.slug);
                        const isUnlimited = limit === -1;
                        const usageLimited = accessible && !usable;
                        const used = getModuleUsage(mod.slug);

                        return (
                            <motion.div key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.04 }}
                            >
                                <button
                                    onClick={() => handleModuleClick(mod.slug, mod.name, mod.deployedUrl, mod.internalRoute)}
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        textAlign: "left",
                                        cursor: "pointer",
                                        background: "none",
                                        border: "none",
                                        padding: 0,
                                    }}
                                >
                                    <div className="glass-card" style={{ padding: 24, position: "relative", overflow: "hidden", minHeight: 200 }}>
                                        {/* Top accent */}
                                        <div style={{
                                            position: "absolute", top: 0, left: 0, right: 0, height: 3,
                                            background: mod.color,
                                            opacity: accessible ? 0.7 : 0.2,
                                            borderRadius: "20px 20px 0 0",
                                        }} />

                                        {/* Icon + status */}
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                                            <div style={{
                                                width: 44, height: 44, borderRadius: 12,
                                                background: `${mod.color}15`,
                                                border: `1px solid ${mod.color}30`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                color: mod.color,
                                            }}>
                                                <svg viewBox="0 0 24 24" style={{ width: 22, height: 22 }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
                                                </svg>
                                            </div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                {locked ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 100, background: "rgba(184,169,201,0.14)" }}>
                                                        <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, color: "var(--color-brand-lavender)" }} fill="none" stroke="currentColor" strokeWidth={1.8}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                        </svg>
                                                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-brand-lavender)" }}>Upgrade</span>
                                                    </div>
                                                ) : usageLimited ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 100, background: "rgba(212,165,106,0.14)" }}>
                                                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-status-warn)" }}>Limit reached</span>
                                                    </div>
                                                ) : (
                                                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 100, background: "rgba(125,186,156,0.14)" }}>
                                                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                                                        <span style={{ fontSize: 10, fontWeight: 600, color: "var(--color-status-ok)" }}>Active</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6, letterSpacing: "-0.01em" }}>
                                            {mod.shortName}
                                        </h3>
                                        <p style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: 14 }}>
                                            {mod.description.length > 90 ? mod.description.slice(0, 88) + "…" : mod.description}
                                        </p>

                                        {/* Usage bar */}
                                        {accessible && !isUnlimited && (
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ height: 4, background: "rgba(0,0,0,0.06)", borderRadius: 100, overflow: "hidden" }}>
                                                    <div style={{
                                                        height: "100%",
                                                        width: `${Math.min(100, (used / limit) * 100)}%`,
                                                        background: usageLimited ? "var(--color-status-warn)" : mod.color,
                                                        borderRadius: 100,
                                                        transition: "width 0.4s ease",
                                                    }} />
                                                </div>
                                                <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginTop: 4 }}>
                                                    {used}/{limit} uses this month
                                                </p>
                                            </div>
                                        )}
                                        {accessible && isUnlimited && (
                                            <p style={{ fontSize: 11, color: "var(--color-text-muted)", marginBottom: 12 }}>
                                                Unlimited usage
                                            </p>
                                        )}

                                        {/* CTA */}
                                        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: locked ? "var(--color-text-muted)" : mod.color }}>
                                            <span>{locked ? "Upgrade to unlock" : usageLimited ? "Upgrade for more" : `Open ${mod.shortName}`}</span>
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                            </svg>
                                        </div>

                                        {/* tier pill in corner */}
                                        <span style={{
                                            position: "absolute", bottom: 16, right: 20,
                                            fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
                                            color: mod.tier === "free" ? "var(--color-brand-sage)" : "var(--color-brand-lavender)",
                                            background: mod.tier === "free" ? "rgba(138,171,150,0.12)" : "rgba(184,169,201,0.14)",
                                            padding: "2px 8px", borderRadius: 6,
                                        }}>
                                            {mod.tier === "free" ? "Free" : "Pro"}
                                        </span>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 2 }}>Recent Activity</h3>
                <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginBottom: 20 }}>Cross-module event stream</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {activity.map((item, i) => {
                        const sev = sevColors[item.severity];
                        return (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "12px 8px",
                                borderBottom: i < activity.length - 1 ? "1px solid var(--color-border)" : "none",
                                transition: "background 0.15s",
                                borderRadius: 6,
                            }} className="hover:bg-black/[0.02]">
                                <span style={{ fontSize: 11, color: "var(--color-text-muted)", fontFamily: "monospace", width: 32, textAlign: "right", flexShrink: 0 }}>{item.time}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.event}</p>
                                    <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{item.module}</p>
                                </div>
                                <span style={{
                                    fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                                    color: sev.text, background: sev.bg,
                                    padding: "3px 8px", borderRadius: 100, flexShrink: 0,
                                }}>
                                    {item.severity}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            <UpgradeModal
                isOpen={upgradeModal.open}
                onClose={() => setUpgradeModal((prev) => ({ ...prev, open: false }))}
                moduleName={upgradeModal.moduleName}
                onUpgrade={handleUpgrade}
                isUsageLimited={upgradeModal.isUsageLimited}
                usageInfo={upgradeModal.usageInfo}
            />
        </div>
    );
}
