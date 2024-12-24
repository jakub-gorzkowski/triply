import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar';
import TripsList from '../general/TripsList.jsx';

const Trips = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage='trips' />
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto space-y-12 pt-12">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Ongoing trips</h2>
                        <TripsList />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Past trips</h2>
                        <TripsList isPast />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Trips;