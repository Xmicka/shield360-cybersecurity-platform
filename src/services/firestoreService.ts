import {
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    addDoc,
    query,
    orderBy,
    limit,
    getDocs,
    getCountFromServer,
    serverTimestamp,
    where,
    Timestamp,
    increment,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { MODULES } from "../config/services";
import type { PlanType } from "../config/services";
import type { UserRole } from "../context/subscriptionContext";

// ─── Types ───
export interface UserProfile {
    email: string;
    displayName: string;
    organization: string;
    plan: PlanType;
    role: UserRole;
    enabledModules: string[];
    createdAt: Timestamp | ReturnType<typeof serverTimestamp>;
    lastLogin: Timestamp | ReturnType<typeof serverTimestamp>;
}

export interface ActivityLog {
    userId: string;
    userEmail: string;
    event: string;
    module: string;
    severity: "info" | "medium" | "high" | "critical";
    timestamp: Timestamp | ReturnType<typeof serverTimestamp>;
}

export interface ModuleLaunch {
    userId: string;
    userEmail: string;
    moduleSlug: string;
    moduleName: string;
    timestamp: Timestamp | ReturnType<typeof serverTimestamp>;
}

// ─── User Profiles ───

export async function createUserProfile(
    uid: string,
    data: { email: string; displayName: string; organization: string }
): Promise<void> {
    await setDoc(doc(db, "users", uid), {
        email: data.email,
        displayName: data.displayName,
        organization: data.organization,
        plan: "free" as PlanType,
        role: "admin" as UserRole, // first user is admin by default for demo
        enabledModules: MODULES.map((m) => m.slug),
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
    });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
}

export async function updateUserProfile(
    uid: string,
    data: Partial<Pick<UserProfile, "plan" | "role" | "enabledModules" | "lastLogin">>
): Promise<void> {
    await updateDoc(doc(db, "users", uid), data);
}

export async function updateLastLogin(uid: string): Promise<void> {
    await updateDoc(doc(db, "users", uid), { lastLogin: serverTimestamp() });
}

// ─── Activity Logs ───

export async function logActivity(data: Omit<ActivityLog, "timestamp">): Promise<void> {
    await addDoc(collection(db, "activity"), {
        ...data,
        timestamp: serverTimestamp(),
    });
}

export async function getRecentActivity(count: number = 20): Promise<ActivityLog[]> {
    const q = query(collection(db, "activity"), orderBy("timestamp", "desc"), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data() } as ActivityLog));
}

// ─── Module Launches ───

export async function logModuleLaunch(data: Omit<ModuleLaunch, "timestamp">): Promise<void> {
    await addDoc(collection(db, "moduleLaunches"), {
        ...data,
        timestamp: serverTimestamp(),
    });
}

export async function getModuleLaunchStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    for (const mod of MODULES) {
        const q = query(collection(db, "moduleLaunches"), where("moduleSlug", "==", mod.slug));
        const snap = await getCountFromServer(q);
        stats[mod.slug] = snap.data().count;
    }
    return stats;
}

export async function getRecentLaunches(count: number = 10): Promise<ModuleLaunch[]> {
    const q = query(collection(db, "moduleLaunches"), orderBy("timestamp", "desc"), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data() } as ModuleLaunch));
}

// ─── Admin Stats ───

export async function getTotalUserCount(): Promise<number> {
    const snap = await getCountFromServer(collection(db, "users"));
    return snap.data().count;
}

export async function getTotalLaunchCount(): Promise<number> {
    const snap = await getCountFromServer(collection(db, "moduleLaunches"));
    return snap.data().count;
}

export async function getRecentUsers(count: number = 5): Promise<UserProfile[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data() } as UserProfile));
}

// ─── Usage Tracking ───

function getCurrentMonthKey(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export async function getMonthlyUsage(uid: string): Promise<Record<string, number>> {
    const monthKey = getCurrentMonthKey();
    const snap = await getDoc(doc(db, "users", uid, "usage", monthKey));
    if (!snap.exists()) return {};
    const data = snap.data();
    // Filter out non-numeric fields (like timestamps)
    const usage: Record<string, number> = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === "number") usage[key] = value;
    }
    return usage;
}

export async function incrementModuleUsage(uid: string, moduleSlug: string): Promise<void> {
    const monthKey = getCurrentMonthKey();
    const usageRef = doc(db, "users", uid, "usage", monthKey);
    await setDoc(usageRef, {
        [moduleSlug]: increment(1),
        lastUpdated: serverTimestamp(),
    }, { merge: true });
}
