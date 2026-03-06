import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { PLANS, useSubscription } from "../context/subscriptionContext";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

export default function Pricing() {
    const [annual, setAnnual] = useState(false);
    const { plan: currentPlan } = useSubscription();

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            {/* Navbar */}
            <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80" /><div className="absolute inset-[2px] rounded-[10px] bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg></div></div>
                        <span className="text-lg font-bold text-white tracking-tight">Shield360</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-ghost text-sm !py-2.5 !px-5">Sign In</Link>
                        <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div {...fadeIn} className="text-center mb-12">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Pricing</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                            Simple, transparent <span className="gradient-text">pricing</span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto mb-8">
                            Enterprise-grade security made affordable for SMEs. No hidden fees, cancel anytime.
                        </p>

                        {/* Billing Toggle */}
                        <div className="inline-flex items-center gap-4 glass-sm p-1.5 rounded-xl">
                            <button onClick={() => setAnnual(false)} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-cyan-400/10 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>Monthly</button>
                            <button onClick={() => setAnnual(true)} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-cyan-400/10 text-cyan-400" : "text-slate-500 hover:text-slate-300"}`}>
                                Annual
                                <span className="text-[10px] bg-emerald-400/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold">SAVE 20%</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {PLANS.map((p, i) => {
                            const price = annual ? p.annualPrice : p.price;
                            const isPopular = p.id === "professional";
                            const isCurrent = currentPlan === p.id;

                            return (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className={`relative glass p-8 flex flex-col ${isPopular ? "border-cyan-400/30 ring-1 ring-cyan-400/10" : ""}`}
                                >
                                    {isPopular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full">
                                            <span className="text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
                                        </div>
                                    )}

                                    <div className="mb-6">
                                        <h3 className="text-lg font-bold text-white mb-1">{p.name}</h3>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-extrabold text-white">${price}</span>
                                            <span className="text-sm text-slate-500">/mo</span>
                                        </div>
                                        {annual && <p className="text-[11px] text-emerald-400 mt-1">Billed ${price * 12}/year</p>}
                                    </div>

                                    <ul className="space-y-3 mb-8 flex-1">
                                        {p.features.map((f) => (
                                            <li key={f} className="flex items-start gap-3 text-sm">
                                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                <span className="text-slate-300">{f}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {isCurrent ? (
                                        <div className="text-center py-3.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-sm font-semibold">
                                            Current Plan
                                        </div>
                                    ) : (
                                        <Link
                                            to={`/checkout?plan=${p.id}&billing=${annual ? "annual" : "monthly"}`}
                                            className={`text-center py-3.5 rounded-xl text-sm font-semibold transition-all ${isPopular
                                                    ? "btn-primary !rounded-xl"
                                                    : "border border-white/10 text-white hover:border-cyan-400/30 hover:bg-cyan-400/5"
                                                }`}
                                        >
                                            Get Started
                                        </Link>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* FAQ-like trust */}
                    <motion.div {...fadeIn} className="mt-20 text-center">
                        <div className="inline-flex flex-wrap justify-center gap-8 text-sm text-slate-500">
                            {["No credit card required", "14-day free trial", "Cancel anytime", "SOC 2 Compliant"].map((t) => (
                                <div key={t} className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /><span>{t}</span></div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
