import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

export type PlanType = "free" | "starter" | "professional" | "enterprise";

export interface PlanInfo {
    id: PlanType;
    name: string;
    price: number;
    annualPrice: number;
    features: string[];
    modules: string[];
}

export const PLANS: PlanInfo[] = [
    {
        id: "starter",
        name: "Starter",
        price: 49,
        annualPrice: 39,
        features: [
            "Dashboard Overview",
            "Spear Phishing Simulation",
            "Basic Risk Scoring",
            "Email Reports",
            "5 User Seats",
        ],
        modules: ["spear-phishing"],
    },
    {
        id: "professional",
        name: "Professional",
        price: 129,
        annualPrice: 99,
        features: [
            "Everything in Starter",
            "Behaviour Intelligence Engine",
            "Device Behaviour Monitoring",
            "Advanced Analytics",
            "25 User Seats",
            "Priority Support",
        ],
        modules: ["spear-phishing", "behaviour-engine", "device-monitoring"],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 299,
        annualPrice: 239,
        features: [
            "Everything in Professional",
            "Compliance & Policy Engine",
            "Custom Integrations",
            "Unlimited Seats",
            "Dedicated Account Manager",
            "SLA Guarantee",
            "On-premise Option",
        ],
        modules: ["spear-phishing", "behaviour-engine", "device-monitoring", "compliance-engine"],
    },
];

interface SubscriptionState {
    plan: PlanType;
    billing: "monthly" | "annual";
    setPlan: (plan: PlanType, billing?: "monthly" | "annual") => void;
    hasAccess: (moduleSlug: string) => boolean;
    currentPlan: PlanInfo | null;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [plan, setPlanState] = useState<PlanType>(() => {
        const saved = localStorage.getItem("s360_plan");
        return (saved as PlanType) || "free";
    });
    const [billing, setBilling] = useState<"monthly" | "annual">(() => {
        const saved = localStorage.getItem("s360_billing");
        return (saved as "monthly" | "annual") || "monthly";
    });

    useEffect(() => {
        localStorage.setItem("s360_plan", plan);
        localStorage.setItem("s360_billing", billing);
    }, [plan, billing]);

    const currentPlan = PLANS.find((p) => p.id === plan) || null;

    const hasAccess = (moduleSlug: string): boolean => {
        if (plan === "free") return false;
        const p = PLANS.find((pl) => pl.id === plan);
        return p ? p.modules.includes(moduleSlug) : false;
    };

    const setPlan = (newPlan: PlanType, newBilling?: "monthly" | "annual") => {
        setPlanState(newPlan);
        if (newBilling) setBilling(newBilling);
    };

    return (
        <SubscriptionContext.Provider value={{ plan, billing, setPlan, hasAccess, currentPlan }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
    return ctx;
}
