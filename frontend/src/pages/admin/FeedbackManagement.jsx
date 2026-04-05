import React, { useState, useEffect, useContext, useRef } from 'react';
import { getAllTickets, addMessage, updateTicketStatus } from '../../services/ticketService';
import { AuthContext } from '../../context/AuthContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Send, CheckCircle, Clock, AlertCircle, Ticket, ChevronRight } from 'lucide-react';

export default function FeedbackManagement() {
    const { user } = useContext(AuthContext);
    const [tickets, setTickets] = useState([]);
    const [activeTab, setActiveTab] = useState('PENDING'); 
    const [activeTicket, setActiveTicket] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        loadTickets();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeTicket?.messages]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const data = await getAllTickets();
            setTickets(data);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
        } finally {
            setLoading(false);
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

    const filteredTickets = tickets
        .filter(t => t.status === activeTab)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const sortedMessages = activeTicket?.messages
        ? [...activeTicket.messages].sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt))
        : [];

    const tabConfig = [
        { key: 'PENDING', label: 'PENDING', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-500' },
        { key: 'ONGOING', label: 'ONGOING', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-600' },
        { key: 'RESOLVED', label: 'RESOLVED', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500' },
    ];

    if (loading) {
        return (
            <AdminLayout>
                <div className="p-10 text-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent mx-auto mb-3"></div>
                    Loading tickets...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="flex flex-col h-[calc(100vh-100px)] gap-4 p-4">
                
                {/* Tabs Header */}
                <div className="glass-card p-2 rounded-2xl flex gap-2 w-fit mx-auto shrink-0 shadow-glass">
                    {tabConfig.map(tab => (
                        <button 
                            key={tab.key}
                            onClick={() => {setActiveTab(tab.key); setActiveTicket(null);}}
                            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                                activeTab === tab.key 
                                    ? `${tab.bg} text-white shadow-lg shadow-gray-400/20` 
                                    : 'text-gray-500 hover:bg-white/40'
                            }`}
                        >
                            <tab.icon size={16} /> {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-1 gap-4 overflow-hidden min-h-0">
                    {/* Left Pane: Ticket List */}
                    <div className="w-1/3 glass-card rounded-3xl p-4 flex flex-col gap-3 shadow-glass overflow-hidden">
                        <div className="flex items-center gap-2 px-2 mb-2">
                            <Ticket size={20} className="text-accent" />
                            <h2 className="font-bold text-gray-800 text-sm uppercase tracking-widest">Tickets ({filteredTickets.length})</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-1 custom-scrollbar">
                            {filteredTickets.length === 0 ? (
                                <div className="text-center mt-10 py-10 glass rounded-2xl border-white/20">
                                    <p className="text-gray-400 text-sm font-medium">No {activeTab.toLowerCase()} tickets.</p>
                                </div>
                            ) : (
                                filteredTickets.map(ticket => (
                                    <div 
                                        key={ticket.id} 
                                        onClick={() => setActiveTicket(ticket)}
                                        className={`p-4 rounded-2xl cursor-pointer border transition-all duration-300 relative group overflow-hidden ${
                                            activeTicket?.id === ticket.id 
                                                ? 'glass bg-accent/5 border-accent/30 shadow-glass-sm' 
                                                : 'glass border-white/30 hover:border-accent/20 hover:shadow-glass-sm bg-white/30'
                                        }`}
                                    >
                                        {activeTicket?.id === ticket.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-gradient" />}
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold transition-colors text-sm truncate ${activeTicket?.id === ticket.id ? 'text-accent' : 'text-gray-800'}`}>
                                                {ticket.subject}
                                            </h3>
                                            <ChevronRight size={14} className={`transition-transform duration-300 ${activeTicket?.id === ticket.id ? 'translate-x-1 text-accent' : 'text-gray-300'}`} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 font-medium">User: {ticket.userName}</p>
                                        <p className="text-[10px] text-gray-400 mt-2 font-semibold">{new Date(ticket.createdAt).toLocaleString()}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Chat Interface */}
                    <div className="w-2/3 glass-card rounded-3xl flex flex-col overflow-hidden shadow-glass border-white/40">
                        {activeTicket ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-5 border-b border-white/30 flex justify-between items-center glass shrink-0 bg-white/20">
                                    <div>
                                        <h2 className="font-bold text-lg text-gray-900 group">{activeTicket.subject}</h2>
                                        <p className="text-sm text-gray-500 mt-0.5">Reported by <span className="font-semibold text-gray-700">{activeTicket.userName}</span></p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {activeTicket.status !== 'RESOLVED' && (
                                            <button 
                                                onClick={() => handleStatusChange('RESOLVED')}
                                                className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg shadow-green-500/20 hover:scale-105 transition-all"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {activeTicket.status === 'RESOLVED' && (
                                            <button 
                                                onClick={() => handleStatusChange('ONGOING')}
                                                className="px-4 py-2 glass-btn text-accent border-accent/20 hover:bg-accent/5 rounded-xl font-bold text-xs transition-all"
                                            >
                                                Reopen Ticket
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white/40 custom-scrollbar">
                                    {sortedMessages.map(msg => {
                                        const isAdmin = msg.senderRole === 'ADMIN';
                                        return (
                                            <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                                <div className={`max-w-[75%] rounded-2xl p-4 shadow-glass-sm animate-fade-in ${
                                                    isAdmin 
                                                        ? 'bg-accent-gradient text-white rounded-br-sm shadow-cyan-500/10' 
                                                        : 'glass bg-white/80 text-gray-800 rounded-bl-sm border-white/60'
                                                }`}>
                                                    <p className={`text-[10px] font-bold mb-1 uppercase tracking-wider ${isAdmin ? 'text-white/60' : 'text-gray-500'}`}>
                                                        {msg.senderName} {isAdmin ? '(You)' : ''}
                                                    </p>
                                                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                                    <p className={`text-[10px] text-right mt-2 font-semibold ${isAdmin ? 'text-white/50' : 'text-gray-400'}`}>
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
                                    <div className="p-5 glass text-gray-500 text-center font-bold border-t border-white/30 shrink-0 text-sm bg-white/40">
                                        This ticket is resolved. Chat is locked.
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="p-4 glass border-t border-white/30 flex gap-3 shrink-0 bg-white/50">
                                        <textarea 
                                            rows="1"
                                            className="flex-1 glass-input rounded-xl px-4 py-3 text-sm resize-none font-medium custom-scrollbar"
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
                                            className="btn-accent px-6 rounded-xl hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed font-bold flex items-center gap-2"
                                        >
                                            Send <Send size={16} />
                                        </button>
                                    </form>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 glass bg-white/20">
                                <div className="bg-accent/5 p-8 rounded-full mb-4 animate-pulse shadow-glass-sm border border-accent/5">
                                    <AlertCircle size={48} className="text-accent/40" />
                                </div>
                                <p className="text-lg font-bold tracking-tight text-gray-500/70">Select a ticket to begin communication</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}