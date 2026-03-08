import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

const team = [
    { name: "Akesh Chandrasiri", role: "Lead Developer", component: "Spear Phishing Simulation", color: "#22d3ee", gradient: "from-cyan-400 to-blue-500" },
    { name: "Shanuki Liyanage", role: "Compliance Analyst/Developer", component: "Compliance Assistant", color: "#34d399", gradient: "from-emerald-400 to-teal-500" },
    { name: "Shenal Somaweera", role: "Shadow IT Developer", component: "Shadow IT Dashboard", color: "#3b82f6", gradient: "from-blue-400 to-indigo-500" },
    { name: "Yasindu De Silva", role: "Endpoint Scanner Developer", component: "Endpoint Risk Scanner", color: "#fbbf24", gradient: "from-amber-400 to-orange-500" },
];

const techStack = [
    { name: "React", desc: "Frontend Framework", icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" },
    { name: "TypeScript", desc: "Type Safety", icon: "M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" },
    { name: "Python", desc: "ML & Backend", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
    { name: "TensorFlow", desc: "AI Models", icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" },
    { name: "Firebase", desc: "Auth & Database", icon: "M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" },
    { name: "Three.js", desc: "3D Graphics", icon: "M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" },
];

const values = [
    {
        title: "Affordable Security",
        desc: "Enterprise-grade protection at a fraction of the cost. Our subscription model means no massive upfront licensing fees.",
        icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        color: "#22d3ee",
    },
    {
        title: "AI-First Approach",
        desc: "Machine learning models power everything from phishing simulation to anomaly detection, adapting to your organisation in real-time.",
        icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5",
        color: "#a855f7",
    },
    {
        title: "Zero Trust Architecture",
        desc: "Built on zero-trust principles from the ground up. Every request is verified, every anomaly is flagged, every device is monitored.",
        icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
        color: "#34d399",
    },
];

export default function About() {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />

            {/* Navbar */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="fixed top-0 left-0 right-0 z-50"
                style={{ background: "rgba(5,8,16,0.7)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(148,163,184,0.06)" }}
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6" style={{ height: 64 }}>
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative w-9 h-9">
                            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80" />
                            <div className="absolute inset-[2px] rounded-[6px] bg-navy-900 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-cyan-400" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-base font-bold text-white tracking-tight">Shield360</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/contact" className="btn-ghost text-sm !py-2.5 !px-5">Contact</Link>
                        <Link to="/pricing" className="btn-primary text-sm !py-2.5 !px-5">View Plans</Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10 pt-36 pb-32 px-6">
                <div className="max-w-5xl mx-auto">

                    {/* ─── Hero / Mission ─── */}
                    <motion.div {...fadeIn} className="text-center mb-28">
                        <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#22d3ee", fontWeight: 700, marginBottom: 16 }}>About Us</p>
                        <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#f1f5f9", lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: 24 }}>
                            Democratising <span className="gradient-text">cybersecurity</span> for SMEs
                        </h1>
                        <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 640, margin: "0 auto", lineHeight: 1.7, marginBottom: 16 }}>
                            Small and medium enterprises face the same cyber threats as large corporations — but without the budget or expertise to combat them. Shield360 was built to change that.
                        </p>
                        <p style={{ fontSize: 15, color: "#64748b", maxWidth: 640, margin: "0 auto", lineHeight: 1.7 }}>
                            We combine AI-driven threat simulation, behavioural analytics, device monitoring, and compliance automation into a single, affordable platform. Our mission is to make enterprise-grade security accessible to every business, regardless of size.
                        </p>
                    </motion.div>

                    {/* ─── Values ─── */}
                    <motion.div {...fadeIn} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 112 }}>
                        {values.map((v, i) => (
                            <motion.div
                                key={v.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.5 }}
                                style={{
                                    padding: 36,
                                    borderRadius: 20,
                                    background: "rgba(10,14,26,0.6)",
                                    backdropFilter: "blur(20px)",
                                    border: "1px solid rgba(148,163,184,0.06)",
                                    textAlign: "center",
                                    position: "relative",
                                    overflow: "hidden",
                                }}
                            >
                                {/* Top accent */}
                                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${v.color}, transparent)`, opacity: 0.4 }} />

                                <div style={{
                                    width: 56, height: 56, borderRadius: 16,
                                    background: `${v.color}10`,
                                    border: `1px solid ${v.color}20`,
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    margin: "0 auto 20px",
                                }}>
                                    <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, color: v.color }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d={v.icon} />
                                    </svg>
                                </div>
                                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#f1f5f9", marginBottom: 8 }}>{v.title}</h3>
                                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.7 }}>{v.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* ─── Team ─── */}
                    <motion.div {...fadeIn} style={{ marginBottom: 112 }}>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#22d3ee", fontWeight: 700, marginBottom: 12 }}>The Team</p>
                            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Built by security researchers</h2>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                            {team.map((m, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.5 }}
                                    whileHover={{ y: -4 }}
                                    style={{
                                        padding: 32,
                                        borderRadius: 20,
                                        background: "rgba(10,14,26,0.6)",
                                        backdropFilter: "blur(20px)",
                                        border: "1px solid rgba(148,163,184,0.06)",
                                        textAlign: "center",
                                        position: "relative",
                                        overflow: "hidden",
                                        transition: "border-color 0.3s",
                                    }}
                                    className="hover:!border-[rgba(148,163,184,0.12)]"
                                >
                                    {/* Top accent */}
                                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${m.color}, transparent)`, opacity: 0.5 }} />

                                    {/* Avatar */}
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 18, padding: 2,
                                        background: `linear-gradient(135deg, ${m.color}, ${m.color}60)`,
                                        margin: "0 auto 20px",
                                    }}>
                                        <div style={{
                                            width: "100%", height: "100%", borderRadius: 16,
                                            background: "#0a0e1a",
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                        }}>
                                            <span style={{ fontSize: 22, fontWeight: 800, color: m.color }}>{m.name[0]}</span>
                                        </div>
                                    </div>

                                    {/* Name & Role */}
                                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{m.name}</h3>
                                    <p style={{ fontSize: 12, color: "#64748b", marginBottom: 16 }}>{m.role}</p>

                                    {/* Component badge */}
                                    <div style={{
                                        display: "inline-block",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        letterSpacing: "0.02em",
                                        padding: "5px 14px",
                                        borderRadius: 8,
                                        background: `${m.color}10`,
                                        border: `1px solid ${m.color}25`,
                                        color: m.color,
                                    }}>
                                        {m.component}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* ─── Tech Stack ─── */}
                    <motion.div {...fadeIn}>
                        <div style={{ textAlign: "center", marginBottom: 48 }}>
                            <p style={{ fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase", color: "#22d3ee", fontWeight: 700, marginBottom: 12 }}>Technology</p>
                            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>Built with cutting-edge tools</h2>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 16 }}>
                            {techStack.map((t, i) => (
                                <motion.div
                                    key={t.name}
                                    initial={{ opacity: 0, y: 16 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06, duration: 0.4 }}
                                    whileHover={{ y: -3 }}
                                    style={{
                                        padding: "28px 16px",
                                        borderRadius: 16,
                                        background: "rgba(10,14,26,0.5)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(148,163,184,0.06)",
                                        textAlign: "center",
                                        cursor: "default",
                                        transition: "border-color 0.3s",
                                    }}
                                    className="hover:!border-[rgba(34,211,238,0.15)]"
                                >
                                    <div style={{
                                        width: 40, height: 40, borderRadius: 12,
                                        background: "rgba(34,211,238,0.06)",
                                        border: "1px solid rgba(34,211,238,0.1)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        margin: "0 auto 14px",
                                    }}>
                                        <svg viewBox="0 0 24 24" style={{ width: 20, height: 20, color: "#22d3ee" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d={t.icon} />
                                        </svg>
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>{t.name}</p>
                                    <p style={{ fontSize: 10, color: "#475569" }}>{t.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
