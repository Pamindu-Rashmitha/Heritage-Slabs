import React, { useState, useEffect, useContext } from 'react';
import deliveryService from '../../services/deliveryService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const statusBadge = (status) => {
    const styles = {
        PENDING: 'bg-yellow-100 text-yellow-700',
        SHIPPED: 'bg-blue-100 text-blue-700',
        DELIVERED: 'bg-green-100 text-green-700',
        PAID: 'bg-purple-100 text-purple-700',
    };
    const labels = {
        PENDING: 'Pending',
        SHIPPED: 'Shipped',
        DELIVERED: 'Delivered',
        PAID: 'Paid',
    };
    return (
        <span className={`py-1 px-3 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {labels[status] || status}
        </span>
    );
};

const DeliveryManagement = () => {
    const { user } = useContext(AuthContext);
    const [paidOrders, setPaidOrders] = useState([]);
    const [deliveries, setDeliveries] = useState([]);
    const [availableVehicles, setAvailableVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Assign modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [assignForm, setAssignForm] = useState({ vehicleId: '', driverName: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (successMsg) {
            const t = setTimeout(() => setSuccessMsg(''), 4000);
            return () => clearTimeout(t);
        }
    }, [successMsg]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersData, deliveriesData] = await Promise.all([
                deliveryService.getOrdersReadyForDispatch(),
                deliveryService.getAllDeliveries(),
            ]);
            setPaidOrders(ordersData);
            setDeliveries(deliveriesData);
            setError('');
        } catch {
            setError('Failed to load delivery data. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const openAssignModal = async (order) => {
        setSelectedOrder(order);
        setAssignForm({ vehicleId: '', driverName: '' });
        try {
            const vehicles = await deliveryService.getAvailableVehicles();
            setAvailableVehicles(vehicles);
            if (vehicles.length === 0) {
                setError('No available vehicles. Please add or free up a vehicle first.');
                return;
            }
            setIsModalOpen(true);
        } catch {
            setError('Failed to load available vehicles.');
        }
    };

    const handleAssign = async (e) => {
        e.preventDefault();
        if (!assignForm.vehicleId || !assignForm.driverName.trim()) {
            setError('Please select a vehicle and enter a driver name.');
            return;
        }
        setIsSubmitting(true);
        try {
            await deliveryService.assignVehicle(
                selectedOrder.id,
                Number(assignForm.vehicleId),
                assignForm.driverName.trim()
            );
            setSuccessMsg(`Vehicle assigned to Order #${selectedOrder.id} successfully!`);
            setIsModalOpen(false);
            setSelectedOrder(null);
            await loadData();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to assign vehicle.';
            setError(typeof msg === 'string' ? msg : 'Assignment failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMarkDelivered = async (deliveryId) => {
        if (!window.confirm('Mark this delivery as delivered?')) return;
        try {
            await deliveryService.updateDeliveryStatus(deliveryId, 'DELIVERED');
            setSuccessMsg('Delivery marked as delivered!');
            await loadData();
        } catch {
            setError('Failed to update delivery status.');
        }
    };

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header */}
                <h1 className="text-3xl font-bold text-gray-800">Delivery Management</h1>

                {/* Feedback messages */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-700 font-bold ml-4">×</button>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-100 text-green-700 p-3 rounded">
                        {successMsg}
                    </div>
                )}

                {loading ? (
                    <p className="text-gray-600">Loading delivery data...</p>
                ) : (
                    <>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="inline-block w-3 h-3 rounded-full bg-purple-500"></span>
                                Paid Orders - Ready for Dispatch
                                <span className="ml-2 text-sm font-normal text-gray-400">({paidOrders.length})</span>
                            </h2>
                            {paidOrders.length === 0 ? (
                                <p className="text-gray-400 py-4 text-center">No paid orders awaiting dispatch.</p>
                            ) : (
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6">Order ID</th>
                                                <th className="py-3 px-6">Customer</th>
                                                <th className="py-3 px-6">Total</th>
                                                <th className="py-3 px-6">Address</th>
                                                <th className="py-3 px-6">Order Date</th>
                                                <th className="py-3 px-6">Status</th>
                                                <th className="py-3 px-6 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {paidOrders.map((order) => (
                                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                    <td className="py-3 px-6 font-bold text-gray-800">#{order.id}</td>
                                                    <td className="py-3 px-6">{order.userName || `User #${order.userId}`}</td>
                                                    <td className="py-3 px-6">Rs. {Number(order.totalAmount).toLocaleString()}</td>
                                                    <td className="py-3 px-6 max-w-xs truncate" title={order.address}>{order.address}</td>
                                                    <td className="py-3 px-6">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : '—'}</td>
                                                    <td className="py-3 px-6">{statusBadge(order.status)}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        <button
                                                            onClick={() => openAssignModal(order)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-4 rounded shadow text-xs transition"
                                                        >
                                                            Assign Vehicle
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                                Active Deliveries
                                <span className="ml-2 text-sm font-normal text-gray-400">({deliveries.length})</span>
                            </h2>
                            {deliveries.length === 0 ? (
                                <p className="text-gray-400 py-4 text-center">No deliveries yet.</p>
                            ) : (
                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                                <th className="py-3 px-6">Delivery ID</th>
                                                <th className="py-3 px-6">Order ID</th>
                                                <th className="py-3 px-6">Vehicle</th>
                                                <th className="py-3 px-6">Driver</th>
                                                <th className="py-3 px-6">Est. Time</th>
                                                <th className="py-3 px-6">Status</th>
                                                <th className="py-3 px-6">Created</th>
                                                <th className="py-3 px-6 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-gray-600 text-sm font-light">
                                            {deliveries.map((d) => (
                                                <tr key={d.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                                    <td className="py-3 px-6 font-bold text-gray-800">#{d.id}</td>
                                                    <td className="py-3 px-6">#{d.orderId}</td>
                                                    <td className="py-3 px-6">{d.vehicle?.licensePlate || '—'} <span className="text-gray-400 text-xs">({d.vehicle?.type})</span></td>
                                                    <td className="py-3 px-6">{d.driverName}</td>
                                                    <td className="py-3 px-6">{d.estimatedTime || '—'}</td>
                                                    <td className="py-3 px-6">{statusBadge(d.status)}</td>
                                                    <td className="py-3 px-6">{new Date(d.createdAt).toLocaleString()}</td>
                                                    <td className="py-3 px-6 text-center">
                                                        {d.status === 'SHIPPED' && (
                                                            <button
                                                                onClick={() => handleMarkDelivered(d.id)}
                                                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-1.5 px-4 rounded shadow text-xs transition"
                                                            >
                                                                Mark Delivered
                                                            </button>
                                                        )}
                                                        {d.status === 'DELIVERED' && (
                                                            <span className="text-green-600 font-semibold text-xs">✓ Completed</span>
                                                        )}
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold mb-2">Assign Vehicle</h2>
                        <p className="text-gray-500 mb-4 text-sm">
                            Assigning to <strong>Order #{selectedOrder?.id}</strong> — {selectedOrder?.address}
                        </p>
                        <form onSubmit={handleAssign}>
                            <div className="space-y-4">
                                {/* Vehicle Select */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Select Vehicle</label>
                                    <select
                                        required
                                        value={assignForm.vehicleId}
                                        onChange={(e) => setAssignForm((p) => ({ ...p, vehicleId: e.target.value }))}
                                        className="w-full border p-2 rounded"
                                    >
                                        <option value="">— Choose a vehicle —</option>
                                        {availableVehicles.map((v) => (
                                            <option key={v.id} value={v.id}>
                                                {v.licensePlate} — {v.type} ({v.capacity} kg)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Driver Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Driver Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g., John Silva"
                                        value={assignForm.driverName}
                                        onChange={(e) => setAssignForm((p) => ({ ...p, driverName: e.target.value }))}
                                        className="w-full border p-2 rounded"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setSelectedOrder(null); }}
                                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                >
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
