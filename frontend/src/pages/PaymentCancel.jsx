import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';

const PaymentCancel = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-12 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
                <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <XCircle size={48} className="text-red-500" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Payment Cancelled</h1>
                <p className="text-gray-500 mb-8 font-medium">
                    Your payment was cancelled or declined. Your order has not been completed. Please try again or use a different payment method.
                </p>
                <div className="space-y-4">
                    <Link
                        to="/cart"
                        className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition shadow-lg"
                    >
                        <RefreshCcw size={20} />
                        Try Payment Again
                    </Link>
                    <Link
                        to="/catalog"
                        className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Back to Catalog
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentCancel;
