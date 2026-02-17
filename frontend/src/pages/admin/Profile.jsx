import React, { useState, useContext } from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function Profile() {
    const { user } = useContext(AuthContext);

    // Create a local state to hold the avatar URL so it updates instantly
    const [localAvatar, setLocalAvatar] = useState(user?.avatarUrl);

    // States for forms
    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State for the Avatar file
    const [avatarFile, setAvatarFile] = useState(null);

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await api.put(`/users/${user.email}/profile`, { name });
            setMessage('Profile updated successfully!');
        } catch (err) {
            console.error(err); // Used the err variable to satisfy ESLint
            setError('Failed to update profile. Please try again.');
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        if (newPassword !== confirmPassword) return setError('New passwords do not match!');
        try {
            await api.put(`/users/${user.email}/password`, { currentPassword, newPassword });
            setMessage('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            console.error(err); // Used the err variable to satisfy ESLint
            setError('Failed to change password. Check your current password.');
        }
    };

    const handleAvatarUpload = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!avatarFile) return setError('Please select an image file first.');

        const formData = new FormData();
        formData.append('file', avatarFile);

        try {
            // Capture the response!
            const response = await api.post(`/users/${user.email}/avatar`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            setMessage('Profile picture uploaded successfully!');
            setAvatarFile(null);

            // Instantly update the picture on the screen!
            setLocalAvatar(response.data);
        } catch (err) {
            console.error("Upload error:", err);
            setError('Failed to upload profile picture. Please try again.');
        }
    };

    return (
        <AdminLayout>
            <div className="max-w-3xl p-6 mx-auto bg-white rounded-lg shadow">
                <h2 className="mb-6 text-2xl font-bold text-gray-800">My Profile</h2>

                {message && <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">{message}</div>}
                {error && <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                {/* Profile Picture Upload Section */}
                <div className="p-4 mb-8 border rounded-lg border-gray-100 bg-gray-50">
                    <h3 className="mb-4 text-lg font-semibold text-gray-700">Profile Picture</h3>
                    <div className="flex items-center space-x-6">

                        {/* THE FIX: We are now using localAvatar here instead of user?.avatarUrl! */}
                        <div className="flex-shrink-0">
                            {localAvatar ? (
                                <img src={localAvatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
                            ) : (
                                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold border-4 border-white shadow-sm">
                                    {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                                </div>
                            )}
                        </div>

                        <form onSubmit={handleAvatarUpload} className="flex-1 space-y-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setAvatarFile(e.target.files[0])}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <button type="submit" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                                Upload Picture
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* The Update Profile Form */}
                    <div className="p-4 border rounded-lg border-gray-100 bg-gray-50">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">Update Profile</h3>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Email Address</label>
                                <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-2 bg-gray-200 border rounded-md text-gray-500 cursor-not-allowed" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">New Display Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter new name" />
                            </div>
                            <button type="submit" className="w-full py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Profile</button>
                        </form>
                    </div>

                    {/* The Change Password Form */}
                    <div className="p-4 border rounded-lg border-gray-100 bg-gray-50">
                        <h3 className="mb-4 text-lg font-semibold text-gray-700">Change Password</h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Current Password</label>
                                <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">New Password</label>
                                <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Confirm New Password</label>
                                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <button type="submit" className="w-full py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">Update Password</button>
                        </form>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}