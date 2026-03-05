import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SpearPhishing from "./pages/modules/SpearPhishing";
import BehaviourEngine from "./pages/modules/BehaviourEngine";
import DeviceMonitoring from "./pages/modules/DeviceMonitoring";
import ComplianceEngine from "./pages/modules/ComplianceEngine";
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

/** Layout for authenticated app pages (Dashboard + Modules) */
function AppLayout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-navy-950">
      <AppNavbar />
      <Sidebar />
      <main className="relative z-10 pt-20 pb-12 px-4 sm:px-6 lg:pl-66 lg:pr-8">
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
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<PageWrap><Landing /></PageWrap>} />
        <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
        <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />

        {/* App routes (with sidebar + navbar) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<PageWrap><Dashboard /></PageWrap>} />
          <Route path="/modules/spear-phishing" element={<PageWrap><SpearPhishing /></PageWrap>} />
          <Route path="/modules/behaviour-engine" element={<PageWrap><BehaviourEngine /></PageWrap>} />
          <Route path="/modules/device-monitoring" element={<PageWrap><DeviceMonitoring /></PageWrap>} />
          <Route path="/modules/compliance-engine" element={<PageWrap><ComplianceEngine /></PageWrap>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;
