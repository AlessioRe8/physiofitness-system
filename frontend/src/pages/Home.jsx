import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import {
    Phone, Mail, MapPin, Clock,
    Activity, Heart, Stethoscope,
    ArrowRight, CalendarCheck, User, LogIn,
    Menu, X, UserPlus, LogOut, LayoutDashboard
} from "lucide-react";

const Home = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isPatient = user?.role?.toUpperCase() === 'PATIENT';

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* 1. TOP BAR */}
            <div className="hidden sm:block bg-blue-900 text-white text-sm py-2 px-6">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex space-x-6">
                        <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +39 06 1234 5678</span>
                        <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@physiofitness.it</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Mon - Fri: 08:00 - 20:00
                    </div>
                </div>
            </div>

            {/* 2. MAIN NAVIGATION */}
            <nav className="sticky top-0 bg-white/95 backdrop-blur-sm shadow-sm z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2 text-blue-700">
                        <Activity className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">PhysioFitness<span className="text-gray-400">.it</span></span>
                    </Link>

                    <div className="hidden md:flex space-x-8 font-medium text-gray-600">
                        <a href="#services" className="hover:text-blue-600 transition">Services</a>
                        <Link to="/about" className="hover:text-blue-600 transition">About us</Link>
                    </div>

                    <div className="hidden md:flex flex items-center gap-4">
                        {user ? (
                            <>
                                {isPatient ? (
                                    <>
                                        <Link to="/profile" className="text-blue-700 font-bold hover:underline flex items-center gap-2">
                                            <User className="w-4 h-4" /> My Profile
                                        </Link>
                                        <Link to="/profile" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                                            <CalendarCheck className="w-5 h-5" />
                                            Book Visit
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/dashboard" className="text-blue-700 font-bold hover:underline flex items-center gap-2">
                                        <Activity className="w-4 h-4" /> Staff Portal
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-gray-500 hover:text-blue-600 font-medium text-sm flex items-center gap-1">
                                    <LogIn className="w-4 h-4" /> Login
                                </Link>
                                <Link to="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>

                    <button
                        className="md:hidden text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                    </button>

                </div>

                {/* MOBILE MENU DROPDOWN */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full left-0">
                        <a href="#services" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium border-b border-gray-50">Services</a>
                        <a href="/about" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium border-b border-gray-50">About Clinic</a>

                        {user ? (
                                    <>
                                        {isPatient ? (
                                            <>
                                                <Link to="/profile" className="flex items-center gap-3 text-blue-700 font-bold px-2 py-2 hover:bg-gray-50 rounded">
                                                    <User className="w-5 h-5" /> My Profile
                                                </Link>
                                                <Link to="/profile" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md">
                                                    <CalendarCheck className="w-5 h-5" /> Book New Visit
                                                </Link>
                                            </>
                                        ) : (
                                            <Link to="/dashboard" className="flex items-center gap-3 text-blue-700 font-bold px-2 py-2 hover:bg-gray-50 rounded">
                                                <LayoutDashboard className="w-5 h-5" /> Enter Staff Portal
                                            </Link>
                                        )}

                                        <button
                                            onClick={() => {
                                                logoutUser();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="flex items-center gap-3 w-full text-left text-red-600 font-bold px-2 py-2 hover:bg-red-50 rounded transition mt-2 border-t border-gray-100"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" className="flex items-center gap-3 text-gray-600 font-medium px-2 py-2 hover:bg-gray-50 rounded">
                                            <LogIn className="w-5 h-5" /> Log In
                                        </Link>
                                        <Link to="/register" className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-lg font-bold shadow-md">
                                            <UserPlus className="w-5 h-5" /> Sign Up & Book
                                        </Link>
                                    </>
                                )}
                    </div>
                )}
            </nav>

            {/* 3. HERO SECTION */}
            <div className="relative bg-gradient-to-r from-blue-50 to-white py-24">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 animate-fade-in-up">
                        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-2">
                            #1 Physiotherapy Clinic in Italy
                        </div>
                        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
                            Restoring Motion, <br/>
                            <span className="text-blue-600">Reclaiming Life.</span>
                        </h1>
                        <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                            Advanced rehabilitation technology meets compassionate care.
                            We specialize in sports recovery, post-surgery rehab, and chronic pain management.
                        </p>
                        <div className="flex gap-4 pt-4">
                            {user && !isPatient ? (
                                <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link to={user ? "/profile" : "/register"} className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                    Request Appointment
                                </Link>
                            )}

                            <a href="#services" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-lg text-lg font-bold hover:bg-gray-50 transition">
                                View Services
                            </a>
                        </div>
                    </div>
                    <div className="relative h-96 bg-blue-200 rounded-3xl overflow-hidden shadow-2xl">
                        <div className="absolute inset-0 bg-blue-600 opacity-10 pattern-grid-lg"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity className="w-32 h-32 text-blue-600 opacity-50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. SERVICES GRID */}
            <div id="services" className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Centers of Excellence</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">
                            Our clinic offers specialized departments dedicated to specific areas of rehabilitation.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <ServiceCard
                            icon={Stethoscope}
                            title="Orthopedic Rehab"
                            desc="Post-surgical recovery for ACL, meniscus, and joint replacements."
                            link="/service/rehab"
                        />
                        <ServiceCard
                            icon={Heart}
                            title="Sports Medicine"
                            desc="Performance optimization and injury prevention for athletes."
                            link="/service/sport"
                        />
                        <ServiceCard
                            icon={Activity}
                            title="Manual Therapy"
                            desc="Hands-on techniques including mobilization and manipulation."
                            link="/service/massage"
                        />
                    </div>
                </div>
            </div>

            {/* 5. CTA SECTION */}
            <div className="bg-blue-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your recovery?</h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto text-lg">
                        Our AI-powered booking system finds the earliest slot for you.
                        No waiting lists, no hassle.
                    </p>
                    {/* Only show "Book Now" here for Patients or Guests */}
                    {(isPatient || !user) && (
                        <Link to={user ? "/profile" : "/register"} className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg inline-block">
                            Book Your Visit Now
                        </Link>
                    )}
                </div>
            </div>

            {/* 6. FOOTER */}
            <footer className="bg-gray-900 text-gray-400 py-12 text-sm">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center space-x-2 text-white mb-4">
                            <Activity className="w-6 h-6" />
                            <span className="text-xl font-bold">PhysioFitness</span>
                        </div>
                        <p>Excellence in physiotherapy and rehabilitation since 2025.</p>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Patients</h4>
                        <ul className="space-y-2">
                            <li><a href="/profile" className="hover:text-white">Book Appointment</a></li>
                            <li><a href="#" className="hover:text-white">Insurance Info</a></li>
                            <li><a href="#" className="hover:text-white">Second Opinion</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Via XYZ, Camerino 62032 (MC)</li>
                            <li className="flex items-center gap-2"><Phone className="w-4 h-4"/> +39 06 1234 5678</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-gray-800 text-center">
                    &copy; 2025 PhysioFitness System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

// Service Card Component
const ServiceCard = ({ icon: Icon, title, desc, link }) => (
    <div className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group flex flex-col h-full">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed mb-6 flex-1">{desc}</p>

        <Link to={link} className="flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all cursor-pointer mt-auto">
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
    </div>
);

export default Home;