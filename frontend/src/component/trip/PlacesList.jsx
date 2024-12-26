import { X } from 'lucide-react';

function PlacesList() {
    return (
        <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Places</h3>
            <div className="space-y-4">
                {[1, 2, 3].map((index) => (
                    <div key={index}
                         className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-100 rounded-full"></div>
                            <div>
                                <h4 className="font-medium text-gray-900">Place name</h4>
                                <p className="text-gray-500 text-sm">Address</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center">
                                <span className="text-amber-400 font-medium">4.76</span>
                                <span className="text-amber-400 ml-1">★</span>
                            </div>
                            <button className="p-2 text-red-500 rounded-lg hover:bg-red-50 transition-colors">
                                <X className="w-5 h-5"/>
                            </button>
                        </div>
                    </div>
                ))}
                <button
                    className="w-full py-3 bg-white text-rose-600 rounded-xl hover:bg-rose-50 font-medium border border-gray-100 transition-all">
                    Load more places
                </button>
            </div>
        </div>
    );
}

export default PlacesList;