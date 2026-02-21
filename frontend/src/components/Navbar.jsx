import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const cartCount = getCartCount();

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/logo.png" alt="Heritage Slabs" className="h-10 w-10 rounded-lg object-cover" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-700 to-gray-900">
                            Heritage Slabs
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <div className="flex items-center gap-6">
                                <span className="text-gray-600 font-medium">Hi, {user.name}</span>

                                {/* Orders Link */}
                                <Link to="/orders" className="text-gray-600 hover:text-blue-600 font-medium transition flex items-center gap-1">
                                    <ClipboardList size={18} />
                                    Orders
                                </Link>

                                {/* Cart Icon */}
                                <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition">
                                    <ShoppingCart size={22} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold shadow-md">
                                            {cartCount > 9 ? '9+' : cartCount}
                                        </span>
                                    )}
                                </Link>

                                {user.role === 'ADMIN' && (
                                    <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition">
                                        Admin
                                    </Link>
                                )}
                                <button
                                    onClick={logout}
                                    className="px-4 py-2 border border-gray-200 text-red-500 rounded-lg hover:bg-red-50 hover:border-red-100 transition font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-blue-600 font-medium transition">
                                    Log in
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 font-medium"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-gray-900 p-2"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg">
                    <div className="px-4 pt-4 pb-6 space-y-3">
                        {user ? (
                            <>
                                <div className="px-3 py-2 text-gray-900 font-semibold border-b border-gray-50">{user.name}</div>
                                <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                                    <ShoppingCart size={18} /> Cart {cartCount > 0 && `(${cartCount})`}
                                </Link>
                                <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md flex items-center gap-2">
                                    <ClipboardList size={18} /> Orders
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link to="/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Admin Dashboard</Link>
                                )}
                                <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-md">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-md">Log in</Link>
                                <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 bg-blue-600 text-white rounded-md text-center font-bold">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
