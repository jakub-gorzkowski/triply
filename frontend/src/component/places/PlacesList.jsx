import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import PlaceCard from './PlaceCard';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const PLACE_LIMITS = {
    popular: 12,
    latest: 24
};

const PlacesList = ({ type }) => {
    const [places, setPlaces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;
        fetchPlaces(auth.token);
    }, [type]);

    const fetchPlaces = async (token) => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${API_BASE_URL}/place/${type}`, {
                params: {
                    offset: 0,
                    size: PLACE_LIMITS[type]
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setPlaces(response.data.content);
            setError(null);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to load ${type} places`);
            console.error('Error fetching places:', err);
        } finally {
            setIsLoading(false);
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

    if (places.length === 0) {
        return (
            <div className="col-span-full text-center text-gray-500 py-12">
                No places found.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {places.map((place) => (
                <PlaceCard key={place.id} {...place} />
            ))}
        </div>
    );
};

export default PlacesList;