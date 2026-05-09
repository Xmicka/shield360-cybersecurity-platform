import { lazy, Suspense } from "react";
import { Routes, Route, useLocation, Outlet, Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/authContext";
import { SubscriptionProvider } from "./context/subscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

/* ─── Code-split routes (each becomes its own JS chunk) ─── */
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Pricing = lazy(() => import("./pages/Pricing"));
const Checkout = lazy(() => import("./pages/Checkout"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

/* ─── Module pages (heavier, definitely worth splitting) ─── */
const EndpointScannerPage = lazy(() =>
  import("./modules/endpoint-scanner").then((m) => ({ default: m.EndpointScannerPage }))
);
const ShadowITPage = lazy(() =>
  import("./modules/shadow-it").then((m) => ({ default: m.ShadowITPage }))
);
const ComplianceAssistantPage = lazy(() =>
  import("./modules/compliance-assistant").then((m) => ({ default: m.ComplianceAssistantPage }))
);
const SpearPhishingPage = lazy(() =>
  import("./modules/spear-phishing").then((m) => ({ default: m.SpearPhishingPage }))
);

/* ─── Compliance Assessment Sub-Pages (JSX) ─── */
const SMEProfilePage = lazy(() => import("./modules/compliance-assistant/components/SMEProfile.jsx"));
const QuestionsPage = lazy(() => import("./modules/compliance-assistant/components/QuestionsPage.jsx"));
const Stage2Organizational = lazy(() => import("./modules/compliance-assistant/components/Stage2Organizational.jsx"));
const Stage3People = lazy(() => import("./modules/compliance-assistant/components/Stage3People.jsx"));
const Stage4Physical = lazy(() => import("./modules/compliance-assistant/components/Stage4Physical.jsx"));
const Stage5Technological = lazy(() => import("./modules/compliance-assistant/components/Stage5Technological.jsx"));
const ComplianceSummary = lazy(() => import("./modules/compliance-assistant/components/Summary.jsx"));
const RecommendationsPage = lazy(() => import("./modules/compliance-assistant/components/RecommendationsPage.jsx"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

function PageWrap({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageVariants}>{children}</motion.div>;
}

/* ─── Suspense fallback shown while a route chunk loads ─── */
function RouteFallback() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          width: 28,
          height: 28,
          border: "2px solid var(--color-border)",
          borderTopColor: "var(--color-brand-lavender-dark)",
          borderRadius: "50%",
        }}
        className="animate-spin"
        aria-label="Loading"
      />
    </div>
  );
}

function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen" style={{ background: "var(--color-bg-base)" }}>
      <AppNavbar />
      <Sidebar />
      <style>{`
        .shield-main-content {
          padding-top: 80px;
          padding-bottom: 48px;
          padding-left: 24px;
          padding-right: 24px;
        }
        @media (min-width: 1024px) {
          .shield-main-content {
            padding-left: 272px; /* 248px sidebar + 24px gap */
          }
        }
      `}</style>
      <main className="relative z-10 min-h-screen transition-all duration-300 shield-main-content">
        <div className="max-w-[1400px] mx-auto">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-base)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.25em", color: "var(--color-brand-lavender-dark)", marginBottom: 14 }}>404</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(40px, 6vw, 64px)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.025em", color: "var(--color-text-primary)", marginBottom: 16 }}>
          Page <span style={{ fontStyle: "italic", color: "var(--color-brand-lavender-dark)" }}>not found</span>
        </h1>
        <p style={{ fontSize: 16, color: "var(--color-text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 22px", fontSize: 14 }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <Suspense fallback={<RouteFallback />}>
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/" element={<PageWrap><Landing /></PageWrap>} />
                <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
                <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
                <Route path="/pricing" element={<PageWrap><Pricing /></PageWrap>} />
                <Route path="/about" element={<PageWrap><About /></PageWrap>} />
                <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />

                {/* Authenticated checkout (paid plans go through contact-sales) */}
                <Route path="/checkout" element={<ProtectedRoute><PageWrap><Checkout /></PageWrap></ProtectedRoute>} />

                {/* App (sidebar + navbar) - protected */}
                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<PageWrap><Dashboard /></PageWrap>} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <PageWrap><AdminDashboard /></PageWrap>
                      </AdminRoute>
                    }
                  />
                  {/* Integrated Module Routes */}
                  <Route path="/dashboard/endpoint-scanner" element={<PageWrap><EndpointScannerPage /></PageWrap>} />
                  <Route path="/dashboard/shadow-it" element={<PageWrap><ShadowITPage /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant" element={<PageWrap><ComplianceAssistantPage /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/profile" element={<PageWrap><SMEProfilePage /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/mandatory" element={<PageWrap><QuestionsPage /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/organizational" element={<PageWrap><Stage2Organizational /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/people" element={<PageWrap><Stage3People /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/physical" element={<PageWrap><Stage4Physical /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/technological" element={<PageWrap><Stage5Technological /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/summary/:assessmentId" element={<PageWrap><ComplianceSummary /></PageWrap>} />
                  <Route path="/dashboard/compliance-assistant/assessment/recommendations/:assessmentId" element={<PageWrap><RecommendationsPage /></PageWrap>} />
                  <Route path="/dashboard/spear-phishing" element={<PageWrap><SpearPhishingPage /></PageWrap>} />
                </Route>

                <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </SubscriptionProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
