import { Star } from 'lucide-react';
import { useState } from 'react';
function ReviewForm() {

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setRating(0);
            setReviewText('');
        }, 1000);
    };

    return (
        <>
            <div className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Write a Review</h3>
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
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        placeholder="Share your experience..."
                        className="w-full h-20 p-3 border border-gray-200 rounded-lg focus:border-rose-500 focus:ring-1 focus:ring-rose-500 resize-none"
                    />
                    <button
                        type="submit"
                        disabled={isSubmitting || rating === 0 || !reviewText.trim()}
                        className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </form>
            </div>
        </>
    );
}

export default ReviewForm;