import { Star } from 'lucide-react';

function ReviewList() {
    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Reviews</h3>
            </div>

            <div className="bg-white rounded-xl p-6 mb-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <span className="font-medium text-gray-900">Username</span>
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-gray-900">5.0</span>
                        <Star className="w-5 h-5 fill-current text-amber-400"/>
                    </div>
                </div>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                    nisi ut aliquip ex ea commodo consequat.
                </p>
            </div>

            <button
                className="w-full py-3 bg-white text-rose-600 rounded-xl hover:bg-rose-50 font-medium border border-gray-100 transition-all">
                Load more reviews
            </button>
        </>
    );
}
export default ReviewList;