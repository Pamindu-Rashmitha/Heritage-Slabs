import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import vehicleService from '../../services/vehicleService';
import orderService from '../../services/orderService';
import productService from '../../services/productService';
import { getAllTickets } from '../../services/ticketService';
import api from '../../services/api';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Truck, Package, DollarSign, Users, AlertCircle, CheckCircle, Ticket } from 'lucide-react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeOrders: 0,
        totalVehicles: 0,
        availableVehicles: 0,
        lowStockCount: 0,
        totalProducts: 0,
        ordersReadyToDispatch: 0,
        totalSales: 0,
        openTickets: 0,
        closedTickets: 0
    });

    const [salesData, setSalesData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    
    // Status colors for Bar Chart
    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5CF6'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [
                    usersRes, 
                    orders, 
                    allVehicles, 
                    available, 
                    lowStock, 
                    allProducts,
                    allTickets
                ] = await Promise.all([
                    api.get('/users'),
                    orderService.getAllOrders(),
                    vehicleService.getAllVehicles(),
                    vehicleService.getAvailableVehicles(),
                    productService.getLowStockAlerts(),
                    productService.getAllProducts(),
                    getAllTickets()
                ]);

                // Calculate total sales and group by date for the area chart
                let totalS = 0;
                const salesByDate = {};
                const statusCounts = {};
                let readyToDispatch = 0;

                orders.forEach(order => {
                    if (order.status !== 'Failed') {
                        totalS += order.totalAmount || 0;
                    }

                    if (order.status === 'Paid') {
                        readyToDispatch++;
                    }

                    const stat = order.status || 'Unknown';
                    statusCounts[stat] = (statusCounts[stat] || 0) + 1;

                    if (order.date) {
                        const dateObj = new Date(order.date);
                        const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                        if (!salesByDate[dateStr]) salesByDate[dateStr] = 0;
                        salesByDate[dateStr] += order.totalAmount || 0;
                    }
                });

                // Format Sales Data for Recharts
                const formattedSalesData = Object.keys(salesByDate)
                    .sort((a, b) => new Date(a) - new Date(b))
                    .slice(-30) // Last 30 days
                    .map(date => ({
                        date,
                        sales: salesByDate[date]
                    }));

                // Format Order Status Data
                const formattedStatusData = Object.keys(statusCounts).map(key => ({
                    name: key,
                    value: statusCounts[key]
                }));

                // Ticket statuses
                let openT = 0;
                let closedT = 0;
                allTickets.forEach(t => {
                    if (t.status === 'Resolved' || t.status === 'Closed') {
                        closedT++;
                    } else {
                        openT++;
                    }
                });

                setStats({
                    totalUsers: usersRes.data.length,
                    activeOrders: orders.length, 
                    totalVehicles: allVehicles.length,
                    availableVehicles: available.length,
                    lowStockCount: lowStock.length,
                    totalProducts: allProducts.length,
                    ordersReadyToDispatch: readyToDispatch,
                    totalSales: totalS,
                    openTickets: openT,
                    closedTickets: closedT
                });

                setSalesData(formattedSalesData);
                setOrderStatusData(formattedStatusData);

            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
            }
        };
        fetchStats();
    }, []);

    // Derived chart data
    const vehicleData = [
        { name: 'Available', value: stats.availableVehicles },
        { name: 'Unavailable', value: Math.max(0, stats.totalVehicles - stats.availableVehicles) }
    ];

    const stockData = [
        { name: 'Low Stock', value: stats.lowStockCount },
        { name: 'Sufficient Stock', value: Math.max(0, stats.totalProducts - stats.lowStockCount) }
    ];

    const ticketData = [
        { name: 'Open Queries', value: stats.openTickets },
        { name: 'Resolved', value: stats.closedTickets }
    ];

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50/50 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Overview</h2>
                        <p className="text-gray-500 mt-2 text-sm font-medium">
                            Real-time metrics and dynamic performance indicators for Heritage Slabs ERP.
                        </p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {/* Sales KPI */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Total Sales</p>
                            <p className="text-3xl font-black text-gray-800 mt-1 tracking-tight">
                                LKR {stats.totalSales.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Orders Ready */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Package className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Ready to Dispatch</p>
                            <p className="text-3xl font-black text-gray-800 mt-1 tracking-tight">{stats.ordersReadyToDispatch}</p>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-red-50 flex items-center space-x-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div className="p-4 bg-red-50 text-red-600 rounded-2xl">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-red-500 uppercase tracking-widest">Low Stock Alerts</p>
                            <p className="text-3xl font-black text-red-700 mt-1 tracking-tight">{stats.lowStockCount}</p>
                        </div>
                    </div>

                    {/* Available Vehicles */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-5 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
                        <div className="p-4 bg-sky-50 text-sky-600 rounded-2xl">
                            <Truck className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Available Fleet</p>
                            <p className="text-3xl font-black text-gray-800 mt-1 tracking-tight">{stats.availableVehicles}<span className="text-lg text-gray-400 font-bold ml-1">/ {stats.totalVehicles}</span></p>
                        </div>
                    </div>
                </div>

                {/* Main Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Sales Area Chart spans 2 columns */}
                    <div className="lg:col-span-2 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-indigo-500" />
                                Sales Trend (Daily Performance)
                            </h3>
                        </div>
                        <div className="h-80">
                            {salesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                                        <RechartsTooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', fontWeight: 'bold' }}
                                            formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Sales']}
                                        />
                                        <Area type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <DollarSign className="w-12 h-12 mb-3 text-gray-200" />
                                    <p>Not enough sales data</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Order Status Distribution */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-indigo-500" />
                            Order Distribution
                        </h3>
                        <div className="h-80">
                            {orderStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={orderStatusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                                        <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={80} tickLine={false} axisLine={false} fontWeight={600} />
                                        <RechartsTooltip cursor={{fill: '#F9FAFB'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={30}>
                                            {orderStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Package className="w-12 h-12 mb-3 text-gray-200" />
                                    <p>No active orders found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Charts Data */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Vehicle Distribution */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-center mb-2 text-sky-500"><Truck className="w-6 h-6"/></div>
                        <h3 className="text-md font-extrabold text-gray-800 mb-2 text-center">Fleet Availability</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie data={vehicleData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                        <Cell fill="#0EA5E9" />
                                        <Cell fill="#E0F2FE" />
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Stock Alert Distribution */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-center mb-2 text-rose-500"><AlertCircle className="w-6 h-6"/></div>
                        <h3 className="text-md font-extrabold text-gray-800 mb-2 text-center">Inventory Health</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie data={stockData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                        <Cell fill="#F43F5E" />
                                        <Cell fill="#FEE2E2" />
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ticket Status */}
                    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <div className="flex items-center justify-center mb-2 text-amber-500"><Ticket className="w-6 h-6"/></div>
                        <h3 className="text-md font-extrabold text-gray-800 mb-2 text-center">Support Load</h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie data={ticketData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                        <Cell fill="#F59E0B" />
                                        <Cell fill="#FEF3C7" />
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} />
                                    <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

            </div>
        </AdminLayout>
    );
}