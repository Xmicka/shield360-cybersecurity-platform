import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msgs = JSON.parse(localStorage.getItem("s360_messages") || "[]");
    msgs.push({ ...form, timestamp: new Date().toISOString() });
    localStorage.setItem("s360_messages", JSON.stringify(msgs));
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="relative min-h-screen w-full" style={{ background: "var(--color-bg-base)" }}>
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 scroll-reveal"
          >
            <p className="text-sm uppercase tracking-wider font-semibold mb-4" style={{ color: "var(--color-accent-lavender)" }}>Get in Touch</p>
            <h1 className="text-4xl sm:text-5xl font-serif mb-4" style={{ fontFamily: "'DM Serif Display', serif", color: "var(--color-text-primary)" }}>
              We'd Love to Hear From You
            </h1>
            <p className="text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Have questions? Our team responds within 24 hours.
            </p>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="scroll-reveal"
            style={{
              background: "var(--color-bg-card)",
              borderRadius: "16px",
              padding: "48px",
              boxShadow: "var(--shadow-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            {sent ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "rgba(212, 197, 240, 0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                    border: "2px solid var(--color-accent-lavender)",
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 32, height: 32, color: "var(--color-accent-lavender)" }} fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold mb-2" style={{ color: "var(--color-text-primary)" }}>
                  Message Sent!
                </h3>
                <p style={{ color: "var(--color-text-muted)" }}>We'll get back to you soon.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-surface)",
                        color: "var(--color-text-primary)",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-accent-lavender)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 197, 240, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg-surface)",
                        color: "var(--color-text-primary)",
                        fontSize: "14px",
                        transition: "all 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-accent-lavender)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 197, 240, 0.1)";
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = "var(--color-border)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="How can we help?"
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-surface)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-accent-lavender)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 197, 240, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us more..."
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: "12px",
                      border: "1px solid var(--color-border)",
                      background: "var(--color-bg-surface)",
                      color: "var(--color-text-primary)",
                      fontSize: "14px",
                      fontFamily: "inherit",
                      resize: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-accent-lavender)";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(212, 197, 240, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px 24px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, var(--color-accent-lavender), var(--color-accent-coral))",
                    color: "white",
                    border: "none",
                    fontWeight: "600",
                    fontSize: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                  }}
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Info Cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                label: "Email",
                value: "support@shield360.io",
                icon: "✉️",
              },
              {
                label: "Website",
                value: "shield360.io",
                icon: "🌐",
              },
              {
                label: "Response Time",
                value: "Within 24 hours",
                icon: "⏱️",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="scroll-reveal"
                style={{
                  background: "var(--color-bg-card)",
                  borderRadius: "12px",
                  padding: "24px",
                  border: "1px solid var(--color-border)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                <p className="text-xs uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
                  {item.label}
                </p>
                <p style={{ color: "var(--color-text-primary)", fontSize: "16px", fontWeight: "500" }}>
                  {item.value}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
