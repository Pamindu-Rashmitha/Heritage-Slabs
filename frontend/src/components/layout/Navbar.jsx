import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm">
            <div className="flex items-center space-x-3">
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                ) : (
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                <div className="text-xl font-semibold text-gray-800">
                    Welcome, {user?.email || 'Admin'}
                </div>
            </div>

            {/* This is the SINGLE correct block for your buttons */}
            <div className="flex items-center space-x-4">
                <span className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full">
                    Role: {user?.role || 'USER'}
                </span>

                <button
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                >
                    My Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </header>
    );
}