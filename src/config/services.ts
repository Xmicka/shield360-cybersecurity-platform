export const SERVICE_URLS = {
    spearPhishing: {
        apiUrl: import.meta.env.VITE_SPEAR_PHISHING_API || "http://localhost:5000",
        dashboardUrl: import.meta.env.VITE_SPEAR_PHISHING_DASHBOARD || "https://spear-phishing-dashboard.onrender.com",
    },
    behaviorEngine: {
        apiUrl: import.meta.env.VITE_BEHAVIOR_ENGINE_API || "http://localhost:5001",
        dashboardUrl: import.meta.env.VITE_BEHAVIOR_ENGINE_DASHBOARD || "",
    },
    deviceMonitoring: {
        apiUrl: import.meta.env.VITE_DEVICE_MONITORING_API || "http://localhost:5002",
        dashboardUrl: import.meta.env.VITE_DEVICE_MONITORING_DASHBOARD || "",
    },
    complianceEngine: {
        apiUrl: import.meta.env.VITE_COMPLIANCE_ENGINE_API || "http://localhost:5003",
        dashboardUrl: import.meta.env.VITE_COMPLIANCE_ENGINE_DASHBOARD || "",
    },
};
