import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { ShoppingBag, ChevronRight, Package, Calendar, Clock, MapPin, Truck, Download, CreditCard, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';

const OrdersList = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user) return;
            try {
                let data;
                if (user.role === 'ADMIN') { data = await orderService.getAllOrders(); }
                else { data = await orderService.getOrdersByEmail(user.email); }
                const sortedOrders = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setOrders(sortedOrders);
            } catch (err) {
                console.error("Failed to fetch orders", err);
                setError("Failed to load orders.");
            } finally { setLoading(false); }
        };
        fetchOrders();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-emerald-100/60 text-emerald-700 border-emerald-200/50';
            case 'pending': return 'bg-amber-100/60 text-amber-700 border-amber-200/50';
            case 'shipped': return 'bg-blue-100/60 text-blue-700 border-blue-200/50';
            default: return 'bg-gray-100/60 text-gray-700 border-gray-200/50';
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try { await orderService.downloadInvoice(orderId); }
        catch (err) { console.error("Failed to download invoice", err); alert("Sorry, there was an issue downloading the invoice."); }
    };

    const handleProceedPayment = async (orderId) => {
        try {
            const payhereData = await orderService.initiatePayment(orderId);
            const form = document.createElement('form');
            form.method = 'POST'; form.action = 'https://sandbox.payhere.lk/pay/checkout';
            Object.keys(payhereData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden'; input.name = key; input.value = payhereData[key];
                form.appendChild(input);
            });
            document.body.appendChild(form); form.submit();
        } catch (err) { console.error("Failed to initiate payment", err); alert("Failed to initiate payment."); }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to delete this order?')) return;
        setDeletingId(orderId);
        try { await orderService.deleteOrder(orderId); setOrders(prev => prev.filter(o => o.id !== orderId)); }
        catch (err) { console.error("Failed to delete order", err); alert("Failed to delete order."); }
        finally { setDeletingId(null); }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
        );
    }

    const content = (
        <div className={`max-w-7xl mx-auto px-4 ${user?.role === 'ADMIN' ? 'py-4' : 'pt-28 pb-12'}`}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 ${user?.role === 'ADMIN' ? 'glass-card p-6 rounded-3xl' : ''}`}>
                <div className="flex items-center gap-4">
                    <div className="bg-accent/10 p-3 rounded-xl">
                        <ShoppingBag className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                            {user?.role === 'ADMIN' ? 'Order Management' : 'My Orders'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {user?.role === 'ADMIN' ? 'Review and manage all customer slab acquisitions' : 'View and track your previous premium purchases'}
                        </p>
                    </div>
                </div>
                <Link to="/catalog" className="inline-flex items-center gap-2 glass-btn px-5 py-2.5 rounded-xl font-semibold text-gray-600 hover:text-accent">
                    Browse More
                </Link>
            </div>

            {error && (
                <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-4 rounded-xl mb-6 flex items-center gap-3 font-semibold">
                    <Clock size={18} /> {error}
                </div>
            )}

            {orders.length === 0 && !error ? (
                <div className="glass-card rounded-3xl p-16 text-center max-w-2xl mx-auto">
                    <div className="glass w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-gray-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No orders found</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Your project's masterpiece is waiting.</p>
                    <Link to="/catalog" className="inline-flex items-center gap-2 btn-accent px-8 py-4 rounded-xl font-bold">
                        EXPLORE CATALOG <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="glass-card rounded-3xl overflow-hidden hover:shadow-glass-lg transition-shadow group">
                            <div className="p-6 border-b border-white/20 flex flex-wrap items-center justify-between gap-4">
                                <div className="flex flex-wrap items-center gap-8">
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Transaction ID</p>
                                        <p className="font-mono font-bold text-gray-800 text-base">#HS-{order.id.toString().padStart(5, '0')}</p>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</p>
                                        <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                                            <Calendar className="w-3.5 h-3.5 text-accent" />
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                    </div>
                                    {user?.role === 'ADMIN' && (
                                        <div className="space-y-0.5">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client</p>
                                            <p className="text-xs font-semibold text-accent glass-badge">{order.user_id?.email || 'N/A'}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border backdrop-blur-sm ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Value</p>
                                        <p className="text-2xl font-bold bg-clip-text text-transparent bg-accent-gradient">
                                            {order.totalAmount.toLocaleString()} <span className="text-xs font-semibold text-gray-400 uppercase">Lkr</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3 p-4 glass rounded-2xl">
                                        <div className="glass-btn p-2 rounded-lg flex-shrink-0"><MapPin className="w-4 h-4 text-accent" /></div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Delivery Destination</p>
                                            <p className="text-gray-700 leading-relaxed font-semibold text-xs">{order.address}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="glass rounded-2xl p-5 border-l-4 border-accent/30 space-y-2">
                                    <div className="flex items-center gap-2 text-accent">
                                        <Package size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Project Materials</span>
                                    </div>
                                    <p className="text-xs text-gray-600 font-semibold leading-relaxed">
                                        Premium slabs curated for your project's specific requirements.
                                    </p>
                                </div>
                            </div>

                            <div className="p-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3">
                                {order.status?.toLowerCase() === 'pending' && (
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => handleProceedPayment(order.id)}
                                            className="inline-flex items-center gap-2 btn-accent px-5 py-2.5 rounded-xl text-xs font-bold uppercase">
                                            <CreditCard className="w-4 h-4" /> Pay Now
                                        </button>
                                        <button onClick={() => handleDeleteOrder(order.id)} disabled={deletingId === order.id}
                                            className="inline-flex items-center gap-2 text-red-500 glass-btn border-red-200/50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase disabled:opacity-50">
                                            <Trash2 className="w-4 h-4" /> {deletingId === order.id ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                )}
                                {order.status?.toLowerCase() === 'failed' && (
                                    <button onClick={() => handleDeleteOrder(order.id)} disabled={deletingId === order.id}
                                        className="inline-flex items-center gap-2 text-red-500 glass-btn border-red-200/50 px-4 py-2.5 rounded-xl text-xs font-bold uppercase disabled:opacity-50">
                                        <Trash2 className="w-4 h-4" /> {deletingId === order.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                )}
                                {order.status?.toLowerCase() !== 'pending' && order.status?.toLowerCase() !== 'failed' && <div />}
                                <button onClick={() => handleDownloadInvoice(order.id)}
                                    className="inline-flex items-center gap-2 glass-btn px-4 py-2 rounded-xl text-xs font-bold uppercase text-gray-700 hover:text-accent">
                                    <Download className="w-4 h-4" /> Download Invoice
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    if (user?.role === 'ADMIN') { return <AdminLayout>{content}</AdminLayout>; }
    return <div className="min-h-screen">{content}</div>;
};

export default OrdersList;