import { supabase } from "../config/supabase";
import { MODULES } from "../config/services";
import type { PlanType } from "../config/services";
import type { UserRole } from "../context/subscriptionContext";

// ─── Types (mirror firestoreService for drop-in compatibility) ───
export interface UserProfile {
    id?: string;
    email: string;
    displayName: string;
    organization: string;
    plan: PlanType;
    role: UserRole;
    enabledModules: string[];
    createdAt: string | null;
    lastLogin: string | null;
}

export interface ActivityLog {
    userId: string;
    userEmail: string;
    event: string;
    module: string;
    severity: "info" | "medium" | "high" | "critical";
    timestamp: string | null;
}

export interface ModuleLaunch {
    userId: string;
    userEmail: string;
    moduleSlug: string;
    moduleName: string;
    timestamp: string | null;
}

const PROFILES = "profiles";
const ACTIVITY = "activity_logs";
const LAUNCHES = "module_launches";
const USAGE = "module_usage";

function currentMonthKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// ─── User Profiles ───

export async function createUserProfile(
    uid: string,
    data: { email: string; displayName: string; organization: string }
): Promise<void> {
    const { error } = await supabase.from(PROFILES).insert({
        id: uid,
        email: data.email,
        display_name: data.displayName,
        organization: data.organization,
        plan: "free",
        role: "user",
        enabled_modules: MODULES.map((m) => m.slug),
        created_at: new Date().toISOString(),
        last_login: new Date().toISOString(),
    });
    if (error) throw error;
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
    const { data, error } = await supabase.from(PROFILES).select("*").eq("id", uid).maybeSingle();
    if (error) throw error;
    if (!data) return null;
    return {
        id: data.id,
        email: data.email,
        displayName: data.display_name,
        organization: data.organization,
        plan: data.plan,
        role: data.role,
        enabledModules: data.enabled_modules ?? MODULES.map((m) => m.slug),
        createdAt: data.created_at,
        lastLogin: data.last_login,
    };
}

export async function updateUserProfile(
    uid: string,
    data: Partial<{ plan: PlanType; role: UserRole; enabledModules: string[]; lastLogin: string }>
): Promise<void> {
    const payload: Record<string, unknown> = {};
    if (data.plan !== undefined) payload.plan = data.plan;
    if (data.role !== undefined) payload.role = data.role;
    if (data.enabledModules !== undefined) payload.enabled_modules = data.enabledModules;
    if (data.lastLogin !== undefined) payload.last_login = data.lastLogin;
    const { error } = await supabase.from(PROFILES).update(payload).eq("id", uid);
    if (error) throw error;
}

export async function updateLastLogin(uid: string): Promise<void> {
    const { error } = await supabase.from(PROFILES).update({ last_login: new Date().toISOString() }).eq("id", uid);
    if (error) throw error;
}

// ─── Activity Logs ───

export async function logActivity(data: Omit<ActivityLog, "timestamp">): Promise<void> {
    const { error } = await supabase.from(ACTIVITY).insert({
        user_id: data.userId,
        user_email: data.userEmail,
        event: data.event,
        module: data.module,
        severity: data.severity,
    });
    if (error) throw error;
}

export async function getRecentActivity(count: number = 20): Promise<ActivityLog[]> {
    const { data, error } = await supabase.from(ACTIVITY).select("*").order("created_at", { ascending: false }).limit(count);
    if (error) throw error;
    return (data ?? []).map((d: any) => ({
        userId: d.user_id,
        userEmail: d.user_email,
        event: d.event,
        module: d.module,
        severity: d.severity,
        timestamp: d.created_at,
    }));
}

// ─── Module Launches ───

export async function logModuleLaunch(data: Omit<ModuleLaunch, "timestamp">): Promise<void> {
    const { error } = await supabase.from(LAUNCHES).insert({
        user_id: data.userId,
        user_email: data.userEmail,
        module_slug: data.moduleSlug,
        module_name: data.moduleName,
    });
    if (error) throw error;
}

export async function getModuleLaunchStats(): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    for (const mod of MODULES) {
        const { count } = await supabase
            .from(LAUNCHES)
            .select("*", { count: "exact", head: true })
            .eq("module_slug", mod.slug);
        stats[mod.slug] = count ?? 0;
    }
    return stats;
}

export async function getRecentLaunches(count: number = 10): Promise<ModuleLaunch[]> {
    const { data, error } = await supabase.from(LAUNCHES).select("*").order("created_at", { ascending: false }).limit(count);
    if (error) throw error;
    return (data ?? []).map((d: any) => ({
        userId: d.user_id,
        userEmail: d.user_email,
        moduleSlug: d.module_slug,
        moduleName: d.module_name,
        timestamp: d.created_at,
    }));
}

// ─── Admin Stats ───

export async function getTotalUserCount(): Promise<number> {
    const { count, error } = await supabase.from(PROFILES).select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
}

export async function getTotalLaunchCount(): Promise<number> {
    const { count, error } = await supabase.from(LAUNCHES).select("*", { count: "exact", head: true });
    if (error) throw error;
    return count ?? 0;
}

export async function getRecentUsers(count: number = 5): Promise<UserProfile[]> {
    const { data, error } = await supabase.from(PROFILES).select("*").order("created_at", { ascending: false }).limit(count);
    if (error) throw error;
    return (data ?? []).map((d) => ({
        id: d.id,
        email: d.email,
        displayName: d.display_name,
        organization: d.organization,
        plan: d.plan,
        role: d.role,
        enabledModules: d.enabled_modules ?? [],
        createdAt: d.created_at,
        lastLogin: d.last_login,
    }));
}

// ─── Usage Tracking ───

export async function getMonthlyUsage(uid: string): Promise<Record<string, number>> {
    const month = currentMonthKey();
    const { data, error } = await supabase
        .from(USAGE)
        .select("module_slug, count")
        .eq("user_id", uid)
        .eq("month", month);
    if (error) throw error;
    const usage: Record<string, number> = {};
    for (const row of data ?? []) usage[row.module_slug] = row.count;
    return usage;
}

export async function incrementModuleUsage(uid: string, moduleSlug: string): Promise<void> {
    const month = currentMonthKey();
    // Try to find existing row
    const { data: existing, error: selErr } = await supabase
        .from(USAGE)
        .select("count")
        .eq("user_id", uid)
        .eq("module_slug", moduleSlug)
        .eq("month", month)
        .maybeSingle();
    if (selErr) throw selErr;
    if (existing) {
        const { error } = await supabase
            .from(USAGE)
            .update({ count: existing.count + 1 })
            .eq("user_id", uid)
            .eq("module_slug", moduleSlug)
            .eq("month", month);
        if (error) throw error;
    } else {
        const { error } = await supabase.from(USAGE).insert({
            user_id: uid,
            module_slug: moduleSlug,
            month,
            count: 1,
        });
        if (error) throw error;
    }
}
