import axios from "axios";
import { SERVICE_URLS } from "../config/services";

const isConfigured = () => SERVICE_URLS.complianceEngine.apiUrl !== "http://localhost:5003" && SERVICE_URLS.complianceEngine.apiUrl !== "";

export const fetchComplianceMetrics = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICE_URLS.complianceEngine.apiUrl}/metrics`);
        return res.data;
    } catch {
        return null;
    }
};

export const fetchComplianceAlerts = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICE_URLS.complianceEngine.apiUrl}/alerts`);
        return res.data;
    } catch {
        return null;
    }
};

export const COMPLIANCE_DEMO_DATA = {
    metrics: {
        overallScore: 87.3,
        policiesActive: 24,
        violations: 5,
        frameworks: 4,
    },
    alerts: [
        { id: 1, policy: "Password Complexity", status: "violation", framework: "ISO 27001", time: "15 min ago" },
        { id: 2, policy: "Data Retention", status: "warning", framework: "GDPR", time: "2 hrs ago" },
        { id: 3, policy: "Access Review", status: "violation", framework: "SOC 2", time: "1 day ago" },
        { id: 4, policy: "Encryption at Rest", status: "compliant", framework: "PCI DSS", time: "2 days ago" },
        { id: 5, policy: "Incident Response Plan", status: "warning", framework: "NIST", time: "3 days ago" },
    ],
    frameworkScores: [
        { framework: "ISO 27001", score: 92, controls: 114, compliant: 105 },
        { framework: "GDPR", score: 88, controls: 48, compliant: 42 },
        { framework: "SOC 2", score: 85, controls: 64, compliant: 54 },
        { framework: "NIST CSF", score: 79, controls: 98, compliant: 77 },
    ],
    complianceTrend: [
        { month: "Sep", score: 78 },
        { month: "Oct", score: 81 },
        { month: "Nov", score: 83 },
        { month: "Dec", score: 85 },
        { month: "Jan", score: 86 },
        { month: "Feb", score: 87.3 },
    ],
};
