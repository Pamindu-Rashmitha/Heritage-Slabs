import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext'; // Adjust path if needed

const AdminRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // 1. If not logged in at all, kick to login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. If logged in, but NOT an admin, kick to the public catalog
    if (user.role !== 'ADMIN') {
        return <Navigate to="/catalog" replace />;
    }

    // 3. If they are an Admin, let them pass!
    return children;
};

export default AdminRoute;