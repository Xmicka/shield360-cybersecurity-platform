import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import MetricsPanel from "../../components/MetricsPanel";
import { fetchBehaviorMetrics, BEHAVIOR_DEMO_DATA } from "../../services/behaviorApi";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };
const RISK_COLORS = ["#00f0ff", "#00d4e0", "#fbbf24", "#f59e0b", "#f43f5e"];
const sevStyle: Record<string, string> = { critical: "text-rose-400 bg-rose-400/10", high: "text-amber-400 bg-amber-400/10", medium: "text-purple-400 bg-purple-400/10", low: "text-cyan-400 bg-cyan-400/10" };

export default function SpearPhishing() {
    const [connected, setConnected] = useState<boolean | null>(null);
    const data = BEHAVIOR_DEMO_DATA;

    useEffect(() => { fetchBehaviorMetrics().then((r) => setConnected(r !== null)); }, []);

    const phishingMetrics = { campaignsActive: 23, emailsSent: 1847, clickRate: 14.2, trainingTriggered: 38 };
    const campaignData = [
        { name: "Week 1", sent: 320, clicked: 52 },
        { name: "Week 2", sent: 415, clicked: 38 },
        { name: "Week 3", sent: 380, clicked: 45 },
        { name: "Week 4", sent: 290, clicked: 28 },
    ];

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 p-[1px]">
                        <div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Spear Phishing Simulation</h1>
                        <p className="text-xs text-slate-500">AI-driven adaptive phishing campaigns and micro-training</p>
                    </div>
                </div>
                {connected === false && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 glass p-4 border border-amber-400/15 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                            <svg viewBox="0 0 24 24" className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                        </div>
                        <div>
                            <p className="text-sm text-amber-400 font-medium">Service not connected</p>
                            <p className="text-xs text-slate-500">Configure the API endpoint in your environment variables to see live data.</p>
                        </div>
                    </motion.div>
                )}
            </motion.div>

            <motion.div {...fadeIn} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricsPanel label="Active Campaigns" value={phishingMetrics.campaignsActive} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>} color="cyan" />
                <MetricsPanel label="Emails Sent" value={phishingMetrics.emailsSent} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>} color="purple" trend="up" trendValue="+312" />
                <MetricsPanel label="Click Rate" value={phishingMetrics.clickRate} suffix="%" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" /></svg>} color="rose" trend="down" trendValue="-2.3%" />
                <MetricsPanel label="Training Triggered" value={phishingMetrics.trainingTriggered} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>} color="amber" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Campaign Performance</h3>
                    <p className="text-xs text-slate-600 mb-4">Emails sent vs clicked — last 4 weeks</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={campaignData}>
                            <XAxis dataKey="name" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} />
                            <Bar dataKey="sent" fill="#00f0ff" radius={[4, 4, 0, 0]} name="Sent" />
                            <Bar dataKey="clicked" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Clicked" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Risk Score Distribution</h3>
                    <p className="text-xs text-slate-600 mb-4">User risk scores across the organization</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.riskDistribution}>
                            <XAxis dataKey="range" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} />
                            <Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} />
                            <Bar dataKey="count" radius={[6, 6, 0, 0]}>{data.riskDistribution.map((_e, i) => <Cell key={i} fill={RISK_COLORS[i]} />)}</Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div {...fadeIn} className="glass p-6">
                <h3 className="text-sm font-semibold text-white mb-0.5">Recent Phishing Alerts</h3>
                <p className="text-xs text-slate-600 mb-4">Users who interacted with phishing emails</p>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead><tr className="text-left text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/5"><th className="pb-3 pr-4">User</th><th className="pb-3 pr-4">Event</th><th className="pb-3 pr-4">Severity</th><th className="pb-3">Time</th></tr></thead>
                        <tbody className="divide-y divide-white/[0.03]">
                            {data.alerts.map((a) => (
                                <tr key={a.id} className="hover:bg-white/[0.01] transition-colors">
                                    <td className="py-3 pr-4"><span className="text-[13px] text-white font-mono">{a.user}</span></td>
                                    <td className="py-3 pr-4"><span className="text-[13px] text-slate-400">{a.type}</span></td>
                                    <td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sevStyle[a.severity]}`}>{a.severity}</span></td>
                                    <td className="py-3"><span className="text-[13px] text-slate-600">{a.time}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}
