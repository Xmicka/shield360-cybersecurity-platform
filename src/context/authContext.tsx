import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../config/firebase";
import { createUserProfile, getUserProfile, updateLastLogin } from "../services/firestoreService";

interface AuthState {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, organization: string) => Promise<void>;
    logout: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        });
        return unsub;
    }, []);

    const login = async (email: string, password: string) => {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Update last login timestamp
        try {
            await updateLastLogin(cred.user.uid);
        } catch {
            // Firestore update is non-critical
        }
    };

    const signup = async (name: string, email: string, password: string, organization: string) => {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name });
        // Create Firestore user profile
        await createUserProfile(cred.user.uid, { email, displayName: name, organization });
    };

    const logout = async () => {
        await signOut(auth);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        // Check if user profile exists, if not create one
        const profile = await getUserProfile(cred.user.uid);
        if (!profile) {
            await createUserProfile(cred.user.uid, {
                email: cred.user.email || "",
                displayName: cred.user.displayName || "User",
                organization: "",
            });
        } else {
            await updateLastLogin(cred.user.uid);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout, resetPassword, loginWithGoogle }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
