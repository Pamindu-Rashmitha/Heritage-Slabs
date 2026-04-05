import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, ClipboardList, Ticket } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import UserTicketModal from './UserTicketModal';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useCart();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
    const cartCount = getCartCount();

    const handleLogout = () => {
        logout();
        window.location.href = '/login';
    };

    return (
        <>
            <nav className="fixed w-full z-50 bg-white/50 backdrop-blur-xl border-b border-white/40 shadow-glass-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link to="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Heritage Slabs" className="h-10 w-10 rounded-xl object-cover shadow-sm border border-white/50" />
                            <span className="text-xl font-extrabold bg-clip-text text-transparent bg-accent-gradient">
                                Heritage Slabs
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-6">
                            {user ? (
                                <div className="flex items-center gap-5">
                                    <span className="text-gray-700 font-semibold">Hi, {user.name}</span>

                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="glass-btn px-4 py-2 text-sm font-semibold text-gray-700 rounded-xl"
                                    >
                                        My Profile
                                    </button>

                                    <button
                                        onClick={() => setIsTicketModalOpen(true)}
                                        className="text-gray-600 hover:text-accent font-semibold transition-colors duration-300 flex items-center gap-1.5"
                                    >
                                        <Ticket size={18} />
                                        Support
                                    </button>

                                    <Link to="/orders" className="text-gray-600 hover:text-accent font-semibold transition-colors duration-300 flex items-center gap-1.5">
                                        <ClipboardList size={18} />
                                        Orders
                                    </Link>

                                    <Link to="/cart" className="relative text-gray-600 hover:text-accent transition-colors duration-300">
                                        <ShoppingCart size={22} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-2 -right-2 btn-accent text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-glow-teal">
                                                {cartCount > 9 ? '9+' : cartCount}
                                            </span>
                                        )}
                                    </Link>

                                    {user.role === 'ADMIN' && (
                                        <Link to="/dashboard" className="text-gray-600 hover:text-accent font-semibold transition-colors duration-300">
                                            Admin
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 border border-red-200/60 text-red-500 rounded-xl hover:bg-red-50/60 transition-all duration-300 font-semibold backdrop-blur-sm"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/login" className="text-gray-700 hover:text-accent font-semibold transition-colors duration-300">
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="btn-accent px-5 py-2.5 rounded-xl font-semibold"
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>

                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-700 hover:text-gray-900 p-2 glass-btn rounded-xl"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden glass-modal border-t border-white/30 absolute w-full shadow-glass-lg animate-slide-up">
                        <div className="px-4 pt-4 pb-6 space-y-2">
                            {user ? (
                                <>
                                    <div className="px-3 py-2 text-gray-900 font-bold border-b border-white/30">{user.name}</div>
                                    <button onClick={() => { setIsTicketModalOpen(true); setIsMenuOpen(false); }} className="w-full text-left block px-3 py-2.5 text-gray-700 hover:bg-white/40 rounded-xl flex items-center gap-2 transition-colors">
                                        <Ticket size={18} /> Support Tickets
                                    </button>
                                    <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:bg-white/40 rounded-xl flex items-center gap-2 transition-colors">
                                        <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
                                    </Link>
                                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:bg-white/40 rounded-xl flex items-center gap-2 transition-colors">
                                        <ClipboardList size={18} /> Orders
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:bg-white/40 rounded-xl transition-colors">Admin Dashboard</Link>
                                    )}
                                    <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2.5 text-red-500 hover:bg-red-50/50 rounded-xl transition-colors">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 text-gray-700 hover:bg-white/40 rounded-xl transition-colors">Log in</Link>
                                    <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2.5 btn-accent rounded-xl text-center font-bold">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <UserTicketModal isOpen={isTicketModalOpen} onClose={() => setIsTicketModalOpen(false)} />
        </>
    );
};

export default Navbar;