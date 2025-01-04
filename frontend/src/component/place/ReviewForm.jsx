import { Star } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

function ReviewForm({ placeId, onReviewAdded }) {
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        setIsSubmitting(true);
        setError(null);

        const tokenData = JSON.parse(atob(auth.token.split('.')[1]));

        try {
            const response = await axios.post(`${API_BASE_URL}/review/add`, {
                user_email: tokenData.sub,
                place_id: placeId,
                rating,
                content
            }, {
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });

            setRating(0);
            setContent('');
            if (onReviewAdded) {
                onReviewAdded(response.data);
            }
            window.dispatchEvent(new Event('refreshRatings'));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Write a Review</h3>
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none">
                            <Star
                                className={`w-6 h-6 ${rating >= star ? 'fill-current text-amber-400' : 'text-gray-300'}`}
                            />
                        </button>
                    ))}
                </div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                />
                <button
                    type="submit"
                    disabled={isSubmitting || rating === 0 || !content.trim()}
                    className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default ReviewForm;