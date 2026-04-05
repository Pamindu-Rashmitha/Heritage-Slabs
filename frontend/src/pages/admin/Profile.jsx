import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { UserCircle, Upload, Lock, Edit3, Eye, EyeOff, ArrowLeft } from 'lucide-react';

export default function Profile() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [localAvatar, setLocalAvatar] = useState(user?.avatarUrl);
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault(); setMessage(''); setError('');
        try { await api.put(`/users/${user.email}/profile`, { name }); setMessage('Profile updated successfully!'); }
        catch (err) { console.error(err); setError('Failed to update profile.'); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault(); setMessage(''); setError('');
        if (newPassword !== confirmPassword) return setError('New passwords do not match!');
        try {
            await api.put(`/users/${user.email}/password`, { currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
        } catch (err) { console.error(err); setError('Failed to change password. Check your current password.'); }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault(); setMessage(''); setError('');
        if (!avatarFile) return setError('Please select an image file first.');
        const formData = new FormData();
        formData.append('file', avatarFile);
        try {
            const response = await api.post(`/users/${user.email}/avatar`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMessage('Profile picture uploaded successfully!');
            setAvatarFile(null);
            setLocalAvatar(response.data);
        } catch (err) { console.error("Upload error:", err); setError('Failed to upload profile picture.'); }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Back Button */}
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 px-4 py-2 glass-btn rounded-xl text-gray-600 hover:text-accent font-semibold transition-all group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                {/* Header */}
                <div className="glass-card p-8 rounded-3xl text-center">
                    <div className="flex items-center justify-center mb-4">
                        {localAvatar ? (
                            <img src={localAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white/60 shadow-glass" />
                        ) : (
                            <div className="w-24 h-24 bg-accent-gradient rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/60 shadow-glow-teal">
                                {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">My Profile</h2>
                    <p className="text-gray-500 font-medium">{user?.email}</p>
                </div>

                {message && <div className="p-3 text-green-700 bg-green-100/60 backdrop-blur-sm rounded-xl border border-green-200/50 font-semibold">{message}</div>}
                {error && <div className="p-3 text-red-700 bg-red-100/60 backdrop-blur-sm rounded-xl border border-red-200/50 font-semibold">{error}</div>}

                {/* Avatar Upload */}
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-100/50 p-2 rounded-xl"><Upload size={20} className="text-indigo-500" /></div>
                        <h3 className="text-lg font-bold text-gray-800">Profile Picture</h3>
                    </div>
                    <form onSubmit={handleAvatarUpload} className="flex flex-col sm:flex-row items-center gap-4">
                        <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])}
                            className="flex-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent/10 file:text-accent hover:file:bg-accent/20" />
                        <button type="submit" className="btn-accent px-6 py-2.5 rounded-xl text-sm">Upload</button>
                    </form>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Update Profile */}
                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-100/50 p-2 rounded-xl"><Edit3 size={20} className="text-blue-500" /></div>
                            <h3 className="text-lg font-bold text-gray-800">Update Profile</h3>
                        </div>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-600">Email Address</label>
                                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 glass rounded-xl text-gray-400 cursor-not-allowed font-medium" />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-600">New Display Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                                    className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium" placeholder="Enter new name" />
                            </div>
                            <button type="submit" className="w-full py-3 btn-accent rounded-xl">Save Profile</button>
                        </form>
                    </div>

                    {/* Change Password */}
                    <div className="glass-card p-6 rounded-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-green-100/50 p-2 rounded-xl"><Lock size={20} className="text-green-500" /></div>
                            <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
                        </div>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-600">Current Password</label>
                                <div className="relative group">
                                    <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 pr-12" />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                                        onClick={() => setShowCurrent(!showCurrent)}>
                                        {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-600">New Password</label>
                                <div className="relative group">
                                    <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 pr-12" />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                                        onClick={() => setShowNew(!showNew)}>
                                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-semibold text-gray-600">Confirm New Password</label>
                                <div className="relative group">
                                    <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 pr-12" />
                                    <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-accent transition-colors"
                                        onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-500/20">
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}