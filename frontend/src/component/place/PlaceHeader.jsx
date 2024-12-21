import { Plus } from 'lucide-react';

function PlaceHeader() {
    return (
        <>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Name</h2>
                    <p className="text-teal-600">Address</p>
                </div>
                <button className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 shadow-sm transition-colors">
                    <Plus className="w-5 h-5"/>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-rose-200 transition-colors group">
                    <div className="w-32 h-32 mx-auto my-auto mb-4">
                        <img
                            src="https://placehold.co/480x480"
                            alt="Place"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    </div>
                </div>
                <div
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-rose-200 transition-colors">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12345.67890!2d-74.0060!3d40.7128!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCc0Ni4xIk4gNzTCsDAwJzIxLjYiVw!5e0!3m2!1sen!2sus!4v1234567890"
                        className="w-full h-48 rounded-lg border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>

            <div className="mb-8 text-gray-600 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
                mollit anim id est laborum.
            </div>
        </>
    )
}

export default PlaceHeader;