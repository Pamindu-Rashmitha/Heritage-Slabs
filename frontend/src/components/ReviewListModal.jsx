import React, { useContext } from 'react';
import { X, Star, Trash2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const ReviewListModal = ({ isOpen, onClose, product, onWriteReview }) => {
    const { user } = useContext(AuthContext);

    if (!isOpen || !product) return null;

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, i) => (
            <Star
                key={i}
                size={18}
                className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}
            />
        ));
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Delete your review permanently?")) return;

        try {
            await api.delete(`/reviews/${reviewId}`);
            onWriteReview(); // Refresh reviews
            onClose();
        } catch (err) {
            alert("Failed to delete review. Please try again.");
        }
    };

    // Robust check: match by email or name (case insensitive)
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        <p className="text-gray-500">{product.name}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={28} />
                    </button>
                </div>

                {/* Average Rating */}
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center gap-3">
                    <div className="flex text-3xl">{renderStars(product.averageRating)}</div>
                    <div>
                        <span className="text-2xl font-bold">{product.averageRating}</span>
                        <span className="text-gray-500 ml-1">/ 5</span>
                    </div>
                    <div className="ml-auto text-sm text-gray-500">
                        {product.reviews.length} reviews
                    </div>
                </div>

                {/* Write Review Button */}
                <div className="px-6 py-4 border-b">
                    <button
                        onClick={onWriteReview}
                        className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition"
                    >
                        ✍️ Write a Review
                    </button>
                </div>

                {/* Reviews List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {product.reviews && product.reviews.length > 0 ? (
                        product.reviews.map((review) => (
                            <div key={review.id} className="bg-gray-50 rounded-2xl p-5">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{review.sentimentEmoji}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold text-gray-900">{review.userName}</div>
                                        <div className="text-xs text-gray-400">
                                            {new Date(review.reviewDate).toLocaleDateString('en-GB')}
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>

                                <p className="font-medium text-gray-900 mb-2">"{review.title}"</p>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>

                                {review.adminReply && (
                                    <div className="mt-4 pl-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-xl p-4 text-sm">
                                        <div className="font-semibold text-blue-700 mb-1">Vijitha Granite Response:</div>
                                        {review.adminReply}
                                    </div>
                                )}

                                {/* DELETE BUTTON - NOW MORE RELIABLE */}
                                {isMyReview(review) && (
                                    <button
                                        onClick={() => handleDeleteReview(review.id)}
                                        className="mt-4 flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition"
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