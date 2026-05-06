import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { supabase } from "../config/supabase";
import { createUserProfile, getUserProfile, updateLastLogin } from "../services/supabaseService";

/**
 * Normalised user shape used throughout the app.
 * Compatible with the previous Firebase `User` interface so
 * `user.uid`, `user.email`, `user.displayName` keep working.
 */
export interface AppUser {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    user: AppUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, organization: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

function mapSupabaseUser(u: { id: string; email?: string | null; user_metadata?: Record<string, unknown> } | null): AppUser | null {
    if (!u) return null;
    const meta = (u.user_metadata ?? {}) as Record<string, unknown>;
    const displayName =
        (typeof meta.display_name === "string" && meta.display_name) ||
        (typeof meta.full_name === "string" && meta.full_name) ||
        (typeof meta.name === "string" && meta.name) ||
        null;
    return {
        uid: u.id,
        email: u.email ?? null,
        displayName: displayName as string | null,
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get initial session
        supabase.auth.getSession().then(({ data }: { data: { session: { user: any } | null } }) => {
            setUser(mapSupabaseUser(data.session?.user ?? null));
            setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
            setUser(mapSupabaseUser(session?.user ?? null));
            setLoading(false);
        });

        return () => {
            subscription.subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            // Re-throw with a Firebase-like code so existing UI error mapping keeps working
            const lower = (error.message || "").toLowerCase();
            const code =
                lower.includes("invalid") ? "auth/invalid-credential"
                : lower.includes("not confirmed") ? "auth/user-not-found"
                : lower.includes("rate") ? "auth/too-many-requests"
                : "auth/unknown";
            throw Object.assign(new Error(error.message), { code });
        }
        if (data.user) {
            try {
                await updateLastLogin(data.user.id);
            } catch { /* non-critical */ }
        }
    };

    const signup = async (name: string, email: string, password: string, organization: string) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { display_name: name, organization } },
        });
        if (error) {
            const lower = (error.message || "").toLowerCase();
            const code =
                lower.includes("already") || lower.includes("registered") ? "auth/email-already-in-use"
                : lower.includes("weak") || lower.includes("6 char") ? "auth/weak-password"
                : lower.includes("invalid email") ? "auth/invalid-email"
                : "auth/unknown";
            throw Object.assign(new Error(error.message), { code });
        }
        if (data.user) {
            try {
                await createUserProfile(data.user.id, { email, displayName: name, organization });
            } catch { /* non-critical */ }
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const resetPassword = async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
    };

    // Bootstrap profile when user is set but profile doesn't yet exist
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const profile = await getUserProfile(user.uid);
                if (!profile) {
                    await createUserProfile(user.uid, {
                        email: user.email || "",
                        displayName: user.displayName || "User",
                        organization: "",
                    });
                } else {
                    await updateLastLogin(user.uid);
                }
            } catch { /* non-critical */ }
        })();
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
