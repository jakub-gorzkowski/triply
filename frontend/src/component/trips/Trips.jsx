import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar';
import TripsList from '../general/TripsList.jsx';
import CreateTripModal from "./CreateTripModal.jsx";

const Trips = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleTripCreated = (newTrip) => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage='trips' />
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto space-y-12 pt-12">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Ongoing trips</h2>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium"
                        >
                            Create Trip
                        </button>
                    </div>
                    <TripsList key={`ongoing-${refreshTrigger}`} />

                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Past trips</h2>
                        <TripsList isPast key={`past-${refreshTrigger}`} />
                    </div>
                </div>
            </div>

            <CreateTripModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTripCreated={handleTripCreated}
            />
        </div>
    );
};

export default Trips;