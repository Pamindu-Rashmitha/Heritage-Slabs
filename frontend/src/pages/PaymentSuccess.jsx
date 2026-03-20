import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const PaymentSuccess = () => {
    const { clearCart } = useCart();

    useEffect(() => {
        // Clear the cart when the user returns successfully from payment
        clearCart();
    }, [clearCart]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={48} className="text-green-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Payment Successful!</h1>
                <p className="text-gray-500 mb-8 font-medium">
                    Thank you for your order. Your payment has been processed successfully and your order is now confirmed.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/orders"
                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition shadow-lg shadow-blue-200"
                    >
                        View My Orders
                        <ArrowRight size={20} />
                    </Link>
                    <Link
                        to="/catalog"
                        className="w-full py-4 text-gray-500 font-bold hover:text-blue-600 transition block border border-gray-200 rounded-xl hover:bg-gray-50"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;