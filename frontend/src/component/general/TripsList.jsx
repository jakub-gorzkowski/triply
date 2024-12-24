import { useState, useEffect } from 'react';
import { TreePalm } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const TripsList = ({ count, isPast = false }) => {
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const formatDate = (dateArray) => {
        const [year, month, day] = dateArray;
        return new Date(year, month - 1, day).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;
        fetchTrips(auth.token);
    }, [count, isPast]);

    const fetchTrips = async (token) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/trip/${isPast ? 'past' : 'upcoming'}`, {
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
            setError(`Failed to load ${isPast ? 'past' : 'upcoming'} trips`);
            console.error('Error fetching trips:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoading ? (
                <div className="col-span-full flex items-center justify-center h-48">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                </div>
            ) : error ? (
                <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            ) : trips.length === 0 ? (
                <div className="col-span-full text-center text-gray-500 py-12">
                    No {isPast ? 'past' : 'ongoing'} trips found.
                </div>
            ) : (
                trips.map((trip, index) => (
                    <div
                        key={trip.id || index}
                        className="bg-white rounded-xl p-6 border border-gray-100 hover:border-rose-200 transition-colors cursor-pointer group"
                    >
                        <div className="mb-4">
                            <div className="w-12 h-12 bg-sky-50 rounded-lg flex items-center justify-center group-hover:bg-sky-100 transition-colors">
                                <TreePalm className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-gray-900 font-medium">{trip.name}</h3>
                            <div className="space-y-1">
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">From:</span>{' '}
                                    {formatDate(trip.start_date)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    <span className="font-medium">To:</span>{' '}
                                    {formatDate(trip.end_date)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default TripsList;