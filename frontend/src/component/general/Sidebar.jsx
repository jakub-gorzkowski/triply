import { Home, Map, Calendar, MessageSquare, Settings } from 'lucide-react';

function Sidebar({ currentPage = 'home' }) {
    const getNavItemClasses = (page) => {
        const baseClasses = "flex items-center space-x-3 p-2 rounded-lg transition-all";
        const activeClasses = "bg-rose-50 text-rose-600";
        const inactiveClasses = "text-gray-600 hover:text-rose-600 hover:bg-rose-50";

        return `${baseClasses} ${currentPage === page ? activeClasses : inactiveClasses}`;
    };

    return (
        <div className="w-64 h-[calc(100vh-2rem)] bg-white p-6 border border-gray-100 rounded-xl flex flex-col sticky top-4">
            <div className="mb-12">
                <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
            </div>

            <nav className="space-y-2">
                <div className={getNavItemClasses('home')}>
                    <Home className="w-5 h-5"/>
                    <span className="font-medium">Home</span>
                </div>
                <div className={getNavItemClasses('trips')}>
                    <Calendar className="w-5 h-5"/>
                    <span className="font-medium">Trips</span>
                </div>
                <div className={getNavItemClasses('places')}>
                    <Map className="w-5 h-5"/>
                    <span className="font-medium">Places</span>
                </div>
                <div className={getNavItemClasses('requests')}>
                    <MessageSquare className="w-5 h-5"/>
                    <span className="font-medium">Requests</span>
                </div>
            </nav>

            <div className="mt-auto">
                <div className={getNavItemClasses('settings')}>
                    <Settings className="w-5 h-5"/>
                    <span className="font-medium">Settings</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;