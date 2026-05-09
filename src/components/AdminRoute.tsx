import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useSubscription } from "../context/subscriptionContext";

/**
 * Gate routes that require an admin role. Pairs with <ProtectedRoute>.
 * Redirects authenticated non-admins to /dashboard, and unauthenticated
 * users to /login (loading state handled by ProtectedRoute upstream).
 */
export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading: authLoading } = useAuth();
    const { role } = useSubscription();

    if (authLoading) {
        return (
            <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 24, height: 24, border: "2px solid var(--color-border)", borderTopColor: "var(--color-brand-lavender-dark)", borderRadius: "50%" }} className="animate-spin" />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;
    if (role !== "admin") return <Navigate to="/dashboard" replace />;

    return <>{children}</>;
}
