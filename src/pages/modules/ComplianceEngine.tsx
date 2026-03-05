import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import MetricsPanel from "../../components/MetricsPanel";
import { fetchComplianceMetrics, COMPLIANCE_DEMO_DATA } from "../../services/complianceApi";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };
const FW_COLORS = ["#34d399", "#00f0ff", "#a78bfa", "#fbbf24"];
const statusStyle: Record<string, string> = { violation: "text-rose-400 bg-rose-400/10", warning: "text-amber-400 bg-amber-400/10", compliant: "text-emerald-400 bg-emerald-400/10" };

export default function ComplianceEngine() {
    const [connected, setConnected] = useState<boolean | null>(null);
    const data = COMPLIANCE_DEMO_DATA;
    useEffect(() => { fetchComplianceMetrics().then((r) => setConnected(r !== null)); }, []);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 p-[1px]"><div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg></div></div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Compliance & Policy Engine</h1>
                        <p className="text-xs text-slate-500">Automated compliance monitoring and policy enforcement</p>
                    </div>
                </div>
                {connected === false && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 glass p-4 border border-amber-400/15 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg></div>
                        <div><p className="text-sm text-amber-400 font-medium">Service not connected</p><p className="text-xs text-slate-500">Configure API endpoint in environment variables.</p></div>
                    </motion.div>
                )}
            </motion.div>

            {/* Compliance Score Banner */}
            <motion.div {...fadeIn} className="glass p-8 border border-emerald-400/10 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 to-teal-500" />
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32 shrink-0">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                            <circle cx="60" cy="60" r="50" fill="none" stroke="#131c33" strokeWidth="8" />
                            <motion.circle cx="60" cy="60" r="50" fill="none" stroke="url(#cGrad)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${data.metrics.overallScore * 3.14} 314`} initial={{ strokeDasharray: "0 314" }} whileInView={{ strokeDasharray: `${data.metrics.overallScore * 3.14} 314` }} viewport={{ once: true }} transition={{ duration: 1.5, ease: "easeOut" }} />
                            <defs><linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#34d399" /><stop offset="100%" stopColor="#00f0ff" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center"><div className="text-center"><p className="text-2xl font-bold text-emerald-400">{data.metrics.overallScore}%</p><p className="text-[9px] text-slate-600 uppercase tracking-wider">Score</p></div></div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                        <h3 className="text-lg font-bold text-white mb-2">Overall Compliance Score</h3>
                        <p className="text-sm text-slate-400 mb-4">Aggregated across all active frameworks</p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            {data.frameworkScores.map((fw, i) => (
                                <div key={fw.framework} className="glass-sm px-3 py-1.5 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: FW_COLORS[i] }} />
                                    <span className="text-[11px] text-slate-400">{fw.framework}</span>
                                    <span className="text-[11px] font-bold text-white">{fw.score}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div {...fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsPanel label="Score" value={data.metrics.overallScore} suffix="%" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" trend="up" trendValue="+1.3%" />
                <MetricsPanel label="Active Policies" value={data.metrics.policiesActive} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>} color="cyan" />
                <MetricsPanel label="Violations" value={data.metrics.violations} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>} color="rose" />
                <MetricsPanel label="Frameworks" value={data.metrics.frameworks} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" /></svg>} color="purple" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Framework Scores</h3>
                    <p className="text-xs text-slate-600 mb-4">Compliance by framework</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.frameworkScores} layout="vertical"><XAxis type="number" domain={[0, 100]} stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis type="category" dataKey="framework" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} width={80} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Bar dataKey="score" radius={[0, 6, 6, 0]}>{data.frameworkScores.map((_e, i) => <Cell key={i} fill={FW_COLORS[i]} />)}</Bar></BarChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Score Trend</h3>
                    <p className="text-xs text-slate-600 mb-4">6-month trajectory</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={data.complianceTrend}><XAxis dataKey="month" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis domain={[70, 100]} stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Line type="monotone" dataKey="score" stroke="#34d399" strokeWidth={2} dot={{ fill: "#34d399", r: 4 }} /></LineChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div {...fadeIn} className="glass p-6">
                <h3 className="text-sm font-semibold text-white mb-0.5">Policy Status</h3>
                <p className="text-xs text-slate-600 mb-4">Recent compliance events</p>
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/5"><th className="pb-3 pr-4">Policy</th><th className="pb-3 pr-4">Framework</th><th className="pb-3 pr-4">Status</th><th className="pb-3">Last Check</th></tr></thead><tbody className="divide-y divide-white/[0.03]">{data.alerts.map((a) => (<tr key={a.id} className="hover:bg-white/[0.01]"><td className="py-3 pr-4 text-[13px] text-white">{a.policy}</td><td className="py-3 pr-4 text-[13px] text-slate-400 font-mono">{a.framework}</td><td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${statusStyle[a.status]}`}>{a.status}</span></td><td className="py-3 text-[13px] text-slate-600">{a.time}</td></tr>))}</tbody></table></div>
            </motion.div>
        </div>
    );
}
