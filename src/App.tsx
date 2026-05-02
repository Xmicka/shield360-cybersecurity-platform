import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AuthProvider } from "./context/authContext";
import { SubscriptionProvider } from "./context/subscriptionContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// ─── Integrated Module Pages ───
import { EndpointScannerPage } from "./modules/endpoint-scanner";
import { ShadowITPage } from "./modules/shadow-it";
import { ComplianceAssistantPage } from "./modules/compliance-assistant";
import { SpearPhishingPage } from "./modules/spear-phishing";

// ─── Compliance Assessment Sub-Pages (JSX) ───
import SMEProfilePage from "./modules/compliance-assistant/components/SMEProfile.jsx";
import QuestionsPage from "./modules/compliance-assistant/components/QuestionsPage.jsx";
import Stage2Organizational from "./modules/compliance-assistant/components/Stage2Organizational.jsx";
import Stage3People from "./modules/compliance-assistant/components/Stage3People.jsx";
import Stage4Physical from "./modules/compliance-assistant/components/Stage4Physical.jsx";
import Stage5Technological from "./modules/compliance-assistant/components/Stage5Technological.jsx";
import ComplianceSummary from "./modules/compliance-assistant/components/Summary.jsx";
import RecommendationsPage from "./modules/compliance-assistant/components/RecommendationsPage.jsx";

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

function PageWrap({ children }: { children: React.ReactNode }) {
  return <motion.div {...pageVariants}>{children}</motion.div>;
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

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <SubscriptionProvider>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public */}
            <Route path="/" element={<PageWrap><Landing /></PageWrap>} />
            <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
            <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
            <Route path="/pricing" element={<PageWrap><Pricing /></PageWrap>} />
            <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
            <Route path="/about" element={<PageWrap><About /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><Contact /></PageWrap>} />

            {/* App (sidebar + navbar) - protected */}
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<PageWrap><Dashboard /></PageWrap>} />
              <Route path="/admin" element={<PageWrap><AdminDashboard /></PageWrap>} />
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
          </Routes>
        </AnimatePresence>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;
