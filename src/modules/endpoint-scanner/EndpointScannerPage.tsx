import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import ModuleGate from "../../components/ModuleGate";
import { api } from "./services/api";
import type { EndpointListItem } from "./types";

/* ── helpers ── */
function formatWhen(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── Inline Badge ── */
function Badge({ label, tone = "neutral", size = "sm" }: { label: string; tone?: "neutral" | "success" | "warning" | "danger"; size?: "sm" | "md" }) {
  const colors: Record<string, string> = {
    neutral: "bg-slate-700/40 text-slate-200 ring-slate-600/60",
    success: "bg-emerald-500/10 text-emerald-300 ring-emerald-400/20",
    warning: "bg-amber-500/10 text-amber-300 ring-amber-400/20",
    danger: "bg-red-500/10 text-red-300 ring-red-400/20",
  };
  return (
    <span className={`inline-flex items-center font-medium ring-1 ring-inset ${size === "sm" ? "rounded-md px-2 py-0.5 text-[11px]" : "rounded-lg px-2.5 py-1 text-xs"} ${colors[tone]}`}>
      {label}
    </span>
  );
}

/* ── Dashboard (device list) ── */
function EndpointDashboard({ onSelectEndpoint }: { onSelectEndpoint: (id: string) => void }) {
  const [items, setItems] = useState<EndpointListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listEndpoints(200);
      setItems(data);
      setLastRefresh(new Date());
    } catch (e: any) {
      setError(e?.message || "Failed to load endpoints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  const scanningIds = useMemo(() => new Set(items.filter((i) => i.scan_status === "scanning").map((i) => i.endpoint_id)), [items]);

  useEffect(() => {
    if (scanningIds.size === 0) return;
    const t = window.setInterval(() => void load(), 3000);
    return () => window.clearInterval(t);
  }, [scanningIds.size]);

  useEffect(() => {
    const t = window.setInterval(() => void load(), 30_000);
    return () => window.clearInterval(t);
  }, []);

  async function onScan(endpointId: string) {
    setScanError(null);
    setItems((prev) => prev.map((it) => (it.endpoint_id === endpointId ? { ...it, scan_status: "scanning" as const } : it)));
    try {
      await api.startScan(endpointId);
      void load();
    } catch (e: any) {
      setScanError(e?.message || "Failed to start scan");
      setItems((prev) => prev.map((it) => (it.endpoint_id === endpointId ? { ...it, scan_status: "failed" as const } : it)));
    }
  }

  async function onCancel(endpointId: string) {
    setScanError(null);
    try { await api.cancelScan(endpointId); await load(); } catch (e: any) { setScanError(e?.message || "Failed to cancel scan"); }
  }

  const onlineCount = items.filter((i) => i.is_online === true).length;
  const offlineCount = items.filter((i) => i.is_online !== true).length;

  const filtered = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter((it) => (it.endpoint_name || "").toLowerCase().includes(q) || it.endpoint_id.toLowerCase().includes(q) || (it.os_name || "").toLowerCase().includes(q));
  }, [items, search]);

  return (
    <div className="flex flex-col gap-5">
      {/* Status summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> {onlineCount} Online
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-300 ring-1 ring-inset ring-red-400/20">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {offlineCount} Offline
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Updated {lastRefresh.toLocaleTimeString()}</span>
          <button onClick={() => void load()} className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition" title="Refresh">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
          <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        </div>
        <input
          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by hostname or OS..."
          className="block w-full rounded-lg border border-slate-700 bg-slate-800 py-2.5 pl-10 pr-4 text-sm text-slate-100 placeholder-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {scanError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>⚠</span><span>{scanError}</span>
        </div>
      )}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          <span>⚠</span><span>{error}</span>
        </div>
      )}

      {/* Device table */}
      <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm">
        <div className="px-5 py-4 border-b border-slate-700/60">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">Devices ({loading ? "…" : filtered.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3 text-left">Status</th>
                <th className="px-5 py-3 text-left">Hostname</th>
                <th className="px-5 py-3 text-left">Operating System</th>
                <th className="px-5 py-3 text-left">Last Seen</th>
                <th className="px-5 py-3 text-left">Apps</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filtered.map((it) => {
                const isScanning = it.scan_status === "scanning";
                const online = it.is_online === true;
                return (
                  <tr key={it.endpoint_id} className="transition-colors hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${online ? "text-emerald-400" : "text-red-400"}`}>
                        <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-red-500"}`} />
                        {online ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <svg className="h-4 w-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                        <div>
                          <button onClick={() => onSelectEndpoint(it.endpoint_id)} className="font-semibold text-slate-100 hover:text-indigo-300 hover:underline">
                            {it.endpoint_name || it.endpoint_id}
                          </button>
                          <div className="mt-0.5 font-mono text-[11px] text-slate-500">{it.endpoint_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">{it.os_name || "Unknown"}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-400">{formatWhen(it.last_seen)}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge label={`${it.application_count} apps`} tone="success" size="md" />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button onClick={() => onSelectEndpoint(it.endpoint_id)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs font-medium text-slate-200 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                          View
                        </button>
                        {isScanning ? (
                          <button onClick={() => void onCancel(it.endpoint_id)} className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-red-500 transition">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            Cancel
                          </button>
                        ) : (
                          <button onClick={() => void onScan(it.endpoint_id)} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 transition">
                            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            Scan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500">{items.length === 0 ? "No endpoints found." : "No endpoints match your search."}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { MODULES } from "../../config/services";

/* ── Main Endpoint Scanner Content ── */
function EndpointScannerContent() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const mod = MODULES.find(m => m.slug === "endpoint-scanner");

  if (selectedEndpoint) {
    return (
      <div className="flex flex-col gap-5">
        <button
          onClick={() => setSelectedEndpoint(null)}
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-100 transition w-fit"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          Back to device list
        </button>
        <EndpointDetailView endpointId={selectedEndpoint} />
      </div>
    );
  }

  return (
    <div className="max-w-[1240px] mx-auto w-full px-2 flex flex-col gap-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex md:flex-row flex-col items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Endpoint Risk Scanner</h1>
              <p className="text-xs text-slate-500">Scan endpoints for vulnerabilities, CVEs, and security risks</p>
            </div>
          </div>
          
          {mod?.deployedUrl && (
            <a href={mod.deployedUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-slate-800/80 px-4 py-2 text-sm font-semibold text-slate-200 border border-slate-700 hover:bg-slate-700 hover:text-white transition-all shadow-lg hover:shadow-cyan-500/20 group">
              Open Original App
              <svg className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </motion.div>
      <EndpointDashboard onSelectEndpoint={setSelectedEndpoint} />
    </div>
  );
}

/* ── Simplified detail view (uses internal state instead of router params) ── */
function EndpointDetailView({ endpointId }: { endpointId: string }) {
  // We render the full details inline — the EndpointDetails component uses useParams,
  // but since we're managing state internally, we'll render a simplified version.
  // For full parity, we import EndpointDetails and mock the param.

  return (
    <div className="[&_a[href*='/endpoints/']]:pointer-events-none">
      {/* We wrap EndpointDetails providing the endpointId via URL */}
      <EndpointDetailInline endpointId={endpointId} />
    </div>
  );
}

/* ── Inline endpoint detail (avoids router dependency) ── */
function EndpointDetailInline({ endpointId }: { endpointId: string }) {
  const [results, setResults] = useState<import("./types").EndpointResults | null>(null);
  const [detail, setDetail] = useState<import("./types").EndpointDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("overview");

  async function load() {
    if (!endpointId) return;
    setLoading(true);
    setError(null);
    try {
      const [res, det] = await Promise.all([api.getResults(endpointId), api.getEndpoint(endpointId)]);
      setResults(res);
      setDetail(det);
    } catch (e: any) {
      setError(e?.message || "Failed to load endpoint");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, [endpointId]);

  useEffect(() => {
    if (!results || results.scan_status !== "scanning") return;
    const t = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(t);
  }, [results?.scan_status]);

  async function onScan() {
    setScanError(null);
    try {
      await api.startScan(endpointId);
      void load();
    } catch (e: any) {
      setScanError(e?.message || "Failed to start scan");
    }
  }

  const hostname = detail?.identity?.hostname || detail?.connection_status?.hostname || "—";
  const osName = detail?.system?.os_name || "—";
  const isOnline = detail?.connection_status?.online;

  const TABS = ["overview", "security", "network", "software", "scan"] as const;

  if (loading && !detail) {
    return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" /></div>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        ⚠ {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-100">{hostname}</h2>
            {isOnline !== undefined && (
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${isOnline ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-inset ring-emerald-400/20" : "bg-slate-800 text-slate-300 ring-1 ring-inset ring-slate-700"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isOnline ? "bg-emerald-500" : "bg-slate-400"}`} />
                {isOnline ? "Online" : "Offline"}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-sm text-slate-500">{endpointId}</p>
          {osName !== "—" && <p className="mt-0.5 text-sm text-slate-400">{osName}</p>}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => void load()} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 ring-1 ring-inset ring-slate-700 hover:bg-slate-700 transition">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Refresh
          </button>
          <button onClick={() => void onScan()} className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-medium text-white hover:bg-indigo-500 transition">
            Run Scan
          </button>
        </div>
      </div>

      {scanError && <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">⚠ {scanError}</div>}

      {/* Tabs */}
      <div className="border-b border-slate-700/60">
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors capitalize ${
                activeTab === tab
                  ? "border-indigo-400 text-indigo-300"
                  : "border-transparent text-slate-400 hover:border-slate-600 hover:text-slate-200"
              }`}
            >{tab === "scan" ? "Scan Results" : tab}</button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {detail && (
        <div className="text-slate-300">
          {activeTab === "overview" && <OverviewPanel detail={detail} />}
          {activeTab === "security" && <SecurityPanel detail={detail} />}
          {activeTab === "network" && <NetworkPanel detail={detail} />}
          {activeTab === "software" && <SoftwarePanel detail={detail} />}
          {activeTab === "scan" && <ScanPanel results={results} onScan={onScan} endpointId={endpointId} />}
        </div>
      )}
    </div>
  );
}

/* ── Tab Panels ── */
function InfoRow({ label, value }: { label: string; value?: string | number | null | boolean }) {
  if (value === undefined || value === null || value === "") return null;
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-700/30 last:border-0">
      <span className="text-xs font-medium text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-slate-100 text-right break-all">{display}</span>
    </div>
  );
}

function PanelCard({ title, subtitle, children, noPadding }: { title?: string; subtitle?: string; children: React.ReactNode; noPadding?: boolean }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm">
      {title && (
        <div className="flex items-start justify-between gap-4 border-b border-slate-700/60 px-6 py-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
            {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className={noPadding ? "" : "px-6 py-5"}>{children}</div>
    </div>
  );
}

function OverviewPanel({ detail }: { detail: import("./types").EndpointDetail }) {
  const hostname = detail.identity?.hostname || "—";
  const cpu = detail.system?.cpu?.[0];
  const mem = detail.system?.memory;
  const disks = detail.system?.disks || [];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PanelCard title="System Information" subtitle="Hardware & operating system">
        <InfoRow label="Hostname" value={hostname} />
        <InfoRow label="Operating System" value={detail.system?.os_name} />
        <InfoRow label="Architecture" value={detail.system?.os_architecture} />
        <InfoRow label="CPU" value={cpu?.name} />
        <InfoRow label="Cores / Threads" value={cpu ? `${cpu.cores} / ${cpu.logical_processors}` : undefined} />
        <InfoRow label="RAM Total" value={mem ? `${mem.total_gb} GB` : undefined} />
        <InfoRow label="RAM Used" value={mem ? `${mem.used_gb?.toFixed(1)} GB (${mem.percent_used}%)` : undefined} />
        <InfoRow label="Public IP" value={detail.network?.public_ip} />
        <InfoRow label="Agent Version" value={detail.agent_version} />
      </PanelCard>

      <PanelCard title="Storage" subtitle="Disk partitions">
        <div className="space-y-3">
          {disks.map((d, i) => {
            const pct = d.percent_used ?? 0;
            const barColor = pct > 90 ? "bg-red-500" : pct > 75 ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-slate-100">{d.mountpoint || d.device}</span>
                  <span className="text-xs text-slate-400">{d.filesystem}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-700">
                  <div className={`h-2 rounded-full ${barColor} transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs text-slate-400">
                  <span>{d.used_gb?.toFixed(1)} GB used</span>
                  <span>{d.free_gb?.toFixed(1)} GB free / {d.total_gb?.toFixed(1)} GB total</span>
                </div>
              </div>
            );
          })}
          {disks.length === 0 && <p className="py-4 text-center text-sm text-slate-500">No storage data available</p>}
        </div>
      </PanelCard>
    </div>
  );
}

function SecurityPanel({ detail }: { detail: import("./types").EndpointDetail }) {
  const antivirus = detail.security?.antivirus || [];
  const defender = detail.security?.windows_defender;
  const winFw = detail.security?.windows_firewall;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PanelCard title="Antivirus" subtitle="Endpoint protection">
        {antivirus.length > 0 ? (
          <div className="space-y-2">
            {antivirus.map((av, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-3">
                <span className="text-sm font-medium text-slate-100">{av.name}</span>
                <div className="flex gap-1.5">
                  <Badge label={av.enabled ? "Enabled" : "Disabled"} tone={av.enabled ? "success" : "danger"} />
                  <Badge label={av.updated ? "Updated" : "Outdated"} tone={av.updated ? "success" : "warning"} />
                </div>
              </div>
            ))}
          </div>
        ) : <p className="py-4 text-center text-sm text-slate-500">No antivirus data</p>}
      </PanelCard>

      <PanelCard title="Firewall" subtitle="Firewall profiles">
        {winFw && Object.keys(winFw).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(winFw).map(([profile, state]) => (
              <div key={profile} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/30 px-3 py-2">
                <span className="text-xs font-medium text-slate-300">{profile}</span>
                <Badge label={state} tone={state === "ON" ? "success" : "danger"} />
              </div>
            ))}
          </div>
        ) : <p className="py-4 text-center text-sm text-slate-500">No firewall data</p>}
      </PanelCard>

      {defender && (
        <PanelCard title="Windows Defender" subtitle="Built-in protection">
          <InfoRow label="Realtime Protection" value={defender.realtime_protection} />
          <InfoRow label="Antivirus Enabled" value={defender.antivirus_enabled} />
          <InfoRow label="Anti-spyware" value={defender.antispyware_enabled} />
        </PanelCard>
      )}

      <PanelCard title="Policies">
        <InfoRow label="UAC Enabled" value={detail.security?.uac_enabled} />
        <InfoRow label="Pending Updates" value={detail.windows_updates?.pending_updates} />
      </PanelCard>
    </div>
  );
}

function NetworkPanel({ detail }: { detail: import("./types").EndpointDetail }) {
  const ifaces = detail.network?.interfaces || [];
  const conns = detail.network?.active_connections || [];
  const ports = detail.network?.listening_ports || [];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Interfaces">
          {ifaces.length > 0 ? (
            <div className="space-y-2">
              {ifaces.map((ifc, i) => (
                <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-3">
                  <div className="text-sm font-medium text-slate-100">{ifc.name}</div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs text-slate-400">
                    {ifc.ipv4 && <span>IPv4: <span className="font-mono text-slate-200">{ifc.ipv4}</span></span>}
                    {ifc.mac && <span>MAC: <span className="font-mono text-slate-200">{ifc.mac}</span></span>}
                  </div>
                </div>
              ))}
            </div>
          ) : <p className="py-4 text-center text-sm text-slate-500">No interface data</p>}
        </PanelCard>

        <PanelCard title="DNS Servers">
          {(detail.network?.dns_servers || []).length > 0 ? (
            <div className="space-y-1.5">
              {(detail.network?.dns_servers || []).map((d, i) => (
                <div key={i} className="rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-2.5 font-mono text-sm text-slate-100">{d}</div>
              ))}
            </div>
          ) : <p className="py-4 text-center text-sm text-slate-500">No DNS data</p>}
        </PanelCard>

        <PanelCard title="Public IP">
          <div className="flex flex-col items-center py-2">
            <span className="font-mono text-xl font-bold text-slate-100">{detail.network?.public_ip || "—"}</span>
          </div>
        </PanelCard>
      </div>

      <PanelCard title={`Active Connections (${conns.length})`} noPadding>
        {conns.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-2.5 text-left">Process</th><th className="px-5 py-2.5 text-left">Remote</th><th className="px-5 py-2.5 text-left">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {conns.slice(0, 50).map((c, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="px-5 py-2 font-medium text-slate-100">{c.process || "—"}</td>
                    <td className="px-5 py-2 font-mono text-xs text-slate-300">{c.remote_address || "—"}</td>
                    <td className="px-5 py-2"><Badge label={c.status || "—"} tone={c.status === "ESTABLISHED" ? "success" : "neutral"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-5 py-6 text-center text-sm text-slate-500">No active connections</p>}
      </PanelCard>

      <PanelCard title={`Listening Ports (${ports.length})`} noPadding>
        {ports.length > 0 ? (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-2.5 text-left">Port</th><th className="px-5 py-2.5 text-left">Protocol</th><th className="px-5 py-2.5 text-left">Process</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {ports.slice(0, 50).map((p, i) => (
                  <tr key={i} className="hover:bg-slate-800/40">
                    <td className="px-5 py-2 font-mono font-semibold text-slate-100">{p.port ?? "—"}</td>
                    <td className="px-5 py-2 text-xs text-slate-300">{p.protocol || "—"}</td>
                    <td className="px-5 py-2 text-slate-200">{p.process || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="px-5 py-6 text-center text-sm text-slate-500">No listening ports data</p>}
      </PanelCard>
    </div>
  );
}

function SoftwarePanel({ detail }: { detail: import("./types").EndpointDetail }) {
  const apps = detail.applications || [];
  return (
    <PanelCard title={`Installed Applications (${apps.length})`} noPadding>
      {apps.length > 0 ? (
        <div className="overflow-x-auto max-h-[32rem] overflow-y-auto">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-slate-800 z-10"><tr className="border-b border-slate-700 text-xs uppercase tracking-wider text-slate-400">
              <th className="px-5 py-2.5 text-left">Application</th><th className="px-5 py-2.5 text-left">Version</th><th className="px-5 py-2.5 text-left">Publisher</th>
            </tr></thead>
            <tbody className="divide-y divide-slate-700/50">
              {apps.map((a, i) => (
                <tr key={i} className="hover:bg-slate-800/40">
                  <td className="px-5 py-2.5 font-medium text-slate-100">{a.name || "—"}</td>
                  <td className="px-5 py-2.5 font-mono text-xs text-slate-300">{a.version || "—"}</td>
                  <td className="px-5 py-2.5 text-slate-300">{a.publisher || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="px-5 py-8 text-center text-sm text-slate-500">No application data</p>}
    </PanelCard>
  );
}

function ScanPanel({ results, onScan, endpointId }: { results: import("./types").EndpointResults | null; onScan: () => void; endpointId: string }) {
  const es = (results?.endpoint_summary || {}) as any;
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [appCves, setAppCves] = useState<import("./types").ApplicationCves | null>(null);
  const [cvesLoading, setCvesLoading] = useState(false);

  async function toggleApp(productName: string) {
    if (expandedApp === productName) { setExpandedApp(null); setAppCves(null); return; }
    setExpandedApp(productName);
    setAppCves(null);
    setCvesLoading(true);
    try {
      const data = await api.getApplicationCves(endpointId, productName);
      setAppCves(data);
    } catch { /* ignore */ } finally {
      setCvesLoading(false);
    }
  }

  if (!results || results.scan_status === "not_scanned") {
    return (
      <PanelCard>
        <div className="flex flex-col items-center py-8 text-center">
          <p className="text-sm font-medium text-slate-100">No scan results yet</p>
          <p className="mt-1 text-xs text-slate-400">Run a vulnerability scan to see risk analysis.</p>
          <button onClick={onScan} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition">Run Scan</button>
        </div>
      </PanelCard>
    );
  }

  if (results.scan_status !== "completed") {
    return (
      <PanelCard>
        <p className="py-8 text-center text-sm text-slate-400">
          {results.scan_status === "failed" ? "Last scan failed. Try again." : "Waiting for scan to complete…"}
        </p>
      </PanelCard>
    );
  }

  const riskScore = typeof es.endpoint_risk_score_0_100 === "number" ? Number(es.endpoint_risk_score_0_100).toFixed(1) : "—";
  const riskTier = es.endpoint_risk_tier || "—";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5 text-center">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Overall Risk</p>
          <div className="mt-2 text-3xl font-bold tabular-nums text-slate-100">{riskScore}</div>
          <p className="text-xs text-slate-400">/100</p>
          <Badge label={riskTier.toUpperCase()} tone={riskTier.toLowerCase() === "low" ? "success" : riskTier.toLowerCase() === "moderate" ? "warning" : "danger"} size="md" />
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Vulnerable Apps</p>
          <p className="mt-2 text-lg font-bold text-slate-100">{es.application_count_with_cves ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Total CVEs</p>
          <p className="mt-2 text-lg font-bold text-slate-100">{es.total_cve_count ?? "—"}</p>
        </div>
        <div className="rounded-xl border border-slate-700/60 bg-slate-800/60 p-5">
          <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">KEV (Known Exploited)</p>
          <p className="mt-2 text-lg font-bold text-amber-400">{es.total_kev_count ?? "—"}</p>
        </div>
      </div>

      {(results.application_summaries?.length || 0) > 0 && (
        <PanelCard title="Vulnerability Risk Breakdown" subtitle="Click an application to view CVEs" noPadding>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead><tr className="border-b border-slate-700 bg-slate-800/80 text-xs uppercase tracking-wider text-slate-400">
                <th className="px-5 py-2.5 text-left">&nbsp;</th>
                <th className="px-5 py-2.5 text-left">Application</th>
                <th className="px-5 py-2.5 text-left">Version</th>
                <th className="px-5 py-2.5 text-center">CVEs</th>
                <th className="px-5 py-2.5 text-left">Risk</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-700/50">
                {results.application_summaries.map((a) => {
                  const isExpanded = expandedApp === a.display_product;
                  const riskTone = (a.application_risk_tier || "").toLowerCase();
                  return (
                    <tr key={`${a.display_product}:${a.version_normalized}`}
                      className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-950/30" : "hover:bg-slate-800/40"}`}
                      onClick={() => void toggleApp(a.display_product)}
                    >
                      <td className="pl-5 pr-1 py-3 text-slate-400">
                        <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                      </td>
                      <td className="px-5 py-3 font-medium text-slate-100">{a.display_product}</td>
                      <td className="px-5 py-3 font-mono text-xs text-slate-300">{a.version_normalized || "—"}</td>
                      <td className="px-5 py-3 text-center text-slate-300">{a.matched_cve_count}</td>
                      <td className="px-5 py-3">
                        <Badge label={(a.application_risk_tier || "—").toUpperCase()} tone={riskTone === "low" ? "success" : riskTone === "moderate" ? "warning" : riskTone === "high" || riskTone === "severe" || riskTone === "critical" ? "danger" : "neutral"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {expandedApp && (
            <div className="border-t border-slate-700/60 bg-slate-900/30 px-6 py-4">
              {cvesLoading ? (
                <div className="flex items-center justify-center py-4"><div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" /><span className="ml-2 text-sm text-slate-400">Loading CVEs…</span></div>
              ) : appCves && appCves.matched_cves.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{appCves.matched_cve_count} CVEs for {appCves.display_product}</p>
                  {appCves.matched_cves.map((cve) => (
                    <a key={cve.cve_id} href={`https://nvd.nist.gov/vuln/detail/${cve.cve_id}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-slate-700 bg-slate-900/30 px-4 py-3 hover:border-indigo-500/30 transition"
                    >
                      <span className="font-mono text-sm font-semibold text-indigo-400">{cve.cve_id}</span>
                      {cve.cvss_v3?.baseSeverity && <Badge label={cve.cvss_v3.baseSeverity} tone={cve.cvss_v3.baseSeverity.toLowerCase() === "critical" || cve.cvss_v3.baseSeverity.toLowerCase() === "high" ? "danger" : cve.cvss_v3.baseSeverity.toLowerCase() === "medium" ? "warning" : "neutral"} />}
                      {cve.kev_flag && <Badge label="KEV" tone="warning" />}
                      <svg className="h-4 w-4 ml-auto text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                    </a>
                  ))}
                </div>
              ) : <p className="text-sm text-slate-400">No CVEs matched for this application.</p>}
            </div>
          )}
        </PanelCard>
      )}
    </div>
  );
}

export default function EndpointScannerPage() {
  return (
    <ModuleGate moduleSlug="endpoint-scanner" moduleName="Endpoint Risk Scanner">
      <EndpointScannerContent />
    </ModuleGate>
  );
}
