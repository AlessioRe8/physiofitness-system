import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Users, Package, LogOut, BrainCircuit, Receipt, Briefcase } from "lucide-react";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Sidebar = () => {
    const { logoutUser } = useContext(AuthContext);
    const location = useLocation();

    const NavItem = ({ to, icon: Icon, label }) => {
        const isActive = location.pathname === to;
        return (
            <Link to={to} className={`flex items-center space-x-3 px-6 py-3 transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
            </Link>
        );
    };

    return (
        <div className="w-64 bg-white h-screen fixed border-r flex flex-col justify-between">
            <div>
                <div className="p-6">
                    <Link to="/">
                        <h2 className="text-2xl font-bold text-blue-600">PhysioFitness</h2>
                    </Link>
                </div>
                <nav className="mt-6">
                    <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
                    <NavItem to="/calendar" icon={Calendar} label="Scheduling" />
                    <NavItem to="/patients" icon={Users} label="Patients" />
                    <NavItem to="/services" icon={Briefcase} label="Services" />
                    <NavItem to="/inventory" icon={Package} label="Inventory" />
                    <NavItem to="/billing" icon={Receipt} label="Billing" />
                    <NavItem to="/analytics" icon={BrainCircuit} label="Analytics" />
                </nav>
            </div>
            <div className="p-4">
                <button onClick={logoutUser} className="flex items-center space-x-3 px-6 py-3 w-full text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;