import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Activity, Calendar, BrainCircuit, ShieldCheck } from "lucide-react";

const Home = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-white">
            <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-blue-600">
                    <Activity className="w-8 h-8" />
                    <Link to="/">
                        <span className="text-2xl font-bold">PhysioFitness</span>
                    </Link>
                </div>
                <div>
                    {user ? (
                        <Link to="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                            Login
                        </Link>
                    )}
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-20 text-center">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
                    The Future of <span className="text-blue-600">Clinic Management</span>
                </h1>
                <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
                    Streamline your physiotherapy practice with AI-powered analytics,
                    smart scheduling, and automated patient reminders.
                </p>
                <div className="flex justify-center gap-4">
                    {user ? (
                        <Link to="/dashboard" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1">
                            Access Dashboard
                        </Link>
                    ) : (
                        <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-bold hover:bg-blue-700 shadow-lg transition-transform transform hover:-translate-y-1">
                            Staff Login
                        </Link>
                    )}
                    <a href="#features" className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg text-lg font-bold hover:bg-gray-200 transition">
                        Learn More
                    </a>
                </div>
            </div>

            <div id="features" className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Choose PhysioFitness?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={BrainCircuit}
                            title="AI Analytics"
                            desc="Predict patient no-shows and forecast clinic demand with our advanced Machine Learning engine."
                        />
                        <FeatureCard
                            icon={Calendar}
                            title="Smart Scheduling"
                            desc="Effortless drag-and-drop calendar with automated email reminders and conflict detection."
                        />
                        <FeatureCard
                            icon={ShieldCheck}
                            title="Secure & Compliant"
                            desc="Role-based access control ensures patient data is seen only by authorized personnel."
                        />
                    </div>
                </div>
            </div>

            <footer className="bg-white py-10 border-t mt-10">
                <div className="text-center text-gray-500">
                    &copy; 2025 PhysioFitness Systems. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4">
            <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
);

export default Home;