/**
 * Compatibility shim — delegates to the Supabase service so existing
 * call sites that import from "./firestoreService" keep working.
 *
 * Migration in progress: prefer importing from "./supabaseService" directly
 * in new code.
 */
export type {
    UserProfile,
    ActivityLog,
    ModuleLaunch,
} from "./supabaseService";

export {
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    updateLastLogin,
    logActivity,
    getRecentActivity,
    logModuleLaunch,
    getModuleLaunchStats,
    getRecentLaunches,
    getTotalUserCount,
    getTotalLaunchCount,
    getRecentUsers,
    getMonthlyUsage,
    incrementModuleUsage,
} from "./supabaseService";
