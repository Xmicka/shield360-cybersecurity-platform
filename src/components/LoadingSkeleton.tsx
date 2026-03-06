import { motion } from "framer-motion";

interface LoadingSkeletonProps {
    rows?: number;
    type?: "metrics" | "chart" | "table" | "full";
}

function SkeletonBar({ width = "100%", height = 14, delay = 0 }: { width?: string | number; height?: number; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity, delay }}
            style={{
                width, height, borderRadius: 6,
                background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)",
            }}
        />
    );
}

function MetricSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <div className="glass-card" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <SkeletonBar width={40} height={40} delay={delay} />
                <SkeletonBar width={48} height={16} delay={delay + 0.1} />
            </div>
            <SkeletonBar width={100} height={10} delay={delay + 0.2} />
            <SkeletonBar width={64} height={24} delay={delay + 0.3} />
        </div>
    );
}

function ChartSkeleton({ delay = 0 }: { delay?: number }) {
    return (
        <div className="glass-card" style={{ padding: 28 }}>
            <SkeletonBar width={120} height={16} delay={delay} />
            <div style={{ marginTop: 6 }}><SkeletonBar width={200} height={12} delay={delay + 0.1} /></div>
            <div style={{ marginTop: 20 }}><SkeletonBar width="100%" height={200} delay={delay + 0.2} /></div>
        </div>
    );
}

function TableSkeleton({ rows = 4, delay = 0 }: { rows?: number; delay?: number }) {
    return (
        <div className="glass-card" style={{ padding: 28 }}>
            <SkeletonBar width={140} height={16} delay={delay} />
            <div style={{ marginTop: 6 }}><SkeletonBar width={220} height={12} delay={delay + 0.1} /></div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                {Array.from({ length: rows }).map((_, i) => (
                    <div key={i} style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <SkeletonBar width={80} height={14} delay={delay + 0.1 * i} />
                        <SkeletonBar width="60%" height={14} delay={delay + 0.15 * i} />
                        <SkeletonBar width={60} height={14} delay={delay + 0.2 * i} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function LoadingSkeleton({ rows = 4, type = "full" }: LoadingSkeletonProps) {
    if (type === "metrics") {
        return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => <MetricSkeleton key={i} delay={i * 0.1} />)}
            </div>
        );
    }

    if (type === "chart") return <ChartSkeleton />;
    if (type === "table") return <TableSkeleton rows={rows} />;

    // Full page skeleton
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {/* Header skeleton */}
            <div>
                <SkeletonBar width={220} height={26} />
                <div style={{ marginTop: 8 }}><SkeletonBar width={340} height={14} delay={0.1} /></div>
            </div>

            {/* Metrics skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
                {Array.from({ length: 5 }).map((_, i) => <MetricSkeleton key={i} delay={i * 0.1} />)}
            </div>

            {/* Charts skeleton */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
                <ChartSkeleton delay={0.3} />
                <ChartSkeleton delay={0.4} />
            </div>

            {/* Table skeleton */}
            <TableSkeleton rows={rows} delay={0.5} />
        </div>
    );
}

export { MetricSkeleton, ChartSkeleton, TableSkeleton };
