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

    initiatePayment: async (orderId) => {
        const response = await api.get(`/orders/initiate/${orderId}`);
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
    },

    downloadInvoice: async (id) => {
        const response = await api.get(`/orders/${id}/invoice`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Invoice_HS-${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },

    deleteOrder: async (id) => {
        const response = await api.delete(`/orders/${id}`);
        return response.data;
    }
};

export default orderService;