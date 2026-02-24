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
        <div className={`max-w-7xl mx-auto px-4 ${user?.role === 'ADMIN' ? 'py-4' : 'pt-28 pb-12'}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ${user?.role === 'ADMIN' ? 'bg-white p-6 rounded-lg shadow-sm border border-gray-100' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <ShoppingBag className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {user?.role === 'ADMIN' ? 'Order Management' : 'My Orders'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {user?.role === 'ADMIN'
                                ? 'Review and manage all customer slab acquisitions'
                                : 'View and track your previous premium purchases'}
                        </p>
                    </div>
                </div>
                <Link
                    to="/catalog"
                    className="inline-flex items-center gap-2 bg-white text-gray-600 px-5 py-2.5 rounded-xl font-semibold hover:text-blue-600 transition shadow-sm border border-gray-200 hover:shadow-md"
                >
                    Browse More
                </Link>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 font-semibold">
                    <Clock size={18} />
                    {error}
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="bg-white rounded-xl p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                        Your project's masterpiece is waiting. Explore our premium collection today!
                    </p>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-400/20 hover:scale-[1.01] active:scale-[0.99] transform"
                    >
                        EXPLORE CATALOG <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="p-6 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                                        <p className="font-mono font-bold text-gray-800 text-base">#HS-{order.id.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                                            <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client</p>
                                            <p className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">{order.user_id?.email || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {order.totalAmount.toLocaleString()} <span className="text-xs font-semibold text-gray-400 uppercase">Lkr</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 flex-shrink-0">
                                            <MapPin className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Destination</p>
                                            <p className="text-gray-700 leading-relaxed font-semibold text-xs">{order.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-50/50 rounded-lg p-5 border border-blue-100 space-y-2">
                                    <div className="flex items-center gap-2 text-blue-600">
                                        <Package size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Project Materials</span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                                        Premium slabs and architectural materials curated for your project's specific requirements.
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
