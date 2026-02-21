import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import Profile from './pages/admin/Profile';
import LandingPage from './pages/LandingPage';


import ProductManagement from './pages/admin/ProductManagement';
import VehicleManagement from './pages/admin/VehicleManagement';
import ProductCatalog from './pages/ProductCatalog';
import OrderPage from './pages/OrderPage';
import OrdersList from './pages/OrdersList';
import Navbar from './components/Navbar';

// Wrapper to pass user/logout from AuthContext as props to LandingPage
function LandingPageWrapper() {
    const { user, logout } = useContext(AuthContext);
    return <LandingPage user={user} logout={logout} />;
}

const NavbarWrapper = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Paths that should NOT show the global navbar
    const adminPaths = ['/dashboard', '/users', '/profile', '/products', '/vehicles'];
    const isAdminPath = adminPaths.includes(location.pathname);

    // Special case for orders: admins get the admin layout sidebar, so hide global navbar
    const isOrdersAdmin = location.pathname === '/orders' && user?.role === 'ADMIN';

    if (isAdminPath || isOrdersAdmin) return null;

    return <Navbar />;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="min-h-screen bg-white">
                        <NavbarWrapper />
                        <Routes>
                            <Route path="/" element={<LandingPageWrapper />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />

                            <Route path="/catalog" element={<ProductCatalog />} />
                            <Route path="/cart" element={<OrderPage />} />
                            <Route path="/orders" element={<OrdersList />} />

                            {/* Protected Admin Routes */}
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/profile" element={<Profile />} />

                            <Route path="/products" element={<ProductManagement />} />
                            <Route path="/vehicles" element={<VehicleManagement />} />
                        </Routes>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}


export default App;