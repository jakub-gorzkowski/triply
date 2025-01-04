import { Home, Map, Calendar, MessageSquare, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';

function Sidebar({ currentPage = 'home' }) {
    const navigate = useNavigate();
    const auth = AuthenticationService.getCurrentUser();
    const isAdmin = auth?.token ? JSON.parse(atob(auth.token.split('.')[1])).roles?.includes('ROLE_ADMIN') : false;

    const getNavItemClasses = (page) => {
        const baseClasses = "flex items-center space-x-3 p-2 rounded-lg transition-all cursor-pointer";
        const activeClasses = "bg-rose-50 text-rose-600";
        const inactiveClasses = "text-gray-600 hover:text-rose-600 hover:bg-rose-50";

        return `${baseClasses} ${currentPage === page ? activeClasses : inactiveClasses}`;
    };

    const getMobileNavClasses = (page) => {
        return currentPage === page ? "text-rose-500" : "text-gray-400";
    };

    return (
        <>
            <div className="hidden md:flex w-64 h-[calc(100vh-2rem)] bg-white p-6 border border-gray-100 rounded-xl flex-col sticky top-4">
                <div className="mb-12">
                    <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                </div>

                <nav className="space-y-2">
                    <div onClick={() => navigate('/')} className={getNavItemClasses('home')}>
                        <Home className="w-5 h-5"/>
                        <span className="font-medium">Home</span>
                    </div>
                    <div onClick={() => navigate('/trips')} className={getNavItemClasses('trips')}>
                        <Calendar className="w-5 h-5"/>
                        <span className="font-medium">Trips</span>
                    </div>
                    <div onClick={() => navigate('/places')} className={getNavItemClasses('places')}>
                        <Map className="w-5 h-5"/>
                        <span className="font-medium">Places</span>
                    </div>
                    {isAdmin && (
                        <div onClick={() => navigate('/requests')} className={getNavItemClasses('requests')}>
                            <MessageSquare className="w-5 h-5"/>
                            <span className="font-medium">Requests</span>
                        </div>
                    )}
                </nav>

                <div className="mt-auto">
                    <div onClick={() => navigate('/settings')} className={getNavItemClasses('settings')}>
                        <Settings className="w-5 h-5"/>
                        <span className="font-medium">Settings</span>
                    </div>
                </div>
            </div>

            <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-100 rounded-xl md:hidden z-50 shadow-lg">
                <nav className="flex justify-around items-center p-4">
                    <div onClick={() => navigate('/')} className={getMobileNavClasses('home')}>
                        <Home className="w-8 h-8" />
                    </div>
                    <div onClick={() => navigate('/trips')} className={getMobileNavClasses('trips')}>
                        <Calendar className="w-8 h-8" />
                    </div>
                    <div onClick={() => navigate('/places')} className={getMobileNavClasses('places')}>
                        <Map className="w-8 h-8" />
                    </div>
                    <div onClick={() => navigate('/settings')} className={getMobileNavClasses('settings')}>
                        <Settings className="w-8 h-8" />
                    </div>
                </nav>
            </div>
        </>
    );
}

export default Sidebar;