import api from './api';

export const createTicket = async (userId, data) => {
    const response = await api.post(`/tickets/user/${userId}`, data);
    return response.data;
};

export const addMessage = async (ticketId, senderId, data) => {
    const response = await api.post(`/tickets/${ticketId}/messages/sender/${senderId}`, data);
    return response.data;
};

export const updateTicketStatus = async (ticketId, status) => {
    const response = await api.patch(`/tickets/${ticketId}/status?status=${status}`);
    return response.data;
};

export const getUserTickets = async (userId) => {
    const response = await api.get(`/tickets/user/${userId}`);
    return response.data;
};

export const getTicketById = async (ticketId) => {
    const response = await api.get(`/tickets/${ticketId}`);
    return response.data;
};

export const getAllTickets = async () => {
    const response = await api.get(`/tickets`);
    return response.data;
};