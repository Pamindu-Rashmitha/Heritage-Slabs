import React from 'react';
import { Link } from 'react-router-dom';

export default function Sidebar() {
    return (
        <div className="w-64 min-h-screen text-white bg-gray-900">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <h1 className="text-xl font-bold">Heritage Slabs ERP</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <Link to="/dashboard" className="p-3 transition rounded hover:bg-gray-800">
                    Dashboard
                </Link>
                {/* This is the page you will build later for the User Directory! */}
                <Link to="/users" className="p-3 transition rounded hover:bg-gray-800">
                    User Management
                </Link>
                <Link to="/products" className="p-3 transition text-gray-400 hover:text-white hover:bg-gray-800">
                    Products
                </Link>
                <Link to="/orders" className="p-3 transition text-gray-400 hover:text-white hover:bg-gray-800">
                    Orders
                </Link>
            </nav>
        </div>
    );
}