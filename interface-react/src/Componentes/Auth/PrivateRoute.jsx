import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../Auth/AuthToken";

const PrivateRoute = ({requiredRole }) => {

    const authenticated = isAuthenticated();
    const role = getUserRole();
    console.log(`Role: ${role} Required Role: ${requiredRole}`)

    if (!authenticated) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && role !== requiredRole) {
        return <Navigate to="/login" />;
    }
    return <Outlet />;
};

export default PrivateRoute;
