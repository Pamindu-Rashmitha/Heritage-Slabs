import React, { useState, useEffect, useContext } from 'react';
import vehicleService from '../../services/vehicleService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Truck, Plus, Edit3, Trash2, X, CheckCircle } from 'lucide-react';

const VEHICLE_TYPES = ['Truck', 'Van', 'Lorry', 'Tipper'];
const VEHICLE_STATUSES = ['AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE'];

const statusBadge = (status) => {
    const styles = {
        AVAILABLE: 'bg-green-100/50 text-green-700 border-green-200/50',
        IN_TRANSIT: 'bg-blue-100/50 text-blue-700 border-blue-200/50',
        MAINTENANCE: 'bg-amber-100/50 text-amber-700 border-amber-200/50',
    };
    const labels = { AVAILABLE: 'Available', IN_TRANSIT: 'In Transit', MAINTENANCE: 'Maintenance' };
    return <span className={`glass-badge ${styles[status] || 'bg-gray-100/50 text-gray-600'}`}>{labels[status] || status}</span>;
};

const emptyForm = { licensePlate: '', type: 'Truck', capacity: '', status: 'AVAILABLE' };

const VehicleManagement = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ ...emptyForm });

    useEffect(() => { loadVehicles(); }, []);
    useEffect(() => { if (successMsg) { const t = setTimeout(() => setSuccessMsg(''), 3000); return () => clearTimeout(t); } }, [successMsg]);

    const loadVehicles = async () => {
        try { setLoading(true); const data = await vehicleService.getAllVehicles(); setVehicles(data); setError(''); }
        catch { setError('Failed to load vehicles.'); }
        finally { setLoading(false); }
    };

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData((prev) => ({ ...prev, [name]: value })); };
    const openAddModal = () => { setEditingId(null); setFormData({ ...emptyForm }); setIsModalOpen(true); };
    const openEditModal = (vehicle) => {
        setEditingId(vehicle.id);
        setFormData({ licensePlate: vehicle.licensePlate, type: vehicle.type, capacity: vehicle.capacity, status: vehicle.status });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true);
        try {
            const payload = { licensePlate: formData.licensePlate, type: formData.type, capacity: Number(formData.capacity), ...(editingId ? { status: formData.status } : {}) };
            if (editingId) { await vehicleService.updateVehicle(editingId, payload); setSuccessMsg('Vehicle updated!'); }
            else { await vehicleService.createVehicle(payload); setSuccessMsg('Vehicle added!'); }
            setIsModalOpen(false); setFormData({ ...emptyForm }); setEditingId(null); await loadVehicles();
        } catch (err) {
            const data = err.response?.data;
            let msg = 'Operation failed.';
            if (data) { if (typeof data === 'string') msg = data; else if (data.message) msg = data.message; else if (typeof data === 'object') msg = Object.values(data).join(', '); }
            setError(msg);
        } finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this vehicle?')) return;
        try { await vehicleService.deleteVehicle(id); setVehicles((prev) => prev.filter((v) => v.id !== id)); setSuccessMsg('Vehicle deleted.'); }
        catch { setError('Failed to delete vehicle.'); }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><Truck size={24} className="text-accent" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Vehicle Management</h1>
                                <p className="text-gray-500 text-sm">Manage your delivery fleet.</p>
                            </div>
                        </div>
                        <button className="btn-accent px-5 py-2.5 rounded-xl font-bold flex items-center gap-2" onClick={openAddModal}>
                            <Plus size={18} /> Add Vehicle
                        </button>
                    </div>

                    {error && (
                        <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-3 rounded-xl mb-4 font-semibold flex justify-between items-center">
                            <span>{error}</span>
                            <button onClick={() => setError('')} className="text-red-400 hover:text-red-600"><X size={16} /></button>
                        </div>
                    )}
                    {successMsg && (
                        <div className="glass-card bg-green-50/50 border-green-200/50 text-green-600 p-3 rounded-xl mb-4 font-semibold flex items-center gap-2">
                            <CheckCircle size={16} /> {successMsg}
                        </div>
                    )}

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                            Loading vehicles...
                        </div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">License Plate</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Type</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Capacity (kg)</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Status</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {vehicles.length === 0 ? (
                                        <tr><td colSpan="5" className="py-6 text-center text-gray-400">No vehicles found.</td></tr>
                                    ) : (
                                        vehicles.map((v) => (
                                            <tr key={v.id} className="hover:bg-white/20 transition-colors">
                                                <td className="py-3 px-6 font-bold text-gray-800">{v.licensePlate}</td>
                                                <td className="py-3 px-6 text-sm text-gray-600">{v.type}</td>
                                                <td className="py-3 px-6 text-sm text-gray-600">{v.capacity}</td>
                                                <td className="py-3 px-6">{statusBadge(v.status)}</td>
                                                <td className="py-3 px-6 text-center space-x-2">
                                                    <button onClick={() => openEditModal(v)} className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                                                    <button onClick={() => handleDelete(v.id)} className="glass-btn px-3 py-1.5 rounded-lg text-red-500 font-semibold text-xs inline-flex items-center gap-1 border-red-200/50"><Trash2 size={14} /> Delete</button>
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

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-modal rounded-3xl w-full max-w-lg p-8 animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
                            <button onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">License Plate</label>
                                    <input type="text" name="licensePlate" required pattern="^[A-Za-z]{2,3}-\d{4}$" title="Format: ABC-1234" value={formData.licensePlate} onChange={handleInputChange}
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="e.g., ABC-1234" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Vehicle Type</label>
                                    <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                        {VEHICLE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Capacity (kg)</label>
                                    <input type="number" name="capacity" required min="100" max="3500" value={formData.capacity} onChange={handleInputChange}
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="e.g., 3500" />
                                </div>
                                {editingId && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                                        <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                            {VEHICLE_STATUSES.map((s) => <option key={s} value={s}>{s === 'IN_TRANSIT' ? 'In Transit' : s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
                                        </select>
                                    </div>
                                )}
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : editingId ? 'Update Vehicle' : 'Save Vehicle'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default VehicleManagement;
