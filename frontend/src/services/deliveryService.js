import api from './api';

const deliveryService = {
    getAllDeliveries: async () => {
        const response = await api.get('/deliveries');
        return response.data;
    },

    getOrdersReadyForDispatch: async () => {
        const response = await api.get('/deliveries/orders/ready');
        return response.data;
    },

    getAvailableVehicles: async () => {
        const response = await api.get('/deliveries/vehicles/available');
        return response.data;
    },

    assignVehicle: async (orderId, vehicleId, driverName) => {
        const response = await api.post('/deliveries/assign', {
            orderId,
            vehicleId,
            driverName,
        });
        return response.data;
    },

    updateDeliveryStatus: async (id, status) => {
        const response = await api.patch(`/deliveries/${id}/status?status=${status}`);
        return response.data;
    },
};

export default deliveryService;
