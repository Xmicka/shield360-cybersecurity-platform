import { motion } from "framer-motion";
import { useState } from "react";
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
const COLORS = ["#22d3ee", "#0f1629"];

const activity = [
    { time: "2m", event: "Phishing email clicked by user@corp.com", module: "Spear Phishing", severity: "high" },
    { time: "8m", event: "Ransomware C2 communication blocked", module: "Endpoint Scanner", severity: "critical" },
    { time: "15m", event: "Shadow IT application detected", module: "Shadow IT", severity: "info" },
    { time: "32m", event: "Password policy violation detected", module: "Compliance", severity: "medium" },
    { time: "1h", event: "Training triggered for 3 high-risk users", module: "Spear Phishing", severity: "info" },
    { time: "2h", event: "Anomalous file access pattern detected", module: "Endpoint Scanner", severity: "medium" },
];

const sevColors: Record<string, { text: string; bg: string }> = {
    critical: { text: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
    high: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    medium: { text: "#a855f7", bg: "rgba(168,85,247,0.1)" },
    info: { text: "#22d3ee", bg: "rgba(34,211,238,0.1)" },
};

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function Dashboard() {
    const { plan, setPlan, hasAccess, canUse, recordUsage, getRemainingUses, getModuleLimit, getModuleUsage } = useSubscription();
    const { user } = useAuth();
    const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; moduleName: string; deployedUrl: string; isUsageLimited?: boolean; usageInfo?: { used: number; limit: number } }>({
        open: false,
        moduleName: "",
        deployedUrl: "",
    });

    const handleModuleClick = async (slug: string, name: string, deployedUrl: string) => {
        if (canUse(slug)) {
            await recordUsage(slug);
            window.open(deployedUrl, "_blank", "noopener,noreferrer");
            // Log the launch to Firestore
            if (user) {
                logModuleLaunch({
                    userId: user.uid,
                    userEmail: user.email || "",
                    moduleSlug: slug,
                    moduleName: name,
                }).catch(() => {});
                logActivity({
                    userId: user.uid,
                    userEmail: user.email || "",
                    event: `Launched ${name}`,
                    module: name,
                    severity: "info",
                }).catch(() => {});
            }
        } else if (hasAccess(slug)) {
            // Has access but usage limit reached
            const limit = getModuleLimit(slug);
            const used = getModuleUsage(slug);
            setUpgradeModal({ open: true, moduleName: name, deployedUrl, isUsageLimited: true, usageInfo: { used, limit } });
        } else {
            setUpgradeModal({ open: true, moduleName: name, deployedUrl });
        }
    };

    const handleUpgrade = () => {
        // Demo: instantly upgrade to the next tier and open the module
        const nextPlan = getNextPlan(plan);
        setPlan(nextPlan);
        if (upgradeModal.deployedUrl) {
            window.open(upgradeModal.deployedUrl, "_blank", "noopener,noreferrer");
        }
        setUpgradeModal((prev) => ({ ...prev, open: false }));
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em", marginBottom: 4 }}>
                    Security Dashboard
                </h1>
                <p style={{ fontSize: 14, color: "#64748b" }}>
                    Aggregated security metrics across all connected modules
                </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div {...fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                <MetricsPanel label="Endpoints Scanned" value={312} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg>} trend="up" trendValue="+18" color="cyan" />
                <MetricsPanel label="Shadow IT Apps" value={47} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" /></svg>} trend="down" trendValue="-5" color="purple" />
                <MetricsPanel label="Active Threats" value={7} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} trend="down" trendValue="-2" color="amber" />
                <MetricsPanel label="Compliance" value={87} suffix="%" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} trend="up" trendValue="+4.2%" color="emerald" />
                <MetricsPanel label="System Health" value="Online" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
            </motion.div>

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Threat Activity</h3>
                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Threats detected vs blocked, last 6 months</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={threatTrend}>
                            <defs>
                                <linearGradient id="dbThreat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                                <linearGradient id="dbBlocked" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} /><stop offset="95%" stopColor="#22d3ee" stopOpacity={0} /></linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="rgba(148,163,184,0.08)" tick={{ fill: "#64748b", fontSize: 11 }} />
                            <YAxis stroke="rgba(148,163,184,0.08)" tick={{ fill: "#64748b", fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#0f1629", border: "1px solid rgba(148,163,184,0.08)", borderRadius: 14, color: "#f1f5f9", fontSize: 12 }} />
                            <Area type="monotone" dataKey="blocked" stroke="#22d3ee" fill="url(#dbBlocked)" strokeWidth={2} />
                            <Area type="monotone" dataKey="threats" stroke="#f43f5e" fill="url(#dbThreat)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", marginBottom: 12 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Compliance</h3>
                        <p style={{ fontSize: 12, color: "#64748b" }}>Overall posture</p>
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
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#22d3ee" }}>87%</p>
                                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748b" }}>Score</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Connected Modules */}
            <motion.div {...fadeIn}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>Connected Modules</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {MODULES.map((mod, i) => {
                        const accessible = hasAccess(mod.slug);
                        const usable = canUse(mod.slug);
                        const locked = !accessible;
                        const remaining = getRemainingUses(mod.slug);
                        const limit = getModuleLimit(mod.slug);
                        const isUnlimited = limit === -1;
                        const usageLimited = accessible && !usable;

                        return (
                            <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                <button
                                    onClick={() => handleModuleClick(mod.slug, mod.name, mod.deployedUrl)}
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
                                    <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
                                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: mod.color, opacity: accessible ? 0.4 : 0.15 }} />
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: accessible ? "#f1f5f9" : "#475569" }}>{mod.shortName}</span>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                {locked ? (
                                                    <>
                                                        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#a855f7" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                        </svg>
                                                        <span style={{ fontSize: 10, color: "#a855f7" }}>Upgrade</span>
                                                    </>
                                                ) : usageLimited ? (
                                                    <>
                                                        <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#fbbf24" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        <span style={{ fontSize: 10, color: "#fbbf24" }}>Limit reached</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                                                        <span style={{ fontSize: 10, color: "#34d399" }}>Connected</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 12, color: "#64748b" }}>
                                            {locked
                                                ? "Upgrade to access"
                                                : isUnlimited
                                                    ? mod.tag
                                                    : `${remaining}/${limit} uses left this month`
                                            }
                                        </p>
                                    </div>
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>Recent Activity</h3>
                <p style={{ fontSize: 12, color: "#64748b", marginBottom: 20 }}>Cross-module event stream</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {activity.map((item, i) => {
                        const sev = sevColors[item.severity];
                        return (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "12px 8px",
                                borderBottom: i < activity.length - 1 ? "1px solid rgba(148,163,184,0.04)" : "none",
                                transition: "background 0.15s",
                            }} className="hover:bg-white/[0.01]">
                                <span style={{ fontSize: 11, color: "#64748b", fontFamily: "monospace", width: 32, textAlign: "right", flexShrink: 0 }}>{item.time}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.event}</p>
                                    <p style={{ fontSize: 11, color: "#64748b" }}>{item.module}</p>
                                </div>
                                <span style={{
                                    fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                                    color: sev.text, background: sev.bg,
                                    padding: "3px 8px", borderRadius: 6, flexShrink: 0,
                                }}>
                                    {item.severity}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Upgrade Modal */}
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
