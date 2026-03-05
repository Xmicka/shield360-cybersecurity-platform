import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

interface MetricsPanelProps {
    label: string;
    value: number | string;
    suffix?: string;
    prefix?: string;
    icon: React.ReactNode;
    trend?: "up" | "down" | "neutral";
    trendValue?: string;
    color?: "cyan" | "purple" | "emerald" | "rose" | "amber";
}

const colorMap = {
    cyan: { bg: "from-cyan-400/10 to-cyan-400/5", border: "border-cyan-400/20", text: "text-cyan-400" },
    purple: { bg: "from-purple-400/10 to-purple-400/5", border: "border-purple-400/20", text: "text-purple-400" },
    emerald: { bg: "from-emerald-400/10 to-emerald-400/5", border: "border-emerald-400/20", text: "text-emerald-400" },
    rose: { bg: "from-rose-400/10 to-rose-400/5", border: "border-rose-400/20", text: "text-rose-400" },
    amber: { bg: "from-amber-400/10 to-amber-400/5", border: "border-amber-400/20", text: "text-amber-400" },
};

function useCountUp(end: number, duration: number = 2000) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !started.current) {
                    started.current = true;
                    const startTime = Date.now();
                    const step = () => {
                        const elapsed = Date.now() - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        setCount(Math.floor(eased * end));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [end, duration]);

    return { count, ref };
}

export default function MetricsPanel({
    label,
    value,
    suffix = "",
    prefix = "",
    icon,
    trend,
    trendValue,
    color = "cyan",
}: MetricsPanelProps) {
    const numericValue = typeof value === "number" ? value : parseFloat(value);
    const isNumeric = !isNaN(numericValue);
    const { count, ref } = useCountUp(isNumeric ? numericValue : 0);
    const styles = colorMap[color];

    return (
        <motion.div
            ref={ref}
            whileHover={{ y: -2 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className={`glass-panel glass-panel-hover p-5 border ${styles.border} relative overflow-hidden group`}
        >
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${styles.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${styles.bg} border ${styles.border} flex items-center justify-center ${styles.text}`}>
                        {icon}
                    </div>
                    {trend && trendValue && (
                        <div className={`flex items-center gap-1 text-xs font-medium ${trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-slate-400"
                            }`}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                        </div>
                    )}
                </div>

                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <p className="text-2xl font-bold text-white">
                    {prefix}
                    {isNumeric ? (
                        <>
                            {numericValue % 1 !== 0
                                ? (count + (numericValue % 1)).toFixed(1)
                                : count}
                        </>
                    ) : (
                        value
                    )}
                    {suffix && <span className={`text-sm ml-1 ${styles.text}`}>{suffix}</span>}
                </p>
            </div>
        </motion.div>
    );
}
