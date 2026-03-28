/**
 * Shield360 — Customizable Admin Command Center
 *
 * Pulls REAL data from every module backend and lets the admin
 * choose which widgets to display and how to visualize them.
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, AreaChart, Area, CartesianGrid, Legend,
} from "recharts";
import { useAuth } from "../context/authContext";
import { useSubscription } from "../context/subscriptionContext";
import { MODULES } from "../config/services";
import type { ModuleConfig } from "../config/services";
import UpgradeModal from "../components/UpgradeModal";
import {
  getTotalUserCount,
  getTotalLaunchCount,
  getModuleLaunchStats,
  getRecentActivity,
  getRecentUsers,
} from "../services/firestoreService";
import type { ActivityLog, UserProfile } from "../services/firestoreService";
import {
  fetchAllModuleData,
} from "../services/moduleDataService";
import type {
  AggregatedData,
  EndpointSummary,
  ShadowITSummary,
  PhishingSummary,
  ModuleHealth,
} from "../services/moduleDataService";

// ════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════

type WidgetSize = "sm" | "md" | "lg";
type WidgetViz = "stat" | "bar" | "pie" | "area" | "table" | "list" | "status";

interface WidgetConfig {
  id: string;
  module: "platform" | "endpoint-scanner" | "shadow-it" | "spear-phishing" | "compliance-assistant";
  title: string;
  viz: WidgetViz;
  size: WidgetSize;
  enabled: boolean;
}

const STORAGE_KEY = "shield360_admin_widgets";

// ════════════════════════════════════════════════════════
// DEFAULT WIDGET CATALOG
// ════════════════════════════════════════════════════════

const DEFAULT_WIDGETS: WidgetConfig[] = [
  // Platform
  { id: "health", module: "platform", title: "System Health Monitor", viz: "status", size: "lg", enabled: true },
  { id: "platform-users", module: "platform", title: "Registered Users", viz: "stat", size: "sm", enabled: true },
  { id: "platform-launches", module: "platform", title: "Total Module Launches", viz: "stat", size: "sm", enabled: true },
  { id: "platform-launch-breakdown", module: "platform", title: "Launch Breakdown", viz: "bar", size: "md", enabled: true },
  { id: "platform-activity", module: "platform", title: "Recent Activity", viz: "list", size: "lg", enabled: true },
  { id: "platform-users-list", module: "platform", title: "Recent Users", viz: "table", size: "md", enabled: true },
  // Endpoint Scanner
  { id: "ep-overview", module: "endpoint-scanner", title: "Endpoint Overview", viz: "stat", size: "md", enabled: true },
  { id: "ep-risk-dist", module: "endpoint-scanner", title: "Risk Distribution", viz: "pie", size: "md", enabled: true },
  { id: "ep-scan-status", module: "endpoint-scanner", title: "Scan Status", viz: "bar", size: "md", enabled: true },
  { id: "ep-devices", module: "endpoint-scanner", title: "Device Inventory", viz: "table", size: "lg", enabled: true },
  // Shadow IT
  { id: "si-overview", module: "shadow-it", title: "Shadow IT Overview", viz: "stat", size: "md", enabled: true },
  { id: "si-breakdown", module: "shadow-it", title: "Category Breakdown", viz: "pie", size: "md", enabled: true },
  { id: "si-threats", module: "shadow-it", title: "Recent Threats", viz: "table", size: "md", enabled: true },
  { id: "si-timeline", module: "shadow-it", title: "Scan Activity", viz: "area", size: "md", enabled: true },
  // Spear Phishing
  { id: "sp-overview", module: "spear-phishing", title: "Phishing Overview", viz: "stat", size: "md", enabled: true },
  { id: "sp-risk-dist", module: "spear-phishing", title: "User Risk Distribution", viz: "pie", size: "md", enabled: true },
  { id: "sp-pipeline", module: "spear-phishing", title: "Email Pipeline", viz: "bar", size: "md", enabled: true },
  { id: "sp-alerts", module: "spear-phishing", title: "Alerts & Recommendations", viz: "list", size: "lg", enabled: true },
  // Compliance
  { id: "co-status", module: "compliance-assistant", title: "Compliance Status", viz: "stat", size: "sm", enabled: true },
];

function loadWidgets(): WidgetConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved: WidgetConfig[] = JSON.parse(raw);
      // Merge: keep saved preferences, add any new widgets from default catalog
      const savedIds = new Set(saved.map((w) => w.id));
      const merged = [...saved];
      for (const dw of DEFAULT_WIDGETS) {
        if (!savedIds.has(dw.id)) merged.push(dw);
      }
      return merged;
    }
  } catch { /* ignore */ }
  return DEFAULT_WIDGETS.map((w) => ({ ...w }));
}

