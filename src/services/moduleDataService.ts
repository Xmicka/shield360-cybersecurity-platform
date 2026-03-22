/**
 * Unified Module Data Aggregation Service
 * Fetches real-time data from all 4 module backends.
 * Each fetcher is resilient — returns null on failure so one backend being down
 * never breaks the entire dashboard.
 */

// ─── Endpoint Scanner ──────────────────────────────────────
import { api as endpointApi } from "../modules/endpoint-scanner/services/api";
import type { EndpointListItem } from "../modules/endpoint-scanner/types";

// ─── Shadow IT ─────────────────────────────────────────────
import {
  fetchStats as fetchShadowStats,
  fetchLogs as fetchShadowLogs,
  fetchAllowlist as fetchShadowAllowlist,
} from "../modules/shadow-it/services/api";
import type {
  ScanLogEntry,
  AllowlistEntry,
} from "../modules/shadow-it/services/api";

// ─── Spear Phishing ───────────────────────────────────────
import {
  fetchDashboardData as fetchPhishingDashboard,
  fetchPipeline as fetchPhishingPipeline,
  fetchOverview as fetchPhishingOverview,
} from "../modules/spear-phishing/api/client";


// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════

export interface EndpointSummary {
  totalDevices: number;
  onlineDevices: number;
  offlineDevices: number;
  scanning: number;
  completed: number;
  failed: number;
  notScanned: number;
  avgRiskScore: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  devices: EndpointListItem[];
}

export interface ShadowITSummary {
  total: number;
  breakdown: Record<string, number>;
  threatCount: number;
  recentThreats: { id: number; url: string; status: string; confidence: number }[];
  logs: ScanLogEntry[];
  allowlistCount: number;
  allowlist: AllowlistEntry[];
}

export interface PhishingSummary {
  totalUsers: number;
  avgRiskScore: number;
  highRiskUsers: number;
  mediumRiskUsers: number;
  lowRiskUsers: number;
  trainingPending: number;
  totalEmailsSent: number;
  emailClickRate: number;
  emailOpenRate: number;
  securityScore: number;
  pipeline: { stage: string; count: number }[];
  riskDistribution: { high: number; medium: number; low: number };
  alertCount: number;
  alerts: { severity: string; title: string; description: string }[];
  recommendations: { priority: string; title: string; description: string }[];
}

export interface ComplianceSummary {
  available: boolean;
  message: string;
}

export interface ModuleHealth {
  slug: string;
  name: string;
  status: "online" | "offline" | "degraded";
  latencyMs: number;
  lastChecked: string;
}

export interface AggregatedData {
  endpoint: EndpointSummary | null;
  shadowIT: ShadowITSummary | null;
  phishing: PhishingSummary | null;
  compliance: ComplianceSummary | null;
  health: ModuleHealth[];
  fetchedAt: string;
}

// ═══════════════════════════════════════════════════════════
// FETCHERS (resilient — each returns null on failure)
// ═══════════════════════════════════════════════════════════

async function fetchEndpointData(): Promise<EndpointSummary | null> {
  try {
    const devices = await endpointApi.listEndpoints(500);

    const online = devices.filter((d) => d.is_online === true).length;
    const scanning = devices.filter((d) => d.scan_status === "scanning").length;
    const completed = devices.filter((d) => d.scan_status === "completed").length;
    const failed = devices.filter((d) => d.scan_status === "failed").length;
    const notScanned = devices.filter((d) => d.scan_status === "not_scanned").length;

    const scored = devices.filter((d) => d.endpoint_risk_score_0_100 != null);
    const avgRisk = scored.length > 0
      ? scored.reduce((s, d) => s + (d.endpoint_risk_score_0_100 ?? 0), 0) / scored.length
      : 0;

    const highRisk = devices.filter((d) => d.endpoint_risk_tier === "Critical" || d.endpoint_risk_tier === "High").length;
    const mediumRisk = devices.filter((d) => d.endpoint_risk_tier === "Medium").length;
    const lowRisk = devices.filter((d) => d.endpoint_risk_tier === "Low" || d.endpoint_risk_tier === "None").length;

    return {
      totalDevices: devices.length,
      onlineDevices: online,
      offlineDevices: devices.length - online,
      scanning,
      completed,
      failed,
      notScanned,
      avgRiskScore: Math.round(avgRisk),
      highRiskCount: highRisk,
      mediumRiskCount: mediumRisk,
      lowRiskCount: lowRisk,
      devices,
    };
  } catch {
    return null;
  }
}

