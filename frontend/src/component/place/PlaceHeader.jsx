import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import AddToTripModal from './AddToTripModal';

const API_BASE_URL = 'http://localhost:8080';

const mapContainerStyle = {
    width: '100%',
    height: '100%',
    borderRadius: '0.5rem'
};

function PlaceHeader({ place }) {
    const [imageBlob, setImageBlob] = useState(null);
    const [coordinates, setCoordinates] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!place?.image_url) return;

        const fetchImage = async () => {
            const auth = AuthenticationService.getCurrentUser();
            if (!auth) return;

            try {
                const fileName = place.image_url.split('/').pop();
                const response = await axios.get(`${API_BASE_URL}/data/uploads/places/${fileName}`, {
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });

                const imageUrl = URL.createObjectURL(response.data);
                setImageBlob(imageUrl);
            } catch (err) {
                console.error('Error loading image:', err);
            }
        };

        fetchImage();

        if (place?.latitude && place?.longitude) {
            setCoordinates({
                lat: place.latitude,
                lng: place.longitude
            });
            setIsLoading(false);
        }

        return () => {
            if (imageBlob) {
                URL.revokeObjectURL(imageBlob);
            }
        };
    }, [place?.image_url, place?.latitude, place?.longitude]);

    if (!place) return null;

    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{place.name}</h2>
                    <p className="text-teal-600">{place.address}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-sm transition-colors"
                >
                    <Plus className="w-5 h-5"/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors group overflow-hidden">
                    <div className="aspect-video w-full h-full">
                        {imageBlob ? (
                            <img
                                src={imageBlob}
                                alt={place.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <span className="text-gray-400">No image available</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition-colors overflow-hidden">
                    <div className="aspect-video w-full h-full">
                        {!isLoading && (
                            <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_API_KEY}>
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={coordinates || { lat: 0, lng: 0 }}
                                    zoom={18}
                                >
                                    {coordinates && (
                                        <MarkerF position={coordinates} />
                                    )}
                                </GoogleMap>
                            </LoadScript>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-8 text-gray-600 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                {place.description || 'No description available.'}
            </div>

            <AddToTripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                placeId={place.id}
            />
        </>
    );
}

export default PlaceHeader;