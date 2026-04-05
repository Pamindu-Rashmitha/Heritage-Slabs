import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, UserCircle } from 'lucide-react';

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="glass-card flex items-center justify-between h-16 px-6 rounded-2xl">
            <div className="flex items-center space-x-3">
                {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-white/60 shadow-sm" />
                ) : (
                    <div className="w-10 h-10 bg-accent-gradient rounded-full flex items-center justify-center text-white font-bold shadow-glow-teal text-sm">
                        {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                )}
                <div className="text-lg font-bold text-gray-800">
                    Welcome, <span className="bg-clip-text text-transparent bg-accent-gradient">{user?.name || user?.email || 'Admin'}</span>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <span className="glass-badge text-accent-dark">
                    {user?.role || 'USER'}
                </span>

                <button
                    onClick={() => navigate('/profile')}
                    className="glass-btn px-4 py-2 text-sm font-semibold text-gray-700 rounded-xl flex items-center gap-2"
                >
                    <UserCircle size={16} />
                    Profile
                </button>

                <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50/60 backdrop-blur-sm border border-red-200/50 rounded-xl hover:bg-red-100/70 transition-all duration-300 flex items-center gap-2"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>
        </header>
    );
}