import { Link } from "react-router-dom";
import { CheckCircle, Users, Award, ArrowLeft } from "lucide-react";

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Header Image */}
            <div className="h-64 bg-blue-900 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="relative z-10 text-center">
                    <h1 className="text-4xl font-bold text-white mb-2">About PhysioFitness</h1>
                    <p className="text-blue-100">Excellence in Physiotherapy since 2025</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-12">
                <Link to="/" className="inline-flex items-center text-blue-600 hover:underline mb-8">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <div className="prose max-w-none text-gray-600">
                    <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                    <p className="text-lg mb-8">
                        At PhysioFitness, we believe that movement is life. Our mission is to provide world-class physiotherapy and rehabilitation services using the latest technology and evidence-based practices. Whether you are an elite athlete or recovering from surgery, we are dedicated to helping you reach your full potential.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <Users className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900">Expert Team</h3>
                            <p className="text-sm">Certified specialists in orthopedics and sports medicine.</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <Award className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900">Proven Results</h3>
                            <p className="text-sm">Over 5,000 patients successfully treated.</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-4" />
                            <h3 className="font-bold text-gray-900">Modern Facility</h3>
                            <p className="text-sm">Equipped with state-of-the-art gym and medical devices.</p>
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Our History</h2>
                    <p className="mb-4">
                        Founded in 2025, PhysioFitness started as a small clinic in Camerino. Today, we are a leading center for rehabilitation, integrating AI-driven analytics with hands-on manual therapy.
                    </p>
                    <p>
                        We are proud to partner with local sports teams and hospitals to ensure continuity of care for all our patients.
                    </p>
                </div>

                <div className="mt-12 p-8 bg-gray-50 rounded-2xl text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to meet the team?</h3>
                    <div className="flex justify-center gap-4">
                        <Link to="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700">
                            Join Us
                        </Link>
                        <Link to="/" className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-100">
                            View Services
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;