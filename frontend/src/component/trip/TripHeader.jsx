import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem'
};

function TripHeader({ trip, onDelete, refreshTrigger, selectedPlaceId }) {
    const [places, setPlaces] = useState([]);
    const [placeImages, setPlaceImages] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlaces = async () => {
            const auth = AuthenticationService.getCurrentUser();
            if (!auth) return;

            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/trip/places`, {
                    params: {
                        id: trip.id,
                        offset: 0,
                        size: 10
                    },
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });

                const placesData = response.data.content;
                setPlaces(placesData);

                if (placesData.length > 0) {
                    const center = placesData.reduce(
                        (acc, place) => ({
                            lat: acc.lat + Number(place.latitude) / placesData.length,
                            lng: acc.lng + Number(place.longitude) / placesData.length
                        }),
                        { lat: 0, lng: 0 }
                    );
                    setMapCenter(center);
                }

                const imagePromises = placesData.slice(0, 4).map(async place => {
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
                setPlaceImages(images.filter(img => img !== null));
            } catch (err) {
                console.error('Error fetching places:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlaces();

        return () => {
            placeImages.forEach(image => {
                if (image?.url) {
                    URL.revokeObjectURL(image.url);
                }
            });
        };
    }, [trip?.id, refreshTrigger]);

    useEffect(() => {
        if (selectedPlaceId && places.length > 0) {
            const selectedPlace = places.find(place => place.id === selectedPlaceId);
            if (selectedPlace) {
                setMapCenter({
                    lat: Number(selectedPlace.latitude),
                    lng: Number(selectedPlace.longitude)
                });
            }
        }
    }, [selectedPlaceId, places]);

    if (!trip) return null;

    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{trip.name}</h2>
                    <div className="space-y-1">
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">From:</span>{' '}
                            {new Date(trip.start_date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </div>
                        <div className="text-sm text-gray-500">
                            <span className="font-medium">To:</span>{' '}
                            {new Date(trip.end_date).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onDelete}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors"
                    >
                        <X className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    {placeImages.length > 0 ? (
                        placeImages.map((image, index) => (
                            <div
                                key={image.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors group overflow-hidden"
                            >
                                <div className="aspect-video w-full h-full">
                                    <img
                                        src={image.url}
                                        alt={`Trip place ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        Array.from({ length: 4 }).map((_, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="aspect-video w-full flex items-center justify-center bg-gray-100">
                                    <span className="text-gray-400">No image</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors overflow-hidden">
                    <div className="aspect-video w-full h-full">
                        {!isLoading && places.length > 0 ? (
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={12}
                                >
                                    {places.map((place) => (
                                        <MarkerF
                                            key={place.id}
                                            position={{
                                                lat: Number(place.latitude),
                                                lng: Number(place.longitude)
                                            }}
                                            animation={selectedPlaceId === place.id ? google.maps.Animation.BOUNCE : null}
                                        />
                                    ))}
                                </GoogleMap>
                            </LoadScript>
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No places in trip</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TripHeader;