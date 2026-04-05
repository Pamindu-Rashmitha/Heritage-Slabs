import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import productService from '../../services/productService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ClipboardList, Plus, RefreshCw, X } from 'lucide-react';

const PurchaseOrderManagement = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [formData, setFormData] = useState({ supplierId: '', productId: '', orderDate: '', expectedDelivery: '', quantity: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ordersData, suppliersData, productsData] = await Promise.all([supplierService.getAllPurchaseOrders(), supplierService.getAllSuppliers(), productService.getAllProducts()]);
            setOrders(ordersData); setSuppliers(suppliersData); setProducts(productsData); setError('');
        } catch (err) { console.error("Error:", err); setError('Failed to load purchase orders.'); }
        finally { setLoading(false); }
    };

    const handleOpenAddModal = () => {
        setFormData({ supplierId: suppliers.length > 0 ? suppliers[0].id : '', productId: products.length > 0 ? products[0].id : '', orderDate: new Date().toISOString().split('T')[0], expectedDelivery: '', quantity: '' });
        setIsModalOpen(true);
    };

    const handleOpenStatusModal = (order) => { setSelectedOrder(order); setNewStatus(order.status); setIsStatusModalOpen(true); };
    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError('');
        if (new Date(formData.expectedDelivery) < new Date(formData.orderDate)) { setError('Expected delivery date cannot be before the order date.'); setIsSubmitting(false); return; }
        try {
            const payload = { ...formData, supplierId: parseInt(formData.supplierId, 10), productId: parseInt(formData.productId, 10), quantity: parseInt(formData.quantity, 10) };
            const newOrder = await supplierService.createPurchaseOrder(payload);
            setOrders([...orders, newOrder]); setIsModalOpen(false);
        } catch (err) {
            const errData = err.response?.data;
            if (typeof errData === 'object' && errData !== null) { alert(Object.values(errData).join('\n') || 'Failed to save.'); }
            else { alert(errData || 'Failed to save.'); }
        } finally { setIsSubmitting(false); }
    };

    const handleStatusSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true);
        try { const updated = await supplierService.updatePurchaseOrderStatus(selectedOrder.id, newStatus); setOrders(orders.map(o => o.id === updated.id ? updated : o)); setIsStatusModalOpen(false); }
        catch (err) { alert('Failed to update status.'); }
        finally { setIsSubmitting(false); }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-yellow-100/50 text-yellow-800 border-yellow-200/50';
            case 'PARTIALLY_DELIVERED': return 'bg-blue-100/50 text-blue-800 border-blue-200/50';
            case 'DELIVERED': return 'bg-green-100/50 text-green-800 border-green-200/50';
            case 'CANCELLED': return 'bg-red-100/50 text-red-800 border-red-200/50';
            default: return 'bg-gray-100/50 text-gray-800';
        }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><ClipboardList size={24} className="text-accent" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Purchase Orders</h1>
                                <p className="text-gray-500 text-sm">Create and manage supplier purchase orders.</p>
                            </div>
                        </div>
                        <button className="btn-accent px-5 py-2.5 rounded-xl font-bold flex items-center gap-2" onClick={handleOpenAddModal}>
                            <Plus size={18} /> Create Order
                        </button>
                    </div>

                    {error && <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-3 rounded-xl mb-4 font-semibold">{error}</div>}

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                            Loading purchase orders...
                        </div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        {['ID', 'Supplier', 'Material', 'Dates', 'Qty', 'Status', 'Actions'].map(h => (
                                            <th key={h} className={`px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider ${h === 'Actions' ? 'text-center' : 'text-left'}`}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {orders.length === 0 ? (
                                        <tr><td colSpan="7" className="py-6 text-center text-gray-400">No purchase orders found.</td></tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order.id} className="hover:bg-white/20 transition-colors">
                                                <td className="px-6 py-3 font-bold text-gray-800">PO-{order.id}</td>
                                                <td className="px-6 py-3 text-sm font-bold text-gray-800">{order.supplierName}</td>
                                                <td className="px-6 py-3"><span className="glass-badge text-blue-700 bg-blue-100/50 border-blue-200/50">{order.productName || '—'}</span></td>
                                                <td className="px-6 py-3 text-xs text-gray-600">
                                                    <div><span className="font-semibold">Ordered:</span> {order.orderDate}</div>
                                                    <div><span className="font-semibold">Expected:</span> {order.expectedDelivery}</div>
                                                </td>
                                                <td className="px-6 py-3 text-sm font-bold text-gray-700">{order.quantity}</td>
                                                <td className="px-6 py-3"><span className={`glass-badge ${getStatusColor(order.status)}`}>{order.status.replace('_', ' ')}</span></td>
                                                <td className="px-6 py-3 text-center">
                                                    <button onClick={() => handleOpenStatusModal(order)} className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1">
                                                        <RefreshCw size={14} /> Update
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
            </div>

            {/* Add PO Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal w-full max-w-2xl p-8 rounded-3xl overflow-y-auto max-h-[90vh] animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Create Purchase Order</h2>
                            <button onClick={() => setIsModalOpen(false)} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        {suppliers.length === 0 ? (
                            <div className="p-4 glass bg-yellow-50/50 text-yellow-800 rounded-xl font-semibold">
                                You must create a Supplier before placing a Purchase Order.
                                <button type="button" onClick={() => setIsModalOpen(false)} className="ml-4 underline">Close</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2">
                                        <label className="block mb-1 text-sm font-semibold text-gray-600">Select Supplier</label>
                                        <select name="supplierId" required value={formData.supplierId} onChange={handleInputChange}
                                            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                            <option value="" disabled>-- Select a Supplier --</option>
                                            {suppliers.map(sup => (<option key={sup.id} value={sup.id}>{sup.name} (Supplies: {sup.suppliedMaterial})</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-600">Order Date</label>
                                        <input type="date" name="orderDate" required value={formData.orderDate} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-600">Expected Delivery</label>
                                        <input type="date" name="expectedDelivery" required value={formData.expectedDelivery} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-600">Material (Product)</label>
                                        <select name="productId" required value={formData.productId} onChange={handleInputChange}
                                            className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                            <option value="" disabled>Select product...</option>
                                            {products.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.grade})</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-sm font-semibold text-gray-600">Quantity</label>
                                        <input type="number" name="quantity" required value={formData.quantity} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/30">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                    <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Place Order'}</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Status Modal */}
            {isStatusModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal w-full max-w-sm p-8 rounded-3xl animate-scale-in">
                        <h2 className="mb-4 text-xl font-bold text-gray-900">Update PO Status</h2>
                        <form onSubmit={handleStatusSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2 text-sm font-semibold text-gray-600">Order PO-{selectedOrder?.id}</label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                    <option value="PENDING">Pending</option>
                                    <option value="PARTIALLY_DELIVERED">Partially Delivered</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsStatusModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default PurchaseOrderManagement;
