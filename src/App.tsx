import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { SubscriptionProvider } from "./context/subscriptionContext";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Pricing from "./pages/Pricing";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import SpearPhishing from "./pages/modules/SpearPhishing";
import BehaviourEngine from "./pages/modules/BehaviourEngine";
import DeviceMonitoring from "./pages/modules/DeviceMonitoring";
import ComplianceEngine from "./pages/modules/ComplianceEngine";
import ModuleGate from "./components/ModuleGate";
import AppNavbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

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
    <div className="min-h-screen bg-navy-950">
      <AppNavbar />
      <Sidebar />
      <main className="relative z-10" style={{ paddingTop: 80, paddingBottom: 48, paddingLeft: 288, paddingRight: 32 }}>
        <div className="max-w-[1100px] mx-auto">
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

          {/* App (sidebar + navbar) */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<PageWrap><Dashboard /></PageWrap>} />
            <Route path="/modules/spear-phishing" element={<PageWrap><ModuleGate moduleSlug="spear-phishing" moduleName="Spear Phishing Simulation"><SpearPhishing /></ModuleGate></PageWrap>} />
            <Route path="/modules/behaviour-engine" element={<PageWrap><ModuleGate moduleSlug="behaviour-engine" moduleName="Behaviour Intelligence Engine"><BehaviourEngine /></ModuleGate></PageWrap>} />
            <Route path="/modules/device-monitoring" element={<PageWrap><ModuleGate moduleSlug="device-monitoring" moduleName="Device Behaviour Monitoring"><DeviceMonitoring /></ModuleGate></PageWrap>} />
            <Route path="/modules/compliance-engine" element={<PageWrap><ModuleGate moduleSlug="compliance-engine" moduleName="Compliance & Policy Engine"><ComplianceEngine /></ModuleGate></PageWrap>} />
          </Route>
        </Routes>
      </AnimatePresence>
    </SubscriptionProvider>
  );
}

export default App;
