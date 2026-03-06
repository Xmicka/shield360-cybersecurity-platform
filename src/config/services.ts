// Centralized service endpoint configuration
// Priority: VITE_*_API env vars > VITE_*_ENGINE_API env vars > defaults

export const SERVICE_URLS = {
    spearPhishing: {
        apiUrl:
            import.meta.env.VITE_THREAT_API ||
            import.meta.env.VITE_SPEAR_PHISHING_API ||
            "http://localhost:5000",
        dashboardUrl:
            import.meta.env.VITE_SPEAR_PHISHING_DASHBOARD ||
            "https://spear-phishing-dashboard.onrender.com",
    },
    behaviorEngine: {
        apiUrl:
            import.meta.env.VITE_BEHAVIOR_API ||
            import.meta.env.VITE_BEHAVIOR_ENGINE_API ||
            "http://localhost:5001",
        dashboardUrl:
            import.meta.env.VITE_BEHAVIOR_ENGINE_DASHBOARD || "",
    },
    deviceMonitoring: {
        apiUrl:
            import.meta.env.VITE_DEVICE_API ||
            import.meta.env.VITE_DEVICE_MONITORING_API ||
            "http://localhost:5002",
        dashboardUrl:
            import.meta.env.VITE_DEVICE_MONITORING_DASHBOARD || "",
    },
    complianceEngine: {
        apiUrl:
            import.meta.env.VITE_COMPLIANCE_API ||
            import.meta.env.VITE_COMPLIANCE_ENGINE_API ||
            "http://localhost:5003",
        dashboardUrl:
            import.meta.env.VITE_COMPLIANCE_ENGINE_DASHBOARD || "",
    },
};

// Health check helper — pings /metrics for each service
export async function checkServiceHealth(
    serviceName: keyof typeof SERVICE_URLS
): Promise<boolean> {
    const url = SERVICE_URLS[serviceName].apiUrl;
    // Don't ping default localhost URLs
    if (url.includes("localhost")) return false;
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);
        const res = await fetch(`${url}/metrics`, { signal: controller.signal });
        clearTimeout(timeout);
        return res.ok;
    } catch {
        return false;
    }
}
