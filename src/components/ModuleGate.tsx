import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSubscription } from "../context/subscriptionContext";

interface Props {
    moduleSlug: string;
    moduleName: string;
    children: React.ReactNode;
}

export default function ModuleGate({ moduleSlug, moduleName, children }: Props) {
    const { hasAccess, canUse, plan, getRemainingUses, getModuleLimit } = useSubscription();

    const accessible = hasAccess(moduleSlug);
    const usable = canUse(moduleSlug);

    // Fully accessible and within usage limits
    if (accessible && usable) {
        return <>{children}</>;
    }

    // Has access but hit usage limit
    const isUsageLimited = accessible && !usable;
    const limit = getModuleLimit(moduleSlug);
    const remaining = getRemainingUses(moduleSlug);

    return (
        <div className="relative min-h-[60vh]">
            {/* Blurred preview */}
            <div className="filter blur-[6px] pointer-events-none opacity-30 select-none">
                {children}
            </div>

            {/* Paywall overlay */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 z-30 flex items-center justify-center"
            >
                <div className="glass p-10 max-w-md text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500" />

                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-purple-500/20 flex items-center justify-center mx-auto mb-6">
                        <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.5}>
                            {isUsageLimited ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            )}
                        </svg>
                    </div>

                    {isUsageLimited ? (
                        <>
                            <h3 className="text-xl font-bold text-white mb-2">Monthly Limit Reached</h3>
                            <p className="text-sm text-slate-400 mb-2 leading-relaxed">
                                You've used all <span className="text-cyan-400 font-semibold">{limit}</span> uses of{" "}
                                <span className="text-white font-semibold">{moduleName}</span> this month.
                            </p>
                            <p className="text-xs text-slate-500 mb-6">
                                Upgrade your plan for higher limits or unlimited access.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-white mb-2">Upgrade to Access</h3>
                            <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                                <span className="text-white font-semibold">{moduleName}</span> requires a higher subscription tier.
                                {plan === "free"
                                    ? " Upgrade to Professional to unlock all modules."
                                    : " Upgrade your current plan to unlock this module."}
                            </p>
                        </>
                    )}

                    <Link to="/pricing" className="btn-primary inline-flex items-center gap-2 !text-sm">
                        {isUsageLimited ? "Upgrade for More" : "View Plans"}
                        <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                    </Link>

                    <p className="text-[11px] text-slate-600 mt-4">
                        Current plan: <span className="text-cyan-400 font-semibold capitalize">{plan}</span>
                        {accessible && ` · ${remaining}/${limit} uses remaining`}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
