import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { checkServiceHealth, SERVICE_URLS } from "../config/services";

interface ServiceStatus {
    name: string;
    key: keyof typeof SERVICE_URLS;
    color: string;
    status: "checking" | "online" | "offline";
}

const initialServices: ServiceStatus[] = [
    { name: "Spear Phishing", key: "spearPhishing", color: "#00f0ff", status: "checking" },
    { name: "Behaviour Engine", key: "behaviorEngine", color: "#a78bfa", status: "checking" },
    { name: "Device Monitoring", key: "deviceMonitoring", color: "#fbbf24", status: "checking" },
    { name: "Compliance Engine", key: "complianceEngine", color: "#34d399", status: "checking" },
];

export default function HealthMonitor() {
    const [services, setServices] = useState<ServiceStatus[]>(initialServices);

    useEffect(() => {
        const checkAll = async () => {
            const results = await Promise.all(
                initialServices.map(async (svc) => {
                    const ok = await checkServiceHealth(svc.key);
                    return { ...svc, status: ok ? "online" as const : "offline" as const };
                })
            );
            setServices(results);
        };
        checkAll();
        // Re-check every 60 seconds
        const interval = setInterval(checkAll, 60000);
        return () => clearInterval(interval);
    }, []);

    const onlineCount = services.filter((s) => s.status === "online").length;
    const allChecked = services.every((s) => s.status !== "checking");

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-card"
            style={{ padding: 24 }}
        >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 2 }}>Platform Health</h3>
                    <p style={{ fontSize: 12, color: "#475569" }}>
                        {allChecked
                            ? `${onlineCount}/${services.length} services connected`
                            : "Checking services..."}
                    </p>
                </div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 20,
                    background: allChecked
                        ? onlineCount === services.length ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)"
                        : "rgba(255,255,255,0.04)",
                    border: `1px solid ${allChecked
                        ? onlineCount === services.length ? "rgba(52,211,153,0.2)" : "rgba(251,191,36,0.2)"
                        : "rgba(255,255,255,0.06)"}`,
                }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: allChecked
                            ? onlineCount === services.length ? "#34d399" : "#fbbf24"
                            : "#475569",
                    }} className={allChecked ? "animate-pulse" : ""} />
                    <span style={{
                        fontSize: 10, fontWeight: 700,
                        color: allChecked
                            ? onlineCount === services.length ? "#34d399" : "#fbbf24"
                            : "#475569",
                    }}>
                        {allChecked
                            ? onlineCount === services.length ? "ALL ONLINE" : "PARTIAL"
                            : "CHECKING"}
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
                {services.map((svc) => (
                    <div
                        key={svc.key}
                        style={{
                            padding: "12px 14px", borderRadius: 12,
                            background: "rgba(10,15,30,0.5)",
                            border: `1px solid ${svc.status === "online" ? svc.color + "20" : "rgba(255,255,255,0.04)"}`,
                            display: "flex", alignItems: "center", gap: 10,
                        }}
                    >
                        <div style={{
                            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                            background: svc.status === "checking" ? "#475569"
                                : svc.status === "online" ? "#34d399"
                                    : "#f43f5e",
                        }} className={svc.status === "online" ? "animate-pulse" : ""} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {svc.name}
                            </p>
                            <p style={{
                                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                                color: svc.status === "checking" ? "#475569"
                                    : svc.status === "online" ? "#34d399"
                                        : "#f43f5e",
                            }}>
                                {svc.status === "checking" ? "Checking..." : svc.status === "online" ? "Online" : "Offline"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}
