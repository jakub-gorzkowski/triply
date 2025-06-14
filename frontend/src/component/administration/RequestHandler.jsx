import { Pencil, Check, X } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080';

function RequestHandler({ place, imageUrl, onEdit, onSuccess }) {
    const handleApprove = async () => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            await axios.patch(
                `${API_BASE_URL}/api/v1/place/approve`,
                null,
                {
                    headers: { 'Authorization': `Bearer ${auth.token}` },
                    params: { id: place.id }
                }
            );
            onSuccess();
        } catch (err) {
            console.error('Error approving place:', err);
        }
    };

    const handleRemove = async () => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            await axios.delete(
                `${API_BASE_URL}/api/v1/place/remove`,
                {
                    headers: { 'Authorization': `Bearer ${auth.token}` },
                    params: { id: place.id }
                }
            );
            onSuccess();
        } catch (err) {
            console.error('Error removing place:', err);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-8">
                <div className="w-32 h-32 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={place.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100" />
                    )}
                </div>
                <div className="px-6">
                    <h4 className="font-medium text-gray-900">{place.name}</h4>
                    <p className="text-gray-500 text-sm mt-2">{place.address}</p>
                    <p className="text-gray-500 text-sm mt-2">{place.description}</p>
                </div>
            </div>

            <div className="flex items-center gap-2 ml-8">
                <button
                    onClick={handleApprove}
                    className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                    title="Approve"
                >
                    <Check className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onEdit(place)}
                    className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Edit"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={handleRemove}
                    className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Remove"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

export default RequestHandler;