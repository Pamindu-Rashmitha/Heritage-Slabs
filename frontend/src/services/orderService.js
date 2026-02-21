import api from './api';

const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    getAllOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status?status=${status}`);
        return response.data;
    },

    getOrdersByEmail: async (email) => {
        const response = await api.get(`/orders?email=${email}`);
        return response.data;
    }
};

export default orderService;
