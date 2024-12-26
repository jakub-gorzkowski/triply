import {Route, Routes} from "react-router-dom";
import LoggedRoutes from "./component/route/LoggedRoutes.jsx";
import Register from "./component/authentication/Register.jsx";
import Login from "./component/authentication/Login.jsx";
import PrivateRoutes from "./component/route/PrivateRoutes.jsx";
import Place from "./component/place/Place.jsx";
import Home from "./component/hub/Home.jsx";
import Trips from "./component/trips/Trips.jsx";
import AccountSettings from "./component/settings/AccountSettings.jsx";
import Trip from "./component/trip/Trip.jsx";

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
                    <Route path={'/trip'} element={<Trip/>}/>
                    <Route path={'/trips'} element={<Trips/>}/>
                    <Route path={'/place'} element={<Place/>}/>
                    <Route path={'/settings'} element={<AccountSettings/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;