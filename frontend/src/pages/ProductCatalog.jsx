import React, { useState, useEffect, useContext } from 'react';
import productService from '../services/productService';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';
import ReviewListModal from '../components/ReviewListModal';
import VisualizerModal from '../components/VisualizerModal';
import { ShoppingCart, Star, MessageSquare, Sparkles, Plus, Minus, Eye } from 'lucide-react';

const ProductCard = ({ product, onAddToCart, onOpenReviewModal, onOpenReviewList, onOpenVisualizer }) => {
    const [quantity, setQuantity] = useState(1);
    const imageUrl = product.textureUrl ? `http://localhost:8080${product.textureUrl}` : null;

    return (
        <div className="glass-card rounded-3xl overflow-hidden group hover:shadow-glass-xl hover:-translate-y-1 transition-all duration-500 flex flex-col">
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                {imageUrl ? (
                    <img 
                        src={imageUrl} 
                        alt={product.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                        <span className="text-gray-400 text-sm font-medium">No Image</span>
                    </div>
                )}
                {/* Overlay badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    <span className="glass-badge text-gray-700">{product.grade}</span>
                </div>
                {product.averageRating > 0 && (
                    <div className="absolute top-3 right-3 glass-badge flex items-center gap-1 text-yellow-600">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {product.averageRating.toFixed(1)}
                    </div>
                )}
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-3">{product.dimensions}</p>
                    
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-accent-gradient">
                            {product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-400 font-semibold">LKR / sqft</span>
                    </div>
                </div>

                {/* Quantity & Actions */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center glass rounded-xl">
                            <button 
                                onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="px-3 font-bold text-gray-800 min-w-[2rem] text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)}
                                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                        <button
                            onClick={() => onAddToCart(product, quantity)}
                            className="flex-1 btn-accent py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
                        >
                            <ShoppingCart size={16} />
                            Add to Cart
                        </button>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => onOpenReviewList(product)}
                            className="flex-1 glass-btn py-2 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-center gap-1.5"
                        >
                            <MessageSquare size={14} />
                            Reviews ({product.reviews?.length || 0})
                        </button>
                        {imageUrl && (
                            <button
                                onClick={() => onOpenVisualizer(product)}
                                className="flex-1 glass-btn py-2 rounded-xl text-xs font-semibold text-gray-600 flex items-center justify-center gap-1.5"
                            >
                                <Sparkles size={14} />
                                Try in Room
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { user } = useContext(AuthContext);

    // Modal states
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewListOpen, setReviewListOpen] = useState(false);
    const [visualizerOpen, setVisualizerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const loadProducts = async () => {
        try {
            const data = await productService.getAllProducts();
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadProducts(); }, []);

    const handleAddToCart = (product, quantity) => {
        addToCart(product, quantity);
    };

    const handleOpenReviewModal = (product) => {
        setSelectedProduct(product);
        setReviewListOpen(false);
        setReviewModalOpen(true);
    };

    const handleOpenReviewList = (product) => {
        setSelectedProduct(product);
        setReviewListOpen(true);
    };

    const handleOpenVisualizer = (product) => {
        setSelectedProduct(product);
        setVisualizerOpen(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading collection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        Premium <span className="bg-clip-text text-transparent bg-accent-gradient">Collection</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                        Explore our curated selection of premium granite, marble, and natural stone slabs
                    </p>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={handleAddToCart}
                            onOpenReviewModal={handleOpenReviewModal}
                            onOpenReviewList={handleOpenReviewList}
                            onOpenVisualizer={handleOpenVisualizer}
                        />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="glass-card rounded-3xl p-16 text-center max-w-lg mx-auto">
                        <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No products available</h3>
                        <p className="text-gray-400">Check back soon for our latest collection.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            <ReviewModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                productId={selectedProduct?.id}
                productName={selectedProduct?.name}
                onReviewSubmitted={loadProducts}
            />

            <ReviewListModal
                isOpen={reviewListOpen}
                onClose={() => setReviewListOpen(false)}
                product={selectedProduct}
                onWriteReview={() => handleOpenReviewModal(selectedProduct)}
            />

            {selectedProduct && (
                <VisualizerModal
                    isOpen={visualizerOpen}
                    onClose={() => setVisualizerOpen(false)}
                    productImageUrl={selectedProduct.textureUrl ? `http://localhost:8080${selectedProduct.textureUrl}` : null}
                    productName={selectedProduct.name}
                />
            )}
        </div>
    );
};

export default ProductCatalog;