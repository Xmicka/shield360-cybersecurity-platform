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

const colorMap: Record<string, { accent: string; bg: string; border: string }> = {
    cyan: { accent: "#00f0ff", bg: "rgba(0,240,255,0.06)", border: "rgba(0,240,255,0.12)" },
    purple: { accent: "#a78bfa", bg: "rgba(167,139,250,0.06)", border: "rgba(167,139,250,0.12)" },
    emerald: { accent: "#34d399", bg: "rgba(52,211,153,0.06)", border: "rgba(52,211,153,0.12)" },
    rose: { accent: "#f43f5e", bg: "rgba(244,63,94,0.06)", border: "rgba(244,63,94,0.12)" },
    amber: { accent: "#fbbf24", bg: "rgba(251,191,36,0.06)", border: "rgba(251,191,36,0.12)" },
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
            className="glass-card group"
            style={{ padding: 20, position: "relative", overflow: "hidden" }}
        >
            {/* Top accent line */}
            <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 2,
                background: styles.accent, opacity: 0.3,
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 10,
                        background: styles.bg, border: `1px solid ${styles.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: styles.accent,
                    }}>
                        {icon}
                    </div>
                    {trend && trendValue && (
                        <div style={{
                            display: "flex", alignItems: "center", gap: 4,
                            fontSize: 12, fontWeight: 600,
                            color: trend === "up" ? "#34d399" : trend === "down" ? "#f43f5e" : "#94a3b8",
                        }}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                        </div>
                    )}
                </div>

                <p style={{ fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
                    {label}
                </p>
                <p style={{ fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
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
                    {suffix && <span style={{ fontSize: 14, marginLeft: 2, color: styles.accent }}>{suffix}</span>}
                </p>
            </div>
        </motion.div>
    );
}
