import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const MaterialIntakeManagement = () => {
    const { user } = useContext(AuthContext);

    // As per requirement, Material Intakes are tightly coupled to Purchase Orders.
    // We will fetch ALL Purchase Orders, then fetch intakes for each, OR 
    // simply provide a UI to log intakes against existing pending POs.

    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [intakes, setIntakes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        purchaseOrderId: '',
        arrivalDate: '',
        quantityReceived: '',
        conditionNotes: ''
    });

    useEffect(() => {
        loadOrders();
    }, []);

    // Also reload intakes when a specific order is selected in the dropdown
    useEffect(() => {
        if (selectedOrderId) {
            loadIntakes(selectedOrderId);
        } else {
            setIntakes([]); // Clear table if "Select Order" is chosen
        }
    }, [selectedOrderId]);

    const loadOrders = async () => {
        try {
            setLoading(true);
            const data = await supplierService.getAllPurchaseOrders();
            // Filter to only show orders that aren't cancelled
            setOrders(data.filter(o => o.status !== 'CANCELLED'));
            setError('');
        } catch (err) {
            console.error("Error loading purchase orders:", err);
            setError('Failed to load purchase orders to assign intakes.');
        } finally {
            setLoading(false);
        }
    };

    const loadIntakes = async (poId) => {
        try {
            setLoading(true);
            const data = await supplierService.getIntakesByPurchaseOrder(poId);
            setIntakes(data);
        } catch (err) {
            console.error("Error loading intakes:", err);
            setError('Failed to load material intakes for that order.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setFormData({
            purchaseOrderId: selectedOrderId || (orders.length > 0 ? orders[0].id : ''),
            arrivalDate: new Date().toISOString().split('T')[0],
            quantityReceived: '',
            conditionNotes: ''
        });
        setIsModalOpen(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            const newIntake = await supplierService.logMaterialIntake(formData);

            // If the intake we just logged belongs to the order currently being viewed, add it to the table
            if (parseInt(selectedOrderId) === parseInt(formData.purchaseOrderId)) {
                setIntakes([...intakes, newIntake]);
            } else {
                // Otherwise jump the view to the new order intakes
                setSelectedOrderId(formData.purchaseOrderId);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving intake:", err);
            alert(err.response?.data || 'Failed to log intake. Ensure the PO exists and data is valid.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h1 className="text-3xl font-bold text-gray-800">Material Intakes</h1>

                    <div className="flex items-center gap-4">
                        <select
                            value={selectedOrderId}
                            onChange={(e) => setSelectedOrderId(e.target.value)}
                            className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-700 min-w-[200px]"
                        >
                            <option value="">-- Filter by Purchase Order --</option>
                            {orders.map(o => (
                                <option key={o.id} value={o.id}>
                                    PO-{o.id} ({o.materialOrdered}) - {o.supplierName}
                                </option>
                            ))}
                        </select>

                        <button
                            className="px-4 py-2 font-semibold text-white transition bg-green-600 rounded shadow hover:bg-green-700 whitespace-nowrap"
                            onClick={handleOpenAddModal}
                            disabled={orders.length === 0}
                        >
                            + Log New Intake
                        </button>
                    </div>
                </div>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                {/* --- TABLE --- */}
                {loading ? (
                    <div className="py-10 text-center">
                        <div className="inline-block w-8 h-8 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading incoming materials...</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto bg-white border rounded-lg shadow-md mt-4">
                        {selectedOrderId === '' ? (
                            <div className="py-12 text-center text-gray-500 bg-gray-50">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                </svg>
                                <p className="text-lg">Select a Purchase Order from the dropdown to view its material intakes.</p>
                            </div>
                        ) : (
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="text-sm leading-normal text-left text-gray-600 uppercase bg-gray-100">
                                        <th className="px-6 py-3">Intake ID</th>
                                        <th className="px-6 py-3">Arrival Date</th>
                                        <th className="px-6 py-3">Quantity Received</th>
                                        <th className="px-6 py-3">Condition Notes</th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm font-light text-gray-600">
                                    {intakes.length === 0 ? (
                                        <tr><td colSpan="4" className="py-6 text-center text-gray-500">No materials have been logged for this order yet.</td></tr>
                                    ) : (
                                        intakes.map((intake) => (
                                            <tr key={intake.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="px-6 py-4 text-left whitespace-nowrap font-medium text-gray-800">
                                                    #{intake.id}
                                                </td>
                                                <td className="px-6 py-4 text-left font-medium">
                                                    {intake.arrivalDate}
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-bold">
                                                        {intake.quantityReceived} Units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-left">
                                                    {intake.conditionNotes ? (
                                                        <span className="italic text-gray-700">"{intake.conditionNotes}"</span>
                                                    ) : (
                                                        <span className="text-gray-400">No notes provided</span>
                                                    )}
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

            {/* --- LOG NEW INTAKE MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-lg p-6 overflow-y-auto bg-white rounded-lg shadow-2xl max-h-[90vh]">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-2">
                            Log Material Intake
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Target Purchase Order</label>
                                <select
                                    name="purchaseOrderId"
                                    required
                                    value={formData.purchaseOrderId}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                >
                                    <option value="" disabled>-- Select corresponding order --</option>
                                    {orders.map(o => (
                                        <option key={o.id} value={o.id}>PO-{o.id} - {o.materialOrdered} (Qty: {o.quantity})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Arrival Date</label>
                                    <input
                                        type="date"
                                        name="arrivalDate"
                                        required
                                        value={formData.arrivalDate}
                                        onChange={handleInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">Quantity Received</label>
                                    <input
                                        type="number"
                                        name="quantityReceived"
                                        required
                                        value={formData.quantityReceived}
                                        onChange={handleInputChange}
                                        className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Condition Notes (Optional)</label>
                                <textarea
                                    name="conditionNotes"
                                    rows="3"
                                    value={formData.conditionNotes}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., 'Arrived fast, good quality' or '2 slabs crack during transport'"
                                />
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
                                    {isSubmitting ? 'Logging...' : 'Save Intake'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default MaterialIntakeManagement;
