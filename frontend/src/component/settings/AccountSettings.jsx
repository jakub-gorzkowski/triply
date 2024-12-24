import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthenticationService from '../service/AuthenticationService';
import Sidebar from '../general/Sidebar';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AccountSettings = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [initialData, setInitialData] = useState({
        username: ''
    });

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [touchedFields, setTouchedFields] = useState({
        username: false,
        email: false,
        password: false
    });

    useEffect(() => {
        const auth = AuthenticationService.getCurrentUser();
        if (!auth || AuthenticationService.isTokenExpired(auth.token)) {
            navigate('/login');
        } else {
            const tokenData = JSON.parse(atob(auth.token.split('.')[1]));
            setInitialData({
                username: tokenData.realUsername
            });
            setFormData(prev => ({
                ...prev,
                username: tokenData.realUsername,
                email: '',
                password: '',
                confirmPassword: ''
            }));
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'username') {
            setTouchedFields(prev => ({
                ...prev,
                username: value !== initialData.username
            }));
        } else if (name === 'email') {
            setTouchedFields(prev => ({
                ...prev,
                email: value !== ''
            }));
        } else if (name === 'password') {
            setTouchedFields(prev => ({
                ...prev,
                password: value !== ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (touchedFields.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const auth = AuthenticationService.getCurrentUser();
        const tokenData = JSON.parse(atob(auth.token.split('.')[1]));
        const updateData = {
            current_email: tokenData.sub
        };

        if (touchedFields.username) {
            updateData.username = formData.username;
        }

        if (touchedFields.email && formData.email) {
            updateData.email = formData.email;
        }

        if (touchedFields.password && formData.password) {
            updateData.password = formData.password;
        }

        if (Object.keys(updateData).length > 0) {
            try {
                setError(null);
                await axios.patch(
                    `${API_BASE_URL}/user/update`,
                    updateData,
                    {
                        headers: {
                            'Authorization': `Bearer ${auth.token}`
                        }
                    }
                );

                if (touchedFields.email) {
                    AuthenticationService.logout();
                    navigate('/login');
                } else {
                    navigate('/');
                }
            } catch (err) {
                setError('The email address is already in use');
                console.error('Error updating account:', err);
            }
        }
    };

    return (
        <div className="flex min-h-screen p-4 bg-gray-50 gap-4">
            <Sidebar currentPage="settings" />
            <div className="flex-1 px-4">
                <div className="max-w-2xl mx-auto pt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Account settings</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    id="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter new username"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter new email"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter new password"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                                />
                            </div>
                            {touchedFields.password && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        id="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm new password"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={!Object.values(touchedFields).some(Boolean)}
                                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Update
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-200 flex justify-center">
                        <button
                            onClick={() => {
                                AuthenticationService.logout();
                                navigate('/login');
                            }}
                            className="px-8 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountSettings;