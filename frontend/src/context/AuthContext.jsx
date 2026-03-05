import React, { createContext, useState } from 'react';
import api from '../services/api';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        const name = localStorage.getItem('name');
        const id = localStorage.getItem('id');

        if (token && email) {
            return { email, role, name, id };
        }
        return null;
    });

    const loading = false;

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });

        const { token, role, name, id } = response.data; 

        // Save them to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('role', role);
        localStorage.setItem('name', name || '');
        if (id) localStorage.setItem('id', id); 

        setUser({ email, role, name, id }); 
        return true;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('name');
        localStorage.removeItem('id'); 
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};