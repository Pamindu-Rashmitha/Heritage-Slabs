import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import vehicleService from '../../services/vehicleService';
import orderService from '../../services/orderService';
import productService from '../../services/productService'; // <-- NEW IMPORT
import api from '../../services/api';

export default function Dashboard() {
    const [totalUsers, setTotalUsers] = useState('—');
    const [activeOrders, setActiveOrders] = useState('—');
    const [totalVehicles, setTotalVehicles] = useState('—');
    const [availableVehicles, setAvailableVehicles] = useState('—');
    const [lowStockCount, setLowStockCount] = useState(0); // <-- NEW STATE

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // ---> NEW: Added productService.getLowStockAlerts() to your concurrent fetch
                const [usersRes, orders, allVehicles, available, lowStock] = await Promise.all([
                    api.get('/users'),
                    orderService.getAllOrders(),
                    vehicleService.getAllVehicles(),
                    vehicleService.getAvailableVehicles(),
                    productService.getLowStockAlerts()
                ]);

                setTotalUsers(usersRes.data.length);
                setActiveOrders(orders.length);
                setTotalVehicles(allVehicles.length);
                setAvailableVehicles(available.length);
                setLowStockCount(lowStock.length); // <-- Set the count

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
                </p>

                {/* Updated grid to md:grid-cols-5 to fit the new card beautifully */}
                <div className="grid grid-cols-1 gap-6 mt-6 md:grid-cols-5">

                    {/* ---> NEW: Low Stock Warning Card <--- */}
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 shadow-sm">
                        <p className="text-sm font-bold text-red-500 uppercase tracking-wider">Low Stock Alerts</p>
                        <p className="text-3xl font-bold text-red-700 mt-1">
                            {lowStockCount > 0 ? `⚠️ ${lowStockCount}` : '0'}
                        </p>
                    </div>

                    <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{totalUsers}</p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-400">
                        <p className="text-sm text-gray-500 font-medium">Active Orders</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{activeOrders}</p>
                    </div>
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-400">
                        <p className="text-sm text-gray-500 font-medium">Total Vehicles</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{totalVehicles}</p>
                    </div>
                    <div className="p-4 bg-teal-50 border-l-4 border-teal-400">
                        <p className="text-sm text-gray-500 font-medium">Available Vehicles</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{availableVehicles}</p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}