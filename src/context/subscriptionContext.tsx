import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { MODULES } from "../config/services";

export type PlanType = "free" | "premium";
export type UserRole = "user" | "admin";

export interface SubscriptionState {
    plan: PlanType;
    role: UserRole;
    setPlan: (plan: PlanType) => void;
    setRole: (role: UserRole) => void;
    hasAccess: (moduleSlug: string) => boolean;
    // Admin can toggle individual modules on/off
    enabledModules: string[];
    toggleModule: (slug: string) => void;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [plan, setPlanState] = useState<PlanType>(() => {
        const saved = localStorage.getItem("s360_plan");
        return (saved as PlanType) || "free";
    });
    const [role, setRoleState] = useState<UserRole>(() => {
        const saved = localStorage.getItem("s360_role");
        return (saved as UserRole) || "admin";
    });
    const [enabledModules, setEnabledModules] = useState<string[]>(() => {
        const saved = localStorage.getItem("s360_enabled_modules");
        if (saved) return JSON.parse(saved);
        // Default: all modules enabled
        return MODULES.map((m) => m.slug);
    });

    useEffect(() => {
        localStorage.setItem("s360_plan", plan);
    }, [plan]);

    useEffect(() => {
        localStorage.setItem("s360_role", role);
    }, [role]);

    useEffect(() => {
        localStorage.setItem("s360_enabled_modules", JSON.stringify(enabledModules));
    }, [enabledModules]);

    const hasAccess = (moduleSlug: string): boolean => {
        const mod = MODULES.find((m) => m.slug === moduleSlug);
        if (!mod) return false;
        // Check if admin has enabled this module
        if (!enabledModules.includes(moduleSlug)) return false;
        // Free tier: only free modules
        if (mod.tier === "free") return true;
        // Premium tier: need premium plan
        return plan === "premium";
    };

    const setPlan = (newPlan: PlanType) => {
        setPlanState(newPlan);
    };

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
    };

    const toggleModule = (slug: string) => {
        setEnabledModules((prev) =>
            prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
        );
    };

    return (
        <SubscriptionContext.Provider
            value={{ plan, role, setPlan, setRole, hasAccess, enabledModules, toggleModule }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const ctx = useContext(SubscriptionContext);
    if (!ctx) throw new Error("useSubscription must be used within SubscriptionProvider");
    return ctx;
}
