import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';

export default function Dashboard() {
    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-600">
                    Welcome to the central control panel for the Heritage Slabs ERP system.
                    From here, you can navigate to User Management, Products, and Orders using the sidebar.
                </p>

                {/* A quick statistics placeholder */}
                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-3">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">12</p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm text-gray-500">Active Orders</p>
                        <p className="text-2xl font-bold text-gray-800">5</p>
                    </div>
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                        <p className="text-sm text-gray-500">Support Tickets</p>
                        <p className="text-2xl font-bold text-gray-800">2</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}