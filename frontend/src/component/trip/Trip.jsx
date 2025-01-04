import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from "../general/Sidebar.jsx";
import TripHeader from "./TripHeader.jsx";
import PlacesList from "./PlacesList.jsx";
import AuthenticationService from "../service/AuthenticationService";

const API_BASE_URL = 'http://localhost:8080';

const Trip = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [tripData, setTripData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [placesUpdated, setPlacesUpdated] = useState(0);
    const [selectedPlaceId, setSelectedPlaceId] = useState(null);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }

        const fetchTripData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/trip/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });
                setTripData(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load trip details');
                console.error('Error fetching trip details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTripData();
    }, [navigate, id]);

    const handleTripDelete = async () => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }

        try {
            await axios.delete(`${API_BASE_URL}/api/v1/trip/remove`, {
                params: { id },
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            navigate('/trips');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete trip');
            console.error('Error deleting trip:', err);
        }
    };

    const handlePlaceRemoved = () => {
        setPlacesUpdated(prev => prev + 1);
    };

    const handlePlaceClick = (placeId) => {
        setSelectedPlaceId(placeId);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
                <Sidebar currentPage='trips'/>
                <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
                <Sidebar currentPage='trips'/>
                <div className="flex-1 px-4 flex items-center justify-center">
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage="trips"/>
            <div className="flex-1 relative overflow-x-hidden">
                <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-sm">
                    <div className="px-4 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 pt-20 pb-24">
                    {tripData && (
                        <>
                            <TripHeader
                                trip={tripData}
                                onDelete={handleTripDelete}
                                refreshTrigger={placesUpdated}
                                selectedPlaceId={selectedPlaceId}
                            />
                            <PlacesList
                                tripId={id}
                                refreshTrigger={placesUpdated}
                                onPlaceRemoved={handlePlaceRemoved}
                                onPlaceClick={handlePlaceClick}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Trip;