import { Home, Map, Calendar, MessageSquare, Settings } from 'lucide-react';

function Sidebar() {
    return (
        <div className="w-64 bg-white p-6 border border-gray-100 rounded-xl relative">
            <div className="mb-12">
                <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
            </div>

            <nav className="space-y-2">
                <div
                    className="flex items-center space-x-3 text-gray-600 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all">
                    <Home className="w-5 h-5"/>
                    <span className="font-medium">Home</span>
                </div>
                <div
                    className="flex items-center space-x-3 text-gray-600 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all">
                    <Calendar className="w-5 h-5"/>
                    <span className="font-medium">Trips</span>
                </div>
                <div className="flex items-center space-x-3 bg-rose-50 text-rose-600 p-2 rounded-lg">
                    <Map className="w-5 h-5"/>
                    <span className="font-medium">Places</span>
                </div>
                <div
                    className="flex items-center space-x-3 text-gray-600 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all">
                    <MessageSquare className="w-5 h-5"/>
                    <span className="font-medium">Requests</span>
                </div>
            </nav>

            <div className="absolute bottom-6 left-6 right-6">
                <div
                    className="flex items-center space-x-3 text-gray-600 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-all">
                    <Settings className="w-5 h-5"/>
                    <span className="font-medium">Settings</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;

