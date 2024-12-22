import { Navigate, Outlet } from "react-router-dom";
import AuthenticationService from "../service/AuthenticationService";

const PrivateRoutes = () => {
    const auth = AuthenticationService.getCurrentUser();
    if (!auth) return <Navigate to="/login" />;

    const token = auth.token;
    if (AuthenticationService.isTokenExpired(token)) {
        AuthenticationService.logout();
        return <Navigate to="/login" />;
    }

    return <Outlet />;
};
export default PrivateRoutes;