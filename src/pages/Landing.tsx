import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { useRef } from "react";
import AnimatedBackground from "../components/AnimatedBackground";

const modules = [
    {
        title: "Spear Phishing Simulation",
        desc: "AI-driven adaptive phishing campaigns with real-time click detection, behavioral analysis, and automated micro-training enforcement.",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
        ),
        gradient: "from-cyan-400 to-blue-500",
        tag: "Phishing & Training",
    },
    {
        title: "Behaviour Intelligence Engine",
        desc: "Real-time user behaviour analytics using isolation forest models to detect insider threats, anomalous access, and risk scoring.",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
        ),
        gradient: "from-purple-400 to-pink-500",
        tag: "User Analytics",
    },
    {
        title: "Device Behaviour Monitoring",
        desc: "Continuous device inventory, health tracking, and anomalous network behaviour detection across endpoints and IoT devices.",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
            </svg>
        ),
        gradient: "from-amber-400 to-orange-500",
        tag: "Device Security",
    },
    {
        title: "Compliance & Policy Engine",
        desc: "Automated compliance monitoring across ISO 27001, GDPR, SOC 2, and NIST with real-time policy enforcement and audit logging.",
        icon: (
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        gradient: "from-emerald-400 to-teal-500",
        tag: "Compliance",
    },
];

const stats = [
    { value: "99.7%", label: "Threat Detection Rate" },
    { value: "< 5s", label: "Response Time" },
    { value: "1,247", label: "Attacks Blocked" },
    { value: "24/7", label: "Active Monitoring" },
];

const fadeInUp = {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

const stagger = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
};

export default function Landing() {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <div className="relative">
            <AnimatedBackground />

            {/* ─── Navbar ─── */}
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            >
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-[2px] rounded-[10px] bg-navy-900 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-lg font-bold text-white tracking-tight">Shield360</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/login" className="btn-ghost text-sm !py-2.5 !px-5">Sign In</Link>
                        <Link to="/signup" className="btn-primary text-sm !py-2.5 !px-5">Get Started</Link>
                    </div>
                </div>
            </motion.nav>

            {/* ─── Hero ─── */}
            <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
                {/* Gradient blobs */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[120px] animate-blob" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-blob" style={{ animationDelay: "2s" }} />
                <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-rose-500/3 rounded-full blur-[80px] animate-blob" style={{ animationDelay: "4s" }} />

                <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 text-center max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-sm mb-8"
                    >
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-medium text-slate-400">AI-Driven Cybersecurity Platform for SMEs</span>
                    </motion.div>

                    {/* Heading */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                        className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                    >
                        <span className="text-white">Unified Security.</span>
                        <br />
                        <span className="gradient-text">Complete Visibility.</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.6 }}
                        className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
                    >
                        Shield360 aggregates threat intelligence, behaviour analytics, phishing simulation, and compliance enforcement into one{" "}
                        <span className="text-white font-medium">intelligent platform</span>.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link to="/signup" className="btn-primary text-base !py-4 !px-8 flex items-center gap-2">
                            Start Free Trial
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                        <Link to="/login" className="btn-ghost text-base !py-4 !px-8">Sign In →</Link>
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5 }}
                        className="mt-20"
                    >
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-10 border-2 border-slate-700 rounded-full mx-auto flex justify-center pt-2"
                        >
                            <div className="w-1 h-2 bg-cyan-400 rounded-full" />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ─── Stats Bar ─── */}
            <motion.section {...fadeInUp} className="relative z-10 py-16 px-6">
                <div className="max-w-5xl mx-auto glass rounded-2xl p-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, i) => (
                            <motion.div
                                key={i}
                                {...stagger}
                                transition={{ delay: 0.1 * i, duration: 0.5 }}
                                className="text-center"
                            >
                                <p className="text-3xl sm:text-4xl font-bold gradient-text-cyan mb-1">{stat.value}</p>
                                <p className="text-sm text-slate-500">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ─── Modules Section ─── */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Security Modules</p>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Four pillars of{" "}
                            <span className="gradient-text">intelligent defence</span>
                        </h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                            Each module is independently developed and deployed. Shield360 unifies them into a single operational dashboard.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {modules.map((mod, i) => (
                            <motion.div
                                key={i}
                                {...stagger}
                                transition={{ delay: 0.15 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                                className="glass glass-hover p-8 group relative overflow-hidden"
                            >
                                {/* Gradient accent */}
                                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${mod.gradient} opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                                {/* Tag */}
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">{mod.tag}</span>
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mod.gradient} p-[1px]`}>
                                        <div className="w-full h-full rounded-xl bg-navy-900 flex items-center justify-center text-white">
                                            {mod.icon}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">{mod.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{mod.desc}</p>

                                {/* Hover arrow */}
                                <div className="mt-6 flex items-center gap-2 text-sm text-slate-600 group-hover:text-cyan-400 transition-all duration-300">
                                    <span className="font-medium">Learn more</span>
                                    <svg viewBox="0 0 24 24" className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── How It Works ─── */}
            <section className="relative z-10 py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeInUp} className="text-center mb-16">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">How It Works</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            Connect. Monitor. Protect.
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Connect Your Components", desc: "Plug in your team's independent security microservices via simple API URLs. Each component runs independently." },
                            { step: "02", title: "Unified Monitoring", desc: "Shield360 aggregates data from all connected components into a single real-time admin dashboard." },
                            { step: "03", title: "Intelligent Response", desc: "Get actionable insights, automated alerts, and AI-driven recommendations across your entire security posture." },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                {...stagger}
                                transition={{ delay: 0.2 * i, duration: 0.6 }}
                                className="text-center"
                            >
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6 relative">
                                    <span className="text-2xl font-bold gradient-text-cyan">{item.step}</span>
                                    {i < 2 && (
                                        <div className="hidden md:block absolute -right-12 top-1/2 w-8 border-t border-dashed border-slate-700" />
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── CTA Section ─── */}
            <section className="relative z-10 py-24 px-6">
                <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center">
                    <div className="glass p-12 sm:p-16 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-purple-500/5" />
                        <div className="relative z-10">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight">
                                Ready to secure your organization?
                            </h2>
                            <p className="text-lg text-slate-400 mb-8 max-w-xl mx-auto">
                                Get started with Shield360 and bring unified cybersecurity intelligence to your SME.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/signup" className="btn-primary text-base !py-4 !px-8">Create Free Account</Link>
                                <Link to="/login" className="btn-ghost text-base !py-4 !px-8">Sign In</Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ─── Footer ─── */}
            <footer className="relative z-10 border-t border-white/5 py-12 px-6">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 p-[1.5px]">
                            <div className="w-full h-full rounded-[6px] bg-navy-900 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-cyan-400" fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                        </div>
                        <span className="text-sm font-semibold text-white">Shield360</span>
                    </div>
                    <p className="text-xs text-slate-600">© 2025 Shield360 Cybersecurity Platform — AI-Driven Security for SMEs</p>
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-slate-500">All systems operational</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
