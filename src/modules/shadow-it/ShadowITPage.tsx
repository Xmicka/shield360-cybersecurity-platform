import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import {
  Cloud, ExternalLink, BarChart3, Building2, Plus, Trash2,
  CheckCircle2, Fish, Skull, EyeOff, AlertTriangle, HelpCircle,
} from "lucide-react";
import ModuleGate from "../../components/ModuleGate";
import { MODULES } from "../../config/services";
import {
  fetchStats, fetchLogs, clearLogs,
  fetchAllowlist, addAllowlist, removeAllowlist,
  type ShadowStats, type ScanLogEntry, type AllowlistEntry,
} from "./services/api";

/* ── Pastel palette (aligned with project tokens) ─── */
const STATUS_HEX: Record<string, string> = {
  benign: "#7dba9c",
  phishing: "#c97070",
  malware: "#d4a56a",
  defacement: "#D4C5F0",
  company_allowed: "#6ba3be",
};

const STATUS_BG: Record<string, string> = {
  benign: "rgba(125,186,156,0.14)",
  phishing: "rgba(201,112,112,0.12)",
  malware: "rgba(212,165,106,0.14)",
  defacement: "rgba(184,169,201,0.18)",
  company_allowed: "rgba(107,163,190,0.14)",
};

const STATUS_LABELS: Record<string, string> = {
  benign: "Benign",
  phishing: "Phishing",
  malware: "Malware",
  defacement: "Defacement",
  company_allowed: "Safe – Company Allowed",
};

const tooltipStyle: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  fontSize: 12,
  color: "#1A1A2E",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

/* ── Small components ───────────────────────── */
function StatusIcon({ status, size = 13 }: { status: string; size?: number }) {
  const props = { size, strokeWidth: 1.5 };
  switch (status) {
    case "benign": return <CheckCircle2 {...props} />;
    case "phishing": return <Fish {...props} />;
    case "malware": return <Skull {...props} />;
    case "defacement": return <EyeOff {...props} />;
    case "company_allowed": return <Building2 {...props} />;
    default: return <HelpCircle {...props} />;
  }
}

