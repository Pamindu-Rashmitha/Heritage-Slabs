import api from './api';

const supplierService = {
    // --- Supplier Methods ---
    getAllSuppliers: async () => {
        const response = await api.get('/suppliers');
        return response.data;
    },
    getSupplierById: async (id) => {
        const response = await api.get(`/suppliers/${id}`);
        return response.data;
    },
    createSupplier: async (supplierData) => {
        const response = await api.post('/suppliers', supplierData);
        return response.data;
    },
    updateSupplier: async (id, supplierData) => {
        const response = await api.put(`/suppliers/${id}`, supplierData);
        return response.data;
    },
    deleteSupplier: async (id) => {
        const response = await api.delete(`/suppliers/${id}`);
        return response.data;
    },

    // --- Purchase Order Methods ---
    getAllPurchaseOrders: async () => {
        const response = await api.get('/suppliers/purchase-orders');
        return response.data;
    },
    getPurchaseOrdersBySupplier: async (supplierId) => {
        const response = await api.get(`/suppliers/${supplierId}/purchase-orders`);
        return response.data;
    },
    createPurchaseOrder: async (orderData) => {
        const response = await api.post('/suppliers/purchase-orders', orderData);
        return response.data;
    },
    updatePurchaseOrderStatus: async (id, status) => {
        // Pass status as a query parameter
        const response = await api.put(`/suppliers/purchase-orders/${id}/status?status=${status}`);
        return response.data;
    },

    // --- Material Intake Methods ---
    logMaterialIntake: async (intakeData) => {
        const response = await api.post('/suppliers/material-intakes', intakeData);
        return response.data;
    },
    getIntakesByPurchaseOrder: async (purchaseOrderId) => {
        const response = await api.get(`/suppliers/purchase-orders/${purchaseOrderId}/material-intakes`);
        return response.data;
    }
};

export default supplierService;
