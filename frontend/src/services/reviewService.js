import api from './api';

const reviewService = {
    // Submit a new review (requires login)
    createReview: async (productId, rating, title, comment) => {
        const response = await api.post('/reviews', {
            productId,
            rating,
            title,
            comment
        });
        return response.data;
    }
};

export default reviewService;