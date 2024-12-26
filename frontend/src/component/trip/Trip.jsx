import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../general/Sidebar.jsx";
import TripHeader from "./TripHeader.jsx";
import PlacesList from "./PlacesList.jsx";

const Trip = () => {
    const navigate = useNavigate();

    useEffect(() => {
    }, [navigate]);

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage="trips"/>
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto pt-12">
                    <TripHeader/>
                    <PlacesList/>
                </div>
            </div>
        </div>
    );
};

export default Trip;