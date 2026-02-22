import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { Edit2, Trash2, Flag, Star } from 'lucide-react';
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
        return <AdminLayout><div className="p-10 text-center">Loading reviews...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
                </div>

                <p className="text-gray-600 mb-6">Manage customer reviews and responses</p>

                {/* Stats Cards - unchanged */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6">
                        <p className="text-blue-600 text-sm font-medium">Total Reviews</p>
                        <p className="text-4xl font-bold text-blue-700 mt-2">{totalReviews}</p>
                    </div>
                    <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                        <p className="text-red-600 text-sm font-medium">Flagged for Attention</p>
                        <p className="text-4xl font-bold text-red-700 mt-2">{flaggedCount}</p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-3xl p-6">
                        <p className="text-green-600 text-sm font-medium">Positive Reviews</p>
                        <p className="text-4xl font-bold text-green-700 mt-2">{positiveCount}</p>
                    </div>
                </div>

                {/* === ONLY THIS PART CHANGED - Tabs now match Dashboard / other pages style === */}
                <div className="bg-gray-100 p-1.5 rounded-3xl inline-flex mb-8 shadow-sm">
                    <button
                        onClick={() => setActiveTab('flagged')}
                        className={`flex items-center gap-2 px-7 py-3 rounded-3xl font-semibold transition-all text-sm
                            ${activeTab === 'flagged' 
                                ? 'bg-white text-red-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'}`}
                    >
                        <Flag size={18} /> 
                        Flagged ({flaggedCount})
                    </button>
                    
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`flex items-center gap-2 px-7 py-3 rounded-3xl font-semibold transition-all text-sm
                            ${activeTab === 'all' 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-gray-600 hover:text-gray-800 hover:bg-white/70'}`}
                    >
                        All Reviews ({totalReviews})
                    </button>
                </div>

                {/* Reviews List - unchanged */}
                <div className="space-y-6">
                    {displayedReviews.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                            <div className="text-6xl mb-4">🎉</div>
                            <p className="text-xl text-gray-500">No flagged reviews! All caught up.</p>
                        </div>
                    ) : (
                        displayedReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{review.sentimentEmoji}</span>
                                        <div>
                                            <div className="font-semibold">{review.userName}</div>
                                            <div className="text-xs text-gray-400">{review.productName}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className={`px-3 py-1 text-xs font-bold rounded-full ${review.rating >= 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {review.rating >= 4 ? 'POSITIVE' : 'NEGATIVE'}
                                        </div>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <p className="font-medium text-lg mb-2">"{review.title}"</p>
                                <p className="text-gray-600 mb-5">{review.comment}</p>

                                {review.adminReply && (
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl text-sm">
                                        <span className="font-semibold text-blue-700">Vijitha Granite Response:</span><br />
                                        {review.adminReply}
                                    </div>
                                )}

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => handleEditReply(review)}
                                        className="flex items-center gap-2 px-5 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-2xl font-medium transition"
                                    >
                                        <Edit2 size={16} /> Edit Reply
                                    </button>

                                    <button
                                        onClick={() => toggleFlag(review.id)}
                                        className={`flex items-center gap-2 px-5 py-2 rounded-2xl font-medium transition ${
                                            review.isFlagged 
                                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <Flag size={16} /> 
                                        {review.isFlagged ? 'Unflag' : 'Flag'}
                                    </button>

                                    <button
                                        onClick={() => deleteReview(review.id)}
                                        className="flex items-center gap-2 px-5 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-2xl font-medium transition ml-auto"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Reply Modal - unchanged */}
            {showReplyModal && selectedReview && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8">
                        <h3 className="text-2xl font-bold mb-6">Edit Admin Reply</h3>
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="w-full h-40 p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write reply here..."
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="flex-1 py-3 border border-gray-200 rounded-2xl font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveReply}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-medium hover:bg-blue-700"
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