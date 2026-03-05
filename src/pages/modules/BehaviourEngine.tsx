import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import MetricsPanel from "../../components/MetricsPanel";
import { fetchBehaviorMetrics, BEHAVIOR_DEMO_DATA } from "../../services/behaviorApi";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };
const RISK_COLORS = ["#a78bfa", "#7c3aed", "#fbbf24", "#f59e0b", "#f43f5e"];
const sevStyle: Record<string, string> = { critical: "text-rose-400 bg-rose-400/10", high: "text-amber-400 bg-amber-400/10", medium: "text-purple-400 bg-purple-400/10", low: "text-cyan-400 bg-cyan-400/10" };

export default function BehaviourEngine() {
    const [connected, setConnected] = useState<boolean | null>(null);
    const data = BEHAVIOR_DEMO_DATA;
    useEffect(() => { fetchBehaviorMetrics().then((r) => setConnected(r !== null)); }, []);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 p-[1px]"><div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg></div></div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Behaviour Intelligence Engine</h1>
                        <p className="text-xs text-slate-500">User behaviour analytics and insider threat detection</p>
                    </div>
                </div>
                {connected === false && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 glass p-4 border border-amber-400/15 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg></div>
                        <div><p className="text-sm text-amber-400 font-medium">Service not connected</p><p className="text-xs text-slate-500">Configure API endpoint in environment variables.</p></div>
                    </motion.div>
                )}
            </motion.div>

            <motion.div {...fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsPanel label="Users Monitored" value={data.metrics.totalUsersMonitored} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>} color="purple" />
                <MetricsPanel label="High Risk" value={data.metrics.highRiskUsers} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>} color="rose" trend="down" trendValue="-3" />
                <MetricsPanel label="Anomalies" value={data.metrics.anomaliesDetected} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>} color="amber" />
                <MetricsPanel label="Avg Risk Score" value={data.metrics.avgRiskScore} suffix="/100" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /></svg>} color="emerald" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Risk Distribution</h3>
                    <p className="text-xs text-slate-600 mb-4">User risk scores across the organization</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.riskDistribution}><XAxis dataKey="range" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Bar dataKey="count" radius={[6, 6, 0, 0]}>{data.riskDistribution.map((_e, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}</Bar></BarChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Anomaly Timeline</h3>
                    <p className="text-xs text-slate-600 mb-4">Anomalies detected over 24 hours</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data.timeline}><XAxis dataKey="hour" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Line type="monotone" dataKey="anomalies" stroke="#a78bfa" strokeWidth={2} dot={{ fill: "#a78bfa", r: 4 }} /></LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div {...fadeIn} className="glass p-6">
                <h3 className="text-sm font-semibold text-white mb-0.5">Behavioral Alerts</h3>
                <p className="text-xs text-slate-600 mb-4">Latest anomalous user activities</p>
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/5"><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Alert Type</th><th className="pb-3 pr-4">Severity</th><th className="pb-3">Time</th></tr></thead><tbody className="divide-y divide-white/[0.03]">{data.alerts.map((a) => (<tr key={a.id} className="hover:bg-white/[0.01]"><td className="py-3 pr-4 text-[13px] text-white font-mono">{a.user}</td><td className="py-3 pr-4 text-[13px] text-slate-400">{a.type}</td><td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sevStyle[a.severity]}`}>{a.severity}</span></td><td className="py-3 text-[13px] text-slate-600">{a.time}</td></tr>))}</tbody></table></div>
            </motion.div>
        </div>
    );
}
