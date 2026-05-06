import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Aurora from "../components/backgrounds/Aurora";

const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true as const },
    transition: { duration: 0.5 },
};

const eyebrow: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.25em",
    color: "var(--color-brand-blue)",
    marginBottom: 14,
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    color: "var(--color-text-muted)",
    marginBottom: 8,
};

const faqs = [
    { q: "How quickly can I get started?", a: "You can deploy Shield360 in under 10 minutes. Our setup wizard guides you through connecting your first component and configuring your security policies." },
    { q: "Do I need technical expertise?", a: "No. Shield360 is designed for SMEs without dedicated security teams. Our intuitive interface and guided workflows make enterprise-grade security accessible to everyone." },
    { q: "Can I integrate my existing tools?", a: "Yes. Each security module exposes a standard REST API. Simply provide the endpoint URL and Shield360 will aggregate the data automatically." },
    { q: "What kind of support do you offer?", a: "Starter plans include email support. Professional plans get priority support with 4-hour response times. Enterprise plans include a dedicated account manager." },
];

const contactInfo: { icon: string; label: string; value: string; color: string }[] = [
    {
        icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
        label: "Email",
        value: "support@shield360.io",
        color: "var(--color-brand-lavender-dark)",
    },
    {
        icon: "M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582",
        label: "Website",
        value: "shield360.io",
        color: "var(--color-brand-blue)",
    },
    {
        icon: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z",
        label: "Location",
        value: "Remote First, Global",
        color: "var(--color-brand-sage)",
    },
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
        <div className="relative" style={{ background: "var(--color-bg-base)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
            {/* ─── Navbar (matches Landing) ─── */}
            <motion.nav
                initial={{ y: -16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ padding: "16px 24px" }}
            >
                <div style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(20px) saturate(1.4)",
                    WebkitBackdropFilter: "blur(20px) saturate(1.4)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 100,
                    padding: "10px 20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)",
                }}>
                    <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10 }} className="group">
                        <div style={{
                            width: 36, height: 36, borderRadius: 10,
                            background: "linear-gradient(135deg, #B8A1E6 0%, #3D5A47 100%)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(184,161,230,0.35)",
                        }}>
                            <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#fff" }} fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>Shield360</span>
                    </Link>
                    <div className="hidden md:flex" style={{ alignItems: "center", gap: 28, fontSize: 13, color: "var(--color-text-secondary)" }}>
                        <Link to="/about" className="hover:text-black">About</Link>
                        <Link to="/pricing" className="hover:text-black">Pricing</Link>
                        <Link to="/contact" className="hover:text-black">Contact</Link>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Link to="/login" style={{ fontSize: 13, color: "var(--color-text-secondary)", padding: "8px 14px" }} className="hover:text-black">Sign In</Link>
                        <Link to="/signup" className="btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            {/* ─── Hero ─── */}
            <section className="relative overflow-hidden" style={{ padding: "140px 24px 60px" }}>
                <Aurora colorStops={["#E8D5F5", "#F5E6D3", "#D4E8C8"]} speed={0.4} blend="mix-blend-multiply" />
                <motion.div {...fadeIn} className="relative z-10" style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
                    <p style={eyebrow}>Contact</p>
                    <h1 style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(40px, 6vw, 64px)",
                        fontWeight: 400,
                        lineHeight: 1.08,
                        letterSpacing: "-0.025em",
                        color: "var(--color-text-primary)",
                        marginBottom: 18,
                    }}>
                        Get in{" "}
                        <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>touch</span>
                    </h1>
                    <p style={{ fontSize: 17, color: "var(--color-text-secondary)", maxWidth: 560, margin: "0 auto", lineHeight: 1.65 }}>
                        Have questions? We'd love to hear from you. Our team typically responds within 24 hours.
                    </p>
                </motion.div>
            </section>

            {/* ─── Form + Sidebar ─── */}
            <section className="relative z-10" style={{ padding: "20px 24px 80px" }}>
                <div style={{ maxWidth: 1080, margin: "0 auto" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 3fr) minmax(0, 2fr)", gap: 40, alignItems: "start" }} className="contact-grid">
                        {/* Form */}
                        <motion.div {...fadeIn} className="glass-card" style={{ padding: 40 }}>
                            {sent ? (
                                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ textAlign: "center", padding: "48px 0" }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: "50%",
                                        background: "rgba(143,191,150,0.15)",
                                        border: "1px solid rgba(143,191,150,0.35)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 18px",
                                    }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 30, height: 30, color: "var(--color-brand-sage)" }} fill="none" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 style={{ fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>Message Sent</h3>
                                    <p style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>We'll get back to you within 24 hours.</p>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                                        <div>
                                            <label style={labelStyle}>Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Your name"
                                                className="input-premium"
                                            />
                                        </div>
                                        <div>
                                            <label style={labelStyle}>Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="you@company.com"
                                                className="input-premium"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Subject</label>
                                        <input
                                            type="text"
                                            required
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            placeholder="How can we help?"
                                            className="input-premium"
                                        />
                                    </div>
                                    <div>
                                        <label style={labelStyle}>Message</label>
                                        <textarea
                                            required
                                            rows={6}
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us more..."
                                            className="input-premium"
                                            style={{ resize: "none" }}
                                        />
                                    </div>
                                    <button type="submit" className="btn-primary" style={{ padding: "14px 0", fontSize: 14, fontWeight: 600 }}>
                                        Send Message
                                    </button>
                                </form>
                            )}
                        </motion.div>

                        {/* Sidebar Info */}
                        <motion.div {...fadeIn} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                            {contactInfo.map((info) => (
                                <div key={info.label} className="glass-card" style={{ padding: 22, display: "flex", alignItems: "flex-start", gap: 14 }}>
                                    <div style={{
                                        width: 42, height: 42, borderRadius: 14,
                                        background: `${info.color === "var(--color-brand-lavender-dark)" ? "rgba(155,130,204,0.12)" : info.color === "var(--color-brand-blue)" ? "rgba(107,163,190,0.12)" : "rgba(143,191,150,0.15)"}`,
                                        border: `1px solid ${info.color === "var(--color-brand-lavender-dark)" ? "rgba(155,130,204,0.28)" : info.color === "var(--color-brand-blue)" ? "rgba(107,163,190,0.28)" : "rgba(143,191,150,0.30)"}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        flexShrink: 0,
                                    }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, color: info.color }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={info.icon} />
                                        </svg>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-text-muted)", marginBottom: 4 }}>
                                            {info.label}
                                        </p>
                                        <p style={{ fontSize: 14, color: "var(--color-text-primary)", fontWeight: 500 }}>{info.value}</p>
                                    </div>
                                </div>
                            ))}

                            <div className="glass-card" style={{ padding: 22 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", color: "var(--color-text-muted)", marginBottom: 8 }}>
                                    Response Time
                                </p>
                                <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                                    Most enquiries are answered within <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>24 hours</span> on business days.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* FAQ */}
                    <motion.div {...fadeIn} style={{ marginTop: 96, maxWidth: 760, margin: "96px auto 0" }}>
                        <div style={{ textAlign: "center", marginBottom: 32 }}>
                            <p style={eyebrow}>FAQ</p>
                            <h2 style={{
                                fontFamily: "var(--font-display)",
                                fontSize: "clamp(28px, 3.5vw, 38px)",
                                fontWeight: 400,
                                color: "var(--color-text-primary)",
                                letterSpacing: "-0.02em",
                            }}>
                                Frequently asked <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>questions</span>
                            </h2>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                            {faqs.map((faq) => (
                                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

function FaqItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="glass-card" style={{ overflow: "hidden", padding: 0 }}>
            <button
                onClick={() => setOpen(!open)}
                style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "20px 24px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                }}
            >
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", paddingRight: 16 }}>{q}</span>
                <motion.svg
                    animate={{ rotate: open ? 45 : 0 }}
                    viewBox="0 0 24 24"
                    style={{ width: 20, height: 20, color: "var(--color-brand-lavender-dark)", flexShrink: 0 }}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </motion.svg>
            </button>
            <motion.div
                initial={false}
                animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{ overflow: "hidden" }}
            >
                <p style={{ padding: "0 24px 22px", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                    {a}
                </p>
            </motion.div>
        </div>
    );
}
