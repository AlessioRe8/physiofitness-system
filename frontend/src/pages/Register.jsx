import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { UserPlus, Mail, Lock, User, ArrowLeft } from "lucide-react";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        password2: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.password2) {
            setError("Passwords do not match");
            return;
        }

        try {
            await api.post("users/register/", formData);
            alert("Account created successfully! Please login.");
            navigate("/login");
        } catch (err) {
            console.error(err);
            setError(JSON.stringify(err.response?.data) || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                    <p className="text-gray-500">Join PhysioFit today</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input name="first_name" type="text" placeholder="First Name" required
                                className="pl-10 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange} />
                        </div>
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input name="last_name" type="text" placeholder="Last Name" required
                                className="pl-10 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={handleChange} />
                        </div>
                    </div>

                    <div className="relative">
                        <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input name="email" type="email" placeholder="Email Address" required
                            className="pl-10 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input name="password" type="password" placeholder="Password" required
                            className="pl-10 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange} />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                        <input name="password2" type="password" placeholder="Confirm Password" required
                            className="pl-10 p-3 w-full border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange} />
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Register
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;