import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const { clearCart } = useCart();
    useEffect(() => { clearCart(); }, [clearCart]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="glass-modal p-12 rounded-3xl max-w-md w-full text-center relative overflow-hidden animate-scale-in">
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-200/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-200/30 rounded-full blur-2xl" />
                <div className="relative">
                    <div className="w-24 h-24 bg-green-100/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-200/50">
                        <CheckCircle size={52} className="text-green-500" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Payment Successful!</h1>
                    <p className="text-gray-500 mb-2 font-medium leading-relaxed">
                        Thank you for your order. Your payment has been processed and your order is now confirmed.
                    </p>
                    <p className="text-sm text-accent font-semibold mb-8">📧 A confirmation email has been sent to your inbox.</p>
                    <div className="space-y-3">
                        <button onClick={() => { window.location.href = '/orders'; }}
                            className="w-full py-4 btn-accent rounded-2xl font-bold flex items-center justify-center gap-2">
                            View My Orders <ArrowRight size={20} />
                        </button>
                        <button onClick={() => { window.location.href = '/catalog'; }}
                            className="w-full py-4 glass-btn text-gray-600 rounded-2xl font-bold">
                            <span className="flex items-center justify-center gap-2"><ShoppingBag size={18} /> Continue Shopping</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;