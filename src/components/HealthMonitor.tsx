import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MODULES } from "../config/services";

interface ServiceStatus {
    name: string;
    slug: string;
    color: string;
    deployedUrl: string;
    status: "checking" | "online" | "offline";
}

const initialServices: ServiceStatus[] = MODULES.map((m) => ({
    name: m.shortName,
    slug: m.slug,
    color: m.color,
    deployedUrl: m.deployedUrl,
    status: "checking" as const,
}));

export default function HealthMonitor() {
    const [services, setServices] = useState<ServiceStatus[]>(initialServices);

    useEffect(() => {
        // Render free-tier services sleep after ~15min of inactivity and take
        // 30-60s to cold-start. Use a generous timeout and retry once on the
        // first failure so a sleeping service is still marked Online once it
        // wakes up.
        const pingOnce = async (url: string, timeoutMs: number): Promise<boolean> => {
            try {
                const controller = new AbortController();
                const t = setTimeout(() => controller.abort(), timeoutMs);
                await fetch(url, { mode: "no-cors", signal: controller.signal });
                clearTimeout(t);
                return true;
            } catch {
                return false;
            }
        };

        let cancelled = false;
        const checkAll = async () => {
            const results = await Promise.all(
                initialServices.map(async (svc) => {
                    let ok = await pingOnce(svc.deployedUrl, 12000);
                    if (!ok) ok = await pingOnce(svc.deployedUrl, 45000); // wake-up retry
                    return { ...svc, status: ok ? ("online" as const) : ("offline" as const) };
                })
            );
            if (!cancelled) setServices(results);
        };
        checkAll();
        const interval = setInterval(checkAll, 90_000);
        return () => { cancelled = true; clearInterval(interval); };
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
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 2 }}>Platform Health</h3>
                    <p style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                        {allChecked
                            ? `${onlineCount}/${services.length} services connected`
                            : "Checking services..."}
                    </p>
                </div>
                <div style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "4px 10px", borderRadius: 20,
                    background: allChecked
                        ? onlineCount === services.length ? "rgba(125,186,156,0.14)" : "rgba(212,168,83,0.14)"
                        : "rgba(0,0,0,0.04)",
                    border: `1px solid ${allChecked
                        ? onlineCount === services.length ? "rgba(125,186,156,0.30)" : "rgba(212,168,83,0.30)"
                        : "rgba(0,0,0,0.08)"}`,
                }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: allChecked
                            ? onlineCount === services.length ? "var(--color-status-ok)" : "var(--color-status-warn)"
                            : "var(--color-text-muted)",
                    }} className={allChecked ? "animate-pulse" : ""} />
                    <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                        color: allChecked
                            ? onlineCount === services.length ? "var(--color-status-ok)" : "var(--color-status-warn)"
                            : "var(--color-text-muted)",
                    }}>
                        {allChecked
                            ? onlineCount === services.length ? "ALL ONLINE" : "PARTIAL"
                            : "CHECKING"}
                    </span>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {services.map((svc) => (
                    <div
                        key={svc.slug}
                        style={{
                            padding: "12px 14px", borderRadius: 12,
                            background: "var(--color-bg-base)",
                            border: `1px solid ${svc.status === "online" ? svc.color + "33" : "var(--color-border)"}`,
                            display: "flex", alignItems: "center", gap: 10,
                        }}
                    >
                        <div style={{
                            width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                            background: svc.status === "checking" ? "var(--color-text-muted)"
                                : svc.status === "online" ? "var(--color-status-ok)"
                                    : "var(--color-status-error)",
                        }} className={svc.status === "online" ? "animate-pulse" : ""} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {svc.name}
                            </p>
                            <p style={{
                                fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                                color: svc.status === "checking" ? "var(--color-text-muted)"
                                    : svc.status === "online" ? "var(--color-status-ok)"
                                        : "var(--color-status-error)",
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
