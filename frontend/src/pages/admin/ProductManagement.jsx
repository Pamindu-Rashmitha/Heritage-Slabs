import React, { useState, useEffect, useContext } from 'react';
import productService from '../../services/productService';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Plus, Edit3, Trash2, AlertTriangle, X } from 'lucide-react';

const ProductManagement = () => {
    const { user } = useContext(AuthContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [editingProductId, setEditingProductId] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '', price: '', dimensions: '', grade: 'Premium', stockQuantity: '', lowStockThreshold: 10, description: ''
    });

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try { setLoading(true); const data = await productService.getAllProducts(); setProducts(data); setError(''); }
        catch (err) { setError('Failed to load products. Ensure the backend is running.'); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try { await productService.deleteProduct(id); setProducts(products.filter(p => p.id !== id)); }
            catch (err) { alert('Failed to delete product.'); }
        }
    };

    const handleInputChange = (e) => { const { name, value } = e.target; setFormData({ ...formData, [name]: value }); };
    const handleFileChange = (e) => { setSelectedFile(e.target.files[0]); };

    const handleEdit = (product) => {
        setEditingProductId(product.id);
        setFormData({ name: product.name, price: product.price, dimensions: product.dimensions, grade: product.grade, stockQuantity: product.stockQuantity, lowStockThreshold: product.lowStockThreshold || 10, description: product.description || '', textureUrl: product.textureUrl });
        setSelectedFile(null); setValidationErrors({}); setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingProductId(null);
        setFormData({ name: '', price: '', dimensions: '', grade: 'Premium', stockQuantity: '', lowStockThreshold: 10, description: '' });
        setSelectedFile(null); setValidationErrors({}); setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); setValidationErrors({});
        if (!editingProductId && !selectedFile) { alert("Please select a texture image."); return; }
        setIsSubmitting(true);
        try {
            const productPayload = { name: formData.name, price: parseFloat(formData.price), dimensions: formData.dimensions, grade: formData.grade, stockQuantity: parseInt(formData.stockQuantity, 10), lowStockThreshold: parseInt(formData.lowStockThreshold, 10), description: formData.description, textureUrl: formData.textureUrl };
            let productIdToUse;
            if (editingProductId) { await productService.updateProduct(editingProductId, productPayload); productIdToUse = editingProductId; }
            else { const createdProduct = await productService.createProduct(productPayload); productIdToUse = createdProduct.id; }
            if (selectedFile) { await productService.uploadProductImage(productIdToUse, selectedFile); }
            await loadProducts(); setIsModalOpen(false);
        } catch (err) {
            console.error("Error saving product:", err);
            if (err.response && err.response.status === 400) { setValidationErrors(err.response.data); }
            else { alert('Failed to save product.'); }
        } finally { setIsSubmitting(false); }
    };

    if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;
    const lowStockProducts = products.filter(p => p.stockQuantity <= p.lowStockThreshold);

    const inputClass = (field) => `w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium ${validationErrors[field] ? 'border-red-300' : ''}`;

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><Package size={24} className="text-accent" /></div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                                <p className="text-gray-500 text-sm">Manage your granite & natural stone inventory.</p>
                            </div>
                        </div>
                        <button className="btn-accent px-5 py-2.5 rounded-xl font-bold flex items-center gap-2" onClick={handleAddNew}>
                            <Plus size={18} /> Add New Slab
                        </button>
                    </div>

                    {error && <div className="glass-card bg-red-50/50 border-red-200/50 text-red-600 p-3 rounded-xl mb-4 font-semibold">{error}</div>}

                    {!loading && lowStockProducts.length > 0 && (
                        <div className="glass-card border-red-500 p-4 mb-6 rounded-2xl">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                                <div>
                                    <h3 className="text-sm font-bold text-red-800">{lowStockProducts.length} Slab(s) low on stock!</h3>
                                    <ul className="mt-2 text-xs text-red-700 space-y-1">
                                        {lowStockProducts.map(p => (
                                            <li key={p.id}><strong>{p.name}</strong> ({p.dimensions}) — Stock: <span className="font-bold underline">{p.stockQuantity}</span> (Threshold: {p.lowStockThreshold})</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                            Loading inventory...
                        </div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="min-w-full leading-normal">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Image</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Name & Dimensions</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Price / SqFt</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-left">Stock Level</th>
                                        <th className="py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {products.length === 0 ? (
                                        <tr><td colSpan="5" className="py-6 text-center text-gray-400">No products found. Add one!</td></tr>
                                    ) : (
                                        products.map((product) => (
                                            <tr key={product.id} className="hover:bg-white/20 transition-colors">
                                                <td className="py-3 px-6">
                                                    {product.textureUrl ? (
                                                        <img src={`http://localhost:8080${product.textureUrl}`} alt={product.name} className="w-14 h-14 object-cover rounded-xl border border-white/40 shadow-sm" />
                                                    ) : (
                                                        <div className="w-14 h-14 glass rounded-xl flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6">
                                                    <div className="font-bold text-gray-800">{product.name}</div>
                                                    <div className="text-xs text-gray-500">{product.dimensions} • {product.grade}</div>
                                                </td>
                                                <td className="py-3 px-6 font-bold text-gray-800">{product.price.toFixed(2)} LKR</td>
                                                <td className="py-3 px-6">
                                                    {product.stockQuantity <= product.lowStockThreshold ? (
                                                        <span className="glass-badge bg-red-100/50 text-red-700 border-red-200/50">Low: {product.stockQuantity}</span>
                                                    ) : (
                                                        <span className="glass-badge bg-green-100/50 text-green-700 border-green-200/50">In Stock: {product.stockQuantity}</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-center space-x-2">
                                                    <button onClick={() => handleEdit(product)} className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1"><Edit3 size={14} /> Edit</button>
                                                    <button onClick={() => handleDelete(product.id)} className="glass-btn px-3 py-1.5 rounded-lg text-red-500 font-semibold text-xs inline-flex items-center gap-1 border-red-200/50"><Trash2 size={14} /> Delete</button>
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
                <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
                    <div className="glass-modal rounded-3xl w-full max-w-2xl p-8 overflow-y-auto max-h-[90vh] animate-scale-in">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">{editingProductId ? 'Edit Granite Slab' : 'Add Granite Slab'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="glass-btn p-2 rounded-xl text-gray-500"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Product Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className={inputClass('name')} placeholder="e.g., Galaxy Black" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Price per SqFt (LKR)</label>
                                    <input type="number" step="0.01" min="0" name="price" required value={formData.price} onChange={handleInputChange} className={inputClass('price')} />
                                    {validationErrors.price && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {validationErrors.price}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Dimensions</label>
                                    <input type="text" name="dimensions" required value={formData.dimensions} onChange={handleInputChange} className={inputClass('dimensions')} placeholder="e.g., 120 * 60" />
                                    {validationErrors.dimensions && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {validationErrors.dimensions}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Grade</label>
                                    <select name="grade" value={formData.grade} onChange={handleInputChange} className={`${inputClass('')} appearance-none cursor-pointer`}>
                                        <option value="Premium">Premium</option><option value="Standard">Standard</option><option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Stock Quantity</label>
                                    <input type="number" min="0" name="stockQuantity" required value={formData.stockQuantity} onChange={handleInputChange} className={inputClass('stockQuantity')} />
                                    {validationErrors.stockQuantity && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {validationErrors.stockQuantity}</p>}
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Low Stock Threshold</label>
                                    <input type="number" min="0" name="lowStockThreshold" required value={formData.lowStockThreshold} onChange={handleInputChange} className={inputClass('lowStockThreshold')} />
                                    {validationErrors.lowStockThreshold && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ {validationErrors.lowStockThreshold}</p>}
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">
                                        Texture Image {editingProductId ? '(Leave blank to keep current)' : '(Required for AI)'}
                                    </label>
                                    <input type="file" accept="image/*" required={!editingProductId} onChange={handleFileChange}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 btn-accent rounded-xl disabled:opacity-50">
                                    {isSubmitting ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductManagement;