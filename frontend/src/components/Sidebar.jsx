import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
    LayoutDashboard,
    Calendar,
    Users,
    FileText,
    Package,
    Settings,
    LogOut,
    Briefcase,
    BarChart
} from "lucide-react";

const Sidebar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const location = useLocation();

    const userRole = user?.role ? user.role.toUpperCase() : "";

    const navItems = [
        {
            to: "/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
            roles: ['ADMIN', 'PHYSIO', 'RECEPTIONIST']
        },
        {
            to: "/calendar",
            icon: Calendar,
            label: "Calendar",
            roles: ['ADMIN', 'PHYSIO', 'RECEPTIONIST']
        },
        {
            to: "/patients",
            icon: Users,
            label: "Patients",
            roles: ['ADMIN', 'PHYSIO', 'RECEPTIONIST']
        },
        {
            to: "/services",
            icon: Briefcase,
            label: "Services",
            roles: ['ADMIN', 'RECEPTIONIST']
        },
        {
            to: "/billing",
            icon: FileText,
            label: "Billing",
            roles: ['ADMIN', 'RECEPTIONIST']
        },
        {
            to: "/inventory",
            icon: Package,
            label: "Inventory",
            roles: ['ADMIN', 'RECEPTIONIST']
        },
        {
            to: "/analytics",
            icon: BarChart,
            label: "AI Analytics",
            roles: ['ADMIN', 'RECEPTIONIST', 'PHYSIO']
        },
        {
            to: "/users",
            icon: Settings,
            label: "Users",
            roles: ['ADMIN']
        },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <Link to="/" className="cursor-pointer">
                    <h1 className="text-2xl font-bold text-blue-600">PhysioFitness</h1>
                    <p className="text-xs text-gray-400 mt-1">Practice Management</p>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    if (!item.roles.includes(userRole)) return null;

                    const isActive = location.pathname === item.to;
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <div className="mb-4 px-4">
                    <p className="text-xs font-semibold text-gray-400 uppercase">Logged in as</p>
                    <p className="text-sm font-bold text-gray-700">{user?.role || "GUEST"}</p>
                </div>
                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;