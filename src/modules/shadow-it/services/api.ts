// Shadow IT API service — typed for Shield360 integration
const API_PORT = 5001;
const PRODUCTION_API_URL = "https://shield-360-1.onrender.com";

function getBase(): string {
  if (import.meta.env.VITE_SHADOW_IT_API_URL)
    return (import.meta.env.VITE_SHADOW_IT_API_URL as string).replace(/\/$/, "");
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1")
      return `http://${host}:${API_PORT}`;
    return PRODUCTION_API_URL;
  }
  return `http://127.0.0.1:${API_PORT}`;
}

/* ── Types ──────────────────────────────────── */
export interface ShadowStats {
  total: number;
  breakdown: Record<string, number>;
  recent_threats: { id: number; url: string; status: string; confidence: number }[];
}

export interface ScanLogEntry {
  id: number;
  scanned_at: string;
  status: string;
  confidence: number;
  url: string;
}

export interface AllowlistEntry {
  id: number;
  domain: string;
  note: string;
  added_at: string;
}

/* ── API functions ──────────────────────────── */
export async function fetchStats(): Promise<ShadowStats> {
  const res = await fetch(`${getBase()}/stats`);
  if (!res.ok) throw new Error("Server unreachable");
  return res.json();
}

export async function fetchLogs(opts: { limit?: number; status?: string } = {}): Promise<ScanLogEntry[]> {
  const params = new URLSearchParams({ limit: String(opts.limit ?? 200) });
  if (opts.status) params.set("status", opts.status);
  const res = await fetch(`${getBase()}/logs?${params}`);
  if (!res.ok) throw new Error("Server unreachable");
  return res.json();
}

export async function clearLogs(): Promise<{ message: string }> {
  const res = await fetch(`${getBase()}/logs/clear`, { method: "DELETE" });
  if (!res.ok) throw new Error("Clear failed");
  return res.json();
}

export async function fetchAllowlist(): Promise<AllowlistEntry[]> {
  const res = await fetch(`${getBase()}/allowlist`);
  if (!res.ok) throw new Error("Server unreachable");
  return res.json();
}

export async function addAllowlist(domain: string, note = ""): Promise<{ message: string }> {
  const res = await fetch(`${getBase()}/allowlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ domain, note }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to add");
  return data;
}

export async function removeAllowlist(id: number): Promise<{ message: string }> {
  const res = await fetch(`${getBase()}/allowlist/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Remove failed");
  return res.json();
}
