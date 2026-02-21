import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import productService from '../../services/productService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const SupplierManagement = () => {
    const { user } = useContext(AuthContext);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- MODAL & FORM STATE ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null); // null if adding new, else ID to edit
    const [formData, setFormData] = useState({
        name: '',
        contactInfo: '',
        suppliedMaterial: '',
        rating: 5.0
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [suppliersData, productsData] = await Promise.all([
                    supplierService.getAllSuppliers(),
                    productService.getAllProducts()
                ]);
                setSuppliers(suppliersData);
                setProducts(productsData);
                setError('');
            } catch (err) {
                console.error("Error loading initial data:", err);
                setError('Failed to load data. Ensure the backend is running and you have proper permissions.');
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await supplierService.deleteSupplier(id);
                setSuppliers(suppliers.filter(supplier => supplier.id !== id));
            } catch (err) {
                console.error("Error deleting supplier:", err);
                alert('Failed to delete supplier. They may have existing purchase orders.');
            }
        }
    };

    const handleEdit = (supplier) => {
        setFormData({
            name: supplier.name,
            contactInfo: supplier.contactInfo,
            suppliedMaterial: supplier.suppliedMaterial,
            rating: supplier.rating || 5.0
        });
        setEditingId(supplier.id);
        setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setFormData({
            name: '',
            contactInfo: '',
            suppliedMaterial: '',
            rating: 5.0
        });
        setEditingId(null);
        setIsModalOpen(true);
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
            if (editingId) {
                // Update existing
                const updatedSupplier = await supplierService.updateSupplier(editingId, formData);
                setSuppliers(suppliers.map(s => s.id === editingId ? updatedSupplier : s));
            } else {
                // Create new
                const newSupplier = await supplierService.createSupplier(formData);
                setSuppliers([...suppliers, newSupplier]);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving supplier:", err);
            alert(err.response?.data || 'Failed to save supplier. Please check inputs.');
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
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
                    <button
                        className="px-4 py-2 font-semibold text-white transition bg-green-600 rounded shadow hover:bg-green-700"
                        onClick={handleOpenAddModal}
                    >
                        + Add Supplier
                    </button>
                </div>

                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                {/* --- TABLE --- */}
                {loading ? (
                    <div className="py-10 text-center">
                        <div className="inline-block w-8 h-8 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
                        <p className="mt-2 text-gray-600">Loading suppliers...</p>
                    </div>
                ) : (
                    <div className="overflow-hidden bg-white border rounded-lg shadow-md">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr className="text-sm leading-normal text-left text-gray-600 uppercase bg-gray-100">
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Supplier Name</th>
                                    <th className="px-6 py-3">Contact Info</th>
                                    <th className="px-6 py-3">Material Type</th>
                                    <th className="px-6 py-3">Rating</th>
                                    <th className="px-6 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-light text-gray-600">
                                {suppliers.length === 0 ? (
                                    <tr><td colSpan="6" className="py-6 text-center text-gray-500">No suppliers found. Create one above.</td></tr>
                                ) : (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="px-6 py-3 text-left whitespace-nowrap">
                                                <span className="font-medium">#{supplier.id}</span>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <div className="font-bold text-gray-800">{supplier.name}</div>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                {supplier.contactInfo}
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <span className="px-3 py-1 text-xs font-bold text-purple-700 bg-purple-100 rounded-full">
                                                    {supplier.suppliedMaterial}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 text-left">
                                                <div className="flex items-center text-yellow-500">
                                                    ★ <span className="ml-1 text-gray-700 font-medium">{supplier.rating ? supplier.rating.toFixed(1) : 'N/A'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3 text-center">
                                                <div className="flex items-center justify-center space-x-4">
                                                    <button
                                                        onClick={() => handleEdit(supplier)}
                                                        className="font-medium text-blue-500 transition hover:text-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(supplier.id)}
                                                        className="font-medium text-red-500 transition hover:text-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* --- ADD/EDIT SUPPLIER MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
                    <div className="w-full max-w-lg p-6 overflow-y-auto bg-white rounded-lg shadow-2xl max-h-[90vh]">
                        <h2 className="mb-6 text-2xl font-bold text-gray-800 border-b pb-2">
                            {editingId ? 'Edit Supplier' : 'Add New Supplier'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Supplier Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="e.g., Global Stone Providers"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Contact Info (Phone/Email)</label>
                                <input
                                    type="text"
                                    name="contactInfo"
                                    required
                                    value={formData.contactInfo}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="e.g., +94 77 123 4567 or contact@supplier.com"
                                />
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Supplied Material Type</label>
                                <select
                                    name="suppliedMaterial"
                                    required
                                    value={formData.suppliedMaterial}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
                                >
                                    <option value="" disabled>Select a product...</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.name}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Supplier Rating (0 to 5)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    name="rating"
                                    required
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-gray-700 font-medium bg-gray-100 rounded hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-5 py-2.5 font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : 'Save Supplier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default SupplierManagement;
