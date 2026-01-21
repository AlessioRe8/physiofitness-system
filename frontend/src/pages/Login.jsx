import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Mail, Activity, ArrowLeft } from "lucide-react";

const Login = () => {
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const userInfo = await loginUser(email, password);

            if (userInfo) {
                navigate("/");
            } else {
                setError("Login failed. Please check credentials.");
            }
        } catch (err) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <Link to="/" className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-6 transition">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
                </Link>

                <div className="text-center mb-8">
                    <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <Activity className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                    <p className="text-gray-500">Sign in to access your account</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                            <input
                                type="password"
                                className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account? <Link to="/register" className="text-blue-600 font-bold hover:underline">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;