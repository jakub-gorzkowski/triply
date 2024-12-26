import { Plus, X } from 'lucide-react';

function TripHeader() {
    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Trip name</h2>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-sm transition-colors">
                        <Plus className="w-5 h-5"/>
                    </button>
                    <button className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-sm transition-colors">
                        <X className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-rose-200 transition-colors group"
                        >
                            <div className="w-full h-full">
                                <img
                                    src="/api/placeholder/400/400"
                                    alt="Trip place"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-74.0060!3d40.7128!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCc0Ni4xIk4gNzTCsDAwJzIxLjYiVw!5e0!3m2!1sen!2sus!4v1234567890"
                        className="w-full h-full rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        </>
    );
}

export default TripHeader;