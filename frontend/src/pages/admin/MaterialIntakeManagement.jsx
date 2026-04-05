import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { PackageCheck, Plus, Filter, X } from 'lucide-react';

const MaterialIntakeManagement = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [intakes, setIntakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ purchaseOrderId: '', arrivalDate: '', quantityReceived: '', conditionNotes: '' });

    useEffect(() => { loadOrders(); }, []);
    useEffect(() => { if (selectedOrderId) loadIntakes(selectedOrderId); else setIntakes([]); }, [selectedOrderId]);

    const loadOrders = async () => {
        try { setLoading(true); const data = await supplierService.getAllPurchaseOrders(); setOrders(data.filter(o => o.status !== 'CANCELLED')); setError(''); }
        catch (err) { console.error("Error:", err); setError('Failed to load purchase orders.'); }
        finally { setLoading(false); }
    };

    const loadIntakes = async (poId) => {
        try { setLoading(true); const data = await supplierService.getIntakesByPurchaseOrder(poId); setIntakes(data); }
        catch (err) { console.error("Error:", err); setError('Failed to load material intakes.'); }
        finally { setLoading(false); }
    };

    const handleOpenAddModal = () => {
        setFormData({ purchaseOrderId: selectedOrderId || (orders.length > 0 ? orders[0].id : ''), arrivalDate: new Date().toISOString().split('T')[0], quantityReceived: '', conditionNotes: '' });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError('');
        if (new Date(formData.arrivalDate) > new Date()) { setError('Arrival date cannot be in the future.'); setIsSubmitting(false); return; }
        try {
            const newIntake = await supplierService.logMaterialIntake(formData);
            if (parseInt(selectedOrderId) === parseInt(formData.purchaseOrderId)) { setIntakes([...intakes, newIntake]); }
            else { setSelectedOrderId(formData.purchaseOrderId); }
            setIsModalOpen(false);
        } catch (err) { alert(err.response?.data || 'Failed to log intake.'); }
        finally { setIsSubmitting(false); }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><PackageCheck size={24} className="text-accent" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Material Intakes</h1>
                                <p className="text-gray-500 text-sm">Log and track incoming material shipments.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={selectedOrderId} onChange={(e) => setSelectedOrderId(e.target.value)}
                                className="px-4 py-2.5 glass-input rounded-xl text-gray-800 font-medium min-w-[220px] appearance-none cursor-pointer">
                                <option value="">-- Filter by Purchase Order --</option>
                                {orders.map(o => (<option key={o.id} value={o.id}>PO-{o.id} ({o.productName || 'Unknown'}) - {o.supplierName}</option>))}
                            </select>
                            <button className="btn-accent px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap" onClick={handleOpenAddModal} disabled={orders.length === 0}>
                                <Plus size={18} /> Log Intake
                            </button>
                        </div>
                    </div>

                    {error && <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-3 rounded-xl mb-4 font-semibold">{error}</div>}

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                            Loading...
                        </div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl mt-4">
                            {selectedOrderId === '' ? (
                                <div className="py-12 text-center text-gray-400 glass rounded-2xl">
                                    <Filter className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-lg font-medium">Select a Purchase Order to view its intakes.</p>
                                </div>
                            ) : (
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr className="border-b border-white/30">
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Intake ID</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Arrival Date</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Qty Received</th>
                                            <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Condition Notes</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/20">
                                        {intakes.length === 0 ? (
                                            <tr><td colSpan="4" className="py-6 text-center text-gray-400">No materials logged for this order yet.</td></tr>
                                        ) : (
                                            intakes.map((intake) => (
                                                <tr key={intake.id} className="hover:bg-white/20 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-800">#{intake.id}</td>
                                                    <td className="px-6 py-4 font-medium text-gray-700">{intake.arrivalDate}</td>
                                                    <td className="px-6 py-4"><span className="glass-badge text-blue-700 bg-blue-100/50 border-blue-200/50">{intake.quantityReceived} Units</span></td>
                                                    <td className="px-6 py-4 text-gray-600">
                                                        {intake.conditionNotes ? <span className="italic">"{intake.conditionNotes}"</span> : <span className="text-gray-400">No notes</span>}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal w-full max-w-lg p-8 rounded-3xl overflow-y-auto max-h-[90vh] animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Log Material Intake</h2>
                            <button onClick={() => setIsModalOpen(false)} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Target Purchase Order</label>
                                <select name="purchaseOrderId" required value={formData.purchaseOrderId} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                    <option value="" disabled>-- Select order --</option>
                                    {orders.map(o => (<option key={o.id} value={o.id}>PO-{o.id} - {o.productName || 'Unknown'} (Qty: {o.quantity})</option>))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-600">Arrival Date</label>
                                    <input type="date" name="arrivalDate" required value={formData.arrivalDate} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-600">Quantity Received</label>
                                    <input type="number" name="quantityReceived" required value={formData.quantityReceived} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                </div>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Condition Notes (Optional)</label>
                                <textarea name="conditionNotes" rows="3" value={formData.conditionNotes} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium resize-y" placeholder="e.g., 'Good quality' or '2 slabs cracked'" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/30">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">{isSubmitting ? 'Logging...' : 'Save Intake'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default MaterialIntakeManagement;
