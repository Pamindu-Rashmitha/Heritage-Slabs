import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { AuthContext } from '../../context/AuthContext';

export default function AdminLayout({ children }) {
    const { user, loading } = useContext(AuthContext);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Floating Sidebar */}
            <div className="p-3 pr-0 flex-shrink-0">
                <Sidebar />
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
                {/* Floating Navbar */}
                <div className="p-3 pb-0">
                    <Navbar />
                </div>
                {/* Main Content */}
                <main className="flex-1 p-4 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}