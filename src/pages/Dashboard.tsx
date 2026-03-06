import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import MetricsPanel from "../components/MetricsPanel";
import HealthMonitor from "../components/HealthMonitor";
import LoadingSkeleton from "../components/LoadingSkeleton";

const SPEAR_PHISHING_URL = "https://spear-phishing-dashboard.onrender.com/";

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
const COLORS = ["#00f0ff", "#131c33"];

const modules = [
    { name: "Spear Phishing", status: "online" as const, gradient: "#00f0ff", metrics: "23 campaigns active", external: SPEAR_PHISHING_URL },
    { name: "Behaviour Engine", status: "online" as const, path: "/modules/behaviour-engine", gradient: "#a78bfa", metrics: "247 users monitored" },
    { name: "Device Monitoring", status: "online" as const, path: "/modules/device-monitoring", gradient: "#fbbf24", metrics: "312 devices tracked" },
    { name: "Compliance Engine", status: "online" as const, path: "/modules/compliance-engine", gradient: "#34d399", metrics: "87.3% compliance" },
];

const activity = [
    { time: "2m", event: "Phishing email clicked by user@corp.com", module: "Spear Phishing", severity: "high" },
    { time: "8m", event: "Ransomware C2 communication blocked", module: "Behaviour Engine", severity: "critical" },
    { time: "15m", event: "Device compliance scan complete", module: "Device Monitoring", severity: "info" },
    { time: "32m", event: "Password policy violation detected", module: "Compliance", severity: "medium" },
    { time: "1h", event: "Training triggered for 3 high-risk users", module: "Spear Phishing", severity: "info" },
    { time: "2h", event: "Anomalous file access pattern detected", module: "Behaviour Engine", severity: "medium" },
];

const sevColors: Record<string, { text: string; bg: string }> = {
    critical: { text: "#f43f5e", bg: "rgba(244,63,94,0.1)" },
    high: { text: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    medium: { text: "#a78bfa", bg: "rgba(167,139,250,0.1)" },
    info: { text: "#00f0ff", bg: "rgba(0,240,255,0.1)" },
};

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate initial data fetch
        const timer = setTimeout(() => setLoading(false), 800);
        return () => clearTimeout(timer);
    }, []);

    if (loading) return <LoadingSkeleton type="full" />;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 4 }}>
                    Admin Dashboard
                </h1>
                <p style={{ fontSize: 14, color: "#475569" }}>
                    Aggregated security metrics across all connected modules
                </p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div {...fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                <MetricsPanel label="Employees Monitored" value={247} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} trend="up" trendValue="+12%" color="cyan" />
                <MetricsPanel label="High Risk Users" value={12} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>} trend="down" trendValue="-3" color="rose" />
                <MetricsPanel label="Active Threats" value={7} icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} trend="down" trendValue="-2" color="amber" />
                <MetricsPanel label="Compliance" value={87} suffix="%" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} trend="up" trendValue="+4.2%" color="emerald" />
                <MetricsPanel label="System Health" value="Online" icon={<svg viewBox="0 0 24 24" style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
            </motion.div>

            {/* Health Monitor */}
            <HealthMonitor />

            {/* Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Threat Activity</h3>
                    <p style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Threats detected vs blocked — last 6 months</p>
                    <ResponsiveContainer width="100%" height={240}>
                        <AreaChart data={threatTrend}>
                            <defs>
                                <linearGradient id="dbThreat" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} /><stop offset="95%" stopColor="#f43f5e" stopOpacity={0} /></linearGradient>
                                <linearGradient id="dbBlocked" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#00f0ff" stopOpacity={0.25} /><stop offset="95%" stopColor="#00f0ff" stopOpacity={0} /></linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} />
                            <Area type="monotone" dataKey="blocked" stroke="#00f0ff" fill="url(#dbBlocked)" strokeWidth={2} />
                            <Area type="monotone" dataKey="threats" stroke="#f43f5e" fill="url(#dbThreat)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </motion.div>

                <motion.div {...fadeIn} className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", marginBottom: 12 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Compliance</h3>
                        <p style={{ fontSize: 12, color: "#475569" }}>Overall posture</p>
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
                                <p style={{ fontSize: 28, fontWeight: 800, color: "#00f0ff" }}>87%</p>
                                <p style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", color: "#475569" }}>Score</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Module Status */}
            <motion.div {...fadeIn}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 16 }}>Connected Modules</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                    {modules.map((mod, i) => {
                        const inner = (
                            <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden", cursor: "pointer" }}>
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: mod.gradient, opacity: 0.4 }} />
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{mod.name}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399" }} className="animate-pulse" />
                                        <span style={{ fontSize: 10, color: "#34d399" }}>Connected</span>
                                    </div>
                                </div>
                                <p style={{ fontSize: 12, color: "#64748b" }}>{mod.metrics}</p>
                            </div>
                        );

                        if (mod.external) {
                            return (
                                <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                    <a href={mod.external} target="_blank" rel="noopener noreferrer" style={{ display: "block" }}>
                                        {inner}
                                    </a>
                                </motion.div>
                            );
                        }

                        return (
                            <motion.div key={i} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                                <Link to={mod.path!} style={{ display: "block" }}>
                                    {inner}
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div {...fadeIn} className="glass-card" style={{ padding: 28 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Recent Activity</h3>
                <p style={{ fontSize: 12, color: "#475569", marginBottom: 20 }}>Cross-module event stream</p>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {activity.map((item, i) => {
                        const sev = sevColors[item.severity];
                        return (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: 16,
                                padding: "12px 8px",
                                borderBottom: i < activity.length - 1 ? "1px solid rgba(255,255,255,0.03)" : "none",
                                transition: "background 0.15s",
                            }} className="hover:bg-white/[0.01]">
                                <span style={{ fontSize: 11, color: "#475569", fontFamily: "monospace", width: 32, textAlign: "right", flexShrink: 0 }}>{item.time}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 13, color: "#cbd5e1", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.event}</p>
                                    <p style={{ fontSize: 11, color: "#475569" }}>{item.module}</p>
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
        </div>
    );
}
