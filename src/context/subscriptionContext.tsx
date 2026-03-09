import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { MODULES, getPlanById } from "../config/services";
import type { PlanType } from "../config/services";
import { useAuth } from "./authContext";
import { getUserProfile, updateUserProfile, getMonthlyUsage, incrementModuleUsage } from "../services/firestoreService";

export type { PlanType };
export type UserRole = "user" | "admin";

export interface SubscriptionState {
    plan: PlanType;
    role: UserRole;
    setPlan: (plan: PlanType) => void;
    setRole: (role: UserRole) => void;
    hasAccess: (moduleSlug: string) => boolean;
    canUse: (moduleSlug: string) => boolean;
    getRemainingUses: (moduleSlug: string) => number;
    getModuleLimit: (moduleSlug: string) => number;
    getModuleUsage: (moduleSlug: string) => number;
    recordUsage: (moduleSlug: string) => Promise<boolean>;
    // Admin can toggle individual modules on/off
    enabledModules: string[];
    toggleModule: (slug: string) => void;
    firestoreLoaded: boolean;
    monthlyUsage: Record<string, number>;
    refreshUsage: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

/** Normalize legacy plan values (e.g. "premium" → "professional") */
function normalizePlan(raw: string | undefined | null): PlanType {
    if (raw === "premium") return "professional";
    if (raw === "professional" || raw === "enterprise") return raw;
    return "free";
}

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [firestoreLoaded, setFirestoreLoaded] = useState(false);

    const [plan, setPlanState] = useState<PlanType>(() => {
        return normalizePlan(localStorage.getItem("s360_plan"));
    });
    const [role, setRoleState] = useState<UserRole>(() => {
        const saved = localStorage.getItem("s360_role");
        return (saved as UserRole) || "admin";
    });
    const [enabledModules, setEnabledModules] = useState<string[]>(() => {
        const saved = localStorage.getItem("s360_enabled_modules");
        if (saved) return JSON.parse(saved);
        return MODULES.map((m) => m.slug);
    });
    const [monthlyUsage, setMonthlyUsage] = useState<Record<string, number>>({});

    // Load usage from Firestore
    const refreshUsage = useCallback(async () => {
        if (!user) return;
        try {
            const usage = await getMonthlyUsage(user.uid);
            setMonthlyUsage(usage);
        } catch {
            // Non-critical
        }
    }, [user]);

    // Load user profile + usage from Firestore when authenticated
    useEffect(() => {
        if (!user) {
            setFirestoreLoaded(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const [profile, usage] = await Promise.all([
                    getUserProfile(user.uid),
                    getMonthlyUsage(user.uid),
                ]);
                if (profile && !cancelled) {
                    setPlanState(normalizePlan(profile.plan));
                    setRoleState(profile.role || "admin");
                    if (profile.enabledModules?.length) {
                        setEnabledModules(profile.enabledModules);
                    }
                }
                if (!cancelled) setMonthlyUsage(usage);
            } catch {
                // Firestore load failed - fall back to localStorage
            } finally {
                if (!cancelled) setFirestoreLoaded(true);
            }
        })();
        return () => { cancelled = true; };
    }, [user]);

    // Sync to localStorage (always available as fallback/cache)
    useEffect(() => { localStorage.setItem("s360_plan", plan); }, [plan]);
    useEffect(() => { localStorage.setItem("s360_role", role); }, [role]);
    useEffect(() => { localStorage.setItem("s360_enabled_modules", JSON.stringify(enabledModules)); }, [enabledModules]);

    // Persist to Firestore when values change
    const syncToFirestore = useCallback(async (data: Parameters<typeof updateUserProfile>[1]) => {
        if (!user) return;
        try {
            await updateUserProfile(user.uid, data);
        } catch {
            // Non-critical: localStorage is still the fallback
        }
    }, [user]);

    // ─── Access & Usage helpers ───

    const hasAccess = (moduleSlug: string): boolean => {
        const mod = MODULES.find((m) => m.slug === moduleSlug);
        if (!mod) return false;
        if (!enabledModules.includes(moduleSlug)) return false;
        const planConfig = getPlanById(plan);
        if (!planConfig) return false;
        return moduleSlug in planConfig.moduleLimits;
    };

    const getModuleLimit = (moduleSlug: string): number => {
        const planConfig = getPlanById(plan);
        if (!planConfig) return 0;
        return planConfig.moduleLimits[moduleSlug] ?? 0;
    };

    const getModuleUsage = (moduleSlug: string): number => {
        return monthlyUsage[moduleSlug] || 0;
    };

    const getRemainingUses = (moduleSlug: string): number => {
        const limit = getModuleLimit(moduleSlug);
        if (limit === -1) return -1; // unlimited
        return Math.max(0, limit - getModuleUsage(moduleSlug));
    };

    const canUse = (moduleSlug: string): boolean => {
        if (!hasAccess(moduleSlug)) return false;
        const limit = getModuleLimit(moduleSlug);
        if (limit === -1) return true; // unlimited
        return getModuleUsage(moduleSlug) < limit;
    };

    const recordUsage = async (moduleSlug: string): Promise<boolean> => {
        if (!canUse(moduleSlug)) return false;
        // Optimistic local update
        setMonthlyUsage((prev) => ({
            ...prev,
            [moduleSlug]: (prev[moduleSlug] || 0) + 1,
        }));
        // Persist to Firestore
        if (user) {
            try {
                await incrementModuleUsage(user.uid, moduleSlug);
            } catch {
                // Revert on failure
                setMonthlyUsage((prev) => ({
                    ...prev,
                    [moduleSlug]: Math.max(0, (prev[moduleSlug] || 0) - 1),
                }));
                return false;
            }
        }
        return true;
    };

    const setPlan = (newPlan: PlanType) => {
        setPlanState(newPlan);
        syncToFirestore({ plan: newPlan });
    };

    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        syncToFirestore({ role: newRole });
    };

    const toggleModule = (slug: string) => {
        setEnabledModules((prev) => {
            const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
            syncToFirestore({ enabledModules: next });
            return next;
        });
    };

    return (
        <SubscriptionContext.Provider
            value={{
                plan, role, setPlan, setRole,
                hasAccess, canUse, getRemainingUses,
                getModuleLimit, getModuleUsage, recordUsage,
                enabledModules, toggleModule,
                firestoreLoaded, monthlyUsage, refreshUsage,
            }}
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
