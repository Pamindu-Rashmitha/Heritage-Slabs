import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const PurchaseOrderManagement = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- MODAL & FORM STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Status update modal
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');

    const [formData, setFormData] = useState({
        supplierId: '',
        orderDate: '',
        expectedDelivery: '',
        materialOrdered: '',
        quantity: '',
        totalCost: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, suppliersData] = await Promise.all([
                supplierService.getAllPurchaseOrders(),
                supplierService.getAllSuppliers()
            ]);
            setOrders(ordersData);
            setSuppliers(suppliersData);
            setError('');
        } catch (err) {
            console.error("Error loading data:", err);
            setError('Failed to load purchase orders. Ensure the backend is running and you have proper permissions.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setFormData({
            supplierId: suppliers.length > 0 ? suppliers[0].id : '',
            orderDate: new Date().toISOString().split('T')[0], // Today's date
            expectedDelivery: '',
            materialOrdered: '',
            quantity: '',
            totalCost: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsStatusModalOpen(true);
    };

    // --- FORM HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const newOrder = await supplierService.createPurchaseOrder(formData);
            setOrders([...orders, newOrder]);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving purchase order:", err);
            alert(err.response?.data || 'Failed to save purchase order. Please check inputs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStatusSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const updatedOrder = await supplierService.updatePurchaseOrderStatus(selectedOrder.id, newStatus);
            setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o));
            setIsStatusModalOpen(false);
        } catch (err) {
            console.error("Error updating status:", err);
            alert('Failed to update status.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'PARTIALLY_DELIVERED': return 'bg-blue-100 text-blue-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Purchase Orders</h1>
                    <button
                        className="px-4 py-2 font-semibold text-white transition bg-green-600 rounded shadow hover:bg-green-700"
                        onClick={handleOpenAddModal}
                    >
                        + Create Order
                    </button>
                </div>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                {/* --- TABLE --- */}
                {loading ? (
                    <div className="py-10 text-center">
                        <div className="inline-block w-8 h-8 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading purchase orders...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white border rounded-lg shadow-md">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="text-sm leading-normal text-left text-gray-600 uppercase bg-gray-100">
                                    <th className="px-6 py-3">PO #</th>
                                    <th className="px-6 py-3">Supplier</th>
                                    <th className="px-6 py-3">Material & Qty</th>
                                    <th className="px-6 py-3">Dates</th>
                                    <th className="px-6 py-3">Cost (LKR)</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-light text-gray-600">
                                {orders.length === 0 ? (
                                    <tr><td colSpan="7" className="py-6 text-center text-gray-500">No purchase orders found. Create one.</td></tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-3 text-left whitespace-nowrap">
                                                <span className="font-bold text-gray-800">PO-{order.id}</span>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <div className="font-medium text-gray-800">{order.supplierName}</div>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <div className="font-medium">{order.materialOrdered}</div>
                                                <div className="text-xs text-gray-500">Qty: {order.quantity}</div>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <div className="text-xs"><span className="font-semibold text-gray-700">Ordered:</span> {order.orderDate}</div>
                                                <div className="text-xs"><span className="font-semibold text-gray-700">Expected:</span> {order.expectedDelivery}</div>
                                            </td>
                                            <td className="px-6 py-3 text-left font-medium">
                                                {order.totalCost.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <button
                                                    onClick={() => handleOpenStatusModal(order)}
                                                    className="font-medium text-blue-500 transition hover:text-blue-700"
                                                >
                                                    Update Status
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- ADD NEW PO MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-2xl p-6 overflow-y-auto bg-white rounded-lg shadow-2xl max-h-[90vh]">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-2">
                            Create Purchase Order
                        </h2>

                        {suppliers.length === 0 ? (
                            <div className="p-4 bg-yellow-100 text-yellow-800 rounded">
                                You must create a Supplier before placing a Purchase Order.
                                <button type="button" onClick={() => setIsModalOpen(false)} className="ml-4 underline font-semibold">Close</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Select Supplier</label>
                                        <select
                                            name="supplierId"
                                            required
                                            value={formData.supplierId}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="" disabled>-- Select a Supplier --</option>
                                            {suppliers.map(sup => (
                                                <option key={sup.id} value={sup.id}>{sup.name} (Supplies: {sup.suppliedMaterial})</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Order Date</label>
                                        <input
                                            type="date"
                                            name="orderDate"
                                            required
                                            value={formData.orderDate}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Expected Delivery</label>
                                        <input
                                            type="date"
                                            name="expectedDelivery"
                                            required
                                            value={formData.expectedDelivery}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Material Ordered</label>
                                        <input
                                            type="text"
                                            name="materialOrdered"
                                            required
                                            value={formData.materialOrdered}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            placeholder="e.g., 20mm Galaxy Black Granite"
                                        />
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Quantity (Units or Slabs)</label>
                                        <input
                                            type="number"
                                            name="quantity"
                                            required
                                            value={formData.quantity}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">Total Cost (LKR)</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="totalCost"
                                            required
                                            value={formData.totalCost}
                                            onChange={handleInputChange}
                                            className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-5 py-2.5 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                    >
                                        {isSubmitting ? 'Saving...' : 'Place Order'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* --- UPDATE STATUS MODAL --- */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-sm p-6 overflow-y-auto bg-white rounded-lg shadow-2xl">
                        <h2 className="mb-4 text-xl font-bold text-gray-800">Update PO Status</h2>
                        <form onSubmit={handleStatusSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-medium text-gray-700">Order PO-{selectedOrder?.id}</label>
                                <select
                                    name="status"
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="PENDING">Pending</option>
                                    <option value="PARTIALLY_DELIVERED">Partially Delivered</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </AdminLayout>
    );
};

export default PurchaseOrderManagement;
