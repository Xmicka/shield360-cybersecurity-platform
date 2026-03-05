import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import MetricsPanel from "../../components/MetricsPanel";
import { fetchDeviceMetrics, DEVICE_DEMO_DATA } from "../../services/deviceApi";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };
const sevStyle: Record<string, string> = { critical: "text-rose-400 bg-rose-400/10", high: "text-amber-400 bg-amber-400/10", medium: "text-purple-400 bg-purple-400/10", low: "text-cyan-400 bg-cyan-400/10" };

export default function DeviceMonitoring() {
    const [connected, setConnected] = useState<boolean | null>(null);
    const data = DEVICE_DEMO_DATA;
    useEffect(() => { fetchDeviceMetrics().then((r) => setConnected(r !== null)); }, []);

    return (
        <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-[1px]"><div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" /></svg></div></div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Device Behaviour Monitoring</h1>
                        <p className="text-xs text-slate-500">Real-time device inventory and anomaly detection</p>
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
                <MetricsPanel label="Total Devices" value={data.metrics.totalDevices} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7" /></svg>} color="amber" />
                <MetricsPanel label="Active" value={data.metrics.activeDevices} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} color="emerald" />
                <MetricsPanel label="Compromised" value={data.metrics.compromisedDevices} icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>} color="rose" />
                <MetricsPanel label="Patch Compliance" value={data.metrics.patchCompliance} suffix="%" icon={<svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622" /></svg>} color="cyan" />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Device Inventory</h3>
                    <p className="text-xs text-slate-600 mb-4">Breakdown by category</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={data.deviceTypes} layout="vertical"><XAxis type="number" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis type="category" dataKey="name" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} width={90} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Bar dataKey="healthy" fill="#fbbf24" radius={[0, 4, 4, 0]} name="Healthy" /></BarChart>
                    </ResponsiveContainer>
                </motion.div>
                <motion.div {...fadeIn} className="glass p-6">
                    <h3 className="text-sm font-semibold text-white mb-0.5">Weekly Health</h3>
                    <p className="text-xs text-slate-600 mb-4">Device health over the past week</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={data.healthTimeline}><defs><linearGradient id="devH" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#fbbf24" stopOpacity={0.25} /><stop offset="95%" stopColor="#fbbf24" stopOpacity={0} /></linearGradient></defs><XAxis dataKey="day" stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><YAxis stroke="#1e2d4a" tick={{ fill: "#475569", fontSize: 11 }} /><Tooltip contentStyle={{ background: "#0c1222", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, color: "#e2e8f0", fontSize: 12 }} /><Legend wrapperStyle={{ color: "#475569", fontSize: 11 }} /><Area type="monotone" dataKey="healthy" stroke="#fbbf24" fill="url(#devH)" strokeWidth={2} /><Area type="monotone" dataKey="issues" stroke="#f43f5e" fill="transparent" strokeWidth={2} strokeDasharray="5 5" /></AreaChart>
                    </ResponsiveContainer>
                </motion.div>
            </div>

            <motion.div {...fadeIn} className="glass p-6">
                <h3 className="text-sm font-semibold text-white mb-0.5">Device Alerts</h3>
                <p className="text-xs text-slate-600 mb-4">Recent anomalies</p>
                <div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-[10px] text-slate-600 uppercase tracking-wider border-b border-white/5"><th className="pb-3 pr-4">Device</th><th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4">Severity</th><th className="pb-3">Time</th></tr></thead><tbody className="divide-y divide-white/[0.03]">{data.alerts.map((a) => (<tr key={a.id} className="hover:bg-white/[0.01]"><td className="py-3 pr-4 text-[13px] text-white font-mono">{a.device}</td><td className="py-3 pr-4 text-[13px] text-slate-400">{a.type}</td><td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${sevStyle[a.severity]}`}>{a.severity}</span></td><td className="py-3 text-[13px] text-slate-600">{a.time}</td></tr>))}</tbody></table></div>
            </motion.div>
        </div>
    );
}
