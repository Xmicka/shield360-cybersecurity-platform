import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";

export default function AppNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, role } = useSubscription();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;

    // Close menu on click outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout();
        navigate("/");
    };

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 h-16"
            style={{ borderRadius: 0, background: "rgba(5,8,16,0.75)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(148,163,184,0.06)" }}
        >
            <div className="h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
                    <div className="relative w-9 h-9">
                        <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80" />
                        <div className="absolute inset-[2px] rounded-[6px] bg-navy-900 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-cyan-400" fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-base font-bold text-white tracking-tight hidden sm:block">Shield360</span>
                </Link>

                {/* Center nav links */}
                <div className="hidden md:flex items-center gap-1 rounded-xl p-1" style={{ background: "rgba(10,14,26,0.5)" }}>
                    {[
                        { path: "/dashboard", label: "Dashboard" },
                        ...(role === "admin" ? [{ path: "/admin", label: "Admin" }] : []),
                    ].map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all ${isActive(link.path) ? "text-white" : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-lg"
                                    style={{ background: "rgba(15,22,41,0.6)" }}
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Plan badge */}
                    <div
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                        style={{
                            background: plan === "enterprise" ? "rgba(251,191,36,0.08)" : plan === "professional" ? "rgba(168,85,247,0.08)" : "rgba(34,211,238,0.08)",
                            border: `1px solid ${plan === "enterprise" ? "rgba(251,191,36,0.15)" : plan === "professional" ? "rgba(168,85,247,0.15)" : "rgba(34,211,238,0.15)"}`,
                        }}
                    >
                        <div
                            className="w-1.5 h-1.5 rounded-full animate-pulse"
                            style={{ background: plan === "enterprise" ? "#fbbf24" : plan === "professional" ? "#a855f7" : "#22d3ee" }}
                        />
                        <span
                            className="text-[10px] font-medium hidden sm:inline capitalize"
                            style={{ color: plan === "enterprise" ? "#fbbf24" : plan === "professional" ? "#a855f7" : "#22d3ee" }}
                        >
                            {plan === "professional" ? "Pro" : plan}
                        </span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-medium hidden sm:inline">Online</span>
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                            style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.2), rgba(168,85,247,0.2))" }}
                        >
                            {user?.displayName ? (
                                <span className="text-xs font-bold text-white">{user.displayName.charAt(0).toUpperCase()}</span>
                            ) : (
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                </svg>
                            )}
                        </button>

                        {/* Dropdown */}
                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden"
                                style={{ background: "rgba(10,14,26,0.95)", backdropFilter: "blur(20px)", border: "1px solid rgba(148,163,184,0.08)" }}
                            >
                                <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(148,163,184,0.06)" }}>
                                    <p className="text-sm font-medium text-white truncate">{user?.displayName || "User"}</p>
                                    <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-400/5 transition-colors flex items-center gap-3"
                                    >
                                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Sign Out
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
