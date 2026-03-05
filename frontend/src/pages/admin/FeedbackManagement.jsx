import React, { useState, useEffect, useContext, useRef } from 'react';
import { getAllTickets, addMessage, updateTicketStatus } from '../../services/ticketService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function FeedbackManagement() {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('PENDING'); 
    const [activeTicket, setActiveTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeTicket?.messages]);

    const loadTickets = async () => {
        try {
            const data = await getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeTicket) return;
        try {
            const updatedTicket = await addMessage(activeTicket.id, user.id, { message: newMessage });
            setActiveTicket(updatedTicket);
            setNewMessage('');
            setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            
            if (activeTicket.status === 'PENDING') {
                setActiveTab('ONGOING');
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const handleStatusChange = async (newStatus) => {
        if (!activeTicket) return;
        try {
            const updatedTicket = await updateTicketStatus(activeTicket.id, newStatus);
            setActiveTicket(updatedTicket);
            setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
            setActiveTab(newStatus);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    // Sort tickets by newest first
    const filteredTickets = tickets
        .filter(t => t.status === activeTab)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Sort messages oldest first (so newest is at the bottom)
    const sortedMessages = activeTicket?.messages
        ? [...activeTicket.messages].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
        : [];

    return (
        <AdminLayout>
            <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
                
                {/* Floating Tabs Header */}
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex gap-2 w-fit mx-auto shrink-0">
                    <button 
                        onClick={() => {setActiveTab('PENDING'); setActiveTicket(null);}}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'PENDING' ? 'bg-yellow-500 text-white shadow-md shadow-yellow-500/30' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <AlertCircle size={18} /> PENDING
                    </button>
                    <button 
                        onClick={() => {setActiveTab('ONGOING'); setActiveTicket(null);}}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'ONGOING' ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <Clock size={18} /> ONGOING
                    </button>
                    <button 
                        onClick={() => {setActiveTab('RESOLVED'); setActiveTicket(null);}}
                        className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'RESOLVED' ? 'bg-green-500 text-white shadow-md shadow-green-500/30' : 'text-gray-500 hover:bg-gray-100'}`}
                    >
                        <CheckCircle size={18} /> RESOLVED
                    </button>
                </div>

                <div className="flex flex-1 gap-6 overflow-hidden min-h-0">
                    {/* Left Pane: Ticket List */}
                    <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto p-4 flex flex-col gap-3">
                        <h2 className="font-bold text-gray-800 text-lg mb-2 px-2">Tickets ({filteredTickets.length})</h2>
                        {filteredTickets.length === 0 ? (
                            <p className="text-gray-400 text-center mt-10 text-sm">No {activeTab.toLowerCase()} tickets found.</p>
                        ) : (
                            filteredTickets.map(ticket => (
                                <div 
                                    key={ticket.id} 
                                    onClick={() => setActiveTicket(ticket)}
                                    className={`p-4 rounded-xl cursor-pointer border transition ${activeTicket?.id === ticket.id ? 'bg-blue-50 border-blue-500' : 'bg-white border-gray-100 hover:border-gray-300'}`}
                                >
                                    <h3 className="font-bold text-gray-800 truncate">{ticket.subject}</h3>
                                    <p className="text-sm text-gray-500 mt-1">User: {ticket.userName}</p>
                                    <p className="text-xs text-gray-400 mt-2">{new Date(ticket.createdAt).toLocaleString()}</p>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Right Pane: Chat Interface */}
                    <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        {activeTicket ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                                    <div>
                                        <h2 className="font-bold text-xl text-gray-900">{activeTicket.subject}</h2>
                                        <p className="text-sm text-gray-500 mt-1">Reported by <span className="font-semibold">{activeTicket.userName}</span></p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {activeTicket.status !== 'RESOLVED' && (
                                            <button 
                                                onClick={() => handleStatusChange('RESOLVED')}
                                                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg font-bold text-sm transition"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {activeTicket.status === 'RESOLVED' && (
                                            <button 
                                                onClick={() => handleStatusChange('ONGOING')}
                                                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-bold text-sm transition"
                                            >
                                                Reopen Ticket
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                                    {sortedMessages.map(msg => {
                                        const isAdmin = msg.senderRole === 'ADMIN';
                                        return (
                                            <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[70%] rounded-2xl p-4 shadow-sm ${
                                                    isAdmin ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200'
                                                }`}>
                                                    <p className={`text-[11px] font-bold mb-1 uppercase tracking-wider ${isAdmin ? 'text-blue-200' : 'text-gray-500'}`}>
                                                        {msg.senderName} {isAdmin ? '(You)' : ''}
                                                    </p>
                                                    <p className="text-[15px] whitespace-pre-wrap">{msg.message}</p>
                                                    <p className={`text-xs text-right mt-2 ${isAdmin ? 'text-blue-200' : 'text-gray-400'}`}>
                                                        {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input Area */}
                                {activeTicket.status === 'RESOLVED' ? (
                                    <div className="p-5 bg-gray-100 text-gray-500 text-center font-medium border-t border-gray-200 shrink-0">
                                        This ticket is resolved. Chat is locked.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="p-4 bg-gray-50 border-t border-gray-200 flex gap-3 shrink-0">
                                        <textarea 
                                            rows="2"
                                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm resize-none"
                                            placeholder="Type your reply here..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendMessage(e);
                                                }
                                            }}
                                        />
                                        <button 
                                            type="submit"
                                            disabled={!newMessage.trim()}
                                            className="bg-blue-600 text-white px-6 rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-bold flex items-center gap-2 shadow-md"
                                        >
                                            Send <Send size={18} />
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                <AlertCircle size={64} className="mb-4 opacity-20" />
                                <p className="text-lg">Select a ticket from the left to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}