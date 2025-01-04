import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import RequestHandler from './RequestHandler';

const API_BASE_URL = 'http://localhost:8080';

function RequestPlaces({ onEdit }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [placeImages, setPlaceImages] = useState({});

    const fetchPlaces = async () => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            const response = await axios.get(`${API_BASE_URL}/api/v1/place/unapproved`, {
                headers: { 'Authorization': `Bearer ${auth.token}` },
                params: { offset: currentPage, size: 5 }
            });

            const newPlaces = response.data.content;
            setPlaces(newPlaces);
            setTotalPages(response.data.totalPages);
            setError(null);

            const imagePromises = newPlaces.map(async place => {
                if (!place.image_url) return null;
                try {
                    const fileName = place.image_url.split('/').pop();
                    const imageResponse = await axios.get(
                        `${API_BASE_URL}/data/uploads/places/${fileName}`,
                        {
                            responseType: 'blob',
                            headers: { 'Authorization': `Bearer ${auth.token}` }
                        }
                    );
                    return {
                        id: place.id,
                        url: URL.createObjectURL(imageResponse.data)
                    };
                } catch (err) {
                    console.error('Error loading image:', err);
                    return null;
                }
            });

            const images = await Promise.all(imagePromises);
            const newImages = {};
            images.forEach(img => {
                if (img) {
                    newImages[img.id] = img.url;
                }
            });

            setPlaceImages(prev => ({
                ...prev,
                ...newImages
            }));
        } catch (err) {
            setError('Failed to fetch places');
            console.error('Error fetching places:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
        return () => {
            Object.values(placeImages).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, [currentPage]);

    if (loading) {
        return (
            <div className="animate-pulse space-y-4">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-gray-100 h-40 rounded-xl"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {places.map((place) => (
                <RequestHandler
                    key={place.id}
                    place={place}
                    imageUrl={placeImages[place.id]}
                    onEdit={onEdit}
                    onSuccess={fetchPlaces}
                />
            ))}

            {places.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    No pending requests
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i)}
                            className={`px-3 py-1 rounded ${
                                currentPage === i
                                    ? 'bg-rose-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RequestPlaces;