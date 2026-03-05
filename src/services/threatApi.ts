import axios from "axios";
import { SERVICES } from "../config/services";

const isConfigured = () => SERVICES.threatIntel !== "REPLACE_WITH_COMPONENT_API" && SERVICES.threatIntel !== "";

export const fetchThreatMetrics = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICES.threatIntel}/metrics`);
        return res.data;
    } catch {
        return null;
    }
};

export const fetchThreatAlerts = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICES.threatIntel}/alerts`);
        return res.data;
    } catch {
        return null;
    }
};

export const THREAT_DEMO_DATA = {
    metrics: {
        activeThreats: 7,
        blockedAttacks: 1247,
        iocIndicators: 89,
        threatLevel: "ELEVATED",
    },
    alerts: [
        { id: 1, threat: "APT-29 Phishing Campaign", severity: "critical", source: "OSINT", time: "8 min ago" },
        { id: 2, threat: "Ransomware C2 Communication", severity: "critical", source: "Network IDS", time: "35 min ago" },
        { id: 3, threat: "SQL Injection Attempt", severity: "high", source: "WAF", time: "1 hr ago" },
        { id: 4, threat: "Brute Force SSH", severity: "medium", source: "SIEM", time: "2 hrs ago" },
        { id: 5, threat: "Suspicious DNS Query", severity: "low", source: "DNS Monitor", time: "3 hrs ago" },
    ],
    severityBreakdown: [
        { severity: "Critical", count: 2 },
        { severity: "High", count: 5 },
        { severity: "Medium", count: 18 },
        { severity: "Low", count: 34 },
    ],
    threatTimeline: [
        { date: "Week 1", threats: 12, blocked: 245 },
        { date: "Week 2", threats: 8, blocked: 312 },
        { date: "Week 3", threats: 15, blocked: 198 },
        { date: "Week 4", threats: 7, blocked: 287 },
    ],
};
