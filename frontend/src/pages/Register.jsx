import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const navigate = useNavigate();

    const validate = () => {
        const errors = { name: '', email: '', password: '', confirmPassword: '' };
        let isValid = true;

        // Name: at least 3 characters, letters and spaces only
        if (!name.trim()) {
            errors.name = 'Name is required';
            isValid = false;
        } else if (name.trim().length < 3) {
            errors.name = 'Name must be at least 3 characters';
            isValid = false;
        } else if (!/^[A-Za-z\s]+$/.test(name.trim())) {
            errors.name = 'Name can only contain letters and spaces';
            isValid = false;
        }

        // Email: valid format
        if (!email.trim()) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            errors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password: min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        if (!password) {
            errors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            errors.password = 'Password must be at least 8 characters';
            isValid = false;
        } else if (!/[A-Z]/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter';
            isValid = false;
        } else if (!/[a-z]/.test(password)) {
            errors.password = 'Password must contain at least one lowercase letter';
            isValid = false;
        } else if (!/[0-9]/.test(password)) {
            errors.password = 'Password must contain at least one number';
            isValid = false;
        } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            errors.password = 'Password must contain at least one special character';
            isValid = false;
        }

        // Confirm Password: must match
        if (!confirmPassword) {
            errors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (password !== confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setFieldErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Run validations
        if (!validate()) {
            return;
        }

        try {
            // Send the data to your Spring Boot backend
            await api.post('/auth/register', {
                name,
                email,
                password
            });

            // Show success message and redirect to login
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            // Capture errors from the backend (like "Email already taken")
            if (err.response && err.response.data) {
                setError(err.response.data);
            } else {
                setError('Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-center text-gray-800">Create an Account</h2>
                <p className="text-center text-gray-500">Join Heritage Slabs ERP</p>

                {/* Show error or success messages */}
                {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}
                {success && <div className="p-3 text-sm text-green-700 bg-green-100 rounded">{success}</div>}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            type="text"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.name ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            placeholder="Kapila Dissanayake"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Confirm Password</label>
                        <input
                            type="password"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 ${fieldErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {fieldErrors.confirmPassword && <p className="mt-1 text-xs text-red-600">{fieldErrors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:underline">
                        Sign in here
                    </Link>
                </p>
            </div>
        </div>
    );
}