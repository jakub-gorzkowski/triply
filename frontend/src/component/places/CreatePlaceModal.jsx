import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const categories = [
    { id: 1, name: 'Monument' },
    { id: 2, name: 'Hotel' },
    { id: 3, name: 'Eatery' }
];

const CreatePlaceModal = ({ isOpen, onClose, onPlaceCreated }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: '',
        categoryId: '',
        photo: null
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        if (!formData.name.trim() || !formData.address.trim() || !formData.categoryId || !formData.photo) {
            setError('Please fill in all required fields and add a photo');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const formPayload = new FormData();
            formPayload.append('name', formData.name.trim());
            formPayload.append('description', formData.description.trim());
            formPayload.append('address', formData.address.trim());
            formPayload.append('category_id', formData.categoryId);
            formPayload.append('image', formData.photo);

            const response = await axios.post(
                `${API_BASE_URL}/place/add`,
                formPayload,
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            if (response.data) {
                setFormData({
                    name: '',
                    description: '',
                    address: '',
                    categoryId: '',
                    photo: null
                });

                if (onPlaceCreated) {
                    onPlaceCreated(response.data);
                }

                onClose();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create place');
            console.error('Error creating place:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormData(prev => ({ ...prev, photo: file }));
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

                <h2 className="text-xl font-bold text-gray-900 mb-6">Add place</h2>

                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors min-h-[100px]"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                className="w-full p-3 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 outline-none transition-colors text-left bg-white flex items-center justify-between"
                                disabled={isSubmitting}
                            >
                                <span className="text-gray-900">
                                    {categories.find(c => c.id === formData.categoryId)?.name || 'Select category'}
                                </span>
                                <ChevronDown className="w-5 h-5 text-gray-500" />
                            </button>

                            {isCategoryOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsCategoryOpen(false)}
                                    />
                                    <div className="absolute w-full mt-1 py-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                type="button"
                                                onClick={() => {
                                                    setFormData({ ...formData, categoryId: category.id });
                                                    setIsCategoryOpen(false);
                                                }}
                                                className={`w-full px-3 py-2 text-left hover:bg-rose-50 transition-colors ${
                                                    formData.categoryId === category.id ? 'bg-rose-50 text-rose-600' : 'text-gray-900'
                                                }`}
                                            >
                                                {category.name}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500">
                                {formData.photo ? formData.photo.name : 'No photo selected'}
                            </span>
                            <button
                                type="button"
                                onClick={() => document.getElementById('photo-input').click()}
                                className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
                                disabled={isSubmitting}
                            >
                                Add photo
                            </button>
                            <input
                                id="photo-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-rose-600 text-white rounded-lg py-3 font-medium hover:bg-rose-700 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Adding...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreatePlaceModal;