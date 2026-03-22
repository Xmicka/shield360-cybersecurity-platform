import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import ModuleGate from "../../components/ModuleGate";
import {
  fetchStats, fetchLogs, clearLogs,
  fetchAllowlist, addAllowlist, removeAllowlist,
  type ShadowStats, type ScanLogEntry, type AllowlistEntry,
} from "./services/api";

/* ── Palette ─────────────────────────────────── */
const STATUS_COLORS: Record<string, string> = {
  benign: "#22c55e",
  phishing: "#ef4444",
  malware: "#f97316",
  defacement: "#a855f7",
  company_allowed: "#38bdf8",
};
const STATUS_ICONS: Record<string, string> = {
  benign: "✅",
  phishing: "🎣",
  malware: "☠️",
  defacement: "🖤",
  company_allowed: "🏢",
};

/* ── Small components ───────────────────────── */
function Badge({ status }: { status: string }) {
  const label = status === "company_allowed" ? "Safe – Company Allowed" : status;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white"
      style={{ backgroundColor: STATUS_COLORS[status] ?? "#64748b" }}
    >
      {STATUS_ICONS[status] ?? "❓"} {label}
    </span>
  );
}

function StatCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div
      className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-5"
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="text-2xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs text-slate-400 mt-1">{label}</div>
    </div>
  );
}