async function fetchShadowITData(): Promise<ShadowITSummary | null> {
  try {
    const [stats, logs, allowlist] = await Promise.all([
      fetchShadowStats(),
      fetchShadowLogs({ limit: 50 }),
      fetchShadowAllowlist(),
    ]);
    return {
      total: stats.total,
      breakdown: stats.breakdown,
      threatCount: stats.recent_threats?.length ?? 0,
      recentThreats: stats.recent_threats ?? [],
      logs,
      allowlistCount: allowlist.length,
      allowlist,
    };
  } catch {
    return null;
  }
}

async function fetchPhishingData(): Promise<PhishingSummary | null> {
  try {
    const [dashboard, pipeline, overview] = await Promise.all([
      fetchPhishingDashboard(),
      fetchPhishingPipeline(),
      fetchPhishingOverview(),
    ]);

    if (!dashboard) return null;

    return {
      totalUsers: dashboard.posture?.total_users ?? overview.totalUsers ?? 0,
      avgRiskScore: Math.round(dashboard.posture?.avg_risk_score ?? overview.avgRisk ?? 0),
      highRiskUsers: dashboard.risk_distribution?.high ?? 0,
      mediumRiskUsers: dashboard.risk_distribution?.medium ?? 0,
      lowRiskUsers: dashboard.risk_distribution?.low ?? 0,
      trainingPending: dashboard.posture?.training_pending ?? 0,
      totalEmailsSent: dashboard.posture?.total_emails_sent ?? 0,
      emailClickRate: Math.round((dashboard.email_stats?.click_rate ?? dashboard.posture?.email_click_rate ?? 0) * 100),
      emailOpenRate: Math.round((dashboard.email_stats?.open_rate ?? 0) * 100),
      securityScore: dashboard.posture?.security_score ?? 0,
      pipeline,
      riskDistribution: dashboard.risk_distribution ?? { high: 0, medium: 0, low: 0 },
      alertCount: dashboard.alerts?.length ?? 0,
      alerts: (dashboard.alerts ?? []).map((a) => ({ severity: a.severity, title: a.title, description: a.description })),
      recommendations: (dashboard.recommendations ?? []).map((r) => ({ priority: r.priority, title: r.title, description: r.description })),
    };
  } catch {
    return null;
  }
}

async function fetchComplianceData(): Promise<ComplianceSummary | null> {
  // Compliance module is assessment-based, not a live stats API.
  // We signal availability here.
  return { available: true, message: "Assessment-based — run an assessment to generate results." };
}

// ─── Health checks ─────────────────────────────────────────
async function checkHealth(
  slug: string,
  name: string,
  probe: () => Promise<unknown>,
): Promise<ModuleHealth> {
  const start = performance.now();
  try {
    await probe();
    return { slug, name, status: "online", latencyMs: Math.round(performance.now() - start), lastChecked: new Date().toISOString() };
  } catch {
    return { slug, name, status: "offline", latencyMs: Math.round(performance.now() - start), lastChecked: new Date().toISOString() };
  }
}

// ═══════════════════════════════════════════════════════════
// MAIN AGGREGATOR
// ═══════════════════════════════════════════════════════════

export async function fetchAllModuleData(): Promise<AggregatedData> {
  const [endpoint, shadowIT, phishing, compliance] = await Promise.all([
    fetchEndpointData(),
    fetchShadowITData(),
    fetchPhishingData(),
    fetchComplianceData(),
  ]);

  const health = await Promise.all([
    checkHealth("endpoint-scanner", "Endpoint Scanner", () => endpointApi.listEndpoints(1)),
    checkHealth("shadow-it", "Shadow IT", () => fetchShadowStats()),
    checkHealth("spear-phishing", "Spear Phishing", () => fetchPhishingOverview()),
    checkHealth("compliance-assistant", "Compliance", async () => ({ ok: true })),
  ]);

  return { endpoint, shadowIT, phishing, compliance, health, fetchedAt: new Date().toISOString() };
}

// Individual fetchers for selective refreshing
export { fetchEndpointData, fetchShadowITData, fetchPhishingData, fetchComplianceData };
