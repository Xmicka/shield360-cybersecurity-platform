import axios from "axios";
import { SERVICE_URLS } from "../config/services";

const isConfigured = () => SERVICE_URLS.deviceMonitoring.apiUrl !== "http://localhost:5002" && SERVICE_URLS.deviceMonitoring.apiUrl !== "";

export const fetchDeviceMetrics = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICE_URLS.deviceMonitoring.apiUrl}/metrics`);
        return res.data;
    } catch {
        return null;
    }
};

export const fetchDeviceAlerts = async () => {
    if (!isConfigured()) return null;
    try {
        const res = await axios.get(`${SERVICE_URLS.deviceMonitoring.apiUrl}/alerts`);
        return res.data;
    } catch {
        return null;
    }
};

export const DEVICE_DEMO_DATA = {
    metrics: {
        totalDevices: 384,
        activeDevices: 312,
        compromisedDevices: 3,
        patchCompliance: 94.2,
    },
    alerts: [
        { id: 1, device: "WS-LAB-042", type: "Unauthorized USB", severity: "high", time: "5 min ago" },
        { id: 2, device: "SRV-PROD-07", type: "Unusual Network Traffic", severity: "critical", time: "22 min ago" },
        { id: 3, device: "LAPTOP-MKT-15", type: "Outdated OS", severity: "medium", time: "1 hr ago" },
        { id: 4, device: "IOT-CAM-003", type: "Firmware Vulnerable", severity: "high", time: "2 hrs ago" },
        { id: 5, device: "MOBILE-HR-08", type: "Jailbreak Detected", severity: "medium", time: "4 hrs ago" },
    ],
    deviceTypes: [
        { name: "Workstations", count: 156, healthy: 148 },
        { name: "Laptops", count: 98, healthy: 92 },
        { name: "Servers", count: 45, healthy: 44 },
        { name: "Mobile", count: 52, healthy: 48 },
        { name: "IoT", count: 33, healthy: 28 },
    ],
    healthTimeline: [
        { day: "Mon", healthy: 305, issues: 7 },
        { day: "Tue", healthy: 308, issues: 4 },
        { day: "Wed", healthy: 302, issues: 10 },
        { day: "Thu", healthy: 310, issues: 2 },
        { day: "Fri", healthy: 306, issues: 6 },
        { day: "Sat", healthy: 311, issues: 1 },
        { day: "Sun", healthy: 312, issues: 0 },
    ],
};
