import React, { useState, useEffect, useContext } from 'react';
import deliveryService from '../../services/deliveryService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Truck, Package, CheckCircle, X } from 'lucide-react';

const statusBadge = (status) => {
    const styles = {
        PENDING: 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50',
        SHIPPED: 'bg-blue-100/50 text-blue-700 border-blue-200/50',
        DELIVERED: 'bg-green-100/50 text-green-700 border-green-200/50',
        PAID: 'bg-purple-100/50 text-purple-700 border-purple-200/50',
    };
    const labels = { PENDING: 'Pending', SHIPPED: 'Shipped', DELIVERED: 'Delivered', PAID: 'Paid' };
    return <span className={`glass-badge ${styles[status] || 'bg-gray-100/50 text-gray-600'}`}>{labels[status] || status}</span>;
};

const DeliveryManagement = () => {
    const { user } = useContext(AuthContext);
    const [paidOrders, setPaidOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [assignForm, setAssignForm] = useState({ vehicleId: '', driverName: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { loadData(); }, []);
    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 4000); return () => clearTimeout(t); } }, [successMsg]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersData, deliveriesData] = await Promise.all([deliveryService.getOrdersReadyForDispatch(), deliveryService.getAllDeliveries()]);
            setPaidOrders(ordersData); setDeliveries(deliveriesData); setError('');
        } catch { setError('Failed to load delivery data.'); }
        finally { setLoading(false); }
    };

    const openAssignModal = async (order) => {
        setSelectedOrder(order); setAssignForm({ vehicleId: '', driverName: '' });
        try {
            const vehicles = await deliveryService.getAvailableVehicles();
            setAvailableVehicles(vehicles);
            if (vehicles.length === 0) { setError('No available vehicles.'); return; }
            setIsModalOpen(true);
        } catch { setError('Failed to load available vehicles.'); }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!assignForm.vehicleId || !assignForm.driverName.trim()) { setError('Please select a vehicle and enter a driver name.'); return; }
        setIsSubmitting(true);
        try {
            await deliveryService.assignVehicle(selectedOrder.id, Number(assignForm.vehicleId), assignForm.driverName.trim());
            setSuccessMsg(`Vehicle assigned to Order #${selectedOrder.id}!`);
            setIsModalOpen(false); setSelectedOrder(null); await loadData();
        } catch (err) { const msg = err.response?.data?.message || 'Failed to assign vehicle.'; setError(typeof msg === 'string' ? msg : 'Assignment failed.'); }
        finally { setIsSubmitting(false); }
    };

    const handleMarkDelivered = async (deliveryId) => {
        if (!window.confirm('Mark this delivery as delivered?')) return;
        try { await deliveryService.updateDeliveryStatus(deliveryId, 'DELIVERED'); setSuccessMsg('Delivery marked as delivered!'); await loadData(); }
        catch { setError('Failed to update delivery status.'); }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    return (
        <AdminLayout>
            <div className="p-4 space-y-6">
                {/* Header */}
                <div className="glass-card p-6 rounded-3xl flex items-center gap-3">
                    <div className="bg-accent/10 p-3 rounded-xl"><Truck size={24} className="text-accent" /></div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Delivery Management</h1>
                        <p className="text-gray-500 text-sm">Dispatch orders and track deliveries.</p>
                    </div>
                </div>

                {error && (
                    <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-3 rounded-xl font-semibold flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                    </div>
                )}
                {successMsg && (
                    <div className="glass-card bg-green-50/50 border-green-200/50 text-green-600 p-3 rounded-xl font-semibold flex items-center gap-2">
                        <CheckCircle size={16} /> {successMsg}
                    </div>
                )}

                {loading ? (
                    <div className="py-10 text-center text-gray-500">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                        Loading delivery data...
                    </div>
                ) : (
                    <>
                        {/* Paid Orders */}
                        <div className="glass-card p-6 rounded-3xl">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                                Paid Orders — Ready for Dispatch
                                <span className="ml-2 text-sm text-gray-400 font-normal">({paidOrders.length})</span>
                            </h2>
                            {paidOrders.length === 0 ? (
                                <p className="text-gray-400 py-4 text-center">No paid orders awaiting dispatch.</p>
                            ) : (
                                <div className="overflow-x-auto glass-table rounded-2xl">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className="border-b border-white/30">
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Order ID</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Customer</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Total</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Address</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Date</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Status</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/20">
                                            {paidOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-white/20 transition-colors">
                                                    <td className="py-3 px-6 font-bold text-gray-800">#{order.id}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">{order.userName || `User #${order.userId}`}</td>
                                                    <td className="py-3 px-6 text-sm font-bold text-gray-800">Rs. {Number(order.totalAmount).toLocaleString()}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600 max-w-xs truncate" title={order.address}>{order.address}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                                                    <td className="py-3 px-6">{statusBadge(order.status)}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        <button onClick={() => openAssignModal(order)} className="btn-accent px-4 py-1.5 rounded-lg text-xs font-bold">Assign Vehicle</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Active Deliveries */}
                        <div className="glass-card p-6 rounded-3xl">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                Active Deliveries
                                <span className="ml-2 text-sm text-gray-400 font-normal">({deliveries.length})</span>
                            </h2>
                            {deliveries.length === 0 ? (
                                <p className="text-gray-400 py-4 text-center">No deliveries yet.</p>
                            ) : (
                                <div className="overflow-x-auto glass-table rounded-2xl">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className="border-b border-white/30">
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">ID</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Order</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Vehicle</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Driver</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Est. Time</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Status</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Created</th>
                                                <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/20">
                                            {deliveries.map((d) => (
                                                <tr key={d.id} className="hover:bg-white/20 transition-colors">
                                                    <td className="py-3 px-6 font-bold text-gray-800">#{d.id}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">#{d.orderId}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">{d.vehicle?.licensePlate || '—'} <span className="text-gray-400 text-xs">({d.vehicle?.type})</span></td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">{d.driverName}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-600">{d.estimatedTime || '—'}</td>
                                                    <td className="py-3 px-6">{statusBadge(d.status)}</td>
                                                    <td className="py-3 px-6 text-sm text-gray-500">{new Date(d.createdAt).toLocaleString()}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        {d.status === 'SHIPPED' && (
                                                            <button onClick={() => handleMarkDelivered(d.id)} className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg shadow-green-500/20 hover:shadow-green-500/30 transition">
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                        {d.status === 'DELIVERED' && <span className="text-green-600 font-bold text-xs flex items-center justify-center gap-1"><CheckCircle size={14} /> Completed</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Assign Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-modal rounded-3xl w-full max-w-lg p-8 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-900">Assign Vehicle</h2>
                            <button onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        <p className="text-gray-500 mb-6 text-sm">Assigning to <strong className="text-gray-800">Order #{selectedOrder?.id}</strong> — {selectedOrder?.address}</p>
                        <form onSubmit={handleAssign} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Select Vehicle</label>
                                <select required value={assignForm.vehicleId} onChange={(e) => setAssignForm((p) => ({ ...p, vehicleId: e.target.value }))}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                    <option value="">— Choose a vehicle —</option>
                                    {availableVehicles.map((v) => (<option key={v.id} value={v.id}>{v.licensePlate} — {v.type} ({v.capacity} kg)</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Driver Name</label>
                                <input type="text" required placeholder="e.g., John Silva" value={assignForm.driverName}
                                    onChange={(e) => setAssignForm((p) => ({ ...p, driverName: e.target.value }))}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">
                                    {isSubmitting ? 'Assigning...' : 'Assign & Dispatch'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default DeliveryManagement;
