import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-cream)" }}>
                <div className="flex flex-col items-center gap-5">
                    <div style={{ position: "relative", width: 56, height: 56 }}>
                        <div className="animate-pulse-soft" style={{
                            position: "absolute", inset: 0, borderRadius: 16,
                            background: "linear-gradient(135deg, #B8A1E6 0%, #3D5A47 100%)",
                            boxShadow: "0 8px 24px rgba(184,161,230,0.35)",
                        }} />
                        <div style={{
                            position: "absolute", inset: 3, borderRadius: 13,
                            background: "var(--color-bg-cream)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            <svg viewBox="0 0 24 24" style={{ width: 26, height: 26, color: "#B8A1E6" }} fill="currentColor">
                                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                            </svg>
                        </div>
                    </div>
                    <div className="animate-spin" style={{
                        width: 24, height: 24,
                        border: "2px solid rgba(184,161,230,0.25)",
                        borderTopColor: "#B8A1E6",
                        borderRadius: "50%",
                    }} />
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
