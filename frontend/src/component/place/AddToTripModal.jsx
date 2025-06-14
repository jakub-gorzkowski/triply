import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import TripsList from '../general/TripsList';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AddToTripModal = ({ isOpen, onClose, placeId }) => {
    const [selectedTripId, setSelectedTripId] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleAddToTrip = async () => {
        if (!selectedTripId) {
            setError('Please select a trip first');
            return;
        }

        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        setIsSubmitting(true);
        setError(null);

        try {
            await axios.patch(
                `${API_BASE_URL}/trip/add-place`,
                null,
                {
                    params: {
                        trip_id: selectedTripId,
                        place_id: placeId
                    },
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            );
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add place to trip');
            console.error('Error adding place to trip:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-end md:items-center justify-center z-50">
            <div className="bg-white rounded-t-xl md:rounded-xl w-full md:max-w-3xl p-4 md:p-6 relative flex flex-col">
                <div className="md:hidden mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                </div>

                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Add to trip</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="flex-1 overflow-y-auto mb-6">
                    <TripsList
                        isPast={false}
                        selectedTripId={selectedTripId}
                        onTripSelect={(tripId) => setSelectedTripId(tripId)}
                        isModal={true}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddToTrip}
                        className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting || !selectedTripId}
                    >
                        {isSubmitting ? 'Adding...' : 'Add to trip'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddToTripModal;