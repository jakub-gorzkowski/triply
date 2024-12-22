import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import {useState} from "react";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await AuthenticationService.login(email, password);
            navigate('/');
        } catch (error) {
            setMessage('Invalid email or password');
        }
    };

    const inputClasses = [
        "w-full",
        "px-3",
        "py-2",
        "mt-1",
        "mb-4",
        "rounded-lg",
        "border",
        "border-gray-300",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-rose-500",
        "focus:border-transparent"
    ].join(' ');

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Triply</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    {message && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 mb-4"
                    >
                        Sign In
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-rose-500 hover:text-rose-600 font-medium">
                            Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;