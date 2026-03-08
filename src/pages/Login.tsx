import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: unknown) {
            const code = (err as { code?: string }).code || "";
            if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        try {
            await loginWithGoogle();
            navigate("/dashboard");
        } catch {
            setError("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-navy-950" />
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-cyan-400/3 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[120px]" />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800/50 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 max-w-md"
                >
                    {/* Shield icon */}
                    <div className="mb-10">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative w-12 h-12">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 animate-pulse-glow" />
                                <div className="absolute inset-[2px] rounded-[10px] bg-navy-900 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-400" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Shield360</span>
                        </Link>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                        Protect your organization with{" "}
                        <span className="gradient-text">unified intelligence</span>
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-10">
                        Access your cybersecurity dashboard to monitor threats, track compliance, and manage your security posture in real-time.
                    </p>

                    {/* Trust indicators */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs text-slate-500">256-bit encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs text-slate-500">SOC 2 Compliant</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <div className="lg:hidden mb-10 text-center">
                        <Link to="/" className="inline-flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 p-[2px]">
                                <div className="w-full h-full rounded-[10px] bg-navy-900 flex items-center justify-center">
                                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor">
                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                    </svg>
                                </div>
                            </div>
                            <span className="text-lg font-bold text-white">Shield360</span>
                        </Link>
                    </div>

                    <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
                    <p className="text-sm text-slate-500 mb-8">Sign in to access your security dashboard</p>

                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400" style={{ background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.15)" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
                            <input
                                type="email"
                                className="input-premium"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
                            <input
                                type="password"
                                className="input-premium"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-slate-700 bg-navy-800 text-cyan-400 focus:ring-cyan-400/30" />
                                <span className="text-xs text-slate-500">Remember me</span>
                            </label>
                            <button type="button" className="text-xs text-cyan-400 hover:text-cyan-300">Forgot password?</button>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-xs text-slate-600">or</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    {/* Google Sign-In */}
                    <button
                        onClick={handleGoogle}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-300 transition-all hover:text-white"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                    >
                        <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p className="text-sm text-slate-500 text-center mt-8">
                        Don{"'"}t have an account?{" "}
                        <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-medium">Create one</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
