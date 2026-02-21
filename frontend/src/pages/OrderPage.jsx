import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import api from '../services/api';
import PaymentModal from '../components/PaymentModal';
import { ShoppingBag, ChevronRight, MapPin, Phone, User, Trash2, ArrowLeft } from 'lucide-react';
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
                status: 'Pending',
                date: new Date().toISOString(),
                address: address,
                items: orderItems
            };

            const createdOrder = await orderService.createOrder(orderData);

            // 4. Mock payment success - update status to 'paid'
            await orderService.updateOrderStatus(createdOrder.id, 'paid');

            // 5. Clear cart and redirect
            clearCart();
            alert("Order placed and paid successfully!");
            navigate('/');
        } catch (err) {
            console.error("Order process failed", err);
            setError("Failed to process order. Please try again.");
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
                    <Link to="/catalog" className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-4xl font-extrabold text-gray-900">Confirm Order</h1>
                </div>

                {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 font-medium">{error}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Side: Cart Items & Form */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Cart Summary */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                                    <div className="bg-blue-600/10 p-2 rounded-xl">
                                        <ShoppingBag size={24} className="text-blue-600" />
                                    </div>
                                    Cart Items
                                </h2>
                                <span className="bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full text-sm font-bold">
                                    {cartItems.length} {cartItems.length === 1 ? 'Slab' : 'Slabs'}
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-8 flex flex-col sm:flex-row items-center gap-8 hover:bg-gray-50/50 transition duration-300">
                                        <div className="w-32 h-32 bg-gray-50 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 border border-gray-100">
                                            {item.textureUrl ? (
                                                <img src={`http://localhost:8080${item.textureUrl}`} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300 font-bold text-xs tracking-widest uppercase p-4 text-center">No Texture</div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1">{item.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mb-4">
                                                <span className="text-gray-500 text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg">{item.grade}</span>
                                                <span className="text-gray-500 text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg">{item.dimensions}</span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                                <div className="text-blue-600 font-black text-2xl">
                                                    {item.price.toLocaleString()} <span className="text-xs text-gray-400">LKR/sqft</span>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-gray-100 rounded-xl p-1 shadow-inner border border-gray-200">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition text-gray-500 hover:text-blue-600 font-bold"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-12 text-center font-black text-lg text-gray-900">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-lg transition text-gray-500 hover:text-blue-600 font-bold"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <div className="text-xl font-bold text-gray-900">
                                                {(item.price * item.quantity).toLocaleString()} LKR
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 group"
                                            >
                                                <Trash2 size={24} className="group-hover:scale-110 transition" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-10">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
                                <div className="bg-blue-600/10 p-2 rounded-xl">
                                    <MapPin size={24} className="text-blue-600" />
                                </div>
                                Shipping Details
                            </h2>
                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <User size={14} className="text-blue-500" /> Receiver Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={user?.name || ''}
                                            className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900"
                                            placeholder="Who will receive the delivery?"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            <Phone size={14} className="text-blue-500" /> Contact Number
                                        </label>
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 placeholder:font-medium"
                                            placeholder="+94 7X XXX XXXX"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <MapPin size={14} className="text-blue-500" /> Exact Location
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-6 py-5 bg-gray-50/50 border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all duration-300 font-bold text-gray-900 resize-none placeholder:font-medium"
                                        placeholder="Enter the full delivery address for slab transportation"
                                        required
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-gray-100 p-10 lg:sticky lg:top-28">
                            <h2 className="text-3xl font-black text-gray-900 mb-10">Summary</h2>

                            <div className="space-y-6 mb-10 pb-10 border-b border-gray-100">
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span>Subtotal</span>
                                    <span className="text-gray-900">{totalAmount.toLocaleString()} LKR</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span>Processing Fee</span>
                                    <span className="text-blue-600">Calculated</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-500 font-bold">
                                    <span>Delivery</span>
                                    <span className="text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg text-xs tracking-wider uppercase">Free Consultation</span>
                                </div>
                            </div>

                            <div className="mb-12">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">Total Investment</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-blue-600">{totalAmount.toLocaleString()}</span>
                                        <span className="text-sm font-black text-gray-400 uppercase">LKR</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button
                                    onClick={handleConfirmOrder}
                                    disabled={!address || !phone || loading}
                                    className="w-full py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-2xl shadow-blue-200 disabled:from-gray-200 disabled:to-gray-200 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transform"
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
                                    className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition duration-300 text-sm tracking-widest uppercase"
                                >
                                    ← Back to Catalog
                                </button>
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-6">
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale opacity-50">VISA</div>
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale opacity-50">MC</div>
                                <div className="bg-gray-100 h-10 w-16 rounded-lg flex items-center justify-center grayscale opacity-50 font-black text-[10px]">STRIPE</div>
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
