import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
    const { user, loading } = useContext(AuthContext);

    // Show a loading screen while checking for the token
    if (loading) return <div className="p-10 text-center">Loading...</div>;

    // Security Check: If no user is logged in, kick them back to the login page!
    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Navbar />
                {/* The 'children' is where the actual page content (like the Dashboard) will go */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}