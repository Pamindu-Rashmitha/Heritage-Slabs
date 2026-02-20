import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = () => {
    // 1. Get the current user
    const { user } = useContext(AuthContext);

    return (
        <div className="bg-white w-64 h-screen shadow-md">
            <ul className="p-4 space-y-4">

                {/* Everyone can see the Catalog */}
                <li>
                    <Link to="/catalog" className="text-gray-700 hover:text-blue-600">Browse Slabs</Link>
                </li>

                {/* 2. ONLY render these links if the user is an ADMIN */}
                {user?.role === 'ADMIN' && (
                    <>
                        <li>
                            <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">Admin Dashboard</Link>
                        </li>
                        <li>
                            <Link to="/products" className="font-bold text-blue-600">Product Management</Link>
                        </li>
                        <li>
                            <Link to="/users" className="text-gray-700 hover:text-blue-600">Manage Users</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
};

export default Sidebar;