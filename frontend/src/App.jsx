import {Route, Routes} from "react-router-dom";
import LoggedRoutes from "./component/route/LoggedRoutes.jsx";
import Register from "./component/authentication/Register.jsx";
import Login from "./component/authentication/Login.jsx";
import PrivateRoutes from "./component/route/PrivateRoutes.jsx";
import Place from "./component/place/Place.jsx";

function App() {
    return (
        <>
            <Routes>
                <Route element={<LoggedRoutes/>}>
                    <Route path={'/register'} element={<Register/>}/>
                    <Route path={'/login'} element={<Login/>}/>
                </Route>
                <Route element={<PrivateRoutes/>}>
                    <Route path={'/'} element={<Place/>}/> {/*temporary solution*/}
                </Route>
            </Routes>
        </>
    );
}

export default App;