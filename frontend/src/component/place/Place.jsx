import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../general/Sidebar.jsx";
import PlaceHeader from "./PlaceHeader.jsx";
import Ratings from "./Ratings.jsx";
import ReviewForm from "./ReviewForm.jsx";
import ReviewList from "./ReviewList.jsx";
import AuthenticationService from "../service/AuthenticationService";
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const Place = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [placeData, setPlaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviewsUpdated, setReviewsUpdated] = useState(0);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }

        const fetchPlaceData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/place/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });
                setPlaceData(response.data);
                setError(null);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load place details');
                console.error('Error fetching place details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaceData();
    }, [navigate, id]);

    const handleReviewAdded = () => {
        setReviewsUpdated(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 overflow-hidden">
                <Sidebar currentPage='places'/>
                <div className="flex-1 w-full overflow-x-hidden flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-50 overflow-hidden">
                <Sidebar currentPage='places'/>
                <div className="flex-1 w-full overflow-x-hidden flex items-center justify-center">
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50 overflow-hidden">
            <Sidebar currentPage='places'/>
            <div className="flex-1 w-full overflow-x-hidden">
                <div className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white shadow-sm">
                    <div className="px-4 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 pt-20 pb-24">
                    <PlaceHeader place={placeData} />
                    <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 order-2 md:order-1">
                            <ReviewForm placeId={id} onReviewAdded={handleReviewAdded} />
                            <ReviewList placeId={id} refreshTrigger={reviewsUpdated} />
                        </div>
                        <div className="order-1 md:order-2">
                            <Ratings placeId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Place;