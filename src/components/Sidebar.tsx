import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const links = [
    {
        section: "Overview",
        items: [
            {
                path: "/dashboard",
                label: "Admin Dashboard",
                icon: (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                ),
            },
        ],
    },
    {
        section: "Security Modules",
        items: [
            {
                path: "/modules/spear-phishing",
                label: "Spear Phishing",
                icon: (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                ),
                color: "text-cyan-400",
            },
            {
                path: "/modules/behaviour-engine",
                label: "Behaviour Engine",
                icon: (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                ),
                color: "text-purple-400",
            },
            {
                path: "/modules/device-monitoring",
                label: "Device Monitoring",
                icon: (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
                    </svg>
                ),
                color: "text-amber-400",
            },
            {
                path: "/modules/compliance-engine",
                label: "Compliance Engine",
                icon: (
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                ),
                color: "text-emerald-400",
            },
        ],
    },
];

export default function Sidebar() {
    const location = useLocation();

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="hidden lg:flex fixed left-0 top-16 bottom-0 w-60 flex-col z-40 border-r border-white/5 bg-navy-950/90 backdrop-blur-xl"
        >
            <div className="flex-1 py-6 px-3 space-y-6 overflow-y-auto">
                {links.map((group) => (
                    <div key={group.section}>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-600 font-semibold px-3 mb-2">
                            {group.section}
                        </p>
                        <div className="space-y-0.5">
                            {group.items.map((link) => {
                                const isActive = location.pathname === link.path;
                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all group ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 bg-white/[0.04] rounded-xl border border-white/[0.06]"
                                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                            />
                                        )}
                                        {isActive && (
                                            <motion.div
                                                layoutId="sidebar-indicator"
                                                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-cyan-400 rounded-r-full"
                                            />
                                        )}
                                        <span className={`relative z-10 ${"color" in link && isActive ? (link as { color: string }).color : ""}`}>
                                            {link.icon}
                                        </span>
                                        <span className="relative z-10 font-medium">{link.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom */}
            <div className="p-3 border-t border-white/5">
                <div className="glass-sm p-3 text-center">
                    <p className="text-[10px] text-slate-600 mb-0.5">Platform</p>
                    <p className="text-xs font-semibold text-cyan-400">v1.0.0-beta</p>
                </div>
            </div>
        </motion.aside>
    );
}
