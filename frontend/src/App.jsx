import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Profile from './pages/admin/Profile';
import LandingPage from './pages/LandingPage';


import ProductManagement from './pages/admin/ProductManagement';
import ProductCatalog from './pages/ProductCatalog';

// Wrapper to pass user/logout from AuthContext as props to LandingPage
function LandingPageWrapper() {
    const { user, logout } = useContext(AuthContext);
    return <LandingPage user={user} logout={logout} />;
}

// ... other imports ...
import AdminRoute from './components/layout/AdminRoute'; // <-- 1. Import it

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-gray-100">
                        <Routes>
                            {/* --- PUBLIC ROUTES --- */}
                            <Route path="/" element={<LandingPageWrapper />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/catalog" element={<ProductCatalog />} />

                            {/* --- PROTECTED ADMIN ROUTES --- */}
                            {/* 2. Wrap sensitive routes with <AdminRoute> */}
                            <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                            <Route path="/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
                            <Route path="/products" element={<AdminRoute><ProductManagement /></AdminRoute>} />

                            {/* Note: If regular users also have a profile, you might want a <ProtectedRoute> instead of <AdminRoute> for this one */}
                            <Route path="/profile" element={<AdminRoute><Profile /></AdminRoute>} />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
