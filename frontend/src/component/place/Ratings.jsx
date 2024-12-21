import { Star } from 'lucide-react';

function Ratings() {
    return (
        <>
            <div className="w-80">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Users ratings</h3>
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map(rating => (
                            <div key={rating} className="flex items-center">
                                <span className="w-4 text-gray-700 font-medium">{rating}</span>
                                <div className="flex text-amber-400 mx-2">
                                    <Star className="w-5 h-5 fill-current"/>
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 bg-gray-100 rounded-full">
                                        <div
                                            className="h-2 bg-rose-500 rounded-full"
                                            style={{width: rating === 5 ? '75%' : rating === 4 ? '10%' : '5%'}}
                                        />
                                    </div>
                                </div>
                                <span className="ml-2 text-gray-600 w-12 text-right font-medium">
                                    {rating === 5 ? '75%' : rating === 4 ? '10%' : '5%'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Ratings;