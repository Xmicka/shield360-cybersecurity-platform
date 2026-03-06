import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useSubscription } from "../context/subscriptionContext";

const SPEAR_PHISHING_URL = "https://spear-phishing-dashboard.onrender.com/";

const moduleSlugMap: Record<string, string> = {
    "/modules/spear-phishing": "spear-phishing",
    "/modules/behaviour-engine": "behaviour-engine",
    "/modules/device-monitoring": "device-monitoring",
    "/modules/compliance-engine": "compliance-engine",
};

const links = [
    {
        section: "Overview",
        items: [
            {
                path: "/dashboard",
                label: "Admin Dashboard",
                icon: "M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z",
                color: "#94a3b8",
            },
        ],
    },
    {
        section: "Security Modules",
        items: [
            {
                path: "/modules/spear-phishing",
                label: "Spear Phishing",
                icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
                color: "#00f0ff",
                external: SPEAR_PHISHING_URL,
            },
            {
                path: "/modules/behaviour-engine",
                label: "Behaviour Engine",
                icon: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z",
                color: "#a78bfa",
            },
            {
                path: "/modules/device-monitoring",
                label: "Device Monitoring",
                icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z",
                color: "#fbbf24",
            },
            {
                path: "/modules/compliance-engine",
                label: "Compliance Engine",
                icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
                color: "#34d399",
            },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();
    const { hasAccess, plan, currentPlan } = useSubscription();

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:flex fixed left-0 top-16 bottom-0 w-64 flex-col z-40"
            style={{
                background: "linear-gradient(180deg, rgba(7,11,22,0.95) 0%, rgba(2,6,23,0.98) 100%)",
                borderRight: "1px solid rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
            }}
        >
            <div style={{ flex: 1, padding: "24px 12px", overflowY: "auto" }}>
                {links.map((group) => (
                    <div key={group.section} style={{ marginBottom: 28 }}>
                        <p style={{
                            fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                            letterSpacing: "0.2em", color: "#334155",
                            padding: "0 14px", marginBottom: 10,
                        }}>
                            {group.section}
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            {group.items.map((link) => {
                                const isActive = location.pathname === link.path;
                                const slug = moduleSlugMap[link.path];
                                const isLocked = slug ? !hasAccess(slug) : false;
                                const isExternal = "external" in link && (link as { external: string }).external;

                                if (isExternal && !isLocked) {
                                    return (
                                        <a
                                            key={link.path}
                                            href={(link as { external: string }).external}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                display: "flex", alignItems: "center", gap: 12,
                                                padding: "10px 14px", borderRadius: 12,
                                                fontSize: 13, fontWeight: 500,
                                                color: isActive ? "#fff" : "#64748b",
                                                background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                                                border: isActive ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                                                transition: "all 0.2s ease",
                                                position: "relative",
                                            }}
                                            className="hover:text-slate-300"
                                        >
                                            {isActive && (
                                                <div style={{
                                                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                                                    width: 3, height: 20, borderRadius: "0 4px 4px 0",
                                                    background: link.color,
                                                }} />
                                            )}
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 8,
                                                background: `${link.color}10`, border: `1px solid ${link.color}18`,
                                                display: "flex", alignItems: "center", justifyContent: "center",
                                                flexShrink: 0,
                                            }}>
                                                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: link.color }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                                </svg>
                                            </div>
                                            <span style={{ flex: 1 }}>{link.label}</span>
                                            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, color: "#475569" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                            </svg>
                                        </a>
                                    );
                                }

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        style={{
                                            display: "flex", alignItems: "center", gap: 12,
                                            padding: "10px 14px", borderRadius: 12,
                                            fontSize: 13, fontWeight: 500,
                                            color: isActive ? "#fff" : isLocked ? "#334155" : "#64748b",
                                            background: isActive ? "rgba(255,255,255,0.04)" : "transparent",
                                            border: isActive ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
                                            transition: "all 0.2s ease",
                                            position: "relative",
                                        }}
                                        className="hover:text-slate-300"
                                    >
                                        {isActive && (
                                            <div style={{
                                                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                                                width: 3, height: 20, borderRadius: "0 4px 4px 0",
                                                background: link.color,
                                            }} />
                                        )}
                                        <div style={{
                                            width: 32, height: 32, borderRadius: 8,
                                            background: isActive ? `${link.color}15` : `${link.color}08`,
                                            border: `1px solid ${isActive ? link.color + "25" : link.color + "10"}`,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            flexShrink: 0,
                                            transition: "all 0.2s ease",
                                        }}>
                                            <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: isActive ? link.color : "#475569" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                                            </svg>
                                        </div>
                                        <span style={{ flex: 1 }}>{link.label}</span>
                                        {isLocked && (
                                            <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, color: "#334155" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                            </svg>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom section */}
            <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", flexDirection: "column", gap: 8 }}>
                {plan !== "free" && currentPlan && (
                    <Link to="/pricing" style={{
                        display: "block", padding: 14, borderRadius: 14, textAlign: "center",
                        background: "rgba(10,15,30,0.6)", border: "1px solid rgba(255,255,255,0.06)",
                        transition: "border-color 0.2s",
                    }} className="hover:border-cyan-400/10">
                        <p style={{ fontSize: 10, color: "#475569", marginBottom: 2 }}>Current Plan</p>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#00f0ff", textTransform: "capitalize" }}>{currentPlan.name}</p>
                    </Link>
                )}
                {plan === "free" && (
                    <Link to="/pricing" style={{
                        display: "block", padding: 14, borderRadius: 14, textAlign: "center",
                        background: "linear-gradient(135deg, rgba(0,240,255,0.06), rgba(124,58,237,0.06))",
                        border: "1px solid rgba(0,240,255,0.1)",
                        transition: "border-color 0.2s",
                    }} className="hover:border-cyan-400/20">
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#00f0ff" }}>Upgrade Plan</p>
                        <p style={{ fontSize: 11, color: "#475569" }}>Unlock all modules</p>
                    </Link>
                )}
                <div style={{
                    padding: "10px 14px", borderRadius: 12, textAlign: "center",
                    background: "rgba(10,15,30,0.4)", border: "1px solid rgba(255,255,255,0.04)",
                }}>
                    <span style={{ fontSize: 10, color: "#334155" }}>Platform </span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#00f0ff" }}>v1.0.0-beta</span>
                </div>
            </div>
        </motion.aside>
    );
}
