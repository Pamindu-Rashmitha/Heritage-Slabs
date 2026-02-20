import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Bring in the login function and user state from our AuthContext
    const { login, user } = useContext(AuthContext);

    // Bring in the navigate function to change pages after login
    const navigate = useNavigate();

    // Navigate to dashboard once user state is actually set by React
    useEffect(() => {
        if (user) {
            if (user.role === 'ADMIN') {
                navigate('/dashboard');
            } else {
                navigate('/catalog');
            }
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents the page from refreshing
        setError(''); // Clear any old errors

        try {
            // Call the login function from context
            await login(email, password);
            // Navigation is handled by the useEffect above after user state updates
        } catch (err) {
            // If the backend sends a 400/401 error, catch it and show the user
            setError('Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Heritage Slabs ERP</h2>
                <p className="text-center text-gray-500">Sign in to your account</p>

                {/* Show error message if login fails */}
                {error && (
                    <div className="p-3 text-sm text-red-700 bg-red-100 rounded">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Sign In
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
}