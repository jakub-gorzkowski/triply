import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080';

function PlacesList({ tripId, refreshTrigger, onPlaceRemoved, onPlaceClick }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [placeImages, setPlaceImages] = useState({});

    const fetchPlaces = async (pageNumber) => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/api/v1/trip/places`, {
                params: {
                    id: tripId,
                    offset: pageNumber,
                    size: 5
                },
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });

            const newPlaces = response.data.content;

            const imagePromises = newPlaces.map(async place => {
                if (!place.image_url) return null;
                try {
                    const fileName = place.image_url.split('/').pop();
                    const imageResponse = await axios.get(
                        `${API_BASE_URL}/data/uploads/places/${fileName}`,
                        {
                            responseType: 'blob',
                            headers: {
                                'Authorization': `Bearer ${auth.token}`
                            }
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

            if (pageNumber === 0) {
                setPlaces(newPlaces);
            } else {
                setPlaces(prev => [...prev, ...newPlaces]);
            }

            setHasMore(newPlaces.length === 5);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load places');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces(0);
        return () => {
            Object.values(placeImages).forEach(url => {
                URL.revokeObjectURL(url);
            });
        };
    }, [tripId, refreshTrigger]);

    const handleRemovePlace = async (placeId) => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            await axios.patch(`${API_BASE_URL}/api/v1/trip/remove-place`, null, {
                params: {
                    trip_id: tripId,
                    place_id: placeId
                },
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            setPlaces(prev => prev.filter(place => place.id !== placeId));

            if (placeImages[placeId]) {
                URL.revokeObjectURL(placeImages[placeId]);
                setPlaceImages(prev => {
                    const newImages = { ...prev };
                    delete newImages[placeId];
                    return newImages;
                });
            }

            onPlaceRemoved();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove place');
        }
    };

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchPlaces(nextPage);
    };

    return (
        <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Places</h3>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {places.map((place) => (
                    <div
                        key={place.id}
                        id={`place-${place.id}`}
                        onClick={() => onPlaceClick(place.id)}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:border-rose-200 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden">
                                {placeImages[place.id] ? (
                                    <img
                                        src={placeImages[place.id]}
                                        alt={place.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100" />
                                )}
                            </div>
                            <div>
                                <h4 className="font-medium text-gray-900">{place.name}</h4>
                                <p className="text-gray-500 text-sm">{place.address}</p>
                            </div>
                        </div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemovePlace(place.id);
                            }}
                            className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                ))}

                {loading ? (
                    <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                ) : hasMore && (
                    <button
                        onClick={loadMore}
                        className="w-full py-3 bg-white text-rose-600 rounded-xl hover:bg-rose-50 font-medium border border-gray-100 transition-all"
                    >
                        Load more places
                    </button>
                )}
            </div>
        </div>
    );
}

export default PlacesList;