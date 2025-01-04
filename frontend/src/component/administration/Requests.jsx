import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../general/Sidebar';
import UpdatePlaceModal from './UpdatePlaceModal';
import AuthenticationService from "../service/AuthenticationService";
import RequestsPlaces from "./RequestsPlaces.jsx";

const Requests = () => {
    const navigate = useNavigate();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
            return;
        }
    }, [navigate]);

    const handleEdit = (place) => {
        setSelectedPlace(place);
        setIsEditModalOpen(true);
    };

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage='requests'/>
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto pt-12">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Requests</h1>
                    </div>

                    <RequestsPlaces onEdit={handleEdit} />

                    {selectedPlace && (
                        <UpdatePlaceModal
                            isOpen={isEditModalOpen}
                            onClose={() => {
                                setIsEditModalOpen(false);
                                setSelectedPlace(null);
                            }}
                            place={selectedPlace}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Requests;