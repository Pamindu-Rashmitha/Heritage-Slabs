import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch products when the component mounts
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
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                // Remove the deleted product from the screen without reloading the page
                setProducts(products.filter(product => product.id !== id));
            } catch (err) {
                alert('Failed to delete product.');
            }
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded shadow"
                    onClick={() => alert("We will build the Add Modal next!")}
                >
                    + Add New Slab
                </button>
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

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
                            <tr>
                                <td colSpan="5" className="py-6 text-center">No products found. Add one!</td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                        {product.textureUrl ? (
                                            <img
                                                src={`http://localhost:8080${product.textureUrl}`}
                                                alt={product.name}
                                                className="w-16 h-16 object-cover rounded shadow-sm"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                                                No Img
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        <div className="font-bold text-gray-800">{product.name}</div>
                                        <div className="text-xs text-gray-500">{product.dimensions} • Grade: {product.grade}</div>
                                    </td>
                                    <td className="py-3 px-6 text-left font-medium">
                                        ${product.price.toFixed(2)}
                                    </td>
                                    <td className="py-3 px-6 text-left">
                                        {product.lowStock ? (
                                            <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full text-xs font-bold">
                                                    Low Stock: {product.stockQuantity}
                                                </span>
                                        ) : (
                                            <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full text-xs font-bold">
                                                    In Stock: {product.stockQuantity}
                                                </span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-4">
                                            <button className="text-blue-500 hover:text-blue-700 font-medium">
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="text-red-500 hover:text-red-700 font-medium"
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
    );
};

export default ProductManagement;