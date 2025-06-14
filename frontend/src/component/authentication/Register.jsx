import { useNavigate } from 'react-router-dom';
import AuthenticationService from '../service/AuthenticationService';
import { useState } from "react";

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== passwordConfirmation) {
            setMessage("Passwords aren't the same");
            return;
        }

        try {
            const response = await AuthenticationService.register(username, email, password);
            switch (response.status) {
                case 201:
                    setMessage("You have created an account");
                    navigate("/login");
                    break;
                default:
                    setMessage(typeof response.data === 'object' ? response.data.error : response.data);
            }
        } catch (error) {
            setMessage(error.message);
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
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Choose your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="passwordConfirmation" className="block text-gray-700 text-sm font-bold mb-2">
                            Confirm Password
                        </label>
                        <input
                            id="passwordConfirmation"
                            type="password"
                            placeholder="Confirm your password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className={inputClasses}
                            required
                        />
                    </div>

                    {message && (
                        <div className={`px-4 py-3 rounded relative mb-4 ${
                            message === "You have created an account"
                                ? "bg-green-100 border border-green-400 text-green-700"
                                : "bg-red-100 border border-red-400 text-red-700"
                        }`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 mb-4"
                    >
                        Sign Up
                    </button>

                    <div className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" className="text-rose-500 hover:text-rose-600 font-medium">
                            Sign in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;