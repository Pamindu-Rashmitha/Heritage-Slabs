import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // --- NEW STATE FOR MODAL & FORM ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        dimensions: '',
        grade: 'Premium',
        stockQuantity: '',
        lowStockThreshold: 10,
        description: ''
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.getAllProducts();
            setProducts(data);
            setError('');
        } catch (err) {
            setError('Failed to load products. Ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(products.filter(product => product.id !== id));
            } catch (err) {
                alert('Failed to delete product.');
            }
        }
    };

    // --- FORM HANDLERS ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            // 1. Send text data to create the product
            const newProductData = {
                ...formData,
                price: parseFloat(formData.price),
                stockQuantity: parseInt(formData.stockQuantity),
                lowStockThreshold: parseInt(formData.lowStockThreshold)
            };

            const createdProduct = await productService.createProduct(newProductData);

            // 2. If a file was selected, upload it using the new product's ID
            if (selectedFile) {
                await productService.uploadProductImage(createdProduct.id, selectedFile);
            }

            // 3. Clean up, close modal, and refresh the table
            setIsModalOpen(false);
            setFormData({ name: '', price: '', dimensions: '', grade: 'Premium', stockQuantity: '', lowStockThreshold: 10, description: '' });
            setSelectedFile(null);
            loadProducts();
        } catch (err) {
            console.error(err);
            alert('Error creating product. Check the console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto relative">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow transition"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add New Slab
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

            {/* --- TABLE (Same as before) --- */}
            {loading ? (
                <p className="text-gray-600">Loading inventory...</p>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-left text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6">Image</th>
                                <th className="py-3 px-6">Name & Dimensions</th>
                                <th className="py-3 px-6">Price / SqFt</th>
                                <th className="py-3 px-6">Stock Level</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {products.length === 0 ? (
                                <tr><td colSpan="5" className="py-6 text-center">No products found. Add one!</td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {product.textureUrl ? (
                                                <img src={`http://localhost:8080${product.textureUrl}`} alt={product.name} className="w-16 h-16 object-cover rounded shadow-sm" />
                                            ) : (
                                                <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">No Img</div>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-left">
                                            <div className="font-bold text-gray-800">{product.name}</div>
                                            <div className="text-xs text-gray-500">{product.dimensions} • Grade: {product.grade}</div>
                                        </td>
                                        <td className="py-3 px-6 text-left font-medium">{product.price.toFixed(2)} LKR</td>
                                        <td className="py-3 px-6 text-left">
                                            {product.lowStock ? (
                                                <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">Low Stock: {product.stockQuantity}</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">In Stock: {product.stockQuantity}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-6 text-center">
                                            <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- ADD NEW PRODUCT MODAL --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-2xl font-bold mb-4">Add Granite Slab</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Product Name</label>
                                    <input type="text" name="name" required value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="e.g., Galaxy Black" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Price per SqFt (LKR)</label>
                                    <input type="number" step="0.01" name="price" required value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Dimensions</label>
                                    <input type="text" name="dimensions" required value={formData.dimensions} onChange={handleInputChange} className="w-full border p-2 rounded" placeholder="e.g., 10x5 ft" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Grade</label>
                                    <select name="grade" value={formData.grade} onChange={handleInputChange} className="w-full border p-2 rounded">
                                        <option value="Premium">Premium</option>
                                        <option value="Standard">Standard</option>
                                        <option value="Commercial">Commercial</option>
                                    </select>
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Initial Stock Quantity</label>
                                    <input type="number" name="stockQuantity" required value={formData.stockQuantity} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                                <div className="col-span-2 sm:col-span-1">
                                    <label className="block text-sm font-medium mb-1">Low Stock Alert Threshold</label>
                                    <input type="number" name="lowStockThreshold" required value={formData.lowStockThreshold} onChange={handleInputChange} className="w-full border p-2 rounded" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-1">Texture Image (Critical for AI)</label>
                                    <input type="file" accept="image/*" required onChange={handleFileChange} className="w-full border p-2 rounded" />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300">
                                    Cancel
                                </button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300">
                                    {isSubmitting ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductManagement;