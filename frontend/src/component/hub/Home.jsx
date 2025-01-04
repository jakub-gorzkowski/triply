import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar.jsx';
import TodoList from './ToDoList.jsx';
import TripsList from "../general/TripsList.jsx";

const Home = () => {
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
            <Sidebar currentPage='home'/>
            <div className="flex-1 relative overflow-x-hidden">
                <div className="fixed top-0 left-0 w-full z-50 md:hidden bg-white shadow-sm">
                    <div className="px-4 py-4">
                        <h1 className="text-2xl font-bold text-gray-900">Triply</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 pt-20 pb-24">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Your next trips</h2>
                        <TripsList count={4} />
                    </div>

                    <div className="mb-20 md:mb-8">
                        <TodoList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;