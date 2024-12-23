import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar.jsx';
import TodoList from './ToDoList.jsx';
import UpcomingTrips from "../general/UpcomingTrips.jsx";

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
            <div className="flex-1 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
                    </div>

                    <div className="mb-8">
                        <UpcomingTrips count={3} />
                    </div>

                    <div className="mb-8">
                        <TodoList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;