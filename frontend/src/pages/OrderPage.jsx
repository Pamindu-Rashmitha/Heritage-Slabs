import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import api from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { ShoppingBag, ChevronRight, MapPin, Phone, User, Trash2, ArrowLeft, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const OrderPage = () => {
    const { cartItems, getCartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const totalAmount = getCartTotal();

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        setShowPayment(false);
        setLoading(true);
        setError('');

        try {
            // 1. Fetch full user object from backend using email
            const userResponse = await api.get(`/users/${user.email}`);
            const fullUser = userResponse.data;

            // 2. Prepare items in the format the DTO expects
            const orderItems = cartItems.map(item => ({
                product_id: { id: item.id },
                quantity: item.quantity,
                priceAtOrder: item.price
            }));

            // 3. Create Order
            const orderData = {
                user_id: fullUser,
                totalAmount: totalAmount,
                status: 'PENDING',
                date: new Date().toISOString(),
                address: address,
                items: orderItems
            };

            const createdOrder = await orderService.createOrder(orderData);

            // 4. Mock payment success - update status to 'paid'
            await orderService.updateOrderStatus(createdOrder.id, 'PAID');

            // 5. Clear cart and redirect
            clearCart();
            alert("Order placed and paid successfully!");
            navigate('/');
        } catch (err) {
            console.error("Order process failed", err);
            console.error("Error response data:", err.response?.data);
            const serverMsg = err.response?.data?.message || err.response?.data?.cause || '';
            setError(serverMsg || "Failed to process order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0 && !loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-center items-center justify-center p-4">
                <div className="text-center bg-white p-12 rounded-3xl shadow-xl max-w-md w-full">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any premium slabs to your order yet.</p>
                    <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                        Browse Catalog
                        <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/catalog" className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition text-gray-600 border border-gray-100">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Confirm <span className="text-blue-600 italic">Order</span>
                    </h1>
                </div>

                {error && (
                    <div className="mb-10 p-5 bg-red-50 text-red-700 rounded-3xl border border-red-100 font-bold flex items-center gap-3 animate-shake">
                        <div className="bg-red-100 p-2 rounded-xl">
                            <X size={20} />
                        </div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Side: Cart Items & Form */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Cart Summary */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-10 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-4">
                                    <div className="bg-blue-600/10 p-3 rounded-2xl">
                                        <ShoppingBag size={28} className="text-blue-600" />
                                    </div>
                                    Cart Summary
                                </h2>
                                <span className="bg-blue-50 text-blue-600 px-5 py-2 rounded-full text-sm font-black tracking-widest uppercase border border-blue-100">
                                    {cartItems.length} {cartItems.length === 1 ? 'Slab' : 'Slabs'}
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-10 flex flex-col sm:flex-row items-center gap-10 hover:bg-gray-50/50 transition duration-300 group">
                                        <div className="w-40 h-40 bg-gray-50 rounded-3xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100 relative">
                                            {item.textureUrl ? (
                                                <img
                                                    src={`http://localhost:8080${item.textureUrl}`}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300 font-bold text-xs tracking-widest uppercase p-4 text-center">No Texture</div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-2xl font-extrabold text-gray-900 mb-2 group-hover:text-blue-600 transition">{item.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-3 mb-6">
                                                <span className="text-blue-600 text-xs font-black px-3 py-1 bg-blue-50 rounded-lg uppercase tracking-wider border border-blue-100/50">{item.grade} Grade</span>
                                                <span className="text-gray-500 text-xs font-bold px-3 py-1 bg-gray-100 rounded-lg uppercase tracking-wider">{item.dimensions}</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-8">
                                                <div className="text-blue-600 font-black text-3xl">
                                                    {item.price.toLocaleString()} <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">LKR/sqft</span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-gray-50 rounded-2xl p-1.5 border border-gray-100 shadow-inner">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-50 rounded-xl transition text-gray-400 hover:text-blue-600 font-bold shadow-sm border border-gray-100"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-14 text-center font-black text-xl text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-12 h-12 flex items-center justify-center bg-white hover:bg-gray-50 rounded-xl transition text-gray-400 hover:text-blue-600 font-bold shadow-sm border border-gray-100"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-6">
                                            <div className="text-2xl font-black text-gray-900">
                                                {(item.price * item.quantity).toLocaleString()} <span className="text-sm font-bold text-gray-400 uppercase">LKR</span>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-4 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all duration-300 group/trash border border-transparent hover:border-red-100"
                                            >
                                                <Trash2 size={24} className="group-hover/trash:scale-110 transition" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 p-12">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-12 flex items-center gap-4">
                                <div className="bg-blue-600/10 p-3 rounded-2xl">
                                    <MapPin size={28} className="text-blue-600" />
                                </div>
                                Shipping Details
                            </h2>
                            <form className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                            <User size={14} className="text-blue-600" /> Consignee Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={user?.name || ''}
                                            className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-extrabold text-gray-900 placeholder:font-medium placeholder:text-gray-300"
                                            placeholder="Who will receive the delivery?"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                            <Phone size={14} className="text-blue-600" /> Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-extrabold text-gray-900 placeholder:font-medium placeholder:text-gray-300"
                                            placeholder="+94 7X XXX XXXX"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
                                        <MapPin size={14} className="text-blue-600" /> Transportation Address
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-8 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-extrabold text-gray-900 resize-none placeholder:font-medium placeholder:text-gray-300 leading-relaxed"
                                        placeholder="Enter the full delivery address for safe slab transportation"
                                        required
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-10 lg:sticky lg:top-28">
                            <h2 className="text-3xl font-black text-gray-900 mb-10 tracking-tight">Investment Summary</h2>

                            <div className="space-y-6 mb-10 pb-10 border-b border-gray-100">
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span className="text-sm uppercase tracking-wider font-extrabold text-gray-400">Subtotal</span>
                                    <span className="text-xl font-black text-gray-900">{totalAmount.toLocaleString()} <span className="text-xs">LKR</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider font-extrabold text-gray-400">Handling Fee</span>
                                    <span className="text-blue-600 font-black tracking-widest text-xs uppercase bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">Included</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider font-extrabold text-gray-400">Delivery</span>
                                    <span className="text-emerald-500 font-black tracking-widest text-[10px] uppercase bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">Free Consultation</span>
                                </div>
                            </div>

                            <div className="mb-12 bg-blue-600/5 p-8 rounded-3xl border border-blue-600/10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-[0.25em] mb-2">Total Amount due</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-blue-600 tracking-tighter">{totalAmount.toLocaleString()}</span>
                                        <span className="text-sm font-black text-blue-600 uppercase tracking-widest">LKR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={!address || !phone || loading}
                                    className="w-full py-6 bg-blue-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-400/20 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transform flex items-center justify-center gap-3"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-3">
                                            <div className="animate-spin h-6 w-6 border-4 border-white border-t-transparent rounded-full font-bold"></div>
                                            SECURELY PROCESSING...
                                        </span>
                                    ) : (
                                        'PROCEED TO PAYMENT'
                                    )}
                                </button>
                                <button
                                    onClick={() => navigate('/catalog')}
                                    className="w-full py-4 text-gray-400 font-black hover:text-blue-600 transition-all duration-300 text-xs tracking-[0.2em] uppercase"
                                >
                                    ← Back to Catalog
                                </button>
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-6 opacity-30">
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale text-[10px] font-black italic">VISA</div>
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale text-[10px] font-black italic">MASTER</div>
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale text-[10px] font-black italic uppercase">Stripe</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={showPayment}
                onClose={() => setShowPayment(false)}
                onPaymentSuccess={handlePaymentSuccess}
                totalAmount={totalAmount}
            />
        </div>
    );
};

export default OrderPage;
