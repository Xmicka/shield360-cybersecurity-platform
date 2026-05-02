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
    cyan: { accent: "#6ba3be", bg: "rgba(107,163,190,0.10)", border: "rgba(107,163,190,0.25)" },
    purple: { accent: "#b8a9c9", bg: "rgba(184,169,201,0.12)", border: "rgba(184,169,201,0.30)" },
    emerald: { accent: "#7dba9c", bg: "rgba(125,186,156,0.12)", border: "rgba(125,186,156,0.30)" },
    rose: { accent: "#c97070", bg: "rgba(201,112,112,0.10)", border: "rgba(201,112,112,0.25)" },
    amber: { accent: "#d4a56a", bg: "rgba(212,165,106,0.12)", border: "rgba(212,165,106,0.30)" },
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
                            color: trend === "up" ? "var(--color-status-ok)" : trend === "down" ? "var(--color-status-error)" : "var(--color-text-muted)",
                        }}>
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                        </div>
                    )}
                </div>

                <p style={{ fontSize: 11, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 4 }}>
                    {label}
                </p>
                <p style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
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
