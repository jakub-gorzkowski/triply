import { useState, useEffect } from 'react';
import { Plane } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const UpcomingTrips = ({ count = 3 }) => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;
        fetchTrips(auth.token);
    }, [count]);

    const formatDate = (dateArray) => {
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const fetchTrips = async (token) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/trip/upcoming`, {
                params: {
                    offset: 0,
                    size: count
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setTrips(response.data.content);
            setError(null);
        } catch (err) {
            setError('Failed to load upcoming trips');
            console.error('Error fetching trips:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your next trips</h2>
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}
            {isLoading ? (
                <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
            ) : trips.length === 0 ? (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500">
                    No upcoming trips planned.
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-4">
                    {trips.map((trip) => (
                        <div key={trip.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
                            <div className="h-24 w-full rounded-lg mb-4 bg-gray-50 flex items-center justify-center">
                                <Plane className="w-12 h-12 text-rose-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-4">{trip.name}</h3>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">From:</span>
                                    <span className="text-gray-700">{formatDate(trip.start_date)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">To:</span>
                                    <span className="text-gray-700">{formatDate(trip.end_date)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UpcomingTrips;