export const SERVICES = {
    behaviorEngine: import.meta.env.VITE_BEHAVIOR_API || "REPLACE_WITH_COMPONENT_API",
    deviceMonitoring: import.meta.env.VITE_DEVICE_API || "REPLACE_WITH_COMPONENT_API",
    threatIntel: import.meta.env.VITE_THREAT_API || "REPLACE_WITH_COMPONENT_API",
    complianceEngine: import.meta.env.VITE_COMPLIANCE_API || "REPLACE_WITH_COMPONENT_API",
};
