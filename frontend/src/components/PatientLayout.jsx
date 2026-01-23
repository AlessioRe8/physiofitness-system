import { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
    Menu, X, LogOut, User, Calendar,
    Home, Activity, ChevronLeft
} from "lucide-react";

const PatientLayout = ({ children }) => {
    const { user, logoutUser } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    // Helper to check active link
    const isActive = (path) => location.pathname === path;

    // The Sidebar Content (Reused for Mobile & Desktop)
    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2 text-blue-700">
                        <Activity className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">PhysioFitness<span className="text-gray-400">.it</span></span>
                    </Link>
                {/* Close Button (Mobile Only) */}
                <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}>
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link to="/" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-lg transition">
                    <Home className="w-5 h-5" /> Home
                </Link>
                <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${isActive('/profile') ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}>
                    <User className="w-5 h-5" /> My Profile
                </Link>
                {/* Add more links here if needed */}
            </nav>

            {/* Bottom User Section (Fixed at bottom of sidebar) */}
            <div className="p-4 border-t border-gray-100">
                <div className="mb-4 px-4">
                    <p className="text-xs text-gray-400 uppercase font-bold">Logged in as</p>
                    <p className="font-bold text-gray-800 truncate">{user?.first_name} {user?.last_name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button
                    onClick={logoutUser}
                    className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg w-full transition text-sm font-bold"
                >
                    <LogOut className="w-4 h-4" /> Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">

            {/* 1. DESKTOP SIDEBAR (Fixed, Hidden on Mobile) */}
            <aside className="hidden md:block w-64 flex-shrink-0 h-full">
                <SidebarContent />
            </aside>

            {/* 2. MOBILE DRAWER (Overlay) */}
            {isSidebarOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>
                    {/* Sidebar Panel */}
                    <div className="relative bg-white w-3/4 max-w-xs h-full shadow-2xl animate-slide-in">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* 3. MAIN CONTENT AREA (Scrollable) */}
            <div className="flex-1 flex flex-col h-full w-full relative">

                {/* Mobile Header (Hamburger) */}
                <header className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between flex-shrink-0 z-10">
                    <Link to="/" className="flex items-center space-x-2 text-blue-700">
                        <Activity className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">PhysioFitness<span className="text-gray-400">.it</span></span>
                    </Link>

                    <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                {/* SCROLLABLE CONTENT WRAPPER */}
                <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default PatientLayout;