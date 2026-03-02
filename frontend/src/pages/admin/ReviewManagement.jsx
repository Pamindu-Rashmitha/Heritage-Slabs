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
        return <AdminLayout><div className="p-10 text-center text-gray-600">Loading reviews...</div></AdminLayout>;
    }

    return (
        <AdminLayout>
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Review Management</h1>
                </div>

                <p className="text-gray-600 mb-6">Manage customer reviews and responses</p>

                {/* Stats Cards - Updated to match Dashboard theme */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                        <p className="text-sm text-gray-500">Total Reviews</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{totalReviews}</p>
                    </div>
                    <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded">
                        <p className="text-sm text-gray-500">Flagged for Attention</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{flaggedCount}</p>
                    </div>
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
                        <p className="text-sm text-gray-500">Positive Reviews</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">{positiveCount}</p>
                    </div>
                </div>

                {/* Clean Tab Design */}
                <div className="flex gap-6 mb-6 border-b border-gray-200">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                            activeTab === 'all'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        All Reviews ({totalReviews})
                    </button>
                    <button
                        onClick={() => setActiveTab('flagged')}
                        className={`pb-3 text-sm font-semibold transition-all border-b-2 flex items-center gap-2 ${
                            activeTab === 'flagged'
                                ? 'border-red-600 text-red-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        <Flag size={16} />
                        Flagged ({flaggedCount})
                    </button>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                    {displayedReviews.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-10 text-center border border-gray-200">
                            <p className="text-gray-500">No {activeTab === 'flagged' ? 'flagged ' : ''}reviews found.</p>
                        </div>
                    ) : (
                        displayedReviews.map((review) => (
                            <div key={review.id} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:bg-gray-50 transition">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{review.sentimentEmoji}</span>
                                        <div>
                                            <div className="font-bold text-gray-800">{review.userName}</div>
                                            <div className="text-xs text-gray-500">{review.productName}</div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`px-2 py-1 text-xs font-bold rounded ${review.rating >= 4 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4 rounded text-sm text-gray-700">
                                        <span className="font-semibold text-blue-800">Admin Response:</span><br />
                                        {review.adminReply}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleEditReply(review)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm font-medium transition"
                                    >
                                        <Edit2 size={14} /> Edit Reply
                                    </button>

                                    <button
                                        onClick={() => toggleFlag(review.id)}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm font-medium transition ${
                                            review.isFlagged
                                                ? 'bg-red-600 text-white hover:bg-red-700'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        <Flag size={14} />
                                        {review.isFlagged ? 'Unflag' : 'Flag'}
                                    </button>

                                    <button
                                        onClick={() => deleteReview(review.id)}
                                        className="flex items-center gap-1 px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded text-sm font-medium transition ml-auto"
                                    >
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Edit Reply Modal - Updated to match ProductManagement modal style */}
            {showReplyModal && selectedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                        <h3 className="text-xl font-bold mb-4">Edit Admin Reply</h3>
                        <textarea
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                            className="w-full h-32 p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                            placeholder="Write your response to the customer..."
                        />
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveReply}
                                className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700"
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