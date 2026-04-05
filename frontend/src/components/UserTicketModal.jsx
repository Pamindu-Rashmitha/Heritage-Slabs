import React, { useState, useEffect, useContext, useRef } from 'react';
import { X, Send, Plus, MessageSquare, ChevronLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getUserTickets, createTicket, addMessage } from '../services/ticketService';

export default function UserTicketModal({ isOpen, onClose }) {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState('list');
    const [tickets, setTickets] = useState([]);
    const [activeTicket, setActiveTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [formData, setFormData] = useState({ subject: '', initialMessage: '' });
    const messagesEndRef = useRef(null);

    useEffect(() => { if (isOpen && user) loadTickets(); }, [isOpen, user]);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [activeTicket?.messages]);

    const loadTickets = async () => {
        try { const data = await getUserTickets(user.id); setTickets(data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))); }
        catch (error) { console.error('Failed to load tickets', error); }
    };

    const handleCreateTicket = async (e) => {
        e.preventDefault();
        try { const newTicket = await createTicket(user.id, formData); setTickets([newTicket, ...tickets]); setFormData({ subject: '', initialMessage: '' }); setActiveTicket(newTicket); setView('chat'); }
        catch (error) { console.error('Failed to create ticket', error); }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try { const updated = await addMessage(activeTicket.id, user.id, { message: newMessage }); setActiveTicket(updated); setNewMessage(''); setTickets(tickets.map(t => t.id === updated.id ? updated : t)); }
        catch (error) { console.error('Failed to send message', error); }
    };

    const sortedMessages = activeTicket?.messages ? [...activeTicket.messages].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt)) : [];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-md animate-fade-in">
            <div className="glass-modal rounded-3xl w-full max-w-md h-[600px] flex flex-col overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-accent-gradient text-white p-4 flex justify-between items-center shadow-lg shrink-0">
                    <div className="flex items-center gap-2">
                        {view !== 'list' && (
                            <button onClick={() => setView('list')} className="hover:bg-white/20 p-1.5 rounded-xl transition">
                                <ChevronLeft size={20} />
                            </button>
                        )}
                        <h2 className="font-bold text-lg">
                            {view === 'list' ? 'Support Tickets' : view === 'create' ? 'New Ticket' : activeTicket?.subject}
                        </h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/20 p-1.5 rounded-xl transition text-white/70 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto flex flex-col relative">
                    {/* List View */}
                    {view === 'list' && (
                        <div className="p-4 flex flex-col h-full">
                            <button onClick={() => setView('create')}
                                className="w-full mb-4 btn-accent py-3 rounded-xl flex items-center justify-center gap-2 font-bold shrink-0">
                                <Plus size={18} /> Create New Ticket
                            </button>

                            {tickets.length === 0 ? (
                                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                                    <MessageSquare size={48} className="mb-2 opacity-30" />
                                    <p className="font-medium">No support tickets yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {tickets.map(ticket => (
                                        <div key={ticket.id} onClick={() => { setActiveTicket(ticket); setView('chat'); }}
                                            className="glass-card p-4 rounded-2xl cursor-pointer hover:shadow-glass-lg transition-all group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-gray-800 group-hover:text-accent transition truncate pr-2 text-sm">
                                                    {ticket.subject}
                                                </h3>
                                                <span className={`glass-badge text-xs font-bold shrink-0 ${
                                                    ticket.status === 'PENDING' ? 'bg-yellow-100/50 text-yellow-700 border-yellow-200/50' :
                                                    ticket.status === 'ONGOING' ? 'bg-blue-100/50 text-blue-700 border-blue-200/50' :
                                                    'bg-green-100/50 text-green-700 border-green-200/50'
                                                }`}>
                                                    {ticket.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400">{new Date(ticket.updatedAt).toLocaleDateString()}</p>
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
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Subject</label>
                                    <input type="text" required
                                        className="w-full px-4 py-3 glass-input rounded-xl text-gray-800 font-medium"
                                        placeholder="Briefly describe your issue..."
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Message</label>
                                    <textarea required
                                        className="w-full flex-1 px-4 py-3 glass-input rounded-xl text-gray-800 font-medium resize-none"
                                        placeholder="Provide more details here..."
                                        value={formData.initialMessage}
                                        onChange={(e) => setFormData({ ...formData, initialMessage: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-accent py-3 rounded-xl font-bold mt-4 shrink-0">
                                Submit Ticket
                            </button>
                        </form>
                    )}

                    {/* Chat View */}
                    {view === 'chat' && activeTicket && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {sortedMessages.map((msg) => {
                                    const isMe = String(msg.senderId) === String(user.id);
                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[80%] rounded-2xl p-3 ${isMe
                                                ? 'bg-accent-gradient text-white rounded-br-sm shadow-lg shadow-cyan-500/15'
                                                : 'glass text-gray-800 rounded-bl-sm border border-white/40'}`}>
                                                {!isMe && <p className="text-[10px] font-bold text-gray-500 mb-1 uppercase tracking-wider">{msg.senderName} (Admin)</p>}
                                                <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                                <p className={`text-[10px] text-right mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>
                                                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {activeTicket.status === 'RESOLVED' ? (
                                <div className="p-4 glass text-green-600 text-center text-sm font-medium border-t border-white/30 shrink-0">
                                    This ticket has been resolved and is now closed.
                                </div>
                            ) : (
                                <form onSubmit={handleSendMessage} className="p-3 glass border-t border-white/30 flex gap-2 shrink-0">
                                    <input type="text"
                                        className="flex-1 px-4 py-2 glass-input rounded-full text-sm font-medium"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)} />
                                    <button type="submit" disabled={!newMessage.trim()}
                                        className="btn-accent p-2.5 rounded-full disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center w-10 h-10 shrink-0">
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