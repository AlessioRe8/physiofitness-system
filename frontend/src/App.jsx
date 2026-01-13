import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import PrivateRoute from "./utils/PrivateRoute";
import Sidebar from "./components/Sidebar";
import PatientList from "./pages/PatientList";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";
import AnalyticsAI from "./pages/AnalyticsAI";
import ChatWidget from "./components/ChatWidget";
import Home from "./pages/Home";
import ServiceList from "./pages/ServiceList";

const Layout = () => (
    <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64">
            <Outlet />
        </div>
        <ChatWidget />
    </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
              <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/patients" element= {<PatientList />} />
                  <Route path="/services" element={<ServiceList />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/billing" element={<Billing />} />
                  <Route path="/analytics" element={<AnalyticsAI />} />
              </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;