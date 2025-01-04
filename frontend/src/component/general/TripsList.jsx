import { useState, useEffect } from 'react';
import { TreePalm } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';
const PAGE_SIZE = 8;

const TripsList = ({ count, isPast = false, selectedTripId, onTripSelect, isModal = false }) => {
    const navigate = useNavigate();
    const [trips, setTrips] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

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
    }, [currentPage, isPast]);

    const fetchTrips = async (token) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/trip/${isPast ? 'past' : 'upcoming'}`, {
                params: {
                    offset: currentPage,
                    size: PAGE_SIZE
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.content.length === 0 && currentPage > 0) {
                setCurrentPage(prev => prev - 1);
                return;
            }

            setTrips(response.data.content);
            setTotalPages(Math.ceil(response.data.totalElements / PAGE_SIZE));
            setError(null);
        } catch (err) {
            setError(`Failed to load ${isPast ? 'past' : 'upcoming'} trips`);
            console.error('Error fetching trips:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTripClick = (tripId) => {
        if (isModal) {
            onTripSelect?.(tripId);
        } else {
            navigate(`/trip/${tripId}`);
        }
    };

    if (isLoading) {
        return (
            <div className="col-span-full flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
            </div>
        );
    }

    if (trips.length === 0) {
        return (
            <div className="col-span-full text-center text-gray-500 py-12">
                No {isPast ? 'past' : 'ongoing'} trips found.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {trips.map((trip) => (
                    <div
                        key={trip.id}
                        onClick={() => handleTripClick(trip.id)}
                        className={`bg-white rounded-xl p-4 md:p-6 border transition-colors cursor-pointer group
                        ${selectedTripId === trip.id && isModal
                            ? 'border-rose-500 bg-rose-50'
                            : 'border-gray-100 hover:border-rose-200'}`}
                    >
                        <div className="mb-3 md:mb-4">
                            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center transition-colors
                            ${selectedTripId === trip.id && isModal
                                ? 'bg-rose-100'
                                : 'bg-sky-50 group-hover:bg-sky-100'}`}
                            >
                                <TreePalm className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                            </div>
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <h3 className="text-sm md:text-base text-gray-900 font-medium">{trip.name}</h3>
                            <div className="space-y-0.5 md:space-y-1">
                                <div className="text-xs md:text-sm text-gray-500">
                                    <span className="font-medium">From:</span>{' '}
                                    {formatDate(trip.start_date)}
                                </div>
                                <div className="text-xs md:text-sm text-gray-500">
                                    <span className="font-medium">To:</span>{' '}
                                    {formatDate(trip.end_date)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center gap-1 pt-4">
                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index)}
                            className={`px-3 py-1 rounded-md transition-colors ${
                                currentPage === index
                                    ? 'bg-rose-500 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TripsList;