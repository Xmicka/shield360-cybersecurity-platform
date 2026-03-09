// ─── Deployed Module URLs ───
// Each module links to its independently deployed frontend.
// Clicking a module card/sidebar link opens the deployed version.

export interface ModuleConfig {
    slug: string;
    name: string;
    shortName: string;
    description: string;
    deployedUrl: string;
    repoUrl: string;
    tier: "free" | "professional";
    icon: string; // SVG path
    color: string;
    gradient: string;
    tag: string;
    features: string[];
}

export const MODULES: ModuleConfig[] = [
    {
        slug: "endpoint-scanner",
        name: "Endpoint Risk Scanner",
        shortName: "Endpoint Scanner",
        description:
            "Comprehensive endpoint vulnerability scanning, risk assessment, and real-time security posture monitoring across all networked devices.",
        deployedUrl: "https://jolly-ground-07ccef300.1.azurestaticapps.net/",
        repoUrl: "",
        tier: "free",
        icon: "M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z",
        color: "#fbbf24",
        gradient: "from-amber-400 to-orange-500",
        tag: "Endpoint Security",
        features: ["Vulnerability Scanning", "Risk Assessment", "Device Health"],
    },
    {
        slug: "shadow-it",
        name: "Shadow IT & Asset Vulnerability Dashboard",
        shortName: "Shadow IT",
        description:
            "Discover unauthorized applications, shadow IT assets, and hidden vulnerabilities across your organization's digital footprint.",
        deployedUrl: "https://shadow-it-eight.vercel.app/",
        repoUrl: "https://github.com/Lord-Levi/Shield-360",
        tier: "free",
        icon: "M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z",
        color: "#3b82f6",
        gradient: "from-blue-400 to-indigo-500",
        tag: "Asset Discovery",
        features: ["Shadow IT Detection", "Asset Inventory", "Vulnerability Mapping"],
    },
    {
        slug: "compliance-assistant",
        name: "Compliance Assistant",
        shortName: "Compliance",
        description:
            "AI-powered compliance monitoring across ISO 27001, GDPR, SOC 2, and NIST frameworks with automated policy enforcement and audit trails.",
        deployedUrl: "https://compliance-assistant-two.vercel.app",
        repoUrl: "https://github.com/Shanukiliyanage/Compliance-assistant.git",
        tier: "professional",
        icon: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
        color: "#34d399",
        gradient: "from-emerald-400 to-teal-500",
        tag: "Compliance & Audit",
        features: ["ISO 27001", "GDPR", "SOC 2", "NIST"],
    },
    {
        slug: "spear-phishing",
        name: "Behaviour-Adaptive Spear Phishing Simulation",
        shortName: "Spear Phishing",
        description:
            "AI-driven adaptive phishing campaigns with real-time click detection, behavioral analysis, and automated micro-training enforcement.",
        deployedUrl: "https://spear-phishing-dashboard.onrender.com/",
        repoUrl: "https://github.com/Xmicka/behaviour-adaptive-spear-phishing.git",
        tier: "professional",
        icon: "M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75",
        color: "#22d3ee",
        gradient: "from-cyan-400 to-blue-500",
        tag: "Phishing & Training",
        features: ["Click Detection", "Risk Scoring", "Auto-Training"],
    },
];

export const FREE_MODULES = MODULES.filter((m) => m.tier === "free");
export const PREMIUM_MODULES = MODULES.filter((m) => m.tier === "professional");

export function getModuleBySlug(slug: string): ModuleConfig | undefined {
    return MODULES.find((m) => m.slug === slug);
}

// ─── Plan & Pricing Configuration ───

export type PlanType = "free" | "professional" | "enterprise";

export interface PlanConfig {
    id: PlanType;
    name: string;
    price: number;
    period: string;
    description: string;
    tagline: string;
    color: string;
    gradient: string;
    popular?: boolean;
    moduleLimits: Record<string, number>; // -1 = unlimited
    features: string[];
}

export const PLANS: PlanConfig[] = [
    {
        id: "free",
        name: "Starter",
        price: 0,
        period: "forever",
        description: "Essential security tools to get started",
        tagline: "For individuals & small teams",
        color: "#22d3ee",
        gradient: "from-cyan-400 to-blue-500",
        moduleLimits: {
            "endpoint-scanner": 10,
            "shadow-it": 10,
        },
        features: [
            "Endpoint Risk Scanner: 10 scans/mo",
            "Shadow IT Dashboard: 10 scans/mo",
            "Basic security metrics",
            "Community support",
        ],
    },
    {
        id: "professional",
        name: "Professional",
        price: 50,
        period: "month",
        description: "Full security suite for growing teams",
        tagline: "Most popular for businesses",
        color: "#a855f7",
        gradient: "from-purple-400 to-pink-500",
        popular: true,
        moduleLimits: {
            "endpoint-scanner": 20,
            "shadow-it": 20,
            "compliance-assistant": 10,
            "spear-phishing": 10,
        },
        features: [
            "Everything in Starter, plus:",
            "Endpoint Scanner: 20 scans/mo",
            "Shadow IT: 20 scans/mo",
            "Compliance Assistant: 10 audits/mo",
            "Spear Phishing Sim: 10 campaigns/mo",
            "Admin control panel",
            "Priority email support",
        ],
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: 120,
        period: "month",
        description: "Unlimited access for large organizations",
        tagline: "For security-first enterprises",
        color: "#fbbf24",
        gradient: "from-amber-400 to-orange-500",
        moduleLimits: {
            "endpoint-scanner": -1,
            "shadow-it": -1,
            "compliance-assistant": -1,
            "spear-phishing": -1,
        },
        features: [
            "Everything in Professional, plus:",
            "Unlimited access to all 4 modules",
            "Advanced AI-driven analytics",
            "Custom compliance frameworks",
            "Dedicated account manager",
            "SLA guarantee & 24/7 support",
            "SSO & advanced team management",
        ],
    },
];

export function getPlanById(planId: PlanType): PlanConfig | undefined {
    return PLANS.find((p) => p.id === planId);
}

export function getUsageLimitForModule(planId: PlanType, moduleSlug: string): number {
    const plan = getPlanById(planId);
    if (!plan) return 0;
    return plan.moduleLimits[moduleSlug] ?? 0;
}

/** Return the next tier up (for demo instant-upgrade). Already at max → returns same. */
export function getNextPlan(current: PlanType): PlanType {
    if (current === "free") return "professional";
    if (current === "professional") return "enterprise";
    return "enterprise";
}
