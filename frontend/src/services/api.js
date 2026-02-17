import axios from 'axios';

// Create an Axios instance pointing to your Spring Boot backend
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// This interceptor automatically attaches the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;