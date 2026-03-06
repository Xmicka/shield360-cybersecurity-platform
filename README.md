# Shield360 — Cybersecurity Platform

**Enterprise-grade security. Built for SMEs.**

Shield360 is a unified SaaS cybersecurity platform that brings together phishing simulation, behaviour analytics, device monitoring, and compliance enforcement — all in one intelligent dashboard. Designed as a direct B2C solution so small and medium businesses can protect themselves without the enterprise price tag.

![Shield360](https://img.shields.io/badge/Shield360-Cybersecurity-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square)

---

## What It Does

Shield360 aggregates four independent security modules into a single admin dashboard with subscription-based access:

| Module | Status | Description |
|--------|--------|-------------|
| **Spear Phishing Simulation** | 🟢 Live | AI-driven adaptive phishing campaigns, click detection, risk scoring, and automated micro-training. Deployed at [spear-phishing-dashboard.onrender.com](https://spear-phishing-dashboard.onrender.com/) |
| **Behaviour Intelligence Engine** | 🔧 In Progress | User behaviour analytics using isolation forest models for insider threat detection and dynamic risk scoring |
| **Device Behaviour Monitoring** | 🔧 In Progress | Continuous device inventory, health tracking, and anomalous network behaviour detection across endpoints |
| **Compliance & Policy Engine** | 🔧 In Progress | Automated compliance monitoring across ISO 27001, GDPR, SOC 2, and NIST with policy enforcement |

---

## Features

### Landing Page
- Premium glassmorphism design with animated particle background
- Module showcase with feature pills and gradient accents
- Pricing teaser with three subscription tiers (Starter, Professional, Enterprise)
- Fully responsive with smooth scroll animations

### Admin Dashboard
- **Sidebar** with module-specific icon boxes and colour-coded navigation
- **5 key metrics** — employees monitored, high-risk users, active threats, compliance score, system health
- **Threat activity chart** — area chart showing threats detected vs blocked over 6 months
- **Compliance donut** — real-time compliance posture score
- **Connected modules grid** — status indicators for each security module
- **Activity feed** — cross-module event stream with severity tagging

### Subscription System
- Three plans: Starter ($49/mo), Professional ($129/mo), Enterprise ($299/mo)
- Module access gating based on subscription tier
- Checkout flow with dummy payment processing
- Plan management from the sidebar

### Live Integrations
- Spear Phishing module links directly to the deployed dashboard on Render
- Each module connects to its own microservice via configurable API endpoints

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
git clone https://github.com/Xmicka/shield360-cybersecurity-platform.git
cd shield360-cybersecurity-platform
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to `dist/`.

---

## Connecting APIs

Create a `.env` file in the project root:

```env
VITE_BEHAVIOR_API=https://your-behavior-api.example.com
VITE_DEVICE_API=https://your-device-api.example.com
VITE_THREAT_API=https://your-threat-api.example.com
VITE_COMPLIANCE_API=https://your-compliance-api.example.com
```

Or edit `src/config/services.ts` directly. If an API isn't configured, the dashboard falls back to demo data with a "Service not connected" notice.

---

## Project Structure

```
src/
├── components/
│   ├── AnimatedBackground.tsx  # Three.js particle background
│   ├── MetricsPanel.tsx        # Animated metric cards with count-up
│   ├── ModuleCard.tsx          # Module preview cards
│   ├── ModuleGate.tsx          # Subscription access gating
│   ├── Navbar.tsx              # Top navigation bar
│   └── Sidebar.tsx             # Admin sidebar with module nav
├── context/
│   └── subscriptionContext.tsx  # Subscription state management
├── pages/
│   ├── Landing.tsx             # Public landing page
│   ├── Login.tsx               # Login page
│   ├── Signup.tsx              # Registration page
│   ├── Dashboard.tsx           # Admin overview dashboard
│   ├── Pricing.tsx             # Subscription plans
│   ├── Checkout.tsx            # Payment flow
│   ├── About.tsx               # Company info
│   ├── Contact.tsx             # Contact page
│   └── modules/
│       ├── SpearPhishing.tsx   # Phishing simulation module
│       ├── BehaviourEngine.tsx # Behaviour analytics module
│       ├── DeviceMonitoring.tsx# Device tracking module
│       └── ComplianceEngine.tsx# Compliance monitoring module
├── services/
│   ├── behaviorApi.ts          # Behaviour Engine API connector
│   ├── deviceApi.ts            # Device Monitoring API connector
│   ├── threatApi.ts            # Threat Intel API connector
│   └── complianceApi.ts        # Compliance Engine API connector
├── config/
│   └── services.ts             # API endpoint configuration
├── styles/
│   └── animations.css          # Glass effects, animations, design system
├── App.tsx                     # Root component with routing
├── main.tsx                    # Entry point
└── index.css                   # Global styles & Tailwind config
```

---

## Tech Stack

- **React 19** + **Vite 7** — dev server and production builds
- **TypeScript** — type safety
- **TailwindCSS v4** — utility-first styling
- **Framer Motion** — animations and page transitions
- **Three.js** — 3D animated background
- **Recharts** — charts and data viz
- **React Router v7** — client-side routing
- **Axios** — API calls

---

## Deployment

### Render (Static Site)
1. Connect the GitHub repo
2. Build command: `npm install && npm run build`
3. Publish directory: `dist`
4. Add env variables in Render dashboard

### Vercel
```bash
vercel
```
Auto-detects Vite. Add env variables in the Vercel dashboard.

---

## License

MIT
