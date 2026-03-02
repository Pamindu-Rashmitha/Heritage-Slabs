import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
    const location = useLocation();

    // Helper to style active links like the "Suppliers" link currently is in your code
    const getLinkClass = (path) => {
        const baseClass = "p-3 transition rounded text-gray-400 hover:text-white hover:bg-gray-800 block";
        return location.pathname === path 
            ? `${baseClass} font-bold border-l-4 border-blue-500 bg-gray-800` 
            : baseClass;
    };

    return (
        <div className="w-64 min-h-screen text-white bg-gray-900 flex-shrink-0">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <h1 className="text-xl font-bold">Heritage Slabs</h1>
            </div>
            <nav className="flex flex-col p-4 space-y-2 overflow-y-auto">
                <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
                <Link to="/users" className={getLinkClass('/users')}>User Management</Link>
                <Link to="/products" className={getLinkClass('/products')}>Products</Link>
                <Link to="/suppliers" className={getLinkClass('/suppliers')}>Suppliers</Link>
                <Link to="/purchase-orders" className="pl-6 py-2 text-sm transition text-gray-400 hover:text-white hover:bg-gray-800 block">↳ Purchase Orders</Link>
                <Link to="/material-intakes" className="pl-6 py-2 text-sm transition text-gray-400 hover:text-white hover:bg-gray-800 mb-2 block">↳ Material Intakes</Link>
                <Link to="/vehicles" className={getLinkClass('/vehicles')}>Vehicles</Link>
                <Link to="/deliveries" className={getLinkClass('/deliveries')}>Deliveries</Link>
                <Link to="/orders" className={getLinkClass('/orders')}>Orders</Link>
                <Link to="/admin/reviews" className={getLinkClass('/admin/reviews')}>Reviews</Link>
                <Link to="/admin/feedback" className={getLinkClass('/admin/feedback')}>Feedback / Tickets</Link>
            </nav>
        </div>
    );
}