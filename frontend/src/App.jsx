import {Route, Routes} from "react-router-dom";
import LoggedRoutes from "./component/route/LoggedRoutes.jsx";
import PrivateRoutes from "./component/route/PrivateRoutes.jsx";
import Register from "./component/authentication/Register.jsx";
import Login from "./component/authentication/Login.jsx";
import Home from "./component/hub/Home.jsx";
import Place from "./component/place/Place.jsx";
import Trips from "./component/trips/Trips.jsx";
import AccountSettings from "./component/settings/AccountSettings.jsx";
import Trip from "./component/trip/Trip.jsx";
import Places from "./component/places/Places.jsx";
import Requests from "./component/administration/Requests.jsx";

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
                    <Route path={'/requests'} element={<Requests/>}/>
                    <Route path={'/settings'} element={<AccountSettings/>}/>
                </Route>
            </Routes>
        </>
    );
}

export default App;