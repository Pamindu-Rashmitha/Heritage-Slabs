import React, { useContext } from 'react';
import { X, Star, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReviewListModal = ({ isOpen, onClose, product, onWriteReview }) => {
    const { user } = useContext(AuthContext);

    if (!isOpen || !product) return null;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={18} className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
        ));
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete your review permanently?")) return;
        try {
            await api.delete(`/reviews/${reviewId}`);
            onWriteReview();
            onClose();
        } catch (err) {
            alert("Failed to delete review. Please try again.");
        }
    };

    const isMyReview = (review) => {
        if (!user) return false;
        const userEmail = user.email?.toLowerCase();
        const reviewEmail = review.userEmail?.toLowerCase();
        const userName = user.name?.toLowerCase();
        const reviewName = review.userName?.toLowerCase();
        return (userEmail && reviewEmail && userEmail === reviewEmail) ||
               (userName && reviewName && userName === reviewName);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="glass-modal rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-white/30 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                        <p className="text-gray-500">{product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 glass-btn p-2 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                {/* Average Rating */}
                <div className="px-6 py-4 border-b border-white/20 glass flex items-center gap-3">
                    <div className="flex text-3xl">{renderStars(product.averageRating)}</div>
                    <div>
                        <span className="text-2xl font-extrabold text-gray-900">{product.averageRating}</span>
                        <span className="text-gray-400 ml-1">/ 5</span>
                    </div>
                    <div className="ml-auto text-sm text-gray-500 font-semibold">
                        {product.reviews.length} reviews
                    </div>
                </div>

                {/* Write Review Button */}
                <div className="px-6 py-4 border-b border-white/20">
                    <button onClick={onWriteReview} className="w-full py-3 btn-accent rounded-2xl">
                        ✍️ Write a Review
                    </button>
                </div>

                {/* Reviews List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <div key={review.id} className="glass-card rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{review.sentimentEmoji}</span>
                                    <div className="flex-1">
                                        <div className="font-bold text-gray-900">{review.userName}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(review.reviewDate).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                        ))}
                                    </div>
                                </div>

                                <p className="font-semibold text-gray-900 mb-2">"{review.title}"</p>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>

                                {review.adminReply && (
                                    <div className="mt-4 pl-4 border-l-4 border-accent glass rounded-r-xl p-4 text-sm">
                                        <div className="font-bold text-accent-dark mb-1">Heritage Slabs Response:</div>
                                        {review.adminReply}
                                    </div>
                                )}

                                {isMyReview(review) && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="mt-4 flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-semibold transition"
                                    >
                                        <Trash2 size={16} /> Delete My Review
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            No reviews yet. Be the first to review!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewListModal;