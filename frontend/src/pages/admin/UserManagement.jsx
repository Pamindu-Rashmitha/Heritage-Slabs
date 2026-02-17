import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

export default function UserManagement() {
    const { user: currentUser } = useContext(AuthContext); // Get the logged-in user

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('USER');

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError('Failed to load user data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only fetch users if the current user is an admin
        if (currentUser?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [currentUser]);

    // STRICT ROLE PROTECTION: If not an admin, kick them to the dashboard!
    if (currentUser?.role !== 'ADMIN') {
        return <Navigate to="/dashboard" />;
    }

    const handleDelete = async (email) => {
        if (email === currentUser.email) {
            return alert("You cannot delete your own admin account!");
        }

        const confirmDelete = window.confirm(`Are you absolutely sure you want to delete ${email}?`);
        if (confirmDelete) {
            try {
                await api.delete(`/users/${email}`);
                fetchUsers();
            } catch (err) {
                console.error("Failed to delete user", err);
                alert("Error deleting user. Please try again.");
            }
        }
    };

    // Open the modal and pre-fill the user's current info
    const openEditModal = (user) => {
        setSelectedEmail(user.email);
        setSelectedRole(user.role);
        setIsModalOpen(true);
    };

    // Save the new role to the backend
    const handleUpdateRole = async () => {
        try {
            await api.put(`/users/${selectedEmail}/role`, { role: selectedRole });
            setIsModalOpen(false); // Close modal
            fetchUsers(); // Refresh the table
        } catch (err) {
            console.error("Failed to update role", err);
            alert("Error updating role. Please try again.");
        }
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-white rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                </div>

                {error && <div className="p-4 mb-4 text-red-700 bg-red-100 rounded">{error}</div>}

                {loading ? (
                    <div className="py-10 text-center text-gray-500">Loading users...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                            <tr className="bg-gray-50 border-y">
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Name</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Email</th>
                                <th className="px-6 py-4 text-sm font-medium text-gray-500">Role</th>
                                <th className="px-6 py-4 text-sm font-medium text-right text-gray-500">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y">
                            {users.map((user, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                user.role === 'ADMIN'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        {/* Updated Edit Button to trigger modal */}
                                        <button
                                            onClick={() => openEditModal(user)}
                                            className="mr-3 text-blue-600 hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.email)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* EDIT ROLE MODAL POP-UP */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-xl">
                        <h3 className="mb-4 text-lg font-bold text-gray-800">Change User Role</h3>
                        <p className="mb-4 text-sm text-gray-600">Updating role for: <br/><span className="font-semibold">{selectedEmail}</span></p>

                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Select Role</label>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateRole}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}