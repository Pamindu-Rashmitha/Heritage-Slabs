import React, { useEffect } from 'react';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center border border-gray-100 relative overflow-hidden">
                {/* decorative ring */}
                <div className="absolute -top-12 -right-12 w-40 h-40 bg-green-50 rounded-full opacity-60" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-50 rounded-full opacity-60" />

                <div className="relative">
                    {/* Icon */}
                    <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-green-100">
                        <CheckCircle size={52} className="text-green-500" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Payment Successful!</h1>
                    <p className="text-gray-500 mb-2 font-medium leading-relaxed">
                        Thank you for your order. Your payment has been processed and your order is now confirmed.
                    </p>
                    <p className="text-sm text-blue-600 font-semibold mb-8">
                        📧 A confirmation email has been sent to your inbox.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => { window.location.href = '/orders'; }}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-lg shadow-blue-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                            View My Orders
                            <ArrowRight size={20} />
                        </button>
                        <button
                            onClick={() => { window.location.href = '/catalog'; }}
                            className="w-full py-4 text-gray-500 font-bold hover:text-blue-600 transition block border border-gray-200 rounded-2xl hover:bg-gray-50"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <ShoppingBag size={18} />
                                Continue Shopping
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;