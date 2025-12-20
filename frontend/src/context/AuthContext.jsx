import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("access_token") ? JSON.parse(localStorage.getItem("access_token")) : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem("access_token") ? jwtDecode(localStorage.getItem("access_token")) : null
    );
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (email, password) => {
        try {
            const response = await api.post("token/", {
                email: email,
                password: password
            });

            if (response.status === 200) {
                setAuthTokens(response.data);

                const decodedUser = jwtDecode(response.data.access);
                setUser(decodedUser);

                localStorage.setItem("access_token", JSON.stringify(response.data));

                navigate("/dashboard");
                return true;
            }
        } catch (error) {
            console.error("Login failed:", error);
            alert("Invalid credentials!");
            return false;
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("access_token");
        navigate("/login");
    };

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser
    };

    useEffect(() => {
        setLoading(false);
    }, [authTokens]);

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};

export default AuthContext;