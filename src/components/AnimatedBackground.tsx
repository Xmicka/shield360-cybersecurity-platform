/**
 * AnimatedBackground — Warm pastel floating gradient blobs.
 * Replaces the prior Three.js dark mesh with a wisprflow-inspired ambient layer.
 */
export default function AnimatedBackground() {
    return (
        <div
            className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            aria-hidden
        >
            {/* Cream base with subtle gradient */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse at 20% 10%, rgba(212, 197, 240, 0.35) 0%, transparent 55%)," +
                        "radial-gradient(ellipse at 85% 30%, rgba(232, 145, 122, 0.18) 0%, transparent 50%)," +
                        "radial-gradient(ellipse at 50% 80%, rgba(184, 212, 184, 0.28) 0%, transparent 55%)," +
                        "radial-gradient(ellipse at 90% 90%, rgba(212, 168, 83, 0.15) 0%, transparent 50%)",
                }}
            />

            {/* Floating decorative blobs */}
            <div
                className="blob blob-lavender animate-float"
                style={{ width: 380, height: 380, top: "5%", right: "-5%", opacity: 0.35 }}
            />
            <div
                className="blob blob-sage animate-float-slow"
                style={{ width: 460, height: 460, bottom: "-10%", left: "-8%", opacity: 0.3 }}
            />
            <div
                className="blob blob-coral animate-float-delayed"
                style={{ width: 280, height: 280, top: "40%", left: "15%", opacity: 0.18 }}
            />
            <div
                className="blob blob-gold animate-float"
                style={{ width: 220, height: 220, top: "60%", right: "20%", opacity: 0.15 }}
            />
            <div
                className="blob blob-lavender animate-float-slow"
                style={{ width: 320, height: 320, top: "20%", left: "40%", opacity: 0.2 }}
            />

            {/* Subtle grain overlay for warmth */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
            />
        </div>
    );
}
