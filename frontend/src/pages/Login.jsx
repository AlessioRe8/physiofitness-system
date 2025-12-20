import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Login = () => {
    const { loginUser } = useContext(AuthContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        if (email.length > 0) {
            loginUser(email, password);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-xl w-96">
                <h3 className="text-2xl font-bold text-center text-blue-600">PhysioFitness</h3>
                <p className="text-sm text-center text-gray-500 mb-6">Clinic Management System</p>

                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                        <div>
                            <label className="block" htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                placeholder="doctor@clinic.com"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••"
                                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                            />
                        </div>
                        <div className="flex items-baseline justify-between">
                            <button className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 w-full">Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;