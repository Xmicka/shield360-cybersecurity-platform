import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

const fadeIn = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true as const }, transition: { duration: 0.5 } };

const team = [
    { name: "Akesh", role: "Lead Developer", component: "Spear Phishing Simulation", gradient: "from-cyan-400 to-blue-500" },
    { name: "Team Member", role: "Security Engineer", component: "Behaviour Intelligence Engine", gradient: "from-purple-400 to-pink-500" },
    { name: "Team Member", role: "IoT Security Specialist", component: "Device Behaviour Monitoring", gradient: "from-amber-400 to-orange-500" },
    { name: "Team Member", role: "Compliance Analyst", component: "Compliance & Policy Engine", gradient: "from-emerald-400 to-teal-500" },
];

const techStack = [
    { name: "React", desc: "Frontend Framework" },
    { name: "TypeScript", desc: "Type Safety" },
    { name: "Python", desc: "ML & Backend" },
    { name: "TensorFlow", desc: "AI Models" },
    { name: "Firebase", desc: "Auth & Database" },
    { name: "Three.js", desc: "3D Graphics" },
];

export default function About() {
    return (
        <div className="relative min-h-screen">
            <AnimatedBackground />
            <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative w-10 h-10"><div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-purple-500 opacity-80" /><div className="absolute inset-[2px] rounded-[10px] bg-navy-900 flex items-center justify-center"><svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-400" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" /></svg></div></div>
                        <span className="text-lg font-bold text-white tracking-tight">Shield360</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link to="/contact" className="btn-ghost text-sm !py-2.5 !px-5">Contact</Link>
                        <Link to="/pricing" className="btn-primary text-sm !py-2.5 !px-5">View Plans</Link>
                    </div>
                </div>
            </motion.nav>

            <div className="relative z-10 pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Mission */}
                    <motion.div {...fadeIn} className="text-center mb-24">
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">About Us</p>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                            Democratising <span className="gradient-text">cybersecurity</span> for SMEs
                        </h1>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
                            Small and medium enterprises face the same cyber threats as large corporations — but without the budget or expertise to combat them. Shield360 was built to change that.
                        </p>
                        <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
                            We combine AI-driven threat simulation, behavioural analytics, device monitoring, and compliance automation into a single, affordable platform. Our mission is to make enterprise-grade security accessible to every business, regardless of size.
                        </p>
                    </motion.div>

                    {/* Values */}
                    <motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                        {[
                            { title: "Affordable Security", desc: "Enterprise-grade protection at a fraction of the cost. Our subscription model means no massive upfront licensing fees.", icon: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
                            { title: "AI-First Approach", desc: "Machine learning models power everything from phishing simulation to anomaly detection, adapting to your organisation in real-time.", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" },
                            { title: "Zero Trust", desc: "Built on zero-trust principles from the ground up. Every request is verified, every anomaly is flagged, every device is monitored.", icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" },
                        ].map((v) => (
                            <div key={v.title} className="glass p-8 text-center">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-5">
                                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={v.icon} /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Team */}
                    <motion.div {...fadeIn} className="mb-24">
                        <div className="text-center mb-12">
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">The Team</p>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Built by security researchers</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {team.map((m, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass p-6 text-center group">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${m.gradient} p-[1px] mx-auto mb-4`}>
                                        <div className="w-full h-full rounded-2xl bg-navy-900 flex items-center justify-center">
                                            <span className="text-xl font-bold text-white">{m.name[0]}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-bold text-white mb-0.5">{m.name}</h3>
                                    <p className="text-[11px] text-slate-500 mb-3">{m.role}</p>
                                    <div className={`text-[10px] px-3 py-1 rounded-full bg-gradient-to-r ${m.gradient} bg-opacity-10 text-white/70 inline-block`}>{m.component}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Tech Stack */}
                    <motion.div {...fadeIn}>
                        <div className="text-center mb-12">
                            <p className="text-xs uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-4">Technology</p>
                            <h2 className="text-3xl font-bold text-white tracking-tight">Built with cutting-edge tools</h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                            {techStack.map((t) => (
                                <div key={t.name} className="glass-sm p-5 text-center hover:border-cyan-400/20 transition-colors group">
                                    <p className="text-sm font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{t.name}</p>
                                    <p className="text-[10px] text-slate-600">{t.desc}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
