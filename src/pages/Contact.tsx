import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

const faqs = [
    { q: "How quickly can I get started?", a: "You can deploy Shield360 in under 10 minutes. Our setup wizard guides you through connecting your first component and configuring your security policies." },
    { q: "Do I need technical expertise?", a: "No. Shield360 is designed for SMEs without dedicated security teams. Our intuitive interface and guided workflows make enterprise-grade security accessible to everyone." },
    { q: "Can I integrate my existing tools?", a: "Yes. Each security module exposes a standard REST API. Simply provide the endpoint URL and Shield360 will aggregate the data automatically." },
    { q: "What kind of support do you offer?", a: "Starter plans include email support. Professional plans get priority support with 4-hour response times. Enterprise plans include a dedicated account manager." },
];

export default function Contact() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const msgs = JSON.parse(localStorage.getItem("s360_messages") || "[]");
        msgs.push({ ...form, timestamp: new Date().toISOString() });
        localStorage.setItem("s360_messages", JSON.stringify(msgs));
        setSent(true);
    };

    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ padding: "16px 24px" }}
            >
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    background: "rgba(7, 11, 22, 0.7)",
                    backdropFilter: "blur(20px) saturate(1.5)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.5)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 16,
                    padding: "12px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 4px 30px rgba(0,0,0,0.3)",
                }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #00f0ff, #7c3aed)",
                            padding: 2, display: "flex",
                        }}>
                            <div style={{
                                flex: 1, borderRadius: 8, background: "#070b16",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, color: "#00f0ff" }} fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                        </div>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Shield360</span>
                    </Link>
                    <div style={{ display: "flex", alignItems: "center", gap: 32, fontSize: 13, color: "#94a3b8" }}>
                        <Link to="/about" style={{ transition: "color 0.2s" }} className="hover:text-white">About</Link>
                        <Link to="/pricing" style={{ transition: "color 0.2s" }} className="hover:text-white">Pricing</Link>
                        <Link to="/contact" style={{ transition: "color 0.2s" }} className="hover:text-white">Contact</Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Link to="/login" style={{ fontSize: 13, color: "#94a3b8", padding: "8px 16px" }} className="hover:text-white">Sign In</Link>
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 13, padding: "10px 20px" }}>Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10" style={{ padding: "128px 32px 96px" }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                    <motion.div {...fadeIn} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Contact</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Get in <span className="gradient-text">touch</span></h1>
                        <p className="text-lg text-slate-400 max-w-xl mx-auto">Have questions? We'd love to hear from you. Our team typically responds within 24 hours.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
                        {/* Form */}
                        <motion.div {...fadeIn} className="lg:col-span-3 glass p-8">
                            {sent ? (
                                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4">
                                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                                    <p className="text-sm text-slate-400">We'll get back to you within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div><label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Name</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" className="input-premium" /></div>
                                        <div><label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Email</label><input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@company.com" className="input-premium" /></div>
                                    </div>
                                    <div><label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Subject</label><input type="text" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="How can we help?" className="input-premium" /></div>
                                    <div><label className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Message</label><textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us more..." className="input-premium resize-none" /></div>
                                    <button type="submit" className="btn-primary w-full !py-4">Send Message</button>
                                </form>
                            )}
                        </motion.div>

                        {/* Sidebar Info */}
                        <motion.div {...fadeIn} className="lg:col-span-2 space-y-6">
                            {[
                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />, label: "Email", value: "support@shield360.io" },
                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />, label: "Website", value: "shield360.io" },
                                { icon: <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />, label: "Location", value: "Remote First, Global" },
                            ].map((info) => (
                                <div key={info.label} className="glass p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0"><svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}>{info.icon}</svg></div>
                                    <div><p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-0.5">{info.label}</p><p className="text-sm text-white">{info.value}</p></div>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* FAQ */}
                    <motion.div {...fadeIn} className="mt-24 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
                        <div className="space-y-3">
                            {faqs.map((faq) => (
                                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="glass overflow-hidden">
            <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left">
                <span className="text-sm font-semibold text-white pr-4">{q}</span>
                <motion.svg animate={{ rotate: open ? 45 : 0 }} viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></motion.svg>
            </button>
            <motion.div initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-slate-400 leading-relaxed">{a}</p>
            </motion.div>
        </div>
    );
}
