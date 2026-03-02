import React, { useState, useEffect, useContext, useRef } from 'react';
import { X, Send, Plus, MessageSquare, ChevronLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getUserTickets, createTicket, addMessage } from '../services/ticketService';

export default function UserTicketModal({ isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState('list'); // 'list', 'create', 'chat'
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [formData, setFormData] = useState({ subject: '', initialMessage: '' });
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (isOpen && user) {
            loadTickets();
        }
    }, [isOpen, user]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeTicket?.messages]);

    const loadTickets = async () => {
        try {
            const data = await getUserTickets(user.id);
            // Sort tickets by newest first
            const sortedTickets = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setTickets(sortedTickets);
        } catch (error) {
            console.error('Failed to load tickets', error);
        }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try {
            const newTicket = await createTicket(user.id, formData);
            setTickets([newTicket, ...tickets]);
            setFormData({ subject: '', initialMessage: '' });
            setActiveTicket(newTicket);
            setView('chat');
        } catch (error) {
            console.error('Failed to create ticket', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const updatedTicket = await addMessage(activeTicket.id, user.id, { message: newMessage });
            setActiveTicket(updatedTicket);
            setNewMessage('');
            setTickets(tickets.map(t => t.id === updatedTicket.id ? updatedTicket : t));
        } catch (error) {
            console.error('Failed to send message', error);
        }
    };

    // Sort messages oldest first (so newest is at the bottom)
    const sortedMessages = activeTicket?.messages 
        ? [...activeTicket.messages].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)) 
        : [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md z-10 shrink-0">
                    <div className="flex items-center gap-2">
                        {view !== 'list' && (
                            <button onClick={() => setView('list')} className="hover:bg-gray-800 p-1 rounded transition">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h2 className="font-bold text-lg">
                            {view === 'list' ? 'Support Tickets' : view === 'create' ? 'New Ticket' : activeTicket?.subject}
                        </h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-gray-800 p-1 rounded transition text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Content Body */}
                <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative">
                    {/* List View */}
                    {view === 'list' && (
                        <div className="p-4 flex flex-col h-full">
                            <button 
                                onClick={() => setView('create')}
                                className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition shadow-md shrink-0"
                            >
                                <Plus size={18} /> Create New Ticket
                            </button>
                            
                            {tickets.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <MessageSquare size={48} className="mb-2 opacity-50" />
                                    <p>No support tickets yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tickets.map(ticket => (
                                        <div 
                                            key={ticket.id} 
                                            onClick={() => { setActiveTicket(ticket); setView('chat'); }}
                                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:border-blue-300 hover:shadow-md transition group"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition truncate pr-2">
                                                    {ticket.subject}
                                                </h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${
                                                    ticket.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                    ticket.status === 'ONGOING' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                {new Date(ticket.updatedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Create View */}
                    {view === 'create' && (
                        <form onSubmit={handleCreateTicket} className="p-6 h-full flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input 
                                        type="text" 
                                        required
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        placeholder="Briefly describe your issue..."
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea 
                                        required
                                        className="w-full flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                                        placeholder="Provide more details here..."
                                        value={formData.initialMessage}
                                        onChange={(e) => setFormData({...formData, initialMessage: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition shadow-md mt-4 shrink-0">
                                Submit Ticket
                            </button>
                        </form>
                    )}

                    {/* Chat View */}
                    {view === 'chat' && activeTicket && (
                        <div className="flex flex-col h-full bg-white">
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {sortedMessages.map((msg) => {
                                    const isMe = String(msg.senderId) === String(user.id);
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${
                                                isMe ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm border border-gray-200'
                                            }`}>
                                                {!isMe && <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">{msg.senderName} (Admin)</p>}
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            {activeTicket.status === 'RESOLVED' ? (
                                <div className="p-4 bg-green-50 text-green-700 text-center text-sm font-medium border-t border-green-100 shrink-0">
                                    This ticket has been marked as resolved and is now closed.
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="p-3 bg-gray-50 border-t border-gray-200 flex gap-2 shrink-0">
                                    <input 
                                        type="text"
                                        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-sm"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex items-center justify-center w-10 h-10 shrink-0"
                                    >
                                        <Send size={18} className="ml-0.5" />
                                    </button>
                                </form>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}