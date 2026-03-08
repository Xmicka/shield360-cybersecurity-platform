import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import { MODULES } from "../config/services";
import { useAuth } from "./authContext";
import { getUserProfile, updateUserProfile } from "../services/firestoreService";

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
    firestoreLoaded: boolean;
}

const SubscriptionContext = createContext<SubscriptionState | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [firestoreLoaded, setFirestoreLoaded] = useState(false);

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
        return MODULES.map((m) => m.slug);
    });

    // Load user profile from Firestore when authenticated
    useEffect(() => {
        if (!user) {
            setFirestoreLoaded(false);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const profile = await getUserProfile(user.uid);
                if (profile && !cancelled) {
                    setPlanState(profile.plan || "free");
                    setRoleState(profile.role || "admin");
                    if (profile.enabledModules?.length) {
                        setEnabledModules(profile.enabledModules);
                    }
                }
            } catch {
                // Firestore load failed — fall back to localStorage
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

    const hasAccess = (moduleSlug: string): boolean => {
        const mod = MODULES.find((m) => m.slug === moduleSlug);
        if (!mod) return false;
        if (!enabledModules.includes(moduleSlug)) return false;
        if (mod.tier === "free") return true;
        return plan === "premium";
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
            value={{ plan, role, setPlan, setRole, hasAccess, enabledModules, toggleModule, firestoreLoaded }}
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
