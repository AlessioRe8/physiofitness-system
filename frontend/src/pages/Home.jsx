import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import {
    Phone, Mail, MapPin, Clock,
    Activity, Heart, Stethoscope, UserCheck,
    ArrowRight, CalendarCheck
} from "lucide-react";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">

            {/* 1. TOP BAR (Medical Style) */}
            <div className="bg-blue-900 text-white text-sm py-2 px-6">
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
                    <div className="flex items-center space-x-2 text-blue-700">
                        <Activity className="w-8 h-8" />
                        <span className="text-2xl font-bold tracking-tight">PhysioFitness<span className="text-gray-400">.it</span></span>
                    </div>

                    <div className="hidden md:flex space-x-8 font-medium text-gray-600">
                        <a href="#services" className="hover:text-blue-600 transition">Services</a>
                        <a href="#doctors" className="hover:text-blue-600 transition">Our Team</a>
                        <a href="#about" className="hover:text-blue-600 transition">About Clinic</a>
                    </div>

                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link to="/dashboard" className="text-blue-700 font-bold hover:underline">
                                Staff Portal
                            </Link>
                        ) : (
                            <Link to="/login" className="text-gray-500 hover:text-blue-600 font-medium text-sm">
                                Staff Login
                            </Link>
                        )}
                        <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-lg flex items-center gap-2">
                            <CalendarCheck className="w-5 h-5" />
                            Book Online
                        </button>
                    </div>
                </div>
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
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1">
                                Request Appointment
                            </button>
                            <button className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-lg text-lg font-bold hover:bg-gray-50 transition">
                                View Services
                            </button>
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

            {/* 4. SERVICES GRID (Like Paideia) */}
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
                            desc="Post-surgical recovery for ACL, meniscus, and joint replacements using cutting-edge robotics."
                        />
                        <ServiceCard
                            icon={Heart}
                            title="Sports Medicine"
                            desc="Performance optimization and injury prevention for professional and amateur athletes."
                        />
                        <ServiceCard
                            icon={Activity}
                            title="Manual Therapy"
                            desc="Hands-on techniques including mobilization and manipulation to reduce pain and increase range of motion."
                        />
                    </div>
                </div>
            </div>

            {/* 5. CTA SECTION (Like PhysioClinic) */}
            <div className="bg-blue-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your recovery?</h2>
                    <p className="text-blue-200 mb-8 max-w-2xl mx-auto text-lg">
                        Our AI-powered booking system finds the earliest slot for you.
                        No waiting lists, no hassle.
                    </p>
                    <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition shadow-lg">
                        Book Your Visit Now
                    </button>
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
                            <li><a href="#" className="hover:text-white">Book Appointment</a></li>
                            <li><a href="#" className="hover:text-white">Insurance Info</a></li>
                            <li><a href="#" className="hover:text-white">Second Opinion</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-4 uppercase tracking-wider">Contact</h4>
                        <ul className="space-y-2">
                            <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> Via Roma 10, Milan</li>
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
                    &copy; 2025 PhysioFitness Systems. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const ServiceCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-gray-50 p-8 rounded-2xl hover:bg-white hover:shadow-xl transition duration-300 border border-transparent hover:border-gray-100 group">
        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition">
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
        <div className="mt-6 flex items-center text-blue-600 font-semibold group-hover:gap-2 transition-all cursor-pointer">
            <span>Learn more</span>
            <ArrowRight className="w-4 h-4 ml-1" />
        </div>
    </div>
);

export default Home;