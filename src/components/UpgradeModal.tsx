import { motion, AnimatePresence } from "framer-motion";

interface UpgradeModalProps {
    isOpen: boolean;
    onClose: () => void;
    moduleName: string;
    onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, moduleName, onUpgrade }: UpgradeModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100]"
                        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md mx-4"
                    >
                        <div
                            className="rounded-2xl p-8 relative overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, rgba(15, 22, 41, 0.95) 0%, rgba(5, 8, 16, 0.98) 100%)",
                                border: "1px solid rgba(34, 211, 238, 0.15)",
                                boxShadow: "0 0 80px rgba(34, 211, 238, 0.08), 0 25px 60px rgba(0,0,0,0.5)",
                            }}
                        >
                            {/* Top accent */}
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: "linear-gradient(90deg, #22d3ee, #a855f7)" }}
                            />

                            {/* Glow */}
                            <div
                                className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 rounded-full"
                                style={{ background: "radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)" }}
                            />

                            {/* Close button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                            >
                                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Content */}
                            <div className="relative z-10 text-center">
                                {/* Lock icon */}
                                <div
                                    className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                                    style={{
                                        background: "linear-gradient(135deg, rgba(34,211,238,0.1), rgba(168,85,247,0.1))",
                                        border: "1px solid rgba(34,211,238,0.2)",
                                    }}
                                >
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                                        />
                                    </svg>
                                </div>

                                <h2 className="text-xl font-bold text-white mb-2">Premium Module</h2>
                                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                    <span className="text-white font-semibold">{moduleName}</span> is part of the{" "}
                                    <span className="text-cyan-400 font-semibold">Shield360 Premium</span> tier. Upgrade
                                    to unlock advanced security capabilities.
                                </p>

                                {/* Premium features */}
                                <div className="mb-6 space-y-2">
                                    {[
                                        "Full access to all 4 security modules",
                                        "Advanced AI-driven analytics",
                                        "Priority support & SLA guarantee",
                                        "Unlimited team seats",
                                    ].map((feat) => (
                                        <div key={feat} className="flex items-center gap-2 text-left">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="w-4 h-4 text-cyan-400 shrink-0"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                            </svg>
                                            <span className="text-sm text-slate-400">{feat}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.06)",
                                        }}
                                    >
                                        Maybe Later
                                    </button>
                                    <button
                                        onClick={onUpgrade}
                                        className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                                        style={{
                                            background: "linear-gradient(135deg, #22d3ee, #3b82f6)",
                                        }}
                                    >
                                        Upgrade Now
                                    </button>
                                </div>

                                <p className="text-[10px] text-slate-600 mt-4">
                                    No payment required for demo — click Upgrade to instantly unlock
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