/* ── Allowlist Tab ───────────────────────────── */
function AllowlistTab() {
  const [entries, setEntries] = useState<AllowlistEntry[]>([]);
  const [domain, setDomain] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    try { setEntries(await fetchAllowlist()); } catch { /* server down */ }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!domain.trim()) { setError("Please enter a domain."); return; }
    setLoading(true);
    try {
      const res = await addAllowlist(domain.trim(), note.trim());
      setSuccess(res.message);
      setDomain(""); setNote("");
      await load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: number, d: string) => {
    if (!window.confirm(`Remove "${d}" from allowlist?`)) return;
    await removeAllowlist(id);
    await load();
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">🏢 Company Allowlist</h2>
        <p className="text-sm text-slate-400 mt-1">
          Domains added here are always marked as <Badge status="company_allowed" /> regardless of what the AI detects.
        </p>
      </div>

      <form className="flex flex-wrap gap-3" onSubmit={handleAdd}>
        <input
          type="text" placeholder="Domain (e.g. daraz.lk)" value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="flex-1 min-w-[180px] rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
        />
        <input
          type="text" placeholder="Note / reason (optional)" value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-w-[180px] rounded-lg border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
        />
        <button
          type="submit" disabled={loading}
          className="rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-5 py-2.5 text-sm font-semibold text-white transition-colors"
        >
          {loading ? "Adding…" : "＋ Add to Allowlist"}
        </button>
      </form>

      {error && <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">⚠️ {error}</div>}
      {success && <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm text-emerald-300">✅ {success}</div>}

      <div className="overflow-x-auto rounded-xl border border-slate-700/60">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-4 py-3 text-left">#</th>
              <th className="px-4 py-3 text-left">Domain</th>
              <th className="px-4 py-3 text-left">Note</th>
              <th className="px-4 py-3 text-left">Added</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {entries.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No domains in the allowlist yet.</td></tr>
            ) : entries.map((e) => (
              <tr key={e.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-400">{e.id}</td>
                <td className="px-4 py-3 text-cyan-300 font-medium">🏢 {e.domain}</td>
                <td className="px-4 py-3 text-slate-500">{e.note || "—"}</td>
                <td className="px-4 py-3 text-slate-400">{new Date(e.added_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    className="rounded-md bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20 transition-colors"
                    onClick={() => handleRemove(e.id, e.domain)}
                  >🗑 Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── Main Content ────────────────────────────── */
function ShadowITContent() {
  const [tab, setTab] = useState<"dashboard" | "allowlist">("dashboard");
  const [stats, setStats] = useState<ShadowStats | null>(null);
  const [logs, setLogs] = useState<ScanLogEntry[]>([]);
  const [filter, setFilter] = useState("");
  const [serverDown, setServerDown] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [s, l] = await Promise.all([fetchStats(), fetchLogs({ status: filter })]);
      setStats(s);
      setLogs(l);
      setServerDown(false);
      setLastRefresh(new Date());
    } catch {
      setServerDown(true);
    }
  }, [filter]);

  // Polling
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  const handleClear = async () => {
    if (!window.confirm("Clear all scan logs?")) return;
    setClearing(true);
    await clearLogs();
    await refresh();
    setClearing(false);
  };

  const pieData = stats
    ? Object.entries(stats.breakdown).map(([name, value]) => ({ name, value }))
    : [];
  const barData = stats
    ? Object.entries(stats.breakdown).map(([name, value]) => ({ name, count: value }))
    : [];
  const threats = stats
    ? (stats.breakdown.phishing ?? 0) + (stats.breakdown.malware ?? 0) + (stats.breakdown.defacement ?? 0)
    : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Shadow IT Dashboard</h1>
              <p className="text-xs text-slate-500">Discover unauthorized applications & hidden vulnerabilities</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {serverDown ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 ring-1 ring-inset ring-red-500/20">
                ⚠️ Server Offline
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            )}
            {lastRefresh && (
              <span className="text-xs text-slate-500">Updated {lastRefresh.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </motion.div>

      {serverDown && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Cannot reach Shadow IT API — make sure the backend is running.
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex gap-1 p-1 rounded-xl bg-slate-800/60 border border-slate-700/60 w-fit">
        {(["dashboard", "allowlist"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition-all ${
              tab === t
                ? "bg-slate-700 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "dashboard" ? "📊 Dashboard" : "🏢 Company Allowlist"}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {tab === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard label="Total Scanned" value={stats?.total ?? "—"} color="#38bdf8" />
            <StatCard label="Threats Found" value={threats || "—"} color="#ef4444" />
            <StatCard label="Phishing" value={stats?.breakdown?.phishing ?? 0} color="#ef4444" />
            <StatCard label="Malware" value={stats?.breakdown?.malware ?? 0} color="#f97316" />
            <StatCard label="Defacement" value={stats?.breakdown?.defacement ?? 0} color="#a855f7" />
            <StatCard label="Company Allowed" value={stats?.breakdown?.company_allowed ?? 0} color="#38bdf8" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Threat Breakdown</h3>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#64748b"} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Scans by Category</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }} />
                  <Legend />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? "#64748b"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm p-5">
              <h3 className="text-sm font-semibold text-slate-200 mb-3">Recent Threats</h3>
              {(stats?.recent_threats ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 py-8 text-center">No threats detected yet.</p>
              ) : (
                <ul className="space-y-2.5 max-h-[200px] overflow-y-auto">
                  {(stats?.recent_threats ?? []).map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm">
                      <Badge status={t.status} />
                      <span className="truncate text-slate-300 flex-1" title={t.url}>{t.url}</span>
                      <span className="text-xs text-slate-500">{(t.confidence * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Scan Log */}
          <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/60">
              <h3 className="text-sm font-semibold text-slate-200">Scan Log</h3>
              <div className="flex items-center gap-3">
                <select
                  value={filter} onChange={(e) => setFilter(e.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/30"
                >
                  <option value="">All</option>
                  <option value="benign">Benign</option>
                  <option value="phishing">Phishing</option>
                  <option value="malware">Malware</option>
                  <option value="defacement">Defacement</option>
                  <option value="company_allowed">Company Allowed</option>
                </select>
                <button
                  className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  onClick={handleClear} disabled={clearing}
                >
                  {clearing ? "Clearing…" : "🗑 Clear Logs"}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                    <th className="px-4 py-3 text-left">#</th>
                    <th className="px-4 py-3 text-left">Timestamp</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Confidence</th>
                    <th className="px-4 py-3 text-left">URL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {logs.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">No scans recorded yet.</td></tr>
                  ) : logs.map((row) => (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-slate-800/40 ${
                        row.status === "company_allowed"
                          ? "bg-cyan-500/5"
                          : row.status !== "benign"
                            ? "bg-red-500/5"
                            : ""
                      }`}
                    >
                      <td className="px-4 py-3 text-slate-500">{row.id}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(row.scanned_at).toLocaleString()}</td>
                      <td className="px-4 py-3"><Badge status={row.status} /></td>
                      <td className="px-4 py-3 text-slate-300">{(row.confidence * 100).toFixed(1)}%</td>
                      <td className="px-4 py-3 text-slate-400 max-w-[300px] truncate" title={row.url}>{row.url}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* Allowlist Tab */}
      {tab === "allowlist" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <AllowlistTab />
        </motion.div>
      )}
    </div>
  );
}

export default function ShadowITPage() {
  return (
    <ModuleGate moduleSlug="shadow-it" moduleName="Shadow IT Dashboard">
      <ShadowITContent />
    </ModuleGate>
  );
}
