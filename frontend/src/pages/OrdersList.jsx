import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { ShoppingBag, ChevronRight, Package, Calendar, Clock, MapPin, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const OrdersList = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.email) return;
            try {
                const data = await orderService.getOrdersByEmail(user.email);
                // Sort by date descending
                const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError("Failed to load your orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    const content = (
        <div className={`max-w-4xl mx-auto px-4 ${user?.role === 'ADMIN' ? 'py-6' : 'pt-28 pb-12'}`}>
            <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600/10 p-3 rounded-2xl">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {user?.role === 'ADMIN' ? 'Order Management' : 'My Orders'}
                    </h1>
                    <p className="text-gray-500">
                        {user?.role === 'ADMIN' ? 'Review and manage all customer orders' : 'View and track your previous purchases'}
                    </p>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                    {error}
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Explore our stunning collection of granite slabs!
                    </p>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                    >
                        Explore Collection <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                            <div className="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                                <div className="flex items-center gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Order ID</p>
                                        <p className="font-mono font-bold text-gray-900">#HS-{order.id.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Date</p>
                                        <div className="flex items-center gap-2 text-gray-900 font-bold">
                                            <Calendar className="w-4 h-4 text-gray-400" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Customer</p>
                                            <p className="text-sm font-bold text-gray-900">{order.user_id?.email || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                                        <p className="text-xl font-bold text-blue-600">{order.totalAmount.toLocaleString()} LKR</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex items-start gap-3 mb-6">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-bold text-gray-400 mb-1">Shipping Address</p>
                                        <p className="text-gray-700 leading-relaxed font-medium">{order.address}</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-2xl p-4">
                                    <div className="flex items-center gap-2 mb-3 text-gray-400">
                                        <Package className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Order Contents</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-medium italic">
                                        Slabs and materials for your heritage projects.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (user?.role === 'ADMIN') {
        return <AdminLayout>{content}</AdminLayout>;
    }

    return content;
};

export default OrdersList;
