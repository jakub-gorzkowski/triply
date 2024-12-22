import Sidebar from "../general/Sidebar.jsx";
import PlaceHeader from "./PlaceHeader.jsx";
import Ratings from "./Ratings.jsx";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewList.jsx";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticationService from "../service/AuthenticationService";

const Place = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar/>
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto">
                    <PlaceHeader/>
                    <div className="flex gap-8">
                        <div className="flex-1">
                            <ReviewForm/>
                            <ReviewList/>
                        </div>
                        <Ratings/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Place;