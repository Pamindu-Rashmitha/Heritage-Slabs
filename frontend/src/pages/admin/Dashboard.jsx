import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import vehicleService from '../../services/vehicleService';
import orderService from '../../services/orderService';
import api from '../../services/api';

export default function Dashboard() {
    const [totalUsers, setTotalUsers] = useState('—');
    const [activeOrders, setActiveOrders] = useState('—');
    const [totalVehicles, setTotalVehicles] = useState('—');
    const [availableVehicles, setAvailableVehicles] = useState('—');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, orders, allVehicles, available] = await Promise.all([
                    api.get('/users'),
                    orderService.getAllOrders(),
                    vehicleService.getAllVehicles(),
                    vehicleService.getAvailableVehicles(),
                ]);
                setTotalUsers(usersRes.data.length);
                setActiveOrders(orders.length);
                setTotalVehicles(allVehicles.length);
                setAvailableVehicles(available.length);
            } catch {
                // Keep dash placeholders if API unreachable
            }
        };
        fetchStats();
    }, []);

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-2xl font-bold text-gray-800">Dashboard Overview</h2>
                <p className="text-gray-600">
                    Welcome to the central control panel for the Heritage Slabs ERP system.
                    From here, you can navigate to User Management, Products, Orders, and Vehicles using the sidebar.
                </p>

                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-4">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm text-gray-500">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800">{totalUsers}</p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm text-gray-500">Active Orders</p>
                        <p className="text-2xl font-bold text-gray-800">{activeOrders}</p>
                    </div>
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                        <p className="text-sm text-gray-500">Total Vehicles</p>
                        <p className="text-2xl font-bold text-gray-800">{totalVehicles}</p>
                    </div>
                    <div className="p-4 bg-teal-50 border-l-4 border-teal-500 rounded">
                        <p className="text-sm text-gray-500">Available Vehicles</p>
                        <p className="text-2xl font-bold text-gray-800">{availableVehicles}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
