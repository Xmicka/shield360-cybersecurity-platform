import axios from "axios";
import { SERVICES } from "../config/services";

const isConfigured = () => SERVICES.behaviorEngine !== "REPLACE_WITH_COMPONENT_API" && SERVICES.behaviorEngine !== "";

export const fetchBehaviorMetrics = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICES.behaviorEngine}/metrics`);
        return res.data;
    } catch {
        return null;
    }
};

export const fetchBehaviorAlerts = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICES.behaviorEngine}/alerts`);
        return res.data;
    } catch {
        return null;
    }
};

// Demo data for when the service is not connected
export const BEHAVIOR_DEMO_DATA = {
    metrics: {
        totalUsersMonitored: 247,
        highRiskUsers: 12,
        anomaliesDetected: 34,
        avgRiskScore: 23.5,
    },
    alerts: [
        { id: 1, user: "john.doe@company.com", type: "Unusual Login Pattern", severity: "high", time: "2 min ago" },
        { id: 2, user: "jane.smith@company.com", type: "Data Exfiltration Attempt", severity: "critical", time: "15 min ago" },
        { id: 3, user: "bob.wilson@company.com", type: "Privilege Escalation", severity: "medium", time: "1 hr ago" },
        { id: 4, user: "alice.chen@company.com", type: "Anomalous File Access", severity: "low", time: "2 hrs ago" },
        { id: 5, user: "mike.brown@company.com", type: "Off-hours Activity", severity: "medium", time: "3 hrs ago" },
    ],
    riskDistribution: [
        { range: "0-20", count: 145 },
        { range: "21-40", count: 58 },
        { range: "41-60", count: 28 },
        { range: "61-80", count: 12 },
        { range: "81-100", count: 4 },
    ],
    timeline: [
        { hour: "00:00", anomalies: 2 },
        { hour: "04:00", anomalies: 1 },
        { hour: "08:00", anomalies: 8 },
        { hour: "12:00", anomalies: 5 },
        { hour: "16:00", anomalies: 12 },
        { hour: "20:00", anomalies: 6 },
    ],
};
