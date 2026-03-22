/**
 * Compliance Assistant — ISO 27001 Assessment Wizard
 * Multi-step assessment flow integrated into Shield360
 */
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ModuleGate from "../../components/ModuleGate";

function ComplianceAssistantContent() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Compliance Assistant</h1>
            <p className="text-xs text-slate-500">AI-powered ISO 27001 compliance assessment & recommendations</p>
          </div>
        </div>
      </motion.div>

      {/* Assessment Intro */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">5-Stage Assessment</h3>
            <p className="text-sm text-slate-400">Walk through mandatory clauses, organizational, people, physical, and technological controls.</p>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">AI-Driven Scoring</h3>
            <p className="text-sm text-slate-400">Get intelligent scoring and gap analysis powered by our compliance AI engine.</p>
          </div>
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-2">Detailed Recommendations</h3>
            <p className="text-sm text-slate-400">Receive actionable recommendations with downloadable compliance reports.</p>
          </div>
        </div>

        {/* ISO 27001 Controls Overview */}
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-slate-100 mb-4">Assessment Stages</h3>
          <div className="space-y-3">
            {[
              { num: 1, title: "Mandatory Clauses (4-10)", desc: "Core ISMS requirements", color: "emerald" },
              { num: 2, title: "Organizational Controls", desc: "Policies, roles, asset management", color: "cyan" },
              { num: 3, title: "People Controls", desc: "Screening, awareness, training", color: "blue" },
              { num: 4, title: "Physical Controls", desc: "Security perimeters, equipment protection", color: "purple" },
              { num: 5, title: "Technological Controls", desc: "Access control, cryptography, monitoring", color: "amber" },
            ].map((stage) => (
              <div key={stage.num} className="flex items-center gap-4 rounded-lg border border-slate-700/40 bg-slate-900/30 px-4 py-3">
                <div className={`w-8 h-8 rounded-lg bg-${stage.color}-500/10 flex items-center justify-center text-sm font-bold text-${stage.color}-400`}>
                  {stage.num}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-100">{stage.title}</p>
                  <p className="text-xs text-slate-400">{stage.desc}</p>
                </div>
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center">
          <button
            onClick={() => navigate("/dashboard/compliance-assistant/assessment/profile")}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all hover:scale-[1.02]"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Assessment
          </button>
          <p className="mt-3 text-xs text-slate-500">Takes approximately 15-20 minutes to complete all stages</p>
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
