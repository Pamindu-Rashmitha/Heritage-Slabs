import React, { useState, useEffect, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AdminLayout from '../../components/layout/AdminLayout';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';
import { Users, Shield, X, Edit3, Trash2, Clock } from 'lucide-react';

export default function UserManagement() {
    const { user: currentUser } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [adminLogs, setAdminLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');
    const [selectedRole, setSelectedRole] = useState('USER');

    const fetchUsers = async () => {
        try {
            const [usersRes, logsRes] = await Promise.all([api.get('/users'), api.get('/users/admin-logs')]);
            setUsers(usersRes.data); setAdminLogs(logsRes.data); setLoading(false);
        } catch (err) { console.error("Error fetching users:", err); setError('Failed to load user data.'); setLoading(false); }
    };

    useEffect(() => { if (currentUser?.role === 'ADMIN') fetchUsers(); }, [currentUser]);
    if (currentUser?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

    const handleDelete = async (email) => {
        if (email === currentUser.email) return alert("You cannot delete your own admin account!");
        if (!window.confirm(`Are you absolutely sure you want to delete ${email}?`)) return;
        try { await api.delete(`/users/${email}`); fetchUsers(); }
        catch (err) { console.error("Failed to delete user", err); alert("Error deleting user."); }
    };

    const openEditModal = (user) => { setSelectedEmail(user.email); setSelectedRole(user.role); setIsModalOpen(true); };

    const handleUpdateRole = async () => {
        try { await api.put(`/users/${selectedEmail}/role`, { role: selectedRole }); setIsModalOpen(false); fetchUsers(); }
        catch (err) { console.error("Failed to update role", err); alert("Error updating role."); }
    };

    return (
        <AdminLayout>
            <div className="p-4">
                <div className="glass-card p-6 rounded-3xl mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-accent/10 p-3 rounded-xl"><Users size={24} className="text-accent" /></div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
                                <p className="text-gray-500 text-sm">Manage accounts, roles, and permissions.</p>
                            </div>
                        </div>
                    </div>

                    {error && <div className="p-3 mb-4 text-red-700 bg-red-100/60 backdrop-blur-sm rounded-xl border border-red-200/50">{error}</div>}

                    {loading ? (
                        <div className="py-10 text-center text-gray-500">Loading users...</div>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {users.map((user, index) => (
                                        <tr key={index} className="hover:bg-white/20 transition-colors">
                                            <td className="px-6 py-4 text-sm font-bold text-gray-800">{user.name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <span className={`glass-badge ${user.role === 'ADMIN' ? 'text-purple-700 bg-purple-100/50 border-purple-200/50' : 'text-blue-700 bg-blue-100/50 border-blue-200/50'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-right space-x-2">
                                                <button onClick={() => openEditModal(user)} className="glass-btn px-3 py-1.5 rounded-lg text-accent font-semibold text-xs inline-flex items-center gap-1">
                                                    <Edit3 size={14} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(user.email)} className="glass-btn px-3 py-1.5 rounded-lg text-red-500 font-semibold text-xs inline-flex items-center gap-1 border-red-200/50">
                                                    <Trash2 size={14} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Audit Trail */}
                <div className="glass-card p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-amber-100/50 p-2 rounded-xl"><Clock size={20} className="text-amber-500" /></div>
                        <h3 className="text-xl font-bold text-gray-800">Admin Authentication Logs</h3>
                    </div>
                    {adminLogs.length === 0 ? (
                        <p className="p-4 glass rounded-xl text-gray-400 italic">No admin logins recorded yet.</p>
                    ) : (
                        <div className="overflow-x-auto glass-table rounded-2xl">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-white/30">
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Record ID</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Admin Email</th>
                                        <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Login Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {adminLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-white/20 transition-colors">
                                            <td className="px-6 py-3 text-sm text-gray-500 font-mono">#{log.id}</td>
                                            <td className="px-6 py-3 text-sm font-bold text-gray-800">{log.adminEmail}</td>
                                            <td className="px-6 py-3 text-sm text-gray-600">{new Date(log.loginTime).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Role Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
                    <div className="glass-modal w-full max-w-sm p-8 rounded-3xl animate-scale-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-accent/10 p-2 rounded-xl"><Shield size={20} className="text-accent" /></div>
                            <h3 className="text-lg font-bold text-gray-900">Change User Role</h3>
                        </div>
                        <p className="mb-6 text-sm text-gray-500">Updating role for: <br /><span className="font-bold text-gray-800">{selectedEmail}</span></p>
                        <div className="mb-6">
                            <label className="block mb-2 text-sm font-semibold text-gray-600">Select Role</label>
                            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full px-4 py-3 glass-input rounded-xl font-bold text-gray-800 appearance-none cursor-pointer">
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 glass-btn rounded-xl font-semibold text-gray-600">Cancel</button>
                            <button onClick={handleUpdateRole} className="px-5 py-2.5 btn-accent rounded-xl">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}