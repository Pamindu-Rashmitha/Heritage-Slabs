import api from './api';

const productService = {
    // PUBLIC: Get all products for the catalog
    getAllProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    // PUBLIC: Get a single product by ID
    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    // ADMIN: Get low stock alerts
    getLowStockAlerts: async () => {
        const response = await api.get('/products/low-stock');
        return response.data;
    },

    // ADMIN: Create a new product (text data only)
    createProduct: async (productData) => {
        const response = await api.post('/products', productData);
        return response.data;
    },

    // ADMIN: Update an existing product
    updateProduct: async (id, productData) => {
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
    },

    // ADMIN: Delete a product
    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // ADMIN: Upload a product image (Requires multipart/form-data)
    uploadProductImage: async (id, file) => {
        // We must use FormData to send files via HTTP
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post(`/products/${id}/image`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
};

export default productService;