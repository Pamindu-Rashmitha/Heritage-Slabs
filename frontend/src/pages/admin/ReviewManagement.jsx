import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Edit2, Trash2, Flag, Star, MessageSquare, X } from 'lucide-react';
import api from '../../services/api';

const ReviewManagement = () => {
    const [reviews, setReviews] = useState([]);
    const [flaggedReviews, setFlaggedReviews] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [newReply, setNewReply] = useState('');

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const [allRes, flaggedRes] = await Promise.all([
                api.get('/admin/reviews'),
                api.get('/admin/reviews/flagged')
            ]);
            setReviews(allRes.data);
            setFlaggedReviews(flaggedRes.data);
        } catch (err) {
            console.error("Failed to load reviews", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditReply = (review) => {
        setSelectedReview(review);
        setNewReply(review.adminReply || '');
        setShowReplyModal(true);
    };

    const saveReply = async () => {
        if (!selectedReview) return;
        try {
            await api.put(`/admin/reviews/${selectedReview.id}/reply`, { reply: newReply });
            await fetchReviews();
            setShowReplyModal(false);
            setSelectedReview(null);
        } catch (err) {
            alert("Failed to update reply. Please try again.");
        }
    };

    const toggleFlag = async (id) => {
        try {
            await api.patch(`/admin/reviews/${id}/flag`);
            await fetchReviews();
        } catch (err) {
            alert("Failed to toggle flag");
        }
    };

    const deleteReview = async (id) => {
        if (!window.confirm("Delete this review permanently?")) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            await fetchReviews();
        } catch (err) {
            alert("Failed to delete review");
        }
    };

    const displayedReviews = activeTab === 'all' ? reviews : flaggedReviews;

    const totalReviews = reviews.length;
    const flaggedCount = flaggedReviews.length;
    const positiveCount = reviews.filter(r => r.rating >= 4).length;

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-10 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                    Loading reviews...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-accent/10 p-3 rounded-xl"><MessageSquare size={24} className="text-accent" /></div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Review Management</h1>
                            <p className="text-gray-500 text-sm">Manage customer reviews and responses.</p>
                        </div>
                    </div>

                    {/* Stats Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {[
                            { label: 'Total Reviews', value: totalReviews, color: 'blue', border: 'border-blue-400/50' },
                            { label: 'Flagged for Attention', value: flaggedCount, color: 'red', border: 'border-red-400/50' },
                            { label: 'Positive Feedback', value: positiveCount, color: 'green', border: 'border-green-400/50' },
                        ].map((s, i) => (
                            <div key={i} className={`glass-card p-4 rounded-2xl border-l-4 ${s.border}`}>
                                <p className="text-sm text-gray-500 font-semibold">{s.label}</p>
                                <p className="text-2xl font-extrabold text-gray-800 mt-1">{s.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-6 border-b border-white/30">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 ${
                                activeTab === 'all'
                                    ? 'border-accent text-accent'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            All Reviews ({totalReviews})
                        </button>
                        <button
                            onClick={() => setActiveTab('flagged')}
                            className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${
                                activeTab === 'flagged'
                                    ? 'border-red-500 text-red-500'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Flag size={14} /> Flagged ({flaggedCount})
                        </button>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                        {displayedReviews.length === 0 ? (
                            <div className="glass rounded-2xl p-10 text-center text-gray-400 font-medium">
                                No {activeTab === 'flagged' ? 'flagged ' : ''}reviews found.
                            </div>
                        ) : (
                            displayedReviews.map((review) => (
                                <div key={review.id} className="glass-card rounded-2xl p-5 hover:shadow-glass-lg transition-shadow">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">{review.sentimentEmoji}</span>
                                            <div>
                                                <div className="font-bold text-gray-800">{review.userName}</div>
                                                <div className="text-xs text-gray-500">{review.productName}</div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1">
                                            <div className={`glass-badge text-xs font-bold ${review.rating >= 4 ? 'bg-green-100/50 text-green-700 border-green-200/50' : 'bg-red-100/50 text-red-700 border-red-200/50'}`}>
                                                {review.rating >= 4 ? 'POSITIVE' : 'NEGATIVE'}
                                            </div>
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <p className="font-semibold text-gray-800 mb-1">"{review.title}"</p>
                                    <p className="text-sm text-gray-600 mb-4">{review.comment}</p>

                                    {review.adminReply && (
                                        <div className="glass rounded-xl border-l-4 border-accent p-3 mb-4 text-sm text-gray-700 bg-accent/5">
                                            <span className="font-bold text-accent-dark">Admin Response:</span><br />
                                            {review.adminReply}
                                        </div>
                                    )}

                                    <div className="flex gap-2 pt-3 border-t border-white/30">
                                        <button
                                            onClick={() => handleEditReply(review)}
                                            className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1"
                                        >
                                            <Edit2 size={14} /> Edit Reply
                                        </button>

                                        <button
                                            onClick={() => toggleFlag(review.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition ${
                                                review.isFlagged
                                                    ? 'bg-red-500 text-white hover:bg-red-600'
                                                    : 'glass-btn text-gray-600'
                                            }`}
                                        >
                                            <Flag size={14} />
                                            {review.isFlagged ? 'Unflag' : 'Flag'}
                                        </button>

                                        <button
                                            onClick={() => deleteReview(review.id)}
                                            className="glass-btn px-3 py-1.5 rounded-lg text-red-500 font-semibold text-xs inline-flex items-center gap-1 border-red-200/50 ml-auto hover:bg-red-50/50"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showReplyModal && selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal rounded-3xl w-full max-w-lg p-8 animate-scale-in">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Edit Admin Reply</h3>
                            <button onClick={() => setShowReplyModal(false)} className="glass-btn p-2 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="w-full h-32 px-4 py-3 glass-input rounded-xl text-gray-800 font-medium resize-y mb-4"
                            placeholder="Write your response to the customer..."
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveReply}
                                className="px-5 py-2.5 btn-accent rounded-xl"
                            >
                                Save Reply
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ReviewManagement;