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

// Wrapper to pass user/logout from AuthContext as props to LandingPage
function LandingPageWrapper() {
    const { user, logout } = useContext(AuthContext);
    return <LandingPage user={user} logout={logout} />;
}

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-gray-100">
                        <Routes>
                            <Route path="/" element={<LandingPageWrapper />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                        {/* Protected Admin Routes */}
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/users" element={<UserManagement />} />
                        <Route path="/profile" element={<Profile />} />

                        <Route path="/products" element={<ProductManagement />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}


export default App;