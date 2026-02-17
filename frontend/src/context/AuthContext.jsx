import React, { createContext, useState } from 'react';
import api from '../services/api';

// 1. Tell ESLint to ignore the Fast Refresh rule for this context export
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 2. Lazy Initialization: Checks local storage exactly once on load
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');

        if (token && email) {
            return { email, role };
        }
        return null;
    });

    // 3. FIX: Removed the unused 'setLoading' state setter to clear the ESLint error.
    // We just set loading to a static 'false' so your other components don't break.
    const loading = false;

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        // Grab the token and real role from Spring Boot
        const { token, role } = response.data;

        // Save them to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);

        setUser({ email, role });
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};