import { Navigate, Outlet } from "react-router-dom";
import AuthenticationService from "../service/AuthenticationService";

const LoggedRoutes = () => {
    let auth = AuthenticationService.getCurrentUser();
    return !auth ? <Outlet /> : <Navigate to = '/' replace />;
};
export default LoggedRoutes;