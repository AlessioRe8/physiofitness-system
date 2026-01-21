import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && allowedRoles.length > 0) {
        const userRole = user.role ? user.role.toUpperCase() : "";

        if (!allowedRoles.includes(userRole)) {
            return <Navigate to="/" replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;