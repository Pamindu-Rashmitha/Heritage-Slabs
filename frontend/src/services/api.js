import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // IMPORTANT: If sending FormData, let the browser handle Content-Type.
        // This ensures the "boundary" is correctly appended.
        if (config.data instanceof FormData) {
            delete config.headers['Content-Type'];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;