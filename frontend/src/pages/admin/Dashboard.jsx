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
        totalUsers: 0, activeOrders: 0, totalVehicles: 0, availableVehicles: 0,
        lowStockCount: 0, totalProducts: 0, ordersReadyToDispatch: 0, totalSales: 0,
        openTickets: 0, closedTickets: 0
    });
    const [salesData, setSalesData] = useState([]);
    const [orderStatusData, setOrderStatusData] = useState([]);
    const COLORS = ['#06b6d4', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [usersRes, orders, allVehicles, available, lowStock, allProducts, allTickets] = await Promise.all([
                    api.get('/users'), orderService.getAllOrders(), vehicleService.getAllVehicles(),
                    vehicleService.getAvailableVehicles(), productService.getLowStockAlerts(),
                    productService.getAllProducts(), getAllTickets()
                ]);
                let totalS = 0; const salesByDate = {}; const statusCounts = {}; let readyToDispatch = 0;
                orders.forEach(order => {
                    if (order.status !== 'Failed') totalS += order.totalAmount || 0;
                    if (order.status === 'Paid') readyToDispatch++;
                    const stat = order.status || 'Unknown';
                    statusCounts[stat] = (statusCounts[stat] || 0) + 1;
                    if (order.date) {
                        const dateObj = new Date(order.date);
                        const dateStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;
                        if (!salesByDate[dateStr]) salesByDate[dateStr] = 0;
                        salesByDate[dateStr] += order.totalAmount || 0;
                    }
                });
                const formattedSalesData = Object.keys(salesByDate).sort((a, b) => new Date(a) - new Date(b)).slice(-30).map(date => ({ date, sales: salesByDate[date] }));
                const formattedStatusData = Object.keys(statusCounts).map(key => ({ name: key, value: statusCounts[key] }));
                let openT = 0, closedT = 0;
                allTickets.forEach(t => { if (t.status === 'Resolved' || t.status === 'Closed') closedT++; else openT++; });
                setStats({
                    totalUsers: usersRes.data.length, activeOrders: orders.length, totalVehicles: allVehicles.length,
                    availableVehicles: available.length, lowStockCount: lowStock.length, totalProducts: allProducts.length,
                    ordersReadyToDispatch: readyToDispatch, totalSales: totalS, openTickets: openT, closedTickets: closedT
                });
                setSalesData(formattedSalesData);
                setOrderStatusData(formattedStatusData);
            } catch (err) { console.error("Failed to fetch dashboard stats", err); }
        };
        fetchStats();
    }, []);

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

    const tooltipStyle = { borderRadius: '16px', border: 'none', boxShadow: '0 12px 48px rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', fontWeight: 'bold' };

    return (
        <AdminLayout>
            <div className="p-4 min-h-screen">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Analytics Overview</h2>
                        <p className="text-gray-500 mt-2 text-sm font-medium">Real-time metrics for Heritage Slabs ERP.</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {[
                        { icon: DollarSign, label: 'Total Sales', value: `LKR ${stats.totalSales.toLocaleString()}`, color: 'text-indigo-500', bg: 'bg-indigo-100/50' },
                        { icon: Package, label: 'Ready to Dispatch', value: stats.ordersReadyToDispatch, color: 'text-emerald-500', bg: 'bg-emerald-100/50' },
                        { icon: AlertCircle, label: 'Low Stock Alerts', value: stats.lowStockCount, color: 'text-red-500', bg: 'bg-red-100/50', textColor: 'text-red-700' },
                        { icon: Truck, label: 'Available Fleet', value: <>{stats.availableVehicles}<span className="text-lg text-gray-400 font-bold ml-1">/ {stats.totalVehicles}</span></>, color: 'text-sky-500', bg: 'bg-sky-100/50' },
                    ].map((kpi, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-3xl flex items-center space-x-5 hover:-translate-y-1 hover:shadow-glass-lg transition-all duration-300">
                            <div className={`p-4 ${kpi.bg} backdrop-blur-sm ${kpi.color} rounded-2xl`}>
                                <kpi.icon className="w-8 h-8" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{kpi.label}</p>
                                <p className={`text-3xl font-extrabold ${kpi.textColor || 'text-gray-800'} mt-1 tracking-tight`}>{kpi.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    <div className="lg:col-span-2 glass-card p-6 rounded-3xl hover:shadow-glass-lg transition-shadow duration-300">
                        <div className="mb-6 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center">
                                <DollarSign className="w-5 h-5 mr-2 text-accent" /> Sales Trend (Daily)
                            </h3>
                        </div>
                        <div className="h-80">
                            {salesData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                        <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} dx={-10} />
                                        <RechartsTooltip contentStyle={tooltipStyle} formatter={(value) => [`LKR ${value.toLocaleString()}`, 'Sales']} />
                                        <Area type="monotone" dataKey="sales" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <DollarSign className="w-12 h-12 mb-3 text-gray-200" /><p>Not enough sales data</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="glass-card p-6 rounded-3xl hover:shadow-glass-lg transition-shadow duration-300">
                        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-accent" /> Order Distribution
                        </h3>
                        <div className="h-80">
                            {orderStatusData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart data={orderStatusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="name" type="category" stroke="#6B7280" fontSize={12} width={80} tickLine={false} axisLine={false} fontWeight={600} />
                                        <RechartsTooltip cursor={{fill: 'rgba(255,255,255,0.3)'}} contentStyle={tooltipStyle} />
                                        <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={30}>
                                            {orderStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <Package className="w-12 h-12 mb-3 text-gray-200" /><p>No active orders</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Secondary Charts */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { title: 'Fleet Availability', icon: <Truck className="w-6 h-6"/>, iconColor: 'text-sky-500', data: vehicleData, colors: ['#0EA5E9', '#e0f2fe'] },
                        { title: 'Inventory Health', icon: <AlertCircle className="w-6 h-6"/>, iconColor: 'text-rose-500', data: stockData, colors: ['#F43F5E', '#ffe4e6'] },
                        { title: 'Support Load', icon: <Ticket className="w-6 h-6"/>, iconColor: 'text-amber-500', data: ticketData, colors: ['#F59E0B', '#fef3c7'] },
                    ].map((chart, idx) => (
                        <div key={idx} className="glass-card p-6 rounded-3xl hover:shadow-glass-lg transition-shadow duration-300">
                            <div className={`flex items-center justify-center mb-2 ${chart.iconColor}`}>{chart.icon}</div>
                            <h3 className="text-md font-extrabold text-gray-800 mb-2 text-center">{chart.title}</h3>
                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <PieChart>
                                        <Pie data={chart.data} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                                            <Cell fill={chart.colors[0]} /><Cell fill={chart.colors[1]} />
                                        </Pie>
                                        <RechartsTooltip contentStyle={tooltipStyle} />
                                        <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', paddingTop: '10px' }} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}