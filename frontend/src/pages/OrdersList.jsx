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
                // Admins see ALL orders; regular users see only their own
                const data = user.role === 'ADMIN'
                    ? await orderService.getAllOrders()
                    : await orderService.getOrdersByEmail(user.email);
                // Sort by date descending
                const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError("Failed to load orders.");
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
        <div className={`max-w-5xl mx-auto px-4 ${user?.role === 'ADMIN' ? 'py-6' : 'pt-28 pb-12'}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div className="flex items-center gap-6">
                    <div className="bg-blue-600/10 p-4 rounded-3xl border border-blue-100/50">
                        <ShoppingBag className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                            {user?.role === 'ADMIN' ? 'Order' : 'My'} <span className="text-blue-600 italic">Orders</span>
                        </h1>
                        <p className="text-gray-500 font-medium">
                            {user?.role === 'ADMIN'
                                ? 'Review and manage all customer slab acquisitions'
                                : 'View and track your previous premium purchases'}
                        </p>
                    </div>
                </div>
                {user?.role !== 'ADMIN' && (
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 bg-white text-gray-600 px-6 py-3 rounded-2xl font-bold hover:text-blue-600 transition shadow-sm border border-gray-100 hover:shadow-md"
                    >
                        Browse More
                    </Link>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-3xl mb-10 flex items-center gap-4 font-bold animate-shake">
                    <div className="bg-red-100 p-2 rounded-xl">
                        <Clock size={20} />
                    </div>
                    {error}
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
                    <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Package className="w-12 h-12 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">No orders found</h3>
                    <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">
                        Your project's masterpiece is waiting. Explore our premium collection today!
                    </p>
                    <Link
                        to="/catalog"
                        className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-400/20 hover:scale-[1.02] active:scale-[0.98] transform"
                    >
                        EXPLORE CATALOG <ChevronRight className="w-6 h-6" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-10">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                            <div className="p-8 border-b border-gray-50 flex flex-wrap items-center justify-between gap-6 bg-gray-50/30">
                                <div className="flex flex-wrap items-center gap-10">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transaction ID</p>
                                        <p className="font-mono font-black text-gray-900 text-lg">#HS-{order.id.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div className="space-y-1 text-center md:text-left">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Acquisition Date</p>
                                        <div className="flex items-center gap-2 text-gray-900 font-extrabold">
                                            <Calendar className="w-4 h-4 text-blue-400" />
                                            {new Date(order.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                        </div>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Client</p>
                                            <p className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100/50">{order.user_id?.email || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-8">
                                    <span className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest border transition-colors ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Total Value</p>
                                        <p className="text-3xl font-black text-blue-600">
                                            {order.totalAmount.toLocaleString()} <span className="text-sm font-bold text-gray-400">LKR</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-100">
                                        <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5">Delivery Destination</p>
                                            <p className="text-gray-700 leading-relaxed font-bold text-sm">{order.address}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-blue-600/5 rounded-3xl p-8 border border-blue-100/50 relative overflow-hidden group/contents">
                                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/contents:scale-110 transition-transform duration-500">
                                        <Package size={80} />
                                    </div>
                                    <div className="flex items-center gap-3 mb-4 text-blue-600 relative">
                                        <div className="bg-white p-2 rounded-lg shadow-sm">
                                            <Package size={18} />
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.2em]">Project Materials</span>
                                    </div>
                                    <p className="text-sm text-gray-600 font-bold leading-relaxed relative">
                                        Premium slabs and architectural materials curated for your project's specific requirements.
                                    </p>
                                    <div className="mt-6 flex items-center gap-2 text-blue-600 font-black text-[10px] uppercase tracking-widest relative">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                                        Verified Heritage Quality
                                    </div>
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
