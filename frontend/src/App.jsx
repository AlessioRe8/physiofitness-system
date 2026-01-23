import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import PatientList from "./pages/PatientList";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import AnalyticsAI from "./pages/AnalyticsAI";
import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";
import Users from "./pages/Users";
import Sidebar from "./components/Sidebar";
import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";
import PatientLayout from "./components/PatientLayout";
import Register from "./pages/Register";
import PatientProfile from "./pages/PatientProfile";
import ServiceInfo from "./pages/ServiceInfo";
import About from "./pages/About";

const StaffLayout = () => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 bg-gray-50 min-h-screen">
            <Outlet />
        </div>
        <ChatWidget />
    </div>
);

const PatientRouteWrapper = () => (
    <PatientLayout>
        <Outlet />
    </PatientLayout>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/service/:type" element={<ServiceInfo />} />
          <Route path="/about" element={<About />} />

          {/* PATIENT ROUTES (Uses PatientLayout) */}
          <Route element={<PatientRouteWrapper />}>
              <Route element={<ProtectedRoute allowedRoles={['PATIENT']} />}>
                  <Route path="/profile" element={<PatientProfile />} />
              </Route>
          </Route>

          {/* STAFF ROUTES (Uses StaffLayout/Sidebar) */}
          <Route element={<StaffLayout />}>
              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'PHYSIO', 'RECEPTIONIST']} />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/patients" element={<PatientList />} />
                  <Route path="/analytics" element={<AnalyticsAI />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'RECEPTIONIST']} />}>
                  <Route path="/services" element={<ServiceList />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/billing" element={<Billing />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                  <Route path="/users" element={<Users />} />
              </Route>
          </Route>

        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;