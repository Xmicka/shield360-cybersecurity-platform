import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

export default function Login() {
    const navigate = useNavigate();
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err: unknown) {
            const code = (err as { code?: string }).code || "";
            if (code === "auth/user-not-found" || code === "auth/wrong-password" || code === "auth/invalid-credential") {
                setError("Invalid email or password");
            } else if (code === "auth/too-many-requests") {
                setError("Too many attempts. Please try again later.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError("");
        try {
            await loginWithGoogle();
            navigate("/dashboard");
        } catch {
            setError("Google sign-in failed. Please try again.");
        }
    };

    return (
        <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", display: "flex", position: "relative", overflow: "hidden" }}>
            {/* Soft pastel background blobs */}
            <div style={{ position: "absolute", top: -120, right: -120, width: 480, height: 480, background: "rgba(168,200,219,0.35)", borderRadius: "50%", filter: "blur(120px)" }} />
            <div style={{ position: "absolute", bottom: -120, left: -120, width: 360, height: 360, background: "rgba(184,169,201,0.30)", borderRadius: "50%", filter: "blur(120px)" }} />

            {/* Left Panel */}
            <div className="hidden lg:flex" style={{ width: "50%", position: "relative", alignItems: "center", justifyContent: "center", padding: 48 }}>
                <motion.div
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ position: "relative", zIndex: 10, maxWidth: 440 }}
                >
                    <div style={{ marginBottom: 36 }}>
                        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 12,
                                background: "linear-gradient(135deg, #6ba3be 0%, #8aab96 100%)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                boxShadow: "0 4px 12px rgba(107,163,190,0.25)",
                            }}>
                                <svg viewBox="0 0 24 24" style={{ width: 22, height: 22, color: "#fff" }} fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>Shield360</span>
                        </Link>
                    </div>

                    <h2 style={{ fontSize: 32, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.15, letterSpacing: "-0.025em", marginBottom: 16 }}>
                        Protect your organisation with{" "}
                        <span className="gradient-text" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}>
                            unified intelligence
                        </span>
                    </h2>
                    <p style={{ color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: 32, fontSize: 15 }}>
                        Access your cybersecurity dashboard to monitor threats, track compliance, and manage your security posture in real-time.
                    </p>

                    <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>256-bit encrypted</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                            <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>SOC 2 Compliant</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Right Panel */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", zIndex: 10 }}>
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="glass-card"
                    style={{ width: "100%", maxWidth: 440, padding: "40px 36px" }}
                >
                    <div className="lg:hidden" style={{ marginBottom: 24, textAlign: "center" }}>
                        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: "linear-gradient(135deg, #6ba3be, #8aab96)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}>
                                <svg viewBox="0 0 24 24" style={{ width: 18, height: 18, color: "#fff" }} fill="currentColor">
                                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                                </svg>
                            </div>
                            <span style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)" }}>Shield360</span>
                        </Link>
                    </div>

                    <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6, letterSpacing: "-0.02em" }}>Welcome back</h1>
                    <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginBottom: 28 }}>Sign in to access your security dashboard</p>

                    {error && (
                        <div style={{
                            marginBottom: 18, padding: "10px 14px", borderRadius: 12,
                            fontSize: 13, fontWeight: 500, color: "var(--color-status-error)",
                            background: "rgba(201,112,112,0.10)", border: "1px solid rgba(201,112,112,0.25)",
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, display: "block" }}>Email</label>
                            <input
                                type="email"
                                className="input-premium"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6, display: "block" }}>Password</label>
                            <input
                                type="password"
                                className="input-premium"
                                placeholder="••••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                <input type="checkbox" style={{ width: 14, height: 14, accentColor: "var(--color-brand-blue)" }} />
                                <span style={{ fontSize: 12, color: "var(--color-text-muted)" }}>Remember me</span>
                            </label>
                            <button type="button" style={{ fontSize: 12, color: "var(--color-brand-blue)", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>Forgot password?</button>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 6 }}>
                            {loading ? (
                                <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%" }} className="animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <svg viewBox="0 0 24 24" style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </>
                            )}
                        </button>
                    </form>

                    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
                        <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                        <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>or</span>
                        <div style={{ flex: 1, height: 1, background: "var(--color-border)" }} />
                    </div>

                    <button
                        onClick={handleGoogle}
                        className="btn-ghost"
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                    >
                        <svg viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continue with Google
                    </button>

                    <p style={{ fontSize: 13, color: "var(--color-text-muted)", textAlign: "center", marginTop: 24 }}>
                        Don{"'"}t have an account?{" "}
                        <Link to="/signup" style={{ color: "var(--color-brand-blue)", fontWeight: 600 }}>Create one</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
