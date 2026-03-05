import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import MetricsPanel from "../components/MetricsPanel";

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
    { name: "Spear Phishing", status: "online" as const, path: "/modules/spear-phishing", gradient: "from-cyan-400 to-blue-500", metrics: "23 campaigns active" },
    { name: "Behaviour Engine", status: "online" as const, path: "/modules/behaviour-engine", gradient: "from-purple-400 to-pink-500", metrics: "247 users monitored" },
    { name: "Device Monitoring", status: "online" as const, path: "/modules/device-monitoring", gradient: "from-amber-400 to-orange-500", metrics: "312 devices tracked" },
    { name: "Compliance Engine", status: "online" as const, path: "/modules/compliance-engine", gradient: "from-emerald-400 to-teal-500", metrics: "87.3% compliance" },
];

const activity = [
    { time: "2m", event: "Phishing email clicked by user@corp.com", module: "Spear Phishing", severity: "high" },
    { time: "8m", event: "Ransomware C2 communication blocked", module: "Behaviour Engine", severity: "critical" },
    { time: "15m", event: "Device compliance scan complete", module: "Device Monitoring", severity: "info" },
    { time: "32m", event: "Password policy violation detected", module: "Compliance", severity: "medium" },
    { time: "1h", event: "Training triggered for 3 high-risk users", module: "Spear Phishing", severity: "info" },
    { time: "2h", event: "Anomalous file access pattern detected", module: "Behaviour Engine", severity: "medium" },
];

const severityStyle: Record<string, string> = {
    critical: "text-rose-400 bg-rose-400/10",
    high: "text-amber-400 bg-amber-400/10",
    medium: "text-purple-400 bg-purple-400/10",
    info: "text-cyan-400 bg-cyan-400/10",
};

const statusStyle: Record<string, { dot: string; label: string }> = {
    online: { dot: "bg-emerald-400", label: "Connected" },
    offline: { dot: "bg-slate-500", label: "Offline" },
};

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 },
};

export default function Dashboard() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
                <p className="text-sm text-slate-500">Aggregated security metrics across all connected modules</p>
            </motion.div>

            {/* Key Metrics */}
            <motion.div {...fadeIn} className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <MetricsPanel label="Employees Monitored" value={247} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} trend="up" trendValue="+12%" color="cyan" />
                <MetricsPanel label="High Risk Users" value={12} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>} trend="down" trendValue="-3" color="rose" />
                <MetricsPanel label="Active Threats" value={7} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} trend="down" trendValue="-2" color="amber" />
                <MetricsPanel label="Compliance" value={87} suffix="%" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>} trend="up" trendValue="+4.2%" color="emerald" />
                <MetricsPanel label="System Health" value="Online" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
            </motion.div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div {...fadeIn} className="lg:col-span-2 glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Threat Activity</h3>
                    <p className="text-xs text-slate-600 mb-4">Threats detected vs blocked — last 6 months</p>
                    <ResponsiveContainer width="100%" height={220}>
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

                <motion.div {...fadeIn} className="glass p-6 flex flex-col items-center">
                    <h3 className="text-sm font-semibold text-white mb-0.5 self-start">Compliance</h3>
                    <p className="text-xs text-slate-600 mb-4 self-start">Overall posture</p>
                    <div className="relative flex-1 flex items-center justify-center">
                        <ResponsiveContainer width={160} height={160}>
                            <PieChart>
                                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={55} outerRadius={72} paddingAngle={4} dataKey="value" strokeWidth={0}>
                                    {complianceData.map((_e, i) => <Cell key={i} fill={COLORS[i]} />)}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-cyan-400">87%</p>
                                <p className="text-[9px] text-slate-600 uppercase tracking-wider">Score</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Module Status */}
            <motion.div {...fadeIn}>
                <h3 className="text-sm font-semibold text-white mb-4">Connected Modules</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {modules.map((mod, i) => (
                        <motion.div key={i} whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                            <Link to={mod.path} className="block glass glass-hover p-5 relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.gradient} opacity-40 group-hover:opacity-100 transition-opacity`} />
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-semibold text-white">{mod.name}</span>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${statusStyle[mod.status].dot} animate-pulse`} />
                                        <span className="text-[10px] text-emerald-400">{statusStyle[mod.status].label}</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500">{mod.metrics}</p>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div {...fadeIn} className="glass p-6">
                <h3 className="text-sm font-semibold text-white mb-0.5">Recent Activity</h3>
                <p className="text-xs text-slate-600 mb-4">Cross-module event stream</p>
                <div className="divide-y divide-white/[0.04]">
                    {activity.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 py-3 hover:bg-white/[0.01] transition-colors rounded-lg px-2 -mx-2">
                            <span className="text-[11px] text-slate-600 font-mono w-8 shrink-0 text-right">{item.time}</span>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] text-slate-300 truncate">{item.event}</p>
                                <p className="text-[11px] text-slate-600">{item.module}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 ${severityStyle[item.severity]}`}>{item.severity}</span>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
