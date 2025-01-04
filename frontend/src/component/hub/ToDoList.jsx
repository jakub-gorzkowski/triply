import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import axios from 'axios';
import AuthenticationService from "../service/AuthenticationService.jsx";

const API_BASE_URL = 'http://localhost:8080/api/v1';
const PAGE_SIZE = 6;

const TodoList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        fetchTasks(auth.token);
    }, [currentPage]);

    const fetchTasks = async (token) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/todo`, {
                params: {
                    completed: false,
                    offset: currentPage,
                    size: PAGE_SIZE
                },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.content.length === 0 && currentPage > 0) {
                setCurrentPage(prev => prev - 1);
                return;
            }

            setTasks(response.data.content);
            setTotalPages(response.data.totalPages);
            setError(null);
        } catch (err) {
            setError('Failed to load tasks');
            console.error('Error fetching tasks:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            await axios.patch(`${API_BASE_URL}/todo/toggle`, null, {
                params: {
                    id: taskId
                },
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            });

            await fetchTasks(auth.token);
            setError(null);
        } catch (err) {
            setError('Failed to complete task');
            console.error('Error completing task:', err);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        const auth = AuthenticationService.getCurrentUser();
        if (!auth) return;

        try {
            const response = await axios.post(
                `${API_BASE_URL}/todo/add`,
                { content: newTask.trim() },
                {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data) {
                setNewTask('');
                setCurrentPage(0);
                await fetchTasks(auth.token);
            }
            setError(null);
        } catch (err) {
            setError('Failed to add task');
            console.error('Error adding task:', err);
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">To do list</h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[360px]">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">
                            No tasks yet. Add your first task below!
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {tasks.map((task) => (
                                <div
                                    key={task.id}
                                    className="flex items-center justify-between bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors"
                                >
                                    <span className="text-gray-600">{task.content}</span>
                                    <button
                                        onClick={() => handleCompleteTask(task.id)}
                                        className="ml-3 p-1.5 text-gray-400 hover:text-rose-500 transition-colors"
                                    >
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <form onSubmit={handleAddTask} className="flex gap-2">
                        <input
                            type="text"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            placeholder="Add new task..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                        />
                        <button
                            type="submit"
                            disabled={!newTask.trim()}
                            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Add
                        </button>
                    </form>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-1 pt-4">
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index)}
                                    className={`px-3 py-1 rounded-md transition-colors ${
                                        currentPage === index
                                            ? 'bg-rose-500 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TodoList;