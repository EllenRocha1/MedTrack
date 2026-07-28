// import { Navigate, Outlet } from "react-router-dom";
// import { isAuthenticated, getUserRole } from "../Auth/AuthToken";
//
// const PrivateRoute = ({ requiredRole }) => {
//     const authenticated = isAuthenticated();
//     const role = getUserRole();
//
//     if (!authenticated) {
//         return <Navigate to="/login" />;
//     }
//
//     // Verificando se o papel do usuário está na lista de papéis permitidos
//     if (Array.isArray(requiredRole)) {
//         if (!requiredRole.includes(role)) {
//             return <Navigate to="/login" />;
//         }
//     } else if (role !== requiredRole) {
//         return <Navigate to="/login" />;
//     }
//
//     return <Outlet />;
// };
//
// export default PrivateRoute;
