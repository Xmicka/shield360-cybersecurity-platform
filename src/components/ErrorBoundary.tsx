import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
    children: ReactNode;
}

interface State {
    error: Error | null;
}

/**
 * Top-level error boundary. Wraps <Routes> to keep one render error from
 * blanking the whole app. When an error tracker is added later (Sentry,
 * PostHog Errors), forward `error` + `info` from componentDidCatch.
 */
export default class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null };

    static getDerivedStateFromError(error: Error): State {
        return { error };
    }

    componentDidCatch(error: Error, info: ErrorInfo): void {
        // TODO: forward to Sentry / PostHog when wired
        if (import.meta.env.DEV) {
            // eslint-disable-next-line no-console
            console.error("[ErrorBoundary]", error, info.componentStack);
        }
    }

    handleReset = () => {
        this.setState({ error: null });
    };

    handleReload = () => {
        window.location.assign("/");
    };

    render() {
        if (!this.state.error) return this.props.children;

        const message = this.state.error.message || "An unexpected error occurred.";

        return (
            <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
                <div className="glass-card" style={{ maxWidth: 520, width: "100%", padding: 40, textAlign: "center" }}>
                    <div style={{
                        width: 60, height: 60, borderRadius: 18, margin: "0 auto 22px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        background: "rgba(224, 122, 95, 0.12)",
                        border: "1px solid rgba(224, 122, 95, 0.30)",
                    }}>
                        <svg viewBox="0 0 24 24" style={{ width: 28, height: 28, color: "var(--color-brand-coral, #E07A5F)" }} fill="none" stroke="currentColor" strokeWidth={1.6}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-brand-lavender-dark)", marginBottom: 14 }}>
                        Something broke
                    </p>
                    <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 400, color: "var(--color-text-primary)", letterSpacing: "-0.02em", marginBottom: 14 }}>
                        We hit an <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>unexpected error</span>
                    </h1>
                    <p style={{ fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.65, marginBottom: 22 }}>
                        Our team has been notified. You can try again, or head back to the home page.
                    </p>

                    {import.meta.env.DEV && (
                        <pre style={{
                            textAlign: "left", fontSize: 12, color: "var(--color-text-muted)",
                            background: "rgba(0,0,0,0.04)", border: "1px solid var(--color-border)",
                            padding: 14, borderRadius: 12, marginBottom: 22, overflow: "auto", maxHeight: 160,
                        }}>{message}</pre>
                    )}

                    <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                        <button onClick={this.handleReset} className="btn-ghost" style={{ padding: "11px 20px", fontSize: 14 }}>
                            Try again
                        </button>
                        <button onClick={this.handleReload} className="btn-primary" style={{ padding: "11px 20px", fontSize: 14, fontWeight: 600 }}>
                            Back to home
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