function Badge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  const color = STATUS_HEX[status] ?? "#8A8A8A";
  const bg = STATUS_BG[status] ?? "rgba(0,0,0,0.04)";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 100,
        fontSize: 11,
        fontWeight: 600,
        background: bg,
        color,
        border: `1px solid ${bg}`,
        whiteSpace: "nowrap",
      }}
    >
      <StatusIcon status={status} size={12} />
      {label}
    </span>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string | number; accent: string }) {
  return (
    <div className="glass-card" style={{ padding: 20, position: "relative", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: accent,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      />
      <div style={{ fontSize: 28, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 4, fontWeight: 500 }}>
        {label}
      </div>
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
    <section style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--color-text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <Building2 size={18} strokeWidth={1.5} />
          Company Allowlist
        </h2>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 6, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
          Domains added here are always marked as
          <Badge status="company_allowed" />
          regardless of what the AI detects.
        </p>
      </div>

      <form style={{ display: "flex", flexWrap: "wrap", gap: 12 }} onSubmit={handleAdd}>
        <input
          type="text" placeholder="Domain (e.g. daraz.lk)" value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="input-premium"
          style={{ flex: 1, minWidth: 180 }}
        />
        <input
          type="text" placeholder="Note / reason (optional)" value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input-premium"
          style={{ flex: 1, minWidth: 180 }}
        />
        <button
          type="submit" disabled={loading}
          className="btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: 6, opacity: loading ? 0.5 : 1 }}
        >
          <Plus size={16} strokeWidth={1.8} />
          {loading ? "Adding…" : "Add to Allowlist"}
        </button>
      </form>

      {error && (
        <div style={{
          borderRadius: 12,
          border: "1px solid rgba(201,112,112,0.25)",
          background: "rgba(201,112,112,0.08)",
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--color-status-error)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <AlertTriangle size={14} strokeWidth={1.5} /> {error}
        </div>
      )}
      {success && (
        <div style={{
          borderRadius: 12,
          border: "1px solid rgba(125,186,156,0.25)",
          background: "rgba(125,186,156,0.10)",
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--color-status-ok)",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <CheckCircle2 size={14} strokeWidth={1.5} /> {success}
        </div>
      )}

      <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
            <thead>
              <tr style={{
                background: "rgba(0,0,0,0.02)",
                borderBottom: "1px solid var(--color-border)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--color-text-muted)",
                fontWeight: 600,
              }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>#</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Domain</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Note</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Added</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-muted)" }}>No domains in the allowlist yet.</td></tr>
              ) : entries.map((e) => (
                <tr key={e.id} style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                  onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                >
                  <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>{e.id}</td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-primary)", fontWeight: 500 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                      <Building2 size={14} strokeWidth={1.5} style={{ color: "var(--color-brand-blue)" }} />
                      {e.domain}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>{e.note || "—"}</td>
                  <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>{new Date(e.added_at).toLocaleDateString()}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <button
                      onClick={() => handleRemove(e.id, e.domain)}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "transparent",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-muted)",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 12,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(ev) => {
                        ev.currentTarget.style.color = "var(--color-status-error)";
                        ev.currentTarget.style.borderColor = "rgba(201,112,112,0.3)";
                        ev.currentTarget.style.background = "rgba(201,112,112,0.06)";
                      }}
                      onMouseLeave={(ev) => {
                        ev.currentTarget.style.color = "var(--color-text-muted)";
                        ev.currentTarget.style.borderColor = "var(--color-border)";
                        ev.currentTarget.style.background = "transparent";
                      }}
                    >
                      <Trash2 size={12} strokeWidth={1.5} /> Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
  const mod = MODULES.find(m => m.slug === "shadow-it");

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
    <div className="max-w-[1240px] mx-auto w-full px-2 flex flex-col gap-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex flex-col md:flex-row md:items-center items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: "linear-gradient(135deg, rgba(107,163,190,0.18), rgba(212,197,240,0.22))",
                border: "1px solid var(--color-border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--color-brand-blue)",
              }}
            >
              <Cloud size={20} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                Shadow IT Dashboard
              </h1>
              <p style={{ fontSize: 12, color: "var(--color-text-muted)", marginTop: 2 }}>
                Discover unauthorized applications & hidden vulnerabilities
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {mod?.deployedUrl && (
              <a
                href={mod.deployedUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "8px 16px",
                  borderRadius: 100,
                  background: "var(--color-bg-card)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  fontSize: 13, fontWeight: 500,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                Open Original App
                <ExternalLink size={14} strokeWidth={1.5} />
              </a>
            )}
            {serverDown ? (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 100,
                fontSize: 11, fontWeight: 600,
                background: "rgba(201,112,112,0.12)",
                color: "var(--color-status-error)",
                border: "1px solid rgba(201,112,112,0.25)",
              }}>
                <AlertTriangle size={12} strokeWidth={1.5} /> Server Offline
              </span>
            ) : (
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 100,
                fontSize: 11, fontWeight: 600,
                background: "rgba(125,186,156,0.14)",
                color: "var(--color-status-ok)",
                border: "1px solid rgba(125,186,156,0.25)",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-status-ok)" }} />
                Live
              </span>
            )}
            {lastRefresh && (
              <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Updated {lastRefresh.toLocaleTimeString()}</span>
            )}
          </div>
        </div>
      </motion.div>

      {serverDown && (
        <div style={{
          borderRadius: 12,
          border: "1px solid rgba(201,112,112,0.25)",
          background: "rgba(201,112,112,0.08)",
          padding: "10px 14px",
          fontSize: 13,
          color: "var(--color-status-error)",
        }}>
          Cannot reach Shadow IT API — make sure the backend is running.
        </div>
      )}

      {/* Tab Nav */}
      <div style={{
        display: "inline-flex", gap: 4, padding: 4, borderRadius: 12,
        background: "rgba(0,0,0,0.03)",
        border: "1px solid var(--color-border)",
        width: "fit-content",
      }}>
        {(["dashboard", "allowlist"] as const).map((t) => {
          const active = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 18px",
                borderRadius: 8,
                fontSize: 13, fontWeight: 500,
                cursor: "pointer",
                border: active ? "1px solid var(--color-border)" : "1px solid transparent",
                background: active ? "var(--color-bg-card)" : "transparent",
                color: active ? "var(--color-text-primary)" : "var(--color-text-muted)",
                boxShadow: active ? "0 1px 3px rgba(0,0,0,0.04)" : "none",
                transition: "all 0.2s",
              }}
            >
              {t === "dashboard" ? <BarChart3 size={14} strokeWidth={1.5} /> : <Building2 size={14} strokeWidth={1.5} />}
              {t === "dashboard" ? "Dashboard" : "Company Allowlist"}
            </button>
          );
        })}
      </div>

      {/* Dashboard Tab */}
      {tab === "dashboard" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6">
          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6 gap-4">
            <StatCard label="Total Scanned" value={stats?.total ?? "—"} accent="var(--color-brand-blue)" />
            <StatCard label="Threats Found" value={threats || "—"} accent="var(--color-status-error)" />
            <StatCard label="Phishing" value={stats?.breakdown?.phishing ?? 0} accent="var(--color-accent-coral)" />
            <StatCard label="Malware" value={stats?.breakdown?.malware ?? 0} accent="var(--color-status-warn)" />
            <StatCard label="Defacement" value={stats?.breakdown?.defacement ?? 0} accent="var(--color-accent-lavender)" />
            <StatCard label="Company Allowed" value={stats?.breakdown?.company_allowed ?? 0} accent="var(--color-status-ok)" />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Threat Breakdown</h3>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2, marginBottom: 12 }}>
                Distribution by category
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11, fill: "#4A4A4A" }}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_HEX[entry.name] ?? "#8A8A8A"} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Scans by Category</h3>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2, marginBottom: 12 }}>
                Volume per status
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
                  <XAxis dataKey="name" stroke="#8A8A8A" tick={{ fontSize: 11, fill: "#8A8A8A" }} />
                  <YAxis stroke="#8A8A8A" tick={{ fontSize: 11, fill: "#8A8A8A" }} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#4A4A4A" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {barData.map((entry) => (
                      <Cell key={entry.name} fill={STATUS_HEX[entry.name] ?? "#8A8A8A"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Recent Threats</h3>
              <p style={{ fontSize: 12, color: "var(--color-text-secondary)", marginTop: 2, marginBottom: 12 }}>
                Latest detections
              </p>
              {(stats?.recent_threats ?? []).length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--color-text-muted)", padding: "32px 0", textAlign: "center" }}>
                  No threats detected yet.
                </p>
              ) : (
                <ul style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 200, overflowY: "auto", listStyle: "none" }}>
                  {(stats?.recent_threats ?? []).map((t) => (
                    <li key={t.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13 }}>
                      <Badge status={t.status} />
                      <span style={{
                        flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        color: "var(--color-text-secondary)",
                      }} title={t.url}>{t.url}</span>
                      <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{(t.confidence * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Scan Log */}
          <div className="glass-card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid var(--color-border)",
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)" }}>Scan Log</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <select
                  value={filter} onChange={(e) => setFilter(e.target.value)}
                  style={{
                    background: "var(--color-bg-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    padding: "6px 12px",
                    fontSize: 12,
                    color: "var(--color-text-secondary)",
                    outline: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">All</option>
                  <option value="benign">Benign</option>
                  <option value="phishing">Phishing</option>
                  <option value="malware">Malware</option>
                  <option value="defacement">Defacement</option>
                  <option value="company_allowed">Company Allowed</option>
                </select>
                <button
                  className="btn-ghost"
                  onClick={handleClear}
                  disabled={clearing}
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    opacity: clearing ? 0.5 : 1,
                  }}
                  onMouseEnter={(ev) => {
                    if (clearing) return;
                    ev.currentTarget.style.color = "var(--color-status-error)";
                    ev.currentTarget.style.borderColor = "rgba(201,112,112,0.35)";
                  }}
                  onMouseLeave={(ev) => {
                    ev.currentTarget.style.color = "";
                    ev.currentTarget.style.borderColor = "";
                  }}
                >
                  <Trash2 size={12} strokeWidth={1.5} />
                  {clearing ? "Clearing…" : "Clear Logs"}
                </button>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{
                    background: "rgba(0,0,0,0.02)",
                    borderBottom: "1px solid var(--color-border)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    color: "var(--color-text-muted)",
                    fontWeight: 600,
                  }}>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>#</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Timestamp</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>Confidence</th>
                    <th style={{ padding: "12px 16px", textAlign: "left" }}>URL</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan={5} style={{ padding: "32px 16px", textAlign: "center", color: "var(--color-text-muted)" }}>No scans recorded yet.</td></tr>
                  ) : logs.map((row) => (
                    <tr
                      key={row.id}
                      style={{ borderBottom: "1px solid var(--color-border)", transition: "background 0.2s" }}
                      onMouseEnter={(ev) => (ev.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                      onMouseLeave={(ev) => (ev.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "12px 16px", color: "var(--color-text-muted)" }}>{row.id}</td>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>{new Date(row.scanned_at).toLocaleString()}</td>
                      <td style={{ padding: "12px 16px" }}><Badge status={row.status} /></td>
                      <td style={{ padding: "12px 16px", color: "var(--color-text-primary)", fontWeight: 500 }}>{(row.confidence * 100).toFixed(1)}%</td>
                      <td style={{
                        padding: "12px 16px",
                        color: "var(--color-text-secondary)",
                        maxWidth: 300,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }} title={row.url}>{row.url}</td>
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
