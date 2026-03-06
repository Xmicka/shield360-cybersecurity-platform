import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { PLANS, useSubscription } from "../context/subscriptionContext";
import type { PlanType } from "../context/subscriptionContext";

export default function Checkout() {
    const [params] = useSearchParams();
    const { setPlan } = useSubscription();

    const planId = (params.get("plan") || "starter") as PlanType;
    const billing = (params.get("billing") || "monthly") as "monthly" | "annual";
    const plan = PLANS.find((p) => p.id === planId) || PLANS[0];
    const price = billing === "annual" ? plan.annualPrice : plan.price;

    const [card, setCard] = useState({ number: "", expiry: "", cvv: "", name: "" });
    const [step, setStep] = useState<"form" | "processing" | "success">("form");

    const formatCard = (v: string) => v.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim().slice(0, 19);
    const formatExpiry = (v: string) => { const d = v.replace(/\D/g, "").slice(0, 4); return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d; };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep("processing");
        setTimeout(() => {
            setPlan(planId, billing);
            setStep("success");
        }, 2500);
    };

    if (step === "success") {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass p-12 max-w-md text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }} className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-6">
                        <svg viewBox="0 0 24 24" className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </motion.div>
                    <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                    <p className="text-slate-400 mb-2">Welcome to Shield360 <span className="text-cyan-400 font-semibold capitalize">{plan.name}</span></p>
                    <p className="text-sm text-slate-500 mb-8">Your account has been upgraded. All {plan.name} features are now unlocked.</p>
                    <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
                        Go to Dashboard
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (step === "processing") {
        return (
            <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-8">
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-400/20" />
                        <div className="absolute inset-0 rounded-full border-2 border-t-cyan-400 animate-spin" />
                        <div className="absolute inset-2 rounded-full border-2 border-t-purple-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Processing Payment</h2>
                    <p className="text-sm text-slate-500">Securely processing your card details...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-navy-950 flex items-center justify-center px-6 py-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Order Summary */}
                <div className="lg:col-span-2 glass p-8">
                    <Link to="/pricing" className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors mb-6">
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                        Back to plans
                    </Link>

                    <h3 className="text-lg font-bold text-white mb-1">Order Summary</h3>
                    <p className="text-xs text-slate-500 mb-6">Shield360 {plan.name} Plan</p>

                    <div className="space-y-3 mb-6">
                        {plan.features.slice(0, 5).map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                <span className="text-slate-400">{f}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-white/5 pt-4 space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Plan</span><span className="text-white">{plan.name}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Billing</span><span className="text-white capitalize">{billing}</span></div>
                        <div className="flex justify-between text-sm border-t border-white/5 pt-2 mt-2"><span className="text-white font-semibold">Total</span><span className="text-xl font-bold text-cyan-400">${price}<span className="text-xs text-slate-500">/mo</span></span></div>
                    </div>
                </div>

                {/* Payment Form */}
                <div className="lg:col-span-3 glass p-8">
                    <h3 className="text-lg font-bold text-white mb-1">Payment Details</h3>
                    <p className="text-xs text-slate-500 mb-6">256-bit encrypted • SOC 2 compliant</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Cardholder Name</label>
                            <input type="text" required value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} placeholder="John Smith" className="input-premium" />
                        </div>
                        <div>
                            <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Card Number</label>
                            <input type="text" required value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} placeholder="4242 4242 4242 4242" className="input-premium" maxLength={19} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Expiry</label>
                                <input type="text" required value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} placeholder="MM/YY" className="input-premium" maxLength={5} />
                            </div>
                            <div>
                                <label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">CVV</label>
                                <input type="text" required value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })} placeholder="123" className="input-premium" maxLength={3} />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full !py-4 !text-base flex items-center justify-center gap-2 mt-2">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            Pay ${price}/month
                        </button>

                        <p className="text-[11px] text-slate-600 text-center">
                            By subscribing you agree to our Terms of Service and Privacy Policy.
                        </p>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
