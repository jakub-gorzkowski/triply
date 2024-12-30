import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080';

const PlaceCard = ({ name, address, category, image_url }) => {
    const [imageLoading, setImageLoading] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [imageBlob, setImageBlob] = useState(null);

    useEffect(() => {
        if (!image_url) {
            setImageLoading(false);
            return;
        }

        const fetchImage = async () => {
            const auth = AuthenticationService.getCurrentUser();
            if (!auth) return;

            try {
                setImageLoading(true);
                setImageError(false);

                const fileName = image_url.split('/').pop();

                const response = await axios.get(`${API_BASE_URL}/data/uploads/places/${fileName}`, {
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                });

                const imageUrl = URL.createObjectURL(response.data);
                setImageBlob(imageUrl);
                setImageError(false);
            } catch (err) {
                console.error('Error loading image:', err);
                setImageError(true);
            } finally {
                setImageLoading(false);
            }
        };

        fetchImage();

        return () => {
            if (imageBlob) {
                URL.revokeObjectURL(imageBlob);
            }
        };
    }, [image_url]);

    return (
        <div className="bg-white rounded-xl border border-gray-100 hover:border-rose-200 transition-colors cursor-pointer group overflow-hidden">
            <div className="aspect-video w-full bg-gray-100 relative">
                {imageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                    </div>
                ) : imageError || !imageBlob ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No image available</span>
                    </div>
                ) : (
                    <img
                        src={imageBlob}
                        alt={name}
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                    />
                )}
            </div>
            <div className="p-4 space-y-2">
                <h3 className="text-gray-900 font-medium">{name}</h3>
                <div className="space-y-1">
                    <p className="text-sm text-gray-500">{address}</p>
                    <p className="text-sm text-gray-400">{category}</p>
                </div>
            </div>
        </div>
    );
};

export default PlaceCard;