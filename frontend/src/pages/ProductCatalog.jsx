import React, { useState, useEffect } from 'react';
import productService from '../services/productService';

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getAllProducts();
                setProducts(data);
            } catch (error) {
                console.error("Failed to load products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return <div className="text-center mt-20 text-xl font-semibold">Loading Granite Catalog...</div>;
    }

    return (
        <div className="bg-gray-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Premium Granite Collection</h1>
                    <p className="text-lg text-gray-600">Browse our high-quality slabs for your next construction project.</p>
                </div>

                {products.length === 0 ? (
                    <div className="text-center text-gray-500">No products available at the moment.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:scale-105 duration-300">
                                {/* Product Image */}
                                <div className="h-64 bg-gray-200 relative">
                                    {product.textureUrl ? (
                                        <img
                                            src={`http://localhost:8080${product.textureUrl}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-500">No Image Available</div>
                                    )}
                                </div>

                                {/* Product Details */}
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                            {product.grade}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mb-4">Dimensions: {product.dimensions}</p>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-2xl font-bold text-gray-900">{product.price.toFixed(2)} LKR<span className="text-sm font-normal text-gray-500">/ sqft</span></span>

                                        {/* AI Placeholder Button - Your teammates will use this! */}
                                        <button className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold py-2 px-4 rounded shadow flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            Try in Room
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;