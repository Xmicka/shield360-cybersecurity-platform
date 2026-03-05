# Shield360 Cybersecurity Platform

**AI-Driven Security for SMEs**

A unified cybersecurity research platform dashboard that aggregates four independent security research components into a professional SaaS-grade interface.

![Shield360](https://img.shields.io/badge/Shield360-Cybersecurity-00f0ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square)

---

## Overview

Shield360 is a frontend-only unified dashboard that provides a central interface for four independent cybersecurity research modules:

| Module | Description |
|--------|-------------|
| **Behaviour Intelligence Engine** | AI-powered user behavior analytics, insider threat detection, risk scoring |
| **Device Behaviour Monitoring** | Real-time device inventory, health tracking, anomaly detection |
| **Threat Intelligence** | Aggregated threat feeds, IOC tracking, attack pattern analysis |
| **Compliance & Policy Engine** | Automated compliance monitoring (ISO 27001, GDPR, SOC 2, NIST) |

Each module connects to its own independent microservice via configurable API endpoints.

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/yourusername/shield360-cybersecurity-platform.git
cd shield360-cybersecurity-platform
npm install
```

### Run Locally

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

The output will be in the `dist/` directory.

---

## Connecting Component APIs

### Option 1: Environment Variables (Recommended)

Create a `.env` file in the project root:

```env
VITE_BEHAVIOR_API=https://your-behavior-api.example.com
VITE_DEVICE_API=https://your-device-api.example.com
VITE_THREAT_API=https://your-threat-api.example.com
VITE_COMPLIANCE_API=https://your-compliance-api.example.com
```

### Option 2: Configuration File

Edit `src/config/services.ts` directly:

```typescript
export const SERVICES = {
  behaviorEngine: "https://your-behavior-api.example.com",
  deviceMonitoring: "https://your-device-api.example.com",
  threatIntel: "https://your-threat-api.example.com",
  complianceEngine: "https://your-compliance-api.example.com",
};
```

> **Note:** Environment variables override config file values.

### Expected API Endpoints

Each microservice should expose:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/metrics` | GET | Returns high-level module metrics |
| `/alerts` | GET | Returns recent alerts/events |

If an API is not configured or unreachable, the dashboard displays a "Service not connected" notice with demo placeholder data.

---

## Deployment

### Render Static Site

1. Connect your GitHub repository to Render
2. Set **Build Command**: `npm install && npm run build`
3. Set **Publish Directory**: `dist`
4. Add environment variables in Render dashboard

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase init hosting  # Select 'dist' as public directory, configure as SPA
npm run build
firebase deploy
```

### Vercel

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Vite projects. Add environment variables in the Vercel dashboard.

---

## Adding Additional Modules

1. **Create the API service** in `src/services/yourModuleApi.ts`:
   ```typescript
   import axios from "axios";
   import { SERVICES } from "../config/services";

   export const fetchYourModuleMetrics = async () => {
     try {
       const res = await axios.get(`${SERVICES.yourModule}/metrics`);
       return res.data;
     } catch { return null; }
   };
   ```

2. **Add config entry** in `src/config/services.ts`:
   ```typescript
   yourModule: import.meta.env.VITE_YOUR_MODULE_API || "REPLACE_WITH_COMPONENT_API",
   ```

3. **Create the page** in `src/pages/YourModule.tsx`

4. **Add the route** in `src/App.tsx`:
   ```tsx
   <Route path="/your-module" element={<AnimatedPage><YourModule /></AnimatedPage>} />
   ```

5. **Add navigation links** in `Navbar.tsx` and `Sidebar.tsx`

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.tsx              # Top navigation bar
│   ├── Sidebar.tsx             # Side navigation panel
│   ├── ModuleCard.tsx          # Animated module card component
│   ├── AnimatedBackground.tsx  # Three.js particle background
│   └── MetricsPanel.tsx        # Metrics display widget
├── pages/
│   ├── PlatformOverview.tsx    # Dashboard home with aggregated metrics
│   ├── BehaviourEngine.tsx     # User behavior analytics module
│   ├── DeviceMonitoring.tsx    # Device monitoring module
│   ├── ThreatIntel.tsx         # Threat intelligence module
│   └── ComplianceEngine.tsx    # Compliance & policy module
├── services/
│   ├── behaviorApi.ts          # Behaviour Engine API connector
│   ├── deviceApi.ts            # Device Monitoring API connector
│   ├── threatApi.ts            # Threat Intel API connector
│   └── complianceApi.ts        # Compliance Engine API connector
├── config/
│   └── services.ts             # Configurable service endpoints
├── styles/
│   └── animations.css          # Custom animation keyframes
├── App.tsx                     # Root component with routing
├── main.tsx                    # Application entry point
└── index.css                   # Global styles & Tailwind theme
```

---

## Tech Stack

- **React 19** + **Vite 7** — Fast development and build
- **TypeScript** — Type-safe development
- **TailwindCSS v4** — Utility-first styling
- **Framer Motion** — Smooth animations and transitions
- **Three.js** — 3D animated background effects
- **Recharts** — Data visualization charts
- **Axios** — HTTP client for API calls
- **React Router** — Client-side routing

---

## License

MIT
