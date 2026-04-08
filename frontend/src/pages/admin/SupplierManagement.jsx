import React, { useState, useEffect, useContext } from 'react';
import supplierService from '../../services/supplierService';
import productService from '../../services/productService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Warehouse, Plus, Edit3, Trash2, Star, X, Loader2 } from 'lucide-react';

const SupplierManagement = () => {
    const { user } = useContext(AuthContext);
    const [suppliers, setSuppliers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', suppliedMaterial: '', rating: 5.0 });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setLoading(true);
                const [suppliersData, productsData] = await Promise.all([supplierService.getAllSuppliers(), productService.getAllProducts()]);
                setSuppliers(suppliersData); setProducts(productsData); setError('');
            } catch (err) { console.error("Error:", err); setError('Failed to load data.'); }
            finally { setLoading(false); }
        };
        loadInitialData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Delete this supplier?')) {
            try { await supplierService.deleteSupplier(id); setSuppliers(suppliers.filter(s => s.id !== id)); }
            catch (err) { alert('Failed to delete supplier.'); }
        }
    };

    const handleEdit = (supplier) => {
        setFormData({ name: supplier.name, email: supplier.email || '', phone: supplier.phone || '', suppliedMaterial: supplier.suppliedMaterial, rating: supplier.rating || 5.0 });
        setEditingId(supplier.id); setIsModalOpen(true);
    };

    const handleOpenAddModal = () => {
        setFormData({ name: '', email: '', phone: '', suppliedMaterial: '', rating: 5.0 });
        setEditingId(null); setIsModalOpen(true);
    };

    const showErrorMsg = (msg) => {
        setError(msg);
        setTimeout(() => setError(''), 5000);
    };

    const handleInputChange = (e) => { 
        const { name, value } = e.target; 
        if (name === 'phone') {
            const numericValue = value.replace(/\D/g, '');
            if (numericValue.length <= 10) {
                setFormData({ ...formData, phone: numericValue });
            }
        } else {
            setFormData({ ...formData, [name]: value }); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setIsSubmitting(true); setError('');
        try {
            const payload = { ...formData, rating: parseFloat(formData.rating) };
            if (editingId) { const updated = await supplierService.updateSupplier(editingId, payload); setSuppliers(suppliers.map(s => s.id === editingId ? updated : s)); }
            else { const newS = await supplierService.createSupplier(payload); setSuppliers([...suppliers, newS]); }
            setIsModalOpen(false);
        } catch (err) { 
            console.error("Save error:", err);
            const errData = err.response?.data;
            if (typeof errData === 'object' && errData !== null) { 
                // Spring Boot Validation errors often come as { field: "message", ... } or { error: "...", message: "..." }
                const messages = Object.values(errData).filter(v => typeof v === 'string');
                showErrorMsg(messages.join('\n') || JSON.stringify(errData)); 
            }
            else { showErrorMsg(errData || 'Failed to save supplier.'); }
        }
        finally { setIsSubmitting(false); }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><Warehouse size={24} className="text-accent" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
                                <p className="text-gray-500 text-sm">Manage stone and material suppliers.</p>
                            </div>
                        </div>
                        <button className="btn-accent px-5 py-2.5 rounded-xl font-bold flex items-center gap-2" onClick={handleOpenAddModal}>
                            <Plus size={18} /> Add Supplier
                        </button>
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
                            Loading suppliers...
                        </div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">ID</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Supplier Name</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Email</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Phone</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Material Type</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Rating</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {suppliers.length === 0 ? (
                                        <tr><td colSpan="6" className="py-6 text-center text-gray-400">No suppliers found.</td></tr>
                                    ) : (
                                        suppliers.map((supplier) => (
                                            <tr key={supplier.id} className="hover:bg-white/20 transition-colors">
                                                <td className="px-6 py-3 text-sm font-mono text-gray-500">#{supplier.id}</td>
                                                <td className="px-6 py-3 text-sm font-bold text-gray-800">{supplier.name}</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{supplier.email || 'N/A'}</td>
                                                <td className="px-6 py-3 text-sm text-gray-600">{supplier.phone || 'N/A'}</td>
                                                <td className="px-6 py-3"><span className="glass-badge text-purple-700 bg-purple-100/50 border-purple-200/50">{supplier.suppliedMaterial}</span></td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <Star size={14} className="fill-yellow-400" /> <span className="text-gray-700 font-bold text-sm">{supplier.rating ? supplier.rating.toFixed(1) : 'N/A'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-center space-x-2">
                                                    <button onClick={() => handleEdit(supplier)} className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                                                    <button onClick={() => handleDelete(supplier.id)} className="glass-btn px-3 py-1.5 rounded-lg text-red-500 font-semibold text-xs inline-flex items-center gap-1 border-red-200/50"><Trash2 size={14} /> Delete</button>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal w-full max-w-lg p-8 rounded-3xl overflow-y-auto max-h-[90vh] animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Supplier Name</label>
                                <input type="text" name="name" required value={formData.name} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="e.g., Global Stone Providers" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Email</label>
                                <input type="email" name="email" required value={formData.email} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="supplier@example.com" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Phone</label>
                                <input type="text" name="phone" required pattern="\d{10}" title="Please enter exactly 10 digits" value={formData.phone} onChange={handleInputChange} minLength="10" maxLength="10"
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="0771234567" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Supplied Material Type</label>
                                <select name="suppliedMaterial" required value={formData.suppliedMaterial} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium appearance-none cursor-pointer">
                                    <option value="" disabled>Select a product...</option>
                                    {products.map(product => (<option key={product.id} value={product.name}>{product.name}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-semibold text-gray-600">Rating (0-5)</label>
                                <input type="number" step="0.1" min="0" max="5" name="rating" required value={formData.rating} onChange={handleInputChange}
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-white/30">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50 flex items-center gap-2">
                                    {isSubmitting ? <><Loader2 className="animate-spin" size={16} /> Saving...</> : 'Save Supplier'}
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