function saveWidgets(widgets: WidgetConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(widgets));
}

// Module color map
const MODULE_COLORS: Record<string, string> = {
  platform: "#a855f7",
  "endpoint-scanner": "#fbbf24",
  "shadow-it": "#3b82f6",
  "spear-phishing": "#22d3ee",
  "compliance-assistant": "#34d399",
};

const MODULE_LABELS: Record<string, string> = {
  platform: "Platform",
  "endpoint-scanner": "Endpoint Scanner",
  "shadow-it": "Shadow IT",
  "spear-phishing": "Spear Phishing",
  "compliance-assistant": "Compliance",
};

const PIE_COLORS = ["#f43f5e", "#fbbf24", "#34d399", "#3b82f6", "#a855f7", "#22d3ee"];

const CHART_TOOLTIP_STYLE = {
  contentStyle: { background: "#1e293b", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 10, fontSize: 12, color: "#e2e8f0" },
  itemStyle: { color: "#e2e8f0" },
};

// ════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════

export default function AdminDashboard() {
  const { } = useAuth();
  const { plan, setPlan, role, setRole, hasAccess, enabledModules, toggleModule } = useSubscription();

  // Widget configuration
  const [widgets, setWidgets] = useState<WidgetConfig[]>(loadWidgets);
  const [customizeOpen, setCustomizeOpen] = useState(false);

  // Module data
  const [moduleData, setModuleData] = useState<AggregatedData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  // Firestore platform data
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalLaunches, setTotalLaunches] = useState<number>(0);
  const [launchStats, setLaunchStats] = useState<Record<string, number>>({});
  const [recentActivity, setRecentActivity] = useState<ActivityLog[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);

  // Upgrade modal
  const [upgradeModal, setUpgradeModal] = useState({ open: false, moduleName: "" });

  // ── Data Fetching ──
  const refreshData = useCallback(async () => {
    try {
      const [data, users, launches, modStats, activity, newUsers] = await Promise.all([
        fetchAllModuleData(),
        getTotalUserCount().catch(() => 0),
        getTotalLaunchCount().catch(() => 0),
        getModuleLaunchStats().catch(() => ({})),
        getRecentActivity(10).catch(() => []),
        getRecentUsers(5).catch(() => []),
      ]);
      setModuleData(data);
      setTotalUsers(users);
      setTotalLaunches(launches);
      setLaunchStats(modStats);
      setRecentActivity(activity);
      setRecentUsers(newUsers);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    finally { setDataLoading(false); }
  }, []);

  useEffect(() => {
    refreshData();
    refreshTimer.current = setInterval(refreshData, 30000); // 30s auto-refresh
    return () => { if (refreshTimer.current) clearInterval(refreshTimer.current); };
  }, [refreshData]);

  // ── Widget Management ──
  const toggleWidget = (id: string) => {
    setWidgets((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w));
      saveWidgets(next);
      return next;
    });
  };

  const changeWidgetViz = (id: string, viz: WidgetViz) => {
    setWidgets((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, viz } : w));
      saveWidgets(next);
      return next;
    });
  };

  const changeWidgetSize = (id: string, size: WidgetSize) => {
    setWidgets((prev) => {
      const next = prev.map((w) => (w.id === id ? { ...w, size } : w));
      saveWidgets(next);
      return next;
    });
  };

  const resetWidgets = () => {
    const fresh = DEFAULT_WIDGETS.map((w) => ({ ...w }));
    setWidgets(fresh);
    saveWidgets(fresh);
  };

  const activeWidgets = widgets.filter((w) => w.enabled);

  // ═════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Admin Command Center</h1>
            <p className="text-xs text-slate-500 mt-1">
              Real-time data from all modules •{" "}
              {lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString()}` : "Loading…"}
              {" "}• Auto-refreshes every 30s
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setDataLoading(true); refreshData(); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition-all"
            >
              <svg className={`w-3.5 h-3.5 ${dataLoading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={() => setCustomizeOpen(!customizeOpen)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                customizeOpen
                  ? "bg-purple-600/20 border border-purple-500/30 text-purple-400"
                  : "bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:bg-slate-700/60"
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Customize
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Controls Row ── */}
      <div className="grid grid-cols-3 gap-4">
        <QuickControlCard label="Current Plan">
          <div className="flex gap-1.5">
            {(["free", "professional", "enterprise"] as const).map((p) => (
              <button key={p} onClick={() => setPlan(p)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  plan === p
                    ? p === "free" ? "bg-cyan-500/10 border border-cyan-500/30 text-cyan-400"
                      : p === "professional" ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                      : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                    : "bg-slate-900/40 border border-slate-700/40 text-slate-500 hover:text-slate-300"
                }`}>
                {p === "professional" ? "Pro" : p}
              </button>
            ))}
          </div>
        </QuickControlCard>
        <QuickControlCard label="User Role">
          <div className="flex gap-1.5">
            {(["admin", "user"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${
                  role === r
                    ? "bg-purple-500/10 border border-purple-500/30 text-purple-400"
                    : "bg-slate-900/40 border border-slate-700/40 text-slate-500 hover:text-slate-300"
                }`}>
                {r}
              </button>
            ))}
          </div>
        </QuickControlCard>
        <QuickControlCard label="Modules Enabled">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-extrabold text-emerald-400">{enabledModules.length}</span>
            <span className="text-slate-500 text-sm font-medium">/ {MODULES.length}</span>
            <div className="flex-1" />
            <div className="flex gap-1">
              {MODULES.map((m) => (
                <div key={m.slug} className="w-2.5 h-2.5 rounded-full" style={{
                  background: enabledModules.includes(m.slug) ? m.color : "#334155",
                }} title={m.shortName} />
              ))}
            </div>
          </div>
        </QuickControlCard>
      </div>

      {/* ── Customize Panel ── */}
      <AnimatePresence>
        {customizeOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-purple-500/20 bg-slate-800/40 backdrop-blur-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-100">Dashboard Widgets</h3>
                <button onClick={resetWidgets} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">
                  Reset to Default
                </button>
              </div>
              <div className="space-y-3">
                {Object.keys(MODULE_LABELS).map((mod) => {
                  const modWidgets = widgets.filter((w) => w.module === mod);
                  if (modWidgets.length === 0) return null;
                  return (
                    <div key={mod}>
                      <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: MODULE_COLORS[mod] }}>
                        {MODULE_LABELS[mod]}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {modWidgets.map((w) => (
                          <div key={w.id} className={`flex items-center gap-2 rounded-lg p-2.5 border transition-all cursor-pointer ${
                            w.enabled
                              ? "bg-slate-700/30 border-slate-600/50"
                              : "bg-slate-900/30 border-slate-800/50 opacity-50"
                          }`} onClick={() => toggleWidget(w.id)}>
                            <div className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                              w.enabled ? "border-cyan-400 bg-cyan-400/20" : "border-slate-600"
                            }`}>
                              {w.enabled && (
                                <svg className="w-2 h-2 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className="text-xs text-slate-300 font-medium truncate">{w.title}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Loading State ── */}
      {dataLoading && !moduleData && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-500">Fetching data from all modules…</p>
          </div>
        </div>
      )}

      {/* ── Widget Grid ── */}
      {(!dataLoading || moduleData) && (
        <div className="grid grid-cols-6 gap-4 auto-rows-min">
          {activeWidgets.map((w) => (
            <WidgetWrapper key={w.id} widget={w} onChangeViz={changeWidgetViz} onChangeSize={changeWidgetSize}>
              <WidgetContent
                widget={w}
                moduleData={moduleData}
                totalUsers={totalUsers}
                totalLaunches={totalLaunches}
                launchStats={launchStats}
                recentActivity={recentActivity}
                recentUsers={recentUsers}
              />
            </WidgetWrapper>
          ))}
        </div>
      )}

      {/* ── Module Management ── */}
      <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 backdrop-blur-sm p-5">
        <h3 className="text-sm font-bold text-slate-100 mb-1">Module Management</h3>
        <p className="text-xs text-slate-500 mb-4">Enable/disable modules and manage access</p>
        <div className="grid grid-cols-2 gap-3">
          {MODULES.map((mod) => (
            <ModuleManagementCard
              key={mod.slug}
              mod={mod}
              enabled={enabledModules.includes(mod.slug)}
              accessible={hasAccess(mod.slug)}
              health={moduleData?.health.find((h) => h.slug === mod.slug) ?? null}
              onToggle={() => toggleModule(mod.slug)}
              onUpgrade={() => setUpgradeModal({ open: true, moduleName: mod.name })}
            />
          ))}
        </div>
      </div>

      <UpgradeModal
        isOpen={upgradeModal.open}
        onClose={() => setUpgradeModal({ open: false, moduleName: "" })}
        moduleName={upgradeModal.moduleName}
        onUpgrade={() => {
          setPlan("professional");
          setUpgradeModal({ open: false, moduleName: "" });
        }}
      />
    </div>
  );
}

// ════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ════════════════════════════════════════════════════════

function QuickControlCard({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-4">
      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-2.5">{label}</p>
      {children}
    </div>
  );
}

function WidgetWrapper({ widget, children, onChangeViz, onChangeSize }: {
  widget: WidgetConfig;
  children: React.ReactNode;
  onChangeViz: (id: string, viz: WidgetViz) => void;
  onChangeSize: (id: string, size: WidgetSize) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cols = widget.size === "sm" ? "col-span-2" : widget.size === "md" ? "col-span-3" : "col-span-6";
  const color = MODULE_COLORS[widget.module] ?? "#64748b";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`${cols} relative rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm overflow-hidden group transition-all duration-300`}
      style={{
        "--widget-color": color,
      } as React.CSSProperties}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 0 20px -5px ${color}40, inset 0 0 10px -5px ${color}20`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(51, 65, 85, 0.5)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{widget.title}</span>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-slate-700/50"
          >
            <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-6 z-50 w-44 rounded-lg border border-slate-700 bg-slate-800 shadow-xl p-2 space-y-1">
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 pt-1">Visualization</p>
                {(["stat", "bar", "pie", "area", "table", "list", "status"] as WidgetViz[]).map((v) => (
                  <button key={v} onClick={() => { onChangeViz(widget.id, v); setMenuOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-colors ${widget.viz === v ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"}`}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </button>
                ))}
                <div className="border-t border-slate-700/50 my-1" />
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2">Size</p>
                {(["sm", "md", "lg"] as WidgetSize[]).map((s) => (
                  <button key={s} onClick={() => { onChangeSize(widget.id, s); setMenuOpen(false); }}
                    className={`w-full text-left px-2 py-1.5 rounded text-xs font-medium transition-colors ${widget.size === s ? "bg-cyan-500/10 text-cyan-400" : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"}`}>
                    {s === "sm" ? "Small (1/3)" : s === "md" ? "Medium (1/2)" : "Large (Full)"}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Body */}
      <div className="px-4 pb-4 pt-1">{children}</div>
    </motion.div>
  );
}

// ════════════════════════════════════════════════════════
// WIDGET CONTENT RENDERER
// ════════════════════════════════════════════════════════

function WidgetContent({ widget, moduleData, totalUsers, totalLaunches, launchStats, recentActivity, recentUsers }: {
  widget: WidgetConfig;
  moduleData: AggregatedData | null;
  totalUsers: number;
  totalLaunches: number;
  launchStats: Record<string, number>;
  recentActivity: ActivityLog[];
  recentUsers: UserProfile[];
}) {
  const ep = moduleData?.endpoint;
  const si = moduleData?.shadowIT;
  const sp = moduleData?.phishing;
  const health = moduleData?.health ?? [];

  switch (widget.id) {
    // ──── PLATFORM ────
    case "health":
      return <HealthMonitorWidget health={health} />;
    case "platform-users":
      return <BigStatWidget value={totalUsers} label="Registered Users" color="#22d3ee" />;
    case "platform-launches":
      return <BigStatWidget value={totalLaunches} label="Module Launches" color="#a855f7" />;
    case "platform-launch-breakdown":
      return <LaunchBreakdownWidget launchStats={launchStats} viz={widget.viz} />;
    case "platform-activity":
      return <ActivityFeedWidget activity={recentActivity} />;
    case "platform-users-list":
      return <UsersListWidget users={recentUsers} />;

    // ──── ENDPOINT SCANNER ────
    case "ep-overview":
      return ep ? <EndpointOverviewWidget data={ep} viz={widget.viz} /> : <OfflineWidget name="Endpoint Scanner" />;
    case "ep-risk-dist":
      return ep ? <EndpointRiskDistWidget data={ep} viz={widget.viz} /> : <OfflineWidget name="Endpoint Scanner" />;
    case "ep-scan-status":
      return ep ? <EndpointScanStatusWidget data={ep} viz={widget.viz} /> : <OfflineWidget name="Endpoint Scanner" />;
    case "ep-devices":
      return ep ? <EndpointDevicesWidget data={ep} viz={widget.viz} /> : <OfflineWidget name="Endpoint Scanner" />;

    // ──── SHADOW IT ────
    case "si-overview":
      return si ? <ShadowOverviewWidget data={si} viz={widget.viz} /> : <OfflineWidget name="Shadow IT" />;
    case "si-breakdown":
      return si ? <ShadowBreakdownWidget data={si} viz={widget.viz} /> : <OfflineWidget name="Shadow IT" />;
    case "si-threats":
      return si ? <ShadowThreatsWidget data={si} /> : <OfflineWidget name="Shadow IT" />;
    case "si-timeline":
      return si ? <ShadowTimelineWidget data={si} viz={widget.viz} /> : <OfflineWidget name="Shadow IT" />;

    // ──── SPEAR PHISHING ────
    case "sp-overview":
      return sp ? <PhishingOverviewWidget data={sp} viz={widget.viz} /> : <OfflineWidget name="Spear Phishing" />;
    case "sp-risk-dist":
      return sp ? <PhishingRiskDistWidget data={sp} viz={widget.viz} /> : <OfflineWidget name="Spear Phishing" />;
    case "sp-pipeline":
      return sp ? <PhishingPipelineWidget data={sp} viz={widget.viz} /> : <OfflineWidget name="Spear Phishing" />;
    case "sp-alerts":
      return sp ? <PhishingAlertsWidget data={sp} /> : <OfflineWidget name="Spear Phishing" />;

    // ──── COMPLIANCE ────
    case "co-status":
      return <ComplianceStatusWidget />;

    default:
      return <p className="text-xs text-slate-500">Unknown widget</p>;
  }
}

// ════════════════════════════════════════════════════════
// INDIVIDUAL WIDGET RENDERERS
// ════════════════════════════════════════════════════════

function OfflineWidget({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <div className="w-8 h-8 rounded-full bg-slate-700/50 flex items-center justify-center">
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      </div>
      <p className="text-xs text-slate-500 font-medium">{name} backend offline</p>
    </div>
  );
}

function BigStatWidget({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <p className="text-3xl font-extrabold" style={{ color }}>{value.toLocaleString()}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  );
}

function HealthMonitorWidget({ health }: { health: ModuleHealth[] }) {
  return (
    <div className="grid grid-cols-4 gap-3 py-1">
      {health.map((h) => (
        <div key={h.slug} className="flex items-center gap-3 rounded-lg bg-slate-900/40 border border-slate-700/40 p-3">
          <div className={`w-2.5 h-2.5 rounded-full ${h.status === "online" ? "bg-emerald-400 shadow-emerald-400/30 shadow-sm" : h.status === "degraded" ? "bg-amber-400 animate-pulse" : "bg-red-400"}`} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{h.name}</p>
            <p className="text-[10px] text-slate-500">
              {h.status === "online" ? `${h.latencyMs}ms` : h.status}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LaunchBreakdownWidget({ launchStats, viz }: { launchStats: Record<string, number>; viz: WidgetViz }) {
  const data = MODULES.map((m) => ({ name: m.shortName, value: launchStats[m.slug] ?? 0, color: m.color }));

  if (viz === "pie") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
            {data.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data}>
        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip {...CHART_TOOLTIP_STYLE} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function ActivityFeedWidget({ activity }: { activity: ActivityLog[] }) {
  if (activity.length === 0) return <p className="text-xs text-slate-500 py-4">No recent activity</p>;
  const sevColors: Record<string, string> = { critical: "#f43f5e", high: "#fbbf24", medium: "#a855f7", info: "#22d3ee" };

  return (
    <div className="space-y-0 max-h-72 overflow-y-auto pr-1">
      {activity.map((a, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-slate-700/30 last:border-0">
          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: sevColors[a.severity] || sevColors.info }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-300 truncate">{a.event}</p>
            <p className="text-[10px] text-slate-500">{a.userEmail} • {a.module}</p>
          </div>
          <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded" style={{
            color: sevColors[a.severity] || sevColors.info,
            background: `${sevColors[a.severity] || sevColors.info}15`,
          }}>{a.severity}</span>
        </div>
      ))}
    </div>
  );
}

function UsersListWidget({ users }: { users: UserProfile[] }) {
  if (users.length === 0) return <p className="text-xs text-slate-500 py-4">No users yet</p>;
  return (
    <div className="space-y-2">
      {users.map((u, i) => (
        <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-900/30 p-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-[10px] font-bold text-slate-200">
            {u.displayName?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-200 font-semibold truncate">{u.displayName}</p>
            <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
          </div>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
            u.plan === "enterprise" ? "text-amber-400 bg-amber-400/10" : u.plan === "professional" ? "text-purple-400 bg-purple-400/10" : "text-cyan-400 bg-cyan-400/10"
          }`}>{u.plan}</span>
        </div>
      ))}
    </div>
  );
}

// ─── ENDPOINT SCANNER WIDGETS ──────────────────────

function EndpointOverviewWidget({ data, viz }: { data: EndpointSummary; viz: WidgetViz }) {
  if (viz === "bar" || viz === "area") {
    const chartData = [
      { name: "Online", value: data.onlineDevices, fill: "#34d399" },
      { name: "Offline", value: data.offlineDevices, fill: "#64748b" },
      { name: "High Risk", value: data.highRiskCount, fill: "#f43f5e" },
      { name: "Medium", value: data.mediumRiskCount, fill: "#fbbf24" },
      { name: "Low Risk", value: data.lowRiskCount, fill: "#34d399" },
    ];
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((d, i) => <Cell key={i} fill={d.fill} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 py-1">
      <MiniStat label="Total Devices" value={data.totalDevices} color="#fbbf24" />
      <MiniStat label="Online" value={data.onlineDevices} color="#34d399" />
      <MiniStat label="Avg Risk" value={data.avgRiskScore} color="#f43f5e" suffix="/100" />
    </div>
  );
}

function EndpointRiskDistWidget({ data, viz }: { data: EndpointSummary; viz: WidgetViz }) {
  const chartData = [
    { name: "High", value: data.highRiskCount },
    { name: "Medium", value: data.mediumRiskCount },
    { name: "Low", value: data.lowRiskCount },
  ];
  const colors = ["#f43f5e", "#fbbf24", "#34d399"];

  if (viz === "bar") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={160}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
            {chartData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
            <span className="text-xs text-slate-400">{d.name}</span>
            <span className="text-xs font-bold text-slate-200">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EndpointScanStatusWidget({ data, viz }: { data: EndpointSummary; viz: WidgetViz }) {
  const chartData = [
    { name: "Completed", value: data.completed, color: "#34d399" },
    { name: "Scanning", value: data.scanning, color: "#22d3ee" },
    { name: "Failed", value: data.failed, color: "#f43f5e" },
    { name: "Not Scanned", value: data.notScanned, color: "#64748b" },
  ];

  if (viz === "pie") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
            {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Legend formatter={(value: string) => <span className="text-[10px] text-slate-400">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData} layout="vertical">
        <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={80} />
        <Tooltip {...CHART_TOOLTIP_STYLE} />
        <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16}>
          {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function EndpointDevicesWidget({ data }: { data: EndpointSummary; viz: WidgetViz }) {
  const top = data.devices.slice(0, 10);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="text-slate-500 border-b border-slate-700/40">
            <th className="text-left pb-2 font-semibold">Device</th>
            <th className="text-left pb-2 font-semibold">OS</th>
            <th className="text-center pb-2 font-semibold">Status</th>
            <th className="text-center pb-2 font-semibold">Risk</th>
            <th className="text-right pb-2 font-semibold">Apps</th>
          </tr>
        </thead>
        <tbody>
          {top.map((d) => (
            <tr key={d.endpoint_id} className="border-b border-slate-700/20 last:border-0">
              <td className="py-2 text-slate-200 font-medium truncate max-w-[160px]">{d.endpoint_name || d.endpoint_id.slice(0, 12)}</td>
              <td className="py-2 text-slate-400">{d.os_name || "—"}</td>
              <td className="py-2 text-center">
                <span className={`inline-block w-2 h-2 rounded-full ${d.is_online ? "bg-emerald-400" : "bg-slate-500"}`} />
              </td>
              <td className="py-2 text-center">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  d.endpoint_risk_tier === "Critical" || d.endpoint_risk_tier === "High" ? "text-rose-400 bg-rose-400/10"
                  : d.endpoint_risk_tier === "Medium" ? "text-amber-400 bg-amber-400/10"
                  : "text-emerald-400 bg-emerald-400/10"
                }`}>{d.endpoint_risk_tier || "—"}</span>
              </td>
              <td className="py-2 text-right text-slate-400">{d.application_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {data.devices.length > 10 && (
        <p className="text-[10px] text-slate-500 mt-2">Showing 10 of {data.devices.length} devices</p>
      )}
    </div>
  );
}

// ─── SHADOW IT WIDGETS ─────────────────────────────

function ShadowOverviewWidget({ data, viz }: { data: ShadowITSummary; viz: WidgetViz }) {
  if (viz === "bar") {
    const chartData = Object.entries(data.breakdown).map(([k, v]) => ({ name: k, value: v }));
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  return (
    <div className="grid grid-cols-3 gap-3 py-1">
      <MiniStat label="Total Scanned" value={data.total} color="#3b82f6" />
      <MiniStat label="Threats" value={data.threatCount} color="#f43f5e" />
      <MiniStat label="Allowlisted" value={data.allowlistCount} color="#34d399" />
    </div>
  );
}

function ShadowBreakdownWidget({ data, viz }: { data: ShadowITSummary; viz: WidgetViz }) {
  const chartData = Object.entries(data.breakdown).map(([k, v]) => ({ name: k, value: v }));
  const colors = PIE_COLORS;

  if (viz === "bar") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <PieChart>
        <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={65} paddingAngle={3} dataKey="value">
          {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Pie>
        <Tooltip {...CHART_TOOLTIP_STYLE} />
        <Legend formatter={(value: string) => <span className="text-[10px] text-slate-400">{value}</span>} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ShadowThreatsWidget({ data }: { data: ShadowITSummary }) {
  const threats = data.recentThreats.slice(0, 8);
  if (threats.length === 0) return <p className="text-xs text-slate-500 py-4">No recent threats detected</p>;
  return (
    <div className="space-y-1.5 max-h-56 overflow-y-auto">
      {threats.map((t) => (
        <div key={t.id} className="flex items-center gap-2 rounded-lg bg-slate-900/30 p-2.5">
          <div className={`w-2 h-2 rounded-full ${t.status === "blocked" ? "bg-red-400" : t.status === "suspicious" ? "bg-amber-400" : "bg-emerald-400"}`} />
          <p className="text-xs text-slate-300 flex-1 truncate">{t.url}</p>
          <span className="text-[10px] font-bold text-slate-500">{Math.round(t.confidence * 100)}%</span>
        </div>
      ))}
    </div>
  );
}

function ShadowTimelineWidget({ data, viz }: { data: ShadowITSummary; viz: WidgetViz }) {
  // Group logs by hour for timeline
  const hourBuckets: Record<string, number> = {};
  data.logs.forEach((l) => {
    const h = l.scanned_at?.slice(0, 13) || "unknown";
    hourBuckets[h] = (hourBuckets[h] || 0) + 1;
  });
  const chartData = Object.entries(hourBuckets)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([hour, count]) => ({ hour: hour.slice(11) || hour, count }));

  if (chartData.length === 0) return <p className="text-xs text-slate-500 py-4">No scan data available</p>;

  return (
    <ResponsiveContainer width="100%" height={180}>
      {viz === "bar" ? (
        <BarChart data={chartData}>
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      ) : (
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="siGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" />
          <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Area type="monotone" dataKey="count" stroke="#3b82f6" fill="url(#siGrad)" strokeWidth={2} />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}

// ─── SPEAR PHISHING WIDGETS ────────────────────────

function PhishingOverviewWidget({ data, viz }: { data: PhishingSummary; viz: WidgetViz }) {
  if (viz === "bar") {
    const chartData = [
      { name: "Users", value: data.totalUsers, color: "#22d3ee" },
      { name: "Emails Sent", value: data.totalEmailsSent, color: "#a855f7" },
      { name: "Training Pending", value: data.trainingPending, color: "#fbbf24" },
      { name: "Alerts", value: data.alertCount, color: "#f43f5e" },
    ];
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 py-1">
      <MiniStat label="Users Monitored" value={data.totalUsers} color="#22d3ee" />
      <MiniStat label="Avg Risk" value={data.avgRiskScore} color="#fbbf24" />
      <MiniStat label="Click Rate" value={data.emailClickRate} color="#f43f5e" suffix="%" />
    </div>
  );
}

function PhishingRiskDistWidget({ data, viz }: { data: PhishingSummary; viz: WidgetViz }) {
  const chartData = [
    { name: "High", value: data.highRiskUsers },
    { name: "Medium", value: data.mediumRiskUsers },
    { name: "Low", value: data.lowRiskUsers },
  ];
  const colors = ["#f43f5e", "#fbbf24", "#34d399"];

  if (viz === "bar") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {chartData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={160}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="value">
            {chartData.map((_, i) => <Cell key={i} fill={colors[i]} />)}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: colors[i] }} />
            <span className="text-xs text-slate-400">{d.name}</span>
            <span className="text-xs font-bold text-slate-200">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhishingPipelineWidget({ data, viz }: { data: PhishingSummary; viz: WidgetViz }) {
  const chartData = data.pipeline;
  const colors = ["#22d3ee", "#a855f7", "#fbbf24", "#f43f5e"];

  if (viz === "pie") {
    return (
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4} dataKey="count" nameKey="stage">
            {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
          </Pie>
          <Tooltip {...CHART_TOOLTIP_STYLE} />
          <Legend formatter={(value: string) => <span className="text-[10px] text-slate-400">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={chartData}>
        <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
        <Tooltip {...CHART_TOOLTIP_STYLE} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {chartData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function PhishingAlertsWidget({ data }: { data: PhishingSummary }) {
  const all = [
    ...data.alerts.map((a) => ({ ...a, type: "alert" as const })),
    ...data.recommendations.map((r) => ({ severity: r.priority, ...r, type: "rec" as const })),
  ].slice(0, 10);
  if (all.length === 0) return <p className="text-xs text-slate-500 py-4">No alerts or recommendations</p>;

  const sevColors: Record<string, string> = { critical: "#f43f5e", high: "#f43f5e", urgent: "#f43f5e", medium: "#fbbf24", low: "#34d399" };
  return (
    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
      {all.map((item, i) => (
        <div key={i} className="flex items-start gap-2.5 rounded-lg bg-slate-900/30 p-2.5">
          <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: sevColors[item.severity] || "#64748b" }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-200 font-medium">{item.title}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.description}</p>
          </div>
          <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded flex-shrink-0 ${
            item.type === "alert" ? "text-rose-400 bg-rose-400/10" : "text-cyan-400 bg-cyan-400/10"
          }`}>{item.type === "alert" ? "Alert" : "Rec"}</span>
        </div>
      ))}
    </div>
  );
}

// ─── COMPLIANCE WIDGET ─────────────────────────────

function ComplianceStatusWidget() {
  return (
    <div className="flex flex-col gap-2 py-2">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
          </svg>
        </div>
        <span className="text-sm font-bold text-emerald-400">Ready</span>
      </div>
      <p className="text-[11px] text-slate-500 leading-relaxed">ISO 27001 assessment wizard available. Run an assessment from the Compliance module to see results.</p>
    </div>
  );
}

// ─── MODULE MANAGEMENT CARD ────────────────────────

function ModuleManagementCard({ mod, enabled, accessible, health, onToggle, onUpgrade }: {
  mod: ModuleConfig;
  enabled: boolean;
  accessible: boolean;
  health: ModuleHealth | null;
  onToggle: () => void;
  onUpgrade: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-900/30 border border-slate-700/40 p-3.5 group">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center"
        style={{ background: `${mod.color}10`, border: `1px solid ${mod.color}25` }}>
        <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" style={{ color: accessible ? mod.color : "#475569" }} fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={mod.icon} />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-bold text-slate-200">{mod.shortName}</p>
          {health && (
            <div className={`w-1.5 h-1.5 rounded-full ${health.status === "online" ? "bg-emerald-400" : "bg-red-400"}`}
              title={`${health.status} (${health.latencyMs}ms)`} />
          )}
        </div>
        <p className="text-[10px] text-slate-500">{mod.tier} tier{health?.status === "online" ? ` • ${health.latencyMs}ms` : ""}</p>
      </div>
      <div className="flex items-center gap-2">
        {!accessible && (
          <button onClick={onUpgrade} className="text-[10px] text-purple-400 hover:text-purple-300 font-bold">
            Upgrade
          </button>
        )}
        <button onClick={onToggle}
          className={`w-9 h-5 rounded-full relative transition-all ${enabled ? "bg-cyan-500/20 border border-cyan-500/30" : "bg-slate-700/40 border border-slate-700/40"}`}>
          <div className={`w-3.5 h-3.5 rounded-full absolute top-[2px] transition-all ${enabled ? "left-[18px] bg-cyan-400" : "left-[2px] bg-slate-500"}`} />
        </button>
      </div>
    </div>
  );
}

// ─── MINI STAT ─────────────────────────────────────

function MiniStat({ label, value, color, suffix = "" }: { label: string; value: number; color: string; suffix?: string }) {
  return (
    <div className="rounded-lg bg-slate-900/30 border border-slate-700/30 p-2.5">
      <p className="text-[10px] text-slate-500 font-medium mb-0.5">{label}</p>
      <p className="text-xl font-extrabold" style={{ color }}>{value.toLocaleString()}{suffix && <span className="text-xs text-slate-500 font-medium">{suffix}</span>}</p>
    </div>
  );
}
