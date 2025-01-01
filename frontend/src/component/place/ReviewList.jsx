import { Star } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';

const API_BASE_URL = 'http://localhost:8080/api/v1';

function ReviewList({ placeId, refreshTrigger }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const fetchReviews = async (pageNumber) => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        const tokenData = JSON.parse(atob(auth.token.split('.')[1]));

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(`${API_BASE_URL}/place/reviews`, {
                params: {
                    id: placeId,
                    offset: pageNumber,
                    size: 10
                },
                headers: { 'Authorization': `Bearer ${auth.token}` }
            });

            if (pageNumber === 0) {
                setReviews(response.data.content);
            } else {
                setReviews(prev => [...prev, ...response.data.content]);
            }

            setHasMore(response.data.content.length === 10);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load reviews');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews(0);
    }, [placeId, refreshTrigger]);

    const loadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchReviews(nextPage);
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                    {error}
                </div>
            )}

            {reviews.map((review, index) => (
                <div key={index} className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <span className="font-medium text-gray-900">{review.username}</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-gray-900">{review.rating}</span>
                            <Star className="w-5 h-5 fill-current text-amber-400"/>
                        </div>
                    </div>
                    <p className="text-gray-600">{review.content}</p>
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
                    Load more reviews
                </button>
            )}
        </>
    );
}

export default ReviewList;