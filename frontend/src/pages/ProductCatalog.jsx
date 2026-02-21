import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import productService from '../services/productService';
import { ShoppingCart, Plus, Minus, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
            {/* Image Section */}
            <div className="h-64 relative overflow-hidden bg-gray-100">
                {product.textureUrl ? (
                    <img
                        src={`http://localhost:8080${product.textureUrl}`}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 font-bold tracking-widest uppercase">
                        Slab Texture
                    </div>
                )}
                <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <button className="bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xl text-blue-600 hover:bg-blue-600 hover:text-white transition group/btn">
                        <Eye size={20} className="group-hover/btn:scale-110 transition" />
                    </button>
                </div>
                <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-white/50">
                        {product.grade} Grade
                    </span>
                </div>
            </div>

            {/* Details Section */}
            <div className="p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition mb-2">{product.name}</h2>
                    <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                        Dimensions: {product.dimensions}
                    </p>
                </div>

                <div className="flex items-end justify-between mb-8">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Price per sqft</p>
                        <p className="text-3xl font-extrabold text-blue-600">
                            {product.price.toLocaleString()} <span className="text-sm font-bold text-gray-400">LKR</span>
                        </p>
                    </div>
                </div>

                {/* Quantity & Action Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-2 border border-gray-100">
                        <span className="text-sm font-bold text-gray-500 ml-4">Quantity</span>
                        <div className="flex items-center bg-white rounded-xl shadow-sm border border-gray-100 p-1">
                            <button
                                onClick={(e) => { e.stopPropagation(); setQuantity(Math.max(1, quantity - 1)); }}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition text-gray-400 hover:text-blue-600"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="w-12 text-center font-extrabold text-lg text-gray-900">{quantity}</span>
                            <button
                                onClick={(e) => { e.stopPropagation(); setQuantity(quantity + 1); }}
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-lg transition text-gray-400 hover:text-blue-600"
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => onAddToCart(product, quantity)}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                    >
                        <ShoppingCart size={20} />
                        Add to Cart
                    </button>

                    <button className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-100 transition-colors">
                        Try in Room
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
        navigate('/cart');
    };

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
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-28 pb-12 px-4 shadow-inner">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12 flex flex-col items-center">
                    <div className="bg-blue-100 px-4 py-1 rounded-full text-blue-600 font-bold text-sm mb-4 tracking-widest uppercase">
                        Our Collection
                    </div>
                    <h1 className="text-5xl font-extrabold text-gray-900 mb-6 text-center tracking-tight">
                        Premium <span className="text-blue-600 italic">Heritage</span> Slabs
                    </h1>
                    <div className="w-24 h-1.5 bg-blue-100 rounded-full mb-6"></div>
                    <p className="text-xl text-gray-500 max-w-2xl text-center leading-relaxed">
                        Curated selections of the finest granite, marble, and quartz slabs for your next masterpiece.
                    </p>
                </div>

                {products.length === 0 ? (
                    <div className="bg-white rounded-3xl p-16 text-center border border-gray-100 shadow-sm max-w-2xl mx-auto">
                        <div className="text-6xl mb-6">🛒</div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Inventory is currently empty</h3>
                        <p className="text-gray-500">We're restacking our premium slabs. Please check back shortly!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductCatalog;