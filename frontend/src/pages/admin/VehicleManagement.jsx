import React, { useState, useEffect, useContext } from 'react';
import vehicleService from '../../services/vehicleService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const VEHICLE_TYPES = ['Truck', 'Van', 'Lorry', 'Tipper'];
const VEHICLE_STATUSES = ['AVAILABLE', 'IN_TRANSIT', 'MAINTENANCE'];

const statusBadge = (status) => {
    const styles = {
        AVAILABLE: 'bg-green-100 text-green-700',
        IN_TRANSIT: 'bg-blue-100 text-blue-700',
        MAINTENANCE: 'bg-amber-100 text-amber-700',
    };
    const labels = {
        AVAILABLE: 'Available',
        IN_TRANSIT: 'In Transit',
        MAINTENANCE: 'Maintenance',
    };
    return (
        <span className={`py-1 px-3 rounded-full text-xs font-bold ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
            {labels[status] || status}
        </span>
    );
};

const emptyForm = { licensePlate: '', type: 'Truck', capacity: '', status: 'AVAILABLE' };

const VehicleManagement = () => {
    const { user } = useContext(AuthContext);
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ ...emptyForm });

    useEffect(() => {
        loadVehicles();
    }, []);


    useEffect(() => {
        if (successMsg) {
            const t = setTimeout(() => setSuccessMsg(''), 3000);
            return () => clearTimeout(t);
        }
    }, [successMsg]);

    const loadVehicles = async () => {
        try {
            setLoading(true);
            const data = await vehicleService.getAllVehicles();
            setVehicles(data);
            setError('');
        } catch {
            setError('Failed to load vehicles. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const openAddModal = () => {
        setEditingId(null);
        setFormData({ ...emptyForm });
        setIsModalOpen(true);
    };

    const openEditModal = (vehicle) => {
        setEditingId(vehicle.id);
        setFormData({
            licensePlate: vehicle.licensePlate,
            type: vehicle.type,
            capacity: vehicle.capacity,
            status: vehicle.status,
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const payload = {
                licensePlate: formData.licensePlate,
                type: formData.type,
                capacity: Number(formData.capacity),
                ...(editingId ? { status: formData.status } : {}),
            };

            if (editingId) {
                await vehicleService.updateVehicle(editingId, payload);
                setSuccessMsg('Vehicle updated successfully!');
            } else {
                await vehicleService.createVehicle(payload);
                setSuccessMsg('Vehicle added successfully!');
            }

            setIsModalOpen(false);
            setFormData({ ...emptyForm });
            setEditingId(null);
            await loadVehicles();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Operation failed. Please try again.';
            setError(typeof msg === 'string' ? msg : 'Operation failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
        try {
            await vehicleService.deleteVehicle(id);
            setVehicles((prev) => prev.filter((v) => v.id !== id));
            setSuccessMsg('Vehicle deleted successfully.');
        } catch {
            setError('Failed to delete vehicle.');
        }
    };


    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Vehicle Management</h1>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                        onClick={openAddModal}
                    >
                        + Add Vehicle
                    </button>
                </div>

                {/* Feedback messages */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded mb-4 flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => setError('')} className="text-red-700 font-bold ml-4">×</button>
                    </div>
                )}
                {successMsg && (
                    <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                        {successMsg}
                    </div>
                )}

                {/* Table */}
                {loading ? (
                    <p className="text-gray-600">Loading vehicles...</p>
                ) : (
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6">License Plate</th>
                                    <th className="py-3 px-6">Type</th>
                                    <th className="py-3 px-6">Capacity (kg)</th>
                                    <th className="py-3 px-6">Status</th>
                                    <th className="py-3 px-6 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {vehicles.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-6 text-center text-gray-400">
                                            No vehicles found. Add one!
                                        </td>
                                    </tr>
                                ) : (
                                    vehicles.map((v) => (
                                        <tr key={v.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                                            <td className="py-3 px-6 font-bold text-gray-800">{v.licensePlate}</td>
                                            <td className="py-3 px-6">{v.type}</td>
                                            <td className="py-3 px-6">{v.capacity}</td>
                                            <td className="py-3 px-6">{statusBadge(v.status)}</td>
                                            <td className="py-3 px-6 text-center space-x-3">
                                                <button
                                                    onClick={() => openEditModal(v)}
                                                    className="text-blue-500 hover:text-blue-700 font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(v.id)}
                                                    className="text-red-500 hover:text-red-700 font-medium"
                                                >
                                                    Delete
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

            {/* ---- Add / Edit Modal ---- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingId ? 'Edit Vehicle' : 'Add Vehicle'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                {/* License Plate */}
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">License Plate</label>
                                    <input
                                        type="text"
                                        name="licensePlate"
                                        required
                                        value={formData.licensePlate}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="e.g., ABC-1234"
                                    />
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Vehicle Type</label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                    >
                                        {VEHICLE_TYPES.map((t) => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Capacity */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">Capacity (kg)</label>
                                    <input
                                        type="number"
                                        name="capacity"
                                        required
                                        min="1"
                                        value={formData.capacity}
                                        onChange={handleInputChange}
                                        className="w-full border p-2 rounded"
                                        placeholder="e.g., 10"
                                    />
                                </div>

                                {editingId && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium mb-1">Status</label>
                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            className="w-full border p-2 rounded"
                                        >
                                            {VEHICLE_STATUSES.map((s) => (
                                                <option key={s} value={s}>
                                                    {s === 'IN_TRANSIT' ? 'In Transit' : s.charAt(0) + s.slice(1).toLowerCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setIsModalOpen(false); setEditingId(null); }}
                                    className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                                >
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
