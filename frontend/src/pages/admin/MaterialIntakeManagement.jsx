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

    const getLocalDateString = () => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    const handleOpenAddModal = () => {
        setFormData({ purchaseOrderId: selectedOrderId || (orders.length > 0 ? orders[0].id : ''), arrivalDate: getLocalDateString(), quantityReceived: '', conditionNotes: '' });
        setIsModalOpen(true);
    };

    const showErrorMsg = (msg) => {
        setError(msg);
        setTimeout(() => setError(''), 5000);
    };

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        if (name === 'quantityReceived') {
            setFormData({ ...formData, quantityReceived: value.replace(/\D/g, '') });
        } else {
            setFormData({ ...formData, [name]: value }); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError('');
        if (new Date(formData.arrivalDate) < new Date(new Date().toDateString())) { showErrorMsg('Arrival date cannot be in the past.'); setIsSubmitting(false); return; }
        try {
            const newIntake = await supplierService.logMaterialIntake(formData);
            if (parseInt(selectedOrderId) === parseInt(formData.purchaseOrderId)) { setIntakes([...intakes, newIntake]); }
            else { setSelectedOrderId(formData.purchaseOrderId); }
            setIsModalOpen(false);
            await loadOrders();
        } catch (err) { showErrorMsg(err.response?.data || 'Failed to log intake.'); }
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

                    {error && (
                        <div className="fixed top-6 right-6 z-[100] max-w-sm w-full animate-fade-in shadow-2xl">
                            <div className="flex items-start gap-3 glass-card bg-red-50/95 backdrop-blur-md border-red-300 text-red-700 p-4 rounded-2xl">
                                <X className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium whitespace-pre-wrap">{error}</p>
                                </div>
                                <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg transition-colors"><X size={16}/></button>
                            </div>
                        </div>
                    )}

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
                                    <option value="" disabled>-- Select pending order --</option>
                                    {orders.filter(o => o.status === 'PENDING').map(o => (<option key={o.id} value={o.id}>PO-{o.id} - {o.productName || 'Unknown'} (Qty: {o.quantity})</option>))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-600">Arrival Date</label>
                                    <input type="date" name="arrivalDate" required value={formData.arrivalDate} onChange={handleInputChange} min={getLocalDateString()} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-semibold text-gray-600">Quantity Received</label>
                                    <input type="number" name="quantityReceived" min="1" step="1" required value={formData.quantityReceived} onChange={handleInputChange} onKeyDown={(e) => { if (!/^[0-9]$/.test(e.key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete', 'Tab'].includes(e.key)) e.preventDefault(); }} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
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
