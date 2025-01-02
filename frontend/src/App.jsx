import {Route, Routes} from "react-router-dom";
import LoggedRoutes from "./component/route/LoggedRoutes";
import PrivateRoutes from "./component/route/PrivateRoutes";
import AdminRoutes from "./component/route/AdminRoutes";
import Register from "./component/authentication/Register";
import Login from "./component/authentication/Login";
import Home from "./component/hub/Home";
import Place from "./component/place/Place";
import Trips from "./component/trips/Trips";
import AccountSettings from "./component/settings/AccountSettings";
import Trip from "./component/trip/Trip";
import Places from "./component/places/Places";
import Requests from "./component/administration/Requests";

function App() {
    return (
        <>
            <Routes>
                <Route element={<LoggedRoutes/>}>
                    <Route path={'/register'} element={<Register/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                </Route>
                <Route element={<PrivateRoutes/>}>
                    <Route path={'/'} element={<Home/>}/>
                    <Route path={'/trip/:id'} element={<Trip/>}/>
                    <Route path={'/trips'} element={<Trips/>}/>
                    <Route path={'/place/:id'} element={<Place/>}/>
                    <Route path={'/places'} element={<Places/>}/>
                    <Route path={'/settings'} element={<AccountSettings/>}/>

                    <Route element={<AdminRoutes/>}>
                        <Route path={'/requests'} element={<Requests/>}/>
                    </Route>
                </Route>
            </Routes>
        </>
    );
}

export default App;