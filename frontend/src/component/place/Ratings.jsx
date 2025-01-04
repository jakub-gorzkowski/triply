import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

function Ratings({ placeId }) {
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRatings = async () => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        const tokenData = JSON.parse(atob(auth.token.split('.')[1]));

        try {
            const response = await axios.get(`${API_BASE_URL}/place/ratings`, {
                params: { id: placeId },
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });
            setRatings(response.data);
        } catch (err) {
            console.error('Error fetching ratings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [placeId]);

    useEffect(() => {
        const handleRefresh = () => {
            fetchRatings();
        };

        window.addEventListener('refreshRatings', handleRefresh);
        return () => window.removeEventListener('refreshRatings', handleRefresh);
    }, []);

    if (loading) {
        return (
            <div className="w-full md:w-80 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500 mx-auto"/>
            </div>
        );
    }

    return (
        <div className="w-full md:w-80">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Users ratings</h3>
                <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rate) => {
                        const ratingData = ratings.find(r => r.rate === rate.toString()) || { percentage: 0 };
                        return (
                            <div key={rate} className="flex items-center">
                                <span className="w-4 text-gray-700 font-medium">{rate}</span>
                                <div className="flex text-amber-400 mx-2">
                                    <Star className="w-5 h-5 fill-current"/>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-2 bg-rose-500 rounded-full"
                                            style={{width: `${ratingData.percentage}%`}}
                                        />
                                    </div>
                                </div>
                                <span className="ml-2 text-gray-600 w-12 text-right font-medium">
                                   {ratingData.percentage.toFixed(1)}%
                               </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Ratings;