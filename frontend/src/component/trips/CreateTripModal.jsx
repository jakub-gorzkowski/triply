import { useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from "../service/AuthenticationService.jsx";

const API_BASE_URL = 'http://localhost:8080/api/v1';

const CreateTripModal = ({ isOpen, onClose, onTripCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        photo: null
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        // Basic validation
        if (!formData.name.trim() || !formData.startDate || !formData.endDate) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const tripRequest = {
                name: formData.name.trim(),
                start_date: formData.startDate,
                end_date: formData.endDate
            };

            const response = await axios.post(
                `${API_BASE_URL}/trip/add`,
                tripRequest,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                // Reset form
                setFormData({
                    name: '',
                    startDate: '',
                    endDate: '',
                    photo: null
                });

                // Notify parent component about successful creation
                if (onTripCreated) {
                    onTripCreated(response.data);
                }

                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create trip');
            console.error('Error creating trip:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Create trip</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="date"
                            placeholder="Start date"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            disabled={isSubmitting}
                        />
                        <input
                            type="date"
                            placeholder="End date"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white rounded-lg py-3 font-medium hover:bg-rose-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Creating...' : 'Create'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateTripModal;