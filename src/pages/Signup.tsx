import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", org: "", password: "" });
    const [loading, setLoading] = useState(false);

    const update = (key: string, val: string) => setForm({ ...form, [key]: val });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/dashboard");
        }, 800);
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-navy-950" />
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-400/3 rounded-full blur-[120px]" />

            {/* Left Panel - Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-800/50 to-transparent" />
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="relative z-10 max-w-md"
                >
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
                        Start building your{" "}
                        <span className="gradient-text">security posture</span>
                    </h2>
                    <p className="text-slate-400 leading-relaxed mb-10">
                        Create your account to connect your security components and get unified visibility across your entire organization.
                    </p>

                    {/* Feature list */}
                    <div className="space-y-4">
                        {[
                            "Connect up to 4 independent security modules",
                            "Real-time aggregated metrics dashboard",
                            "AI-powered threat intelligence",
                            "Automated compliance reporting",
                        ].map((feat, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-cyan-400/10 flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 24 24" className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                </div>
                                <span className="text-sm text-slate-400">{feat}</span>
                            </div>
                        ))}
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

                    <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
                    <p className="text-sm text-slate-500 mb-8">Get started with Shield360 in under a minute</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Full Name</label>
                            <input type="text" className="input-premium" placeholder="John Doe" value={form.name} onChange={(e) => update("name", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Email</label>
                            <input type="email" className="input-premium" placeholder="you@company.com" value={form.email} onChange={(e) => update("email", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Organization</label>
                            <input type="text" className="input-premium" placeholder="Your Company" value={form.org} onChange={(e) => update("org", e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 block">Password</label>
                            <input type="password" className="input-premium" placeholder="••••••••••" value={form.password} onChange={(e) => update("password", e.target.value)} />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 !mt-6">
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-sm text-slate-500 text-center mt-8">
                        Already have an account?{" "}
                        <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium">Sign in</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
