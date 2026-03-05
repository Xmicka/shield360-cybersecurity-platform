import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AppNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + "/");

    return (
        <motion.nav
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="fixed top-0 left-0 right-0 z-50 h-16 glass border-b border-white/5"
            style={{ borderRadius: 0 }}
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
                <div className="hidden md:flex items-center gap-1 bg-navy-800/50 rounded-xl p-1">
                    {[
                        { path: "/dashboard", label: "Dashboard" },
                        { path: "/modules", label: "Modules" },
                    ].map((link) => (
                        <Link
                            key={link.path}
                            to={link.path === "/modules" ? "/modules/spear-phishing" : link.path}
                            className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all ${isActive(link.path) ? "text-white" : "text-slate-500 hover:text-slate-300"
                                }`}
                        >
                            {isActive(link.path) && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-navy-600/60 rounded-lg"
                                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                />
                            )}
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    ))}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-400/8 border border-emerald-400/15">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-emerald-400 font-medium hidden sm:inline">Online</span>
                    </div>

                    {/* User menu */}
                    <button
                        onClick={() => navigate("/")}
                        className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center hover:from-cyan-400/30 hover:to-purple-500/30 transition-all"
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
                        </svg>
                    </button>
                </div>
            </div>
        </motion.nav>
    );
}
