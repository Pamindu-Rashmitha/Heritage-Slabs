import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, totalAmount }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
    const [expiry, setExpiry] = useState('12/26');
    const [cvc, setCvc] = useState('123');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            onPaymentSuccess();
        }, 2000);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="glass-modal rounded-3xl w-full max-w-md overflow-hidden animate-scale-in">
                {/* Header */}
                <div className="bg-accent-gradient p-6 text-white text-center relative">
                    <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition">
                        <X size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                        <CreditCard size={32} />
                    </div>
                    <h2 className="text-2xl font-bold">Secure Payment</h2>
                    <p className="text-white/70 mt-1">Heritage Slabs Checkout</p>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="text-center mb-6">
                        <p className="text-gray-400 text-sm uppercase tracking-wider font-bold">Total Amount</p>
                        <p className="text-4xl font-extrabold bg-clip-text text-transparent bg-accent-gradient">{totalAmount.toLocaleString()} LKR</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    className="w-full px-4 py-3 glass-input rounded-xl font-medium text-gray-800"
                                    placeholder="0000 0000 0000 0000"
                                    required
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <CreditCard size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Expiry Date</label>
                                <input
                                    type="text"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    className="w-full px-4 py-3 glass-input rounded-xl font-medium text-gray-800"
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CVC</label>
                                <input
                                    type="text"
                                    value={cvc}
                                    onChange={(e) => setCvc(e.target.value)}
                                    className="w-full px-4 py-3 glass-input rounded-xl font-medium text-gray-800"
                                    placeholder="000"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 btn-accent rounded-xl text-lg flex items-center justify-center gap-2 group disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="animate-spin" size={24} />
                                Processing...
                            </>
                        ) : (
                            <>
                                Pay Now
                                <ShieldCheck className="group-hover:scale-110 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                        <ShieldCheck size={16} className="text-green-500" />
                        Guaranteed safe & secure checkout
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PaymentModal;
