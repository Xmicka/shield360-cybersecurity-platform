import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useSubscription } from "../context/subscriptionContext";
import { useAuth } from "../context/authContext";

const planMeta: Record<string, { label: string; color: string; bg: string; border: string }> = {
    free: { label: "Free", color: "#6b6b6b", bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.08)" },
    professional: { label: "Pro", color: "#6ba3be", bg: "rgba(107,163,190,0.10)", border: "rgba(107,163,190,0.25)" },
    enterprise: { label: "Enterprise", color: "#b8a9c9", bg: "rgba(184,169,201,0.12)", border: "rgba(184,169,201,0.3)" },
};

export default function AppNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, role } = useSubscription();
    const { user, logout } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isActive = (path: string) => location.pathname === path;
    const meta = planMeta[plan] ?? planMeta.free;

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
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 left-0 right-0 z-50"
            style={{
                height: "var(--navbar-height, 64px)",
                background: "rgba(250,249,247,0.85)",
                backdropFilter: "blur(20px) saturate(1.4)",
                WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                borderBottom: "1px solid rgba(0,0,0,0.06)",
            }}
        >
            <div className="h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link to="/dashboard" className="flex items-center gap-3 group shrink-0">
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "linear-gradient(135deg, #6ba3be 0%, #8aab96 100%)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 6px rgba(107,163,190,0.25)",
                        }}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#fff" }} fill="currentColor">
                            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }} className="hidden sm:block">
                        Shield360
                    </span>
                </Link>

                {/* Center nav */}
                <div className="hidden md:flex items-center gap-1 rounded-full p-1" style={{ background: "rgba(0,0,0,0.03)" }}>
                    {[
                        { path: "/dashboard", label: "Dashboard" },
                        ...(role === "admin" ? [{ path: "/admin", label: "Admin" }] : []),
                    ].map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            style={{
                                position: "relative",
                                padding: "6px 16px",
                                fontSize: 12,
                                fontWeight: 500,
                                borderRadius: 100,
                                color: isActive(link.path) ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                            }}
                        >
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    style={{ position: "absolute", inset: 0, borderRadius: 100, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                            )}
                            <span style={{ position: "relative", zIndex: 10 }}>{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2.5">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 100,
                            background: meta.bg,
                            border: `1px solid ${meta.border}`,
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: meta.color }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: meta.color }} className="hidden sm:inline">
                            {meta.label}
                        </span>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            padding: "4px 10px",
                            borderRadius: 100,
                            background: "rgba(125,186,156,0.12)",
                            border: "1px solid rgba(125,186,156,0.25)",
                        }}
                    >
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                        <span style={{ fontSize: 11, fontWeight: 600, color: "var(--color-status-ok)" }} className="hidden sm:inline">
                            Online
                        </span>
                    </div>

                    {/* User menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            style={{
                                width: 34,
                                height: 34,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #6ba3be, #b8a9c9)",
                                color: "#fff",
                                fontSize: 13,
                                fontWeight: 700,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {user?.displayName ? (
                                user.displayName.charAt(0).toUpperCase()
                            ) : (
                                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                                </svg>
                            )}
                        </button>

                        {menuOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                transition={{ duration: 0.15 }}
                                style={{
                                    position: "absolute",
                                    right: 0,
                                    marginTop: 8,
                                    width: 240,
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    background: "#fff",
                                    border: "1px solid var(--color-border)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
                                }}
                            >
                                <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--color-border)" }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--color-text-primary)" }} className="truncate">
                                        {user?.displayName || "User"}
                                    </p>
                                    <p style={{ fontSize: 12, color: "var(--color-text-muted)" }} className="truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div style={{ padding: 4 }}>
                                    <button
                                        onClick={handleLogout}
                                        style={{
                                            width: "100%",
                                            textAlign: "left",
                                            padding: "10px 14px",
                                            fontSize: 13,
                                            color: "var(--color-status-error)",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            background: "transparent",
                                            border: "none",
                                            cursor: "pointer",
                                            borderRadius: 10,
                                        }}
                                        className="hover:bg-black/[0.03]"
                                    >
                                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }} fill="none" stroke="currentColor" strokeWidth={1.5}>
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
