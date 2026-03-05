import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface ModuleCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    status: "online" | "offline" | "warning";
    metrics?: { label: string; value: string | number }[];
    to: string;
    gradient: string;
}

const statusColors = {
    online: { bg: "bg-emerald-400/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Online" },
    offline: { bg: "bg-slate-400/10", text: "text-slate-400", dot: "bg-slate-400", label: "Not Connected" },
    warning: { bg: "bg-amber-400/10", text: "text-amber-400", dot: "bg-amber-400", label: "Warning" },
};

export default function ModuleCard({ title, description, icon, status, metrics, to, gradient }: ModuleCardProps) {
    const statusStyle = statusColors[status];

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4 }}
        >
            <Link to={to} className="block">
                <div className="glass-panel glass-panel-hover p-6 h-full transition-all duration-300 group cursor-pointer relative overflow-hidden">
                    {/* Gradient accent line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${gradient} opacity-60 group-hover:opacity-100 transition-opacity`} />

                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} p-[1px] group-hover:scale-110 transition-transform`}
                        >
                            <div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center text-white">
                                {icon}
                            </div>
                        </div>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusStyle.bg}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} ${status === "online" ? "animate-pulse" : ""}`} />
                            <span className={`text-[10px] font-medium ${statusStyle.text}`}>{statusStyle.label}</span>
                        </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-cyan-400 transition-colors">
                        {title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">{description}</p>

                    {/* Metrics */}
                    {metrics && metrics.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                            {metrics.map((m, i) => (
                                <div key={i}>
                                    <p className="text-[10px] text-slate-600 uppercase tracking-wider">{m.label}</p>
                                    <p className="text-white font-bold text-lg">{m.value}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Hover arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
