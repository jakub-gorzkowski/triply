import { Navigate, Outlet } from "react-router-dom";
import AuthenticationService from "../service/AuthenticationService";

const AdminRoutes = () => {
    const auth = AuthenticationService.getCurrentUser();
    if (!auth) return <Navigate to="/login" />;

    const token = auth.token;
    if (AuthenticationService.isTokenExpired(token)) {
        AuthenticationService.logout();
        return <Navigate to="/login" />;
    }

    const tokenData = JSON.parse(atob(token.split('.')[1]));
    if (!tokenData.roles?.includes('ROLE_ADMIN')) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default AdminRoutes;