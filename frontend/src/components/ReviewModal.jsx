import React, { useState } from 'react';
import { X, Star, ShieldAlert, AlertCircle } from 'lucide-react';
import reviewService from '../services/reviewService';

const ErrorPopup = ({ message, onClose }) => {
    if (!message) return null;
    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="glass-modal rounded-3xl w-full max-w-sm overflow-hidden animate-scale-in">
                <div className="h-1.5 bg-gradient-to-r from-red-500 to-orange-500" />
                <div className="p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-100/60 backdrop-blur-sm rounded-full flex items-center justify-center mb-5">
                        <ShieldAlert size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Purchase Required</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-8">{message}</p>
                    <button
                        onClick={onClose}
                        className="w-full py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all shadow-lg shadow-red-500/25"
                    >
                        Got it
                    </button>
                </div>
            </div>
        </div>
    );
};

const ReviewModal = ({ isOpen, onClose, productId, productName, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [popupError, setPopupError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0 || !title.trim() || !comment.trim()) {
            setError('Please fill all fields and select a rating');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await reviewService.createReview(productId, rating, title, comment);
            onReviewSubmitted();
            onClose();
            setRating(0);
            setTitle('');
            setComment('');
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to submit review. Please try again.';
            if (err.response?.status === 403) {
                setPopupError(msg);
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <ErrorPopup message={popupError} onClose={() => setPopupError('')} />
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
                <div className="glass-modal rounded-3xl w-full max-w-lg overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/30">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
                            <p className="text-gray-500 text-sm mt-1">{productName}</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 glass-btn p-2 rounded-xl">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Star Rating */}
                        <div>
                            <p className="text-sm font-semibold text-gray-600 mb-2">How would you rate this product?</p>
                            <div className="flex gap-2">
                                {[1,2,3,4,5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            size={42}
                                            className={`transition-colors ${
                                                star <= (hoverRating || rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Review Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Summarize your experience"
                                className="w-full px-4 py-3 glass-input rounded-xl"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Your Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your honest feedback here..."
                                rows="4"
                                className="w-full px-4 py-3 glass-input rounded-xl resize-y"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50/60 backdrop-blur-sm border border-red-200/50 rounded-xl">
                                <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3.5 glass-btn rounded-2xl font-semibold text-gray-700">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="flex-1 py-3.5 btn-accent rounded-2xl disabled:opacity-60">
                                {loading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ReviewModal;