/**
 * Spear Phishing Simulation — Behaviour-Adaptive Phishing Platform
 * Integrated into Shield360 with internal tab navigation (replaces standalone sidebar).
 */
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ModuleGate from "../../components/ModuleGate";

// Dashboard sections
import SecurityPostureOverview from "./dashboard/SecurityPostureOverview";
import DataCollection from "./dashboard/DataCollection";
import BehavioralRiskDistribution from "./dashboard/BehavioralRiskDistribution";
import AdaptivePhishingPipeline from "./dashboard/AdaptivePhishingPipeline";
import SimulationOutcomes from "./dashboard/SimulationOutcomes";
import TrainingEnforcement from "./dashboard/TrainingEnforcement";
import AlertsRecommendations from "./dashboard/AlertsRecommendations";
import EmailGenerator from "./dashboard/EmailGenerator";
import AdvancedView from "./dashboard/AdvancedView";
import ImplementationGuide from "./dashboard/ImplementationGuide";
import EmployeeDirectory from "./dashboard/EmployeeDirectory";
import CampaignManager from "./dashboard/CampaignManager";

const BACKEND_URL = import.meta.env.VITE_SPEAR_PHISHING_API_URL
  || (import.meta.env.DEV ? "http://127.0.0.1:8000" : "https://behaviour-adaptive-spear-phishing.onrender.com");

type Section = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const sections: Section[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: "employees",
    label: "Employees",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    id: "behaviour",
    label: "Behaviour",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    id: "campaigns",
    label: "Campaigns",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: "generator",
    label: "Email Generator",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: "training",
    label: "Training",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
  {
    id: "alerts",
    label: "Alerts",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

/* ─── Seed Demo Data ─── */
function SeedDemoDataSection() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error" | "info"; msg: string } | null>(null);

  const handleSeedData = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const url = `${BACKEND_URL}/api/seed-demo-data`;
      const res = await fetch(url, { method: "GET", headers: { Accept: "application/json" } });
      const text = await res.text();
      if (!text || text.trim() === "") { setStatus({ type: "error", msg: "Server returned empty response." }); return; }
      let data: any;
      try { data = JSON.parse(text); } catch { setStatus({ type: "error", msg: `Invalid JSON: ${text.substring(0, 100)}…` }); return; }
      if (res.ok && data.status === "success") setStatus({ type: "success", msg: `✅ ${data.message}` });
      else if (data.status === "already_seeded") setStatus({ type: "info", msg: `Database already has ${data.total_events} events for ${data.unique_users} users` });
      else setStatus({ type: "error", msg: data.error || data.message || "Failed" });
    } catch (err) {
      setStatus({ type: "error", msg: `Network error: ${err instanceof Error ? err.message : "Unknown"}` });
    } finally { setLoading(false); }
  };

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-100">🎯 Demo Data Setup</h3>
          <p className="text-sm text-slate-400 mt-1">Load sample employee behavioral data for testing.</p>
        </div>
        <button onClick={handleSeedData} disabled={loading}
          className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-all ${loading ? "bg-blue-600/50 text-blue-200 cursor-wait" : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-blue-500/20"}`}>
          {loading ? "Loading…" : "📤 Seed Demo Data"}
        </button>
      </div>
      {status && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${status.type === "success" ? "bg-green-500/20 text-green-300 border border-green-500/30" : status.type === "info" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"}`}>
          {status.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Main Content ─── */
function SpearPhishingContent() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <motion.div key="dashboard" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <SecurityPostureOverview />
          </motion.div>
        );
      case "employees":
        return (
          <motion.div key="employees" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <EmployeeDirectory />
          </motion.div>
        );
      case "behaviour":
        return (
          <motion.div key="behaviour" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <BehavioralRiskDistribution />
            <DataCollection />
            <AdaptivePhishingPipeline />
            <div className="flex justify-center py-4">
              <button onClick={() => setShowAdvanced(!showAdvanced)}
                className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all border border-slate-700">
                {showAdvanced ? "Hide" : "Show"} Advanced System Logs
              </button>
            </div>
            <AnimatePresence>
              {showAdvanced && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <AdvancedView />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      case "campaigns":
        return (
          <motion.div key="campaigns" variants={sectionVariants} initial="hidden" animate="visible" exit="exit">
            <CampaignManager />
          </motion.div>
        );
      case "generator":
        return (
          <motion.div key="generator" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <EmailGenerator />
          </motion.div>
        );
      case "training":
        return (
          <motion.div key="training" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <TrainingEnforcement />
          </motion.div>
        );
      case "alerts":
        return (
          <motion.div key="alerts" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <AlertsRecommendations />
          </motion.div>
        );
      case "reports":
        return (
          <motion.div key="reports" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-10">
            <SimulationOutcomes />
          </motion.div>
        );
      case "settings":
        return (
          <motion.div key="settings" variants={sectionVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6">
            <SeedDemoDataSection />
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-100">Browser Extension Deployment</h3>
                <p className="text-sm text-slate-400 mt-1">Download the pre-configured V3 manifest extension.</p>
              </div>
              <a href={`${BACKEND_URL}/api/extension/download`} target="_blank" rel="noreferrer"
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all inline-flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download ZIP
              </a>
            </div>
            <ImplementationGuide />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Spear Phishing Simulation</h1>
            <p className="text-xs text-slate-500">AI-driven adaptive phishing campaigns with behavioral analysis</p>
          </div>
        </div>
      </motion.div>

      {/* Internal Section Tabs */}
      <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm p-1.5">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeSection === s.id
                ? "bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-white shadow-md shadow-cyan-500/10"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
            }`}>
            {s.icon}
            {s.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
    </div>
  );
}

export default function SpearPhishingPage() {
  return (
    <ModuleGate moduleSlug="spear-phishing" moduleName="Spear Phishing Simulation">
      <SpearPhishingContent />
    </ModuleGate>
  );
}
