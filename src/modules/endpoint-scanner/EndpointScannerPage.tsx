import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Eye,
  Scan,
  ExternalLink,
  X,
  ArrowLeft,
  Monitor,
  ShieldCheck,
  AlertTriangle,
  ChevronRight as Chevron,
  Sparkles,
} from "lucide-react";
import ModuleGate from "../../components/ModuleGate";
import { api } from "./services/api";
import type { EndpointListItem } from "./types";
import { Badge } from "./components/Badge";

/** Original Endpoint Risk Scanner app — clicks here send the user there. */
const ORIGINAL_APP_URL = "https://jolly-ground-07ccef300.1.azurestaticapps.net/";
const openOriginalApp = () => window.open(ORIGINAL_APP_URL, "_blank", "noopener,noreferrer");

/* ── helpers ── */
function formatWhen(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

/* ── Dashboard (device list) ── */
function EndpointDashboard({ onSelectEndpoint: _onSelectEndpoint }: { onSelectEndpoint: (id: string) => void }) {
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

  // Scan / cancel actions now redirect to the original app — local handlers
  // intentionally removed. setScanError remains for future use if we add
  // local dashboard actions back.
  void setScanError;

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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(125,186,156,0.14)", color: "#5b9a7c", border: "1px solid rgba(125,186,156,0.32)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-status-ok)" }} /> {onlineCount} Online
          </span>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ background: "rgba(201,112,112,0.12)", color: "#a85555", border: "1px solid rgba(201,112,112,0.32)" }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--color-status-error)" }} /> {offlineCount} Offline
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span>Updated {lastRefresh.toLocaleTimeString()}</span>
          <button
            onClick={() => void load()}
            className="rounded-lg p-1.5 transition"
            style={{ color: "var(--color-text-muted)", background: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,0,0,0.04)"; e.currentTarget.style.color = "var(--color-text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-text-muted)"; }}
            title="Refresh"
          >
            <RefreshCw size={16} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5" style={{ color: "var(--color-text-muted)" }}>
          <Search size={16} strokeWidth={1.5} />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by hostname or OS..."
          className="input-premium"
          style={{ paddingLeft: 40 }}
        />
      </div>

      {scanError && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(201,112,112,0.10)", border: "1px solid rgba(201,112,112,0.28)", color: "#a85555" }}
        >
          <AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <span>{scanError}</span>
        </div>
      )}
      {error && (
        <div
          className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(201,112,112,0.10)", border: "1px solid rgba(201,112,112,0.28)", color: "#a85555" }}
        >
          <AlertTriangle size={16} strokeWidth={1.5} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Device table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--color-text-primary)" }}>
            Devices ({loading ? "…" : filtered.length})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Hostname</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Operating System</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Last Seen</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Apps</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((it) => {
                const isScanning = it.scan_status === "scanning";
                const online = it.is_online === true;
                return (
                  <tr
                    key={it.endpoint_id}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className="inline-flex items-center gap-1.5 text-xs font-semibold"
                        style={{ color: online ? "#5b9a7c" : "#a85555" }}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: online ? "var(--color-status-ok)" : "var(--color-status-error)" }} />
                        {online ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Monitor size={18} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
                        <div>
                          <button
                            onClick={openOriginalApp}
                            className="font-semibold transition inline-flex items-center gap-1"
                            style={{ color: "var(--color-text-primary)" }}
                            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-brand-blue-dark)")}
                            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
                            title="Open in original app"
                          >
                            {it.endpoint_name || it.endpoint_id}
                            <ExternalLink size={11} strokeWidth={1.5} style={{ opacity: 0.4 }} />
                          </button>
                          <div className="mt-0.5 font-mono text-[11px]" style={{ color: "var(--color-text-muted)" }}>{it.endpoint_id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4" style={{ color: "var(--color-text-secondary)" }}>{it.os_name || "Unknown"}</td>
                    <td className="whitespace-nowrap px-5 py-4" style={{ color: "var(--color-text-muted)" }}>{formatWhen(it.last_seen)}</td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <Badge label={`${it.application_count} apps`} tone="success" size="md" />
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={openOriginalApp}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition"
                          style={{ background: "var(--color-bg-card)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-card)")}
                          title="Open in original app"
                        >
                          <Eye size={14} strokeWidth={1.5} />
                          View
                          <ExternalLink size={11} strokeWidth={1.5} style={{ opacity: 0.5 }} />
                        </button>
                        {isScanning ? (
                          <button
                            onClick={openOriginalApp}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition"
                            style={{ background: "var(--color-status-error)" }}
                            title="Manage scan in original app"
                          >
                            <X size={14} strokeWidth={2} />
                            Cancel
                          </button>
                        ) : (
                          <button
                            onClick={openOriginalApp}
                            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition"
                            style={{ background: "var(--color-brand-blue)", color: "#fff" }}
                            title="Run scan in original app"
                          >
                            <Scan size={14} strokeWidth={1.8} />
                            Scan
                            <ExternalLink size={11} strokeWidth={1.5} style={{ opacity: 0.6 }} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center" style={{ color: "var(--color-text-muted)" }}>
                    {items.length === 0 ? "No endpoints found." : "No endpoints match your search."}
                  </td>
                </tr>
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
          className="inline-flex items-center gap-1.5 text-sm transition w-fit"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-text-muted)")}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
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
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, rgba(125,186,156,0.20) 0%, rgba(184,212,184,0.30) 100%)",
                border: "1px solid rgba(125,186,156,0.30)",
              }}
            >
              <ShieldCheck size={22} strokeWidth={1.5} style={{ color: "#5b9a7c" }} />
            </div>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.02em" }}>
                Endpoint Risk Scanner
              </h1>
              <p style={{ marginTop: 2, fontSize: 13, color: "var(--color-text-muted)" }}>
                Scan endpoints for vulnerabilities, CVEs, and security risks
              </p>
            </div>
          </div>

          {mod?.deployedUrl && (
            <a
              href={mod.deployedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition"
              style={{
                background: "var(--color-bg-card)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-card)")}
            >
              Open Original App
              <ExternalLink size={16} strokeWidth={1.5} style={{ color: "var(--color-text-muted)" }} />
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
                Open the Endpoint Risk Scanner app
              </h3>
              <p style={{ fontSize: 13, opacity: 0.92, marginTop: 2 }}>
                Manage scans, drill into device intelligence, and explore CVEs in the standalone interface.
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

      <EndpointDashboard onSelectEndpoint={setSelectedEndpoint} />
    </div>
  );
}

/* ── Simplified detail view (uses internal state instead of router params) ── */
function EndpointDetailView({ endpointId }: { endpointId: string }) {
  return (
    <div className="[&_a[href*='/endpoints/']]:pointer-events-none">
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
    return (
      <div className="flex justify-center py-12">
        <div
          className="h-6 w-6 animate-spin rounded-full"
          style={{ border: "2px solid var(--color-border-strong)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl px-4 py-3 text-sm"
        style={{ background: "rgba(201,112,112,0.10)", border: "1px solid rgba(201,112,112,0.28)", color: "#a85555" }}
      >
        <AlertTriangle size={16} strokeWidth={1.5} className="inline mr-2 -mt-0.5" />
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.01em" }}>
              {hostname}
            </h2>
            {isOnline !== undefined && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={
                  isOnline
                    ? { background: "rgba(125,186,156,0.14)", color: "#5b9a7c", border: "1px solid rgba(125,186,156,0.32)" }
                    : { background: "rgba(0,0,0,0.04)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }
                }
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: isOnline ? "var(--color-status-ok)" : "var(--color-text-muted)" }}
                />
                {isOnline ? "Online" : "Offline"}
              </span>
            )}
          </div>
          <p className="mt-1 font-mono text-sm" style={{ color: "var(--color-text-muted)" }}>{endpointId}</p>
          {osName !== "—" && (
            <p className="mt-0.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>{osName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => void load()}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-medium transition"
            style={{ background: "var(--color-bg-card)", color: "var(--color-text-primary)", border: "1px solid var(--color-border)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.03)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-bg-card)")}
          >
            <RefreshCw size={14} strokeWidth={1.5} />
            Refresh
          </button>
          <button
            onClick={() => void onScan()}
            className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition"
            style={{ background: "var(--color-cyan-400)", color: "var(--color-text-inverse)" }}
          >
            <Scan size={14} strokeWidth={1.8} />
            Run Scan
          </button>
        </div>
      </div>

      {scanError && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ background: "rgba(201,112,112,0.10)", border: "1px solid rgba(201,112,112,0.28)", color: "#a85555" }}
        >
          <AlertTriangle size={16} strokeWidth={1.5} className="inline mr-2 -mt-0.5" />
          {scanError}
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid var(--color-border)" }}>
        <nav className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors capitalize"
                style={{
                  borderBottom: `2px solid ${isActive ? "var(--color-cyan-400)" : "transparent"}`,
                  color: isActive ? "var(--color-text-primary)" : "var(--color-text-muted)",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-text-muted)"; }}
              >
                {tab === "scan" ? "Scan Results" : tab}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      {detail && (
        <div style={{ color: "var(--color-text-secondary)" }}>
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
    <div className="flex items-start justify-between gap-4 py-2.5" style={{ borderBottom: "1px solid var(--color-border)" }}>
      <span className="text-xs font-medium shrink-0" style={{ color: "var(--color-text-muted)" }}>{label}</span>
      <span className="text-sm text-right break-all" style={{ color: "var(--color-text-primary)" }}>{display}</span>
    </div>
  );
}

function PanelCard({ title, subtitle, children, noPadding }: { title?: string; subtitle?: string; children: React.ReactNode; noPadding?: boolean }) {
  return (
    <div className="glass-card overflow-hidden">
      {title && (
        <div className="flex items-start justify-between gap-4 px-6 py-4" style={{ borderBottom: "1px solid var(--color-border)" }}>
          <div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--color-text-primary)" }}>{title}</h3>
            {subtitle && <p style={{ marginTop: 2, fontSize: 12, color: "var(--color-text-muted)" }}>{subtitle}</p>}
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
            const barColor = pct > 90 ? "var(--color-status-error)" : pct > 75 ? "var(--color-status-warn)" : "var(--color-status-ok)";
            return (
              <div
                key={i}
                className="rounded-xl px-4 py-3"
                style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {d.mountpoint || d.device}
                  </span>
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{d.filesystem}</span>
                </div>
                <div className="h-2 w-full rounded-full" style={{ background: "rgba(0,0,0,0.06)" }}>
                  <div className="h-2 rounded-full transition-all" style={{ background: barColor, width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="mt-1.5 flex items-center justify-between text-xs" style={{ color: "var(--color-text-muted)" }}>
                  <span>{d.used_gb?.toFixed(1)} GB used</span>
                  <span>{d.free_gb?.toFixed(1)} GB free / {d.total_gb?.toFixed(1)} GB total</span>
                </div>
              </div>
            );
          })}
          {disks.length === 0 && (
            <p className="py-4 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No storage data available</p>
          )}
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
              <div
                key={i}
                className="flex items-center justify-between rounded-xl px-4 py-3"
                style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--color-border)" }}
              >
                <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{av.name}</span>
                <div className="flex gap-1.5">
                  <Badge label={av.enabled ? "Enabled" : "Disabled"} tone={av.enabled ? "success" : "danger"} />
                  <Badge label={av.updated ? "Updated" : "Outdated"} tone={av.updated ? "success" : "warning"} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No antivirus data</p>
        )}
      </PanelCard>

      <PanelCard title="Firewall" subtitle="Firewall profiles">
        {winFw && Object.keys(winFw).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(winFw).map(([profile, state]) => (
              <div
                key={profile}
                className="flex items-center gap-2 rounded-xl px-3 py-2"
                style={{ background: "rgba(0,0,0,0.02)", border: "1px solid var(--color-border)" }}
              >
                <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{profile}</span>
                <Badge label={state} tone={state === "ON" ? "success" : "danger"} />
              </div>
            ))}
          </div>
        ) : (
          <p className="py-4 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No firewall data</p>
        )}
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

  const tileStyle = { background: "rgba(0,0,0,0.02)", border: "1px solid var(--color-border)" } as const;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Interfaces">
          {ifaces.length > 0 ? (
            <div className="space-y-2">
              {ifaces.map((ifc, i) => (
                <div key={i} className="rounded-xl px-4 py-3" style={tileStyle}>
                  <div className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{ifc.name}</div>
                  <div className="mt-1 flex flex-wrap gap-x-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {ifc.ipv4 && <span>IPv4: <span className="font-mono" style={{ color: "var(--color-text-secondary)" }}>{ifc.ipv4}</span></span>}
                    {ifc.mac && <span>MAC: <span className="font-mono" style={{ color: "var(--color-text-secondary)" }}>{ifc.mac}</span></span>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No interface data</p>
          )}
        </PanelCard>

        <PanelCard title="DNS Servers">
          {(detail.network?.dns_servers || []).length > 0 ? (
            <div className="space-y-1.5">
              {(detail.network?.dns_servers || []).map((d, i) => (
                <div
                  key={i}
                  className="rounded-xl px-4 py-2.5 font-mono text-sm"
                  style={{ ...tileStyle, color: "var(--color-text-primary)" }}
                >
                  {d}
                </div>
              ))}
            </div>
          ) : (
            <p className="py-4 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No DNS data</p>
          )}
        </PanelCard>

        <PanelCard title="Public IP">
          <div className="flex flex-col items-center py-2">
            <span className="font-mono text-xl font-bold" style={{ color: "var(--color-text-primary)" }}>{detail.network?.public_ip || "—"}</span>
          </div>
        </PanelCard>
      </div>

      <PanelCard title={`Active Connections (${conns.length})`} noPadding>
        {conns.length > 0 ? (
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Process</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Remote</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {conns.slice(0, 50).map((c, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-2 font-medium" style={{ color: "var(--color-text-primary)" }}>{c.process || "—"}</td>
                    <td className="px-5 py-2 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>{c.remote_address || "—"}</td>
                    <td className="px-5 py-2"><Badge label={c.status || "—"} tone={c.status === "ESTABLISHED" ? "success" : "neutral"} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No active connections</p>
        )}
      </PanelCard>

      <PanelCard title={`Listening Ports (${ports.length})`} noPadding>
        {ports.length > 0 ? (
          <div className="overflow-x-auto max-h-80 overflow-y-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Port</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Protocol</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Process</th>
                </tr>
              </thead>
              <tbody>
                {ports.slice(0, 50).map((p, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-2 font-mono font-semibold" style={{ color: "var(--color-text-primary)" }}>{p.port ?? "—"}</td>
                    <td className="px-5 py-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>{p.protocol || "—"}</td>
                    <td className="px-5 py-2" style={{ color: "var(--color-text-primary)" }}>{p.process || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="px-5 py-6 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No listening ports data</p>
        )}
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
            <thead className="sticky top-0 z-10" style={{ background: "var(--color-bg-card)" }}>
              <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Application</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Version</th>
                <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Publisher</th>
              </tr>
            </thead>
            <tbody>
              {apps.map((a, i) => (
                <tr key={i} style={{ borderBottom: "1px solid var(--color-border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.02)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <td className="px-5 py-2.5 font-medium" style={{ color: "var(--color-text-primary)" }}>{a.name || "—"}</td>
                  <td className="px-5 py-2.5 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>{a.version || "—"}</td>
                  <td className="px-5 py-2.5" style={{ color: "var(--color-text-secondary)" }}>{a.publisher || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="px-5 py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>No application data</p>
      )}
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
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full mb-4"
            style={{ background: "rgba(184,169,201,0.18)", border: "1px solid rgba(184,169,201,0.32)" }}
          >
            <Scan size={26} strokeWidth={1.5} style={{ color: "#7a6a96" }} />
          </div>
          <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>No scan results yet</p>
          <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>Run a vulnerability scan to see risk analysis.</p>
          <button
            onClick={onScan}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition"
            style={{ background: "var(--color-cyan-400)", color: "var(--color-text-inverse)" }}
          >
            <Scan size={14} strokeWidth={1.8} />
            Run Scan
          </button>
        </div>
      </PanelCard>
    );
  }

  if (results.scan_status !== "completed") {
    return (
      <PanelCard>
        <p className="py-8 text-center text-sm" style={{ color: "var(--color-text-muted)" }}>
          {results.scan_status === "failed" ? "Last scan failed. Try again." : "Waiting for scan to complete…"}
        </p>
      </PanelCard>
    );
  }

  const riskScore = typeof es.endpoint_risk_score_0_100 === "number" ? Number(es.endpoint_risk_score_0_100).toFixed(1) : "—";
  const riskTier = es.endpoint_risk_tier || "—";
  const riskTierLower = riskTier.toLowerCase();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Overall Risk</p>
          <div className="mt-2 text-3xl font-bold tabular-nums" style={{ color: "var(--color-text-primary)" }}>{riskScore}</div>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>/100</p>
          <div className="mt-2 inline-block">
            <Badge
              label={riskTier.toUpperCase()}
              tone={riskTierLower === "low" ? "success" : riskTierLower === "moderate" ? "warning" : "danger"}
              size="md"
            />
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Vulnerable Apps</p>
          <p className="mt-2 text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{es.application_count_with_cves ?? "—"}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Total CVEs</p>
          <p className="mt-2 text-lg font-bold" style={{ color: "var(--color-text-primary)" }}>{es.total_cve_count ?? "—"}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>KEV (Known Exploited)</p>
          <p className="mt-2 text-lg font-bold" style={{ color: "#a87f3f" }}>{es.total_kev_count ?? "—"}</p>
        </div>
      </div>

      {(results.application_summaries?.length || 0) > 0 && (
        <PanelCard title="Vulnerability Risk Breakdown" subtitle="Click an application to view CVEs" noPadding>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr style={{ background: "rgba(0,0,0,0.02)", borderBottom: "1px solid var(--color-border)" }}>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>&nbsp;</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Application</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Version</th>
                  <th className="px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>CVEs</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Risk</th>
                </tr>
              </thead>
              <tbody>
                {results.application_summaries.map((a) => {
                  const isExpanded = expandedApp === a.display_product;
                  const riskTone = (a.application_risk_tier || "").toLowerCase();
                  return (
                    <tr
                      key={`${a.display_product}:${a.version_normalized}`}
                      className="cursor-pointer transition-colors"
                      style={{
                        borderBottom: "1px solid var(--color-border)",
                        background: isExpanded ? "rgba(184,169,201,0.10)" : "transparent",
                      }}
                      onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                      onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
                      onClick={() => void toggleApp(a.display_product)}
                    >
                      <td className="pl-5 pr-1 py-3" style={{ color: "var(--color-text-muted)" }}>
                        <Chevron
                          size={16}
                          strokeWidth={1.8}
                          style={{ transform: isExpanded ? "rotate(90deg)" : "none", transition: "transform 0.15s ease" }}
                        />
                      </td>
                      <td className="px-5 py-3 font-medium" style={{ color: "var(--color-text-primary)" }}>{a.display_product}</td>
                      <td className="px-5 py-3 font-mono text-xs" style={{ color: "var(--color-text-secondary)" }}>{a.version_normalized || "—"}</td>
                      <td className="px-5 py-3 text-center" style={{ color: "var(--color-text-secondary)" }}>{a.matched_cve_count}</td>
                      <td className="px-5 py-3">
                        <Badge
                          label={(a.application_risk_tier || "—").toUpperCase()}
                          tone={
                            riskTone === "low"
                              ? "success"
                              : riskTone === "moderate"
                                ? "warning"
                                : riskTone === "high" || riskTone === "severe" || riskTone === "critical"
                                  ? "danger"
                                  : "neutral"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {expandedApp && (
            <div className="px-6 py-4" style={{ borderTop: "1px solid var(--color-border)", background: "rgba(0,0,0,0.02)" }}>
              {cvesLoading ? (
                <div className="flex items-center justify-center py-4">
                  <div
                    className="h-4 w-4 animate-spin rounded-full"
                    style={{ border: "2px solid var(--color-border-strong)", borderTopColor: "transparent" }}
                  />
                  <span className="ml-2 text-sm" style={{ color: "var(--color-text-muted)" }}>Loading CVEs…</span>
                </div>
              ) : appCves && appCves.matched_cves.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
                    {appCves.matched_cve_count} CVEs for {appCves.display_product}
                  </p>
                  {appCves.matched_cves.map((cve) => {
                    const sev = cve.cvss_v3?.baseSeverity?.toLowerCase();
                    return (
                      <a
                        key={cve.cve_id}
                        href={`https://nvd.nist.gov/vuln/detail/${cve.cve_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                        style={{ background: "var(--color-bg-card)", border: "1px solid var(--color-border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--color-border-strong)")}
                        onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                      >
                        <span className="font-mono text-sm font-semibold" style={{ color: "var(--color-cyan-400)" }}>{cve.cve_id}</span>
                        {cve.cvss_v3?.baseSeverity && (
                          <Badge
                            label={cve.cvss_v3.baseSeverity}
                            tone={sev === "critical" || sev === "high" ? "danger" : sev === "medium" ? "warning" : "neutral"}
                          />
                        )}
                        {cve.kev_flag && <Badge label="KEV" tone="warning" />}
                        <ExternalLink size={16} strokeWidth={1.5} className="ml-auto" style={{ color: "var(--color-text-muted)" }} />
                      </a>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>No CVEs matched for this application.</p>
              )}
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
