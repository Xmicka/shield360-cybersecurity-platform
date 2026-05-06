/**
 * Compliance Assistant — ISO 27001 Assessment Wizard
 * Multi-step assessment flow integrated into Shield360
 */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, BarChart3, FileText, ChevronRight, Zap, ShieldCheck, ExternalLink, Sparkles } from "lucide-react";
import ModuleGate from "../../components/ModuleGate";
import { MODULES } from "../../config/services";

const ORIGINAL_APP_URL = "https://compliance-assistant-two.vercel.app";

function ComplianceAssistantContent() {
  const navigate = useNavigate();
  const mod = MODULES.find(m => m.slug === "compliance-assistant");

  const overviewCards = [
    {
      icon: <CheckCircle2 size={20} strokeWidth={1.5} />,
      title: "5-Stage Assessment",
      desc: "Walk through mandatory clauses, organizational, people, physical, and technological controls.",
      color: "var(--color-accent-sage-light)",
    },
    {
      icon: <BarChart3 size={20} strokeWidth={1.5} />,
      title: "AI-Driven Scoring",
      desc: "Get intelligent scoring and gap analysis powered by our compliance AI engine.",
      color: "var(--color-brand-blue)",
    },
    {
      icon: <FileText size={20} strokeWidth={1.5} />,
      title: "Detailed Recommendations",
      desc: "Receive actionable recommendations with downloadable compliance reports.",
      color: "var(--color-accent-lavender)",
    },
  ];

  const stages = [
    { num: 1, title: "Mandatory Clauses (4-10)", desc: "Core ISMS requirements", color: "#7dba9c" },
    { num: 2, title: "Organizational Controls", desc: "Policies, roles, asset management", color: "#6ba3be" },
    { num: 3, title: "People Controls", desc: "Screening, awareness, training", color: "#8aab96" },
    { num: 4, title: "Physical Controls", desc: "Security perimeters, equipment protection", color: "#b8a9c9" },
    { num: 5, title: "Technological Controls", desc: "Access control, cryptography, monitoring", color: "#d4a56a" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "rgba(107,163,190,0.10)",
                border: "1px solid rgba(107,163,190,0.25)",
                color: "var(--color-brand-blue)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ShieldCheck size={22} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em", marginBottom: 4 }}>
                Compliance Assistant
              </h1>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                AI-powered ISO 27001 compliance assessment & recommendations
              </p>
            </div>
          </div>
          {mod?.deployedUrl && (
            <a
              href={mod.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}
            >
              Open Original App
              <ExternalLink size={14} strokeWidth={1.5} />
            </a>
          )}
        </div>
      </motion.div>

      {/* Featured launchpad CTA */}
      <motion.a
        href={ORIGINAL_APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
        className="relative overflow-hidden block group"
        style={{
          padding: "22px 26px",
          borderRadius: 22,
          background: "linear-gradient(135deg, #B8A1E6 0%, #6BA3BE 100%)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 8px 24px rgba(155,130,204,0.22), 0 18px 50px rgba(107,163,190,0.18)",
        }}
      >
        <span style={{ position: "absolute", top: -40, right: 60, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.18)", filter: "blur(40px)" }} className="animate-blob" />
        <span style={{ position: "absolute", bottom: -50, right: -20, width: 200, height: 200, borderRadius: "50%", background: "rgba(232,213,245,0.22)", filter: "blur(50px)" }} />
        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.28)",
              backdropFilter: "blur(8px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Sparkles size={22} strokeWidth={1.6} />
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.18em", opacity: 0.85, marginBottom: 4 }}>
                Full experience
              </p>
              <h3 style={{ fontSize: 19, fontWeight: 700, letterSpacing: "-0.015em" }}>
                Open the Compliance Assistant app
              </h3>
              <p style={{ fontSize: 13, opacity: 0.92, marginTop: 2 }}>
                Run framework assessments, manage controls, and generate audit reports in the standalone interface.
              </p>
            </div>
          </div>
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 18px", borderRadius: 100,
              background: "rgba(255,255,255,0.96)",
              color: "var(--color-text-primary)",
              fontSize: 13, fontWeight: 700,
              boxShadow: "0 4px 12px rgba(0,0,0,0.10)",
            }}
            className="group-hover:translate-x-0.5 transition-transform"
          >
            Launch app
            <ExternalLink size={14} strokeWidth={2} />
          </div>
        </div>
      </motion.a>

      {/* Assessment Intro */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          {overviewCards.map((card) => (
            <div key={card.title} className="glass-card" style={{ padding: 24 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: `${card.color}15`,
                  border: `1px solid ${card.color}30`,
                  color: card.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                {card.icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 6 }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>{card.desc}</p>
            </div>
          ))}
        </div>

        {/* ISO 27001 Controls Overview */}
        <div className="glass-card" style={{ padding: 24, marginBottom: 28 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", marginBottom: 16 }}>
            Assessment Stages
          </h3>
          <div>
            {stages.map((stage, idx) => (
              <div
                key={stage.num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "14px 4px",
                  borderBottom: idx < stages.length - 1 ? "1px solid var(--color-border)" : "none",
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: `${stage.color}15`,
                    color: stage.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {stage.num}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)", marginBottom: 2 }}>
                    {stage.title}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--color-text-muted)" }}>{stage.desc}</p>
                </div>
                <ChevronRight size={16} strokeWidth={1.5} color="var(--color-text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate("/dashboard/compliance-assistant/assessment/profile")}
            className="btn-primary"
            style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
          >
            <Zap size={16} strokeWidth={1.5} />
            Start Assessment
          </button>
          <p style={{ marginTop: 12, fontSize: 12, color: "var(--color-text-muted)" }}>
            Takes approximately 15-20 minutes to complete all stages
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ComplianceAssistantPage() {
  return (
    <ModuleGate moduleSlug="compliance-assistant" moduleName="Compliance Assistant">
      <ComplianceAssistantContent />
    </ModuleGate>
  );
}
