import React, { useState, useContext } from 'react';
import { useCart } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import api from '../services/api';
import { ShoppingBag, ChevronRight, MapPin, Phone, User, Trash2, ArrowLeft, X, Calendar, FileText, Hash, Building2, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SRI_LANKA_PROVINCES = [
    'Central Province', 'Eastern Province', 'North Central Province', 'Northern Province',
    'North Western Province', 'Sabaragamuwa Province', 'Southern Province', 'Uva Province', 'Western Province',
];

const OrderPage = () => {
    const { cartItems, getCartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [province, setProvince] = useState('');
    const [preferredDeliveryDate, setPreferredDeliveryDate] = useState('');
    const [orderNote, setOrderNote] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});

    const totalAmount = getCartTotal();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = today.toISOString().split('T')[0];
    const maxDate = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const validateFields = () => {
        const errors = {};
        const sriLankaPhoneRegex = /^(0|\+94)\d{9}$/;
        const postalCodeRegex = /^\d{5}$/;

        if (!address.trim()) errors.address = 'Delivery address is required.';
        if (!phone.trim()) { errors.phone = 'Contact number is required.'; }
        else if (!sriLankaPhoneRegex.test(phone.trim())) { errors.phone = 'Enter a valid Sri Lankan number (e.g. 0771234567 or +94771234567).'; }
        if (!city.trim()) errors.city = 'City is required.';
        if (!postalCode.trim()) { errors.postalCode = 'Postal code is required.'; }
        else if (!postalCodeRegex.test(postalCode.trim())) { errors.postalCode = 'Postal code must be exactly 5 digits.'; }
        if (!province) errors.province = 'Province is required.';
        if (!preferredDeliveryDate) { errors.preferredDeliveryDate = 'Preferred delivery date is required.'; }
        else {
            const selected = new Date(preferredDeliveryDate);
            selected.setHours(0, 0, 0, 0);
            if (selected < today) { errors.preferredDeliveryDate = 'Delivery date cannot be in the past.'; }
            else if (selected > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) { errors.preferredDeliveryDate = 'Delivery date must be within 30 days from today.'; }
        }
        if (!contactEmail.trim()) { errors.contactEmail = 'Contact email is required.'; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim())) { errors.contactEmail = 'Please enter a valid email address.'; }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        if (!validateFields()) { setError('Please fix the errors below before proceeding.'); return; }

        setLoading(true);
        setError('');

        try {
            const userResponse = await api.get(`/users/${user.email}`);
            const fullUser = userResponse.data;

            const orderItems = cartItems.map(item => ({
                product_id: { id: item.id },
                quantity: item.quantity,
                priceAtOrder: item.price
            }));

            const orderData = {
                user_id: fullUser, totalAmount, status: 'Pending', date: new Date().toISOString(),
                address: address.trim(), phoneNumber: phone.trim(), city: city.trim(),
                postalCode: postalCode.trim(), province, preferredDeliveryDate,
                orderNote: orderNote.trim() || null, contactEmail: contactEmail.trim(), items: orderItems
            };

            const createdOrder = await orderService.createOrder(orderData);
            const payhereData = await orderService.initiatePayment(createdOrder.id);

            const form = document.createElement('form');
            form.method = 'POST';
            form.action = 'https://sandbox.payhere.lk/pay/checkout';
            Object.keys(payhereData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden'; input.name = key; input.value = payhereData[key];
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (err) {
            console.error("Order process or payment initialization failed", err);
            const backendMsg = err?.response?.data?.message || err?.response?.data || null;
            setError(backendMsg || "Failed to initialize payment. Please try again.");
            setLoading(false);
        }
    };

    const isFormReady = address && phone && city && postalCode && province && preferredDeliveryDate;

    if (cartItems.length === 0 && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center glass-modal p-12 rounded-3xl max-w-md w-full animate-scale-in">
                    <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShoppingBag size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added any premium slabs to your order yet.</p>
                    <Link to="/catalog" className="inline-flex items-center gap-2 px-8 py-4 btn-accent rounded-xl font-bold">
                        Browse Catalog <ChevronRight size={20} />
                    </Link>
                </div>
            </div>
        );
    }

    const FieldError = ({ name }) =>
        fieldErrors[name] ? (
            <p className="text-red-500 text-xs font-bold mt-1 px-1 flex items-center gap-1">
                <X size={12} /> {fieldErrors[name]}
            </p>
        ) : null;

    const inputClasses = (fieldName) =>
        `w-full px-6 py-4 glass-input rounded-2xl font-bold text-gray-900 placeholder:font-medium placeholder:text-gray-400 ${fieldErrors[fieldName] ? 'border-red-300 bg-red-50/30' : ''}`;

    return (
        <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-10">
                    <Link to="/catalog" className="p-3 glass-btn rounded-2xl text-gray-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Confirm <span className="bg-clip-text text-transparent bg-accent-gradient italic">Order</span>
                    </h1>
                </div>

                {error && (
                    <div className="mb-10 p-5 bg-red-50/70 backdrop-blur-sm text-red-700 rounded-3xl border border-red-200/50 font-bold flex items-center gap-3">
                        <div className="bg-red-100/60 p-2 rounded-xl"><X size={20} /></div>
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Side */}
                    <div className="lg:col-span-2 space-y-10">
                        {/* Cart Summary */}
                        <div className="glass-card rounded-3xl overflow-hidden">
                            <div className="p-8 border-b border-white/30 flex justify-between items-center">
                                <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-4">
                                    <div className="bg-accent/10 p-3 rounded-2xl"><ShoppingBag size={24} className="text-accent" /></div>
                                    Cart Summary
                                </h2>
                                <span className="glass-badge text-accent-dark">{cartItems.length} {cartItems.length === 1 ? 'Slab' : 'Slabs'}</span>
                            </div>
                            <div className="divide-y divide-white/20">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="p-8 flex flex-col sm:flex-row items-center gap-8 hover:bg-white/20 transition duration-300 group">
                                        <div className="w-32 h-32 glass rounded-2xl overflow-hidden flex-shrink-0">
                                            {item.textureUrl ? (
                                                <img src={`http://localhost:8080${item.textureUrl}`} alt={item.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-300 font-bold text-xs">No Texture</div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl font-extrabold text-gray-900 mb-2">{item.name}</h3>
                                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                                <span className="glass-badge text-accent-dark">{item.grade}</span>
                                                <span className="glass-badge text-gray-600">{item.dimensions}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                                <div className="text-accent font-extrabold text-2xl">
                                                    {item.price.toLocaleString()} <span className="text-xs text-gray-400 uppercase">LKR/sqft</span>
                                                </div>
                                                <div className="flex items-center glass rounded-xl p-1">
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white/40 rounded-lg transition text-gray-500 font-bold">-</button>
                                                    <span className="w-12 text-center font-extrabold text-gray-900">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="w-10 h-10 flex items-center justify-center hover:bg-white/40 rounded-lg transition text-gray-500 font-bold">+</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <div className="text-xl font-extrabold text-gray-900">
                                                {(item.price * item.quantity).toLocaleString()} <span className="text-sm text-gray-400">LKR</span>
                                            </div>
                                            <button onClick={() => removeFromCart(item.id)}
                                                className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50/50 rounded-xl transition-all">
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Form */}
                        <div className="glass-card rounded-3xl p-10">
                            <h2 className="text-2xl font-extrabold text-gray-900 mb-10 flex items-center gap-4">
                                <div className="bg-accent/10 p-3 rounded-2xl"><MapPin size={24} className="text-accent" /></div>
                                Shipping Details
                            </h2>
                            <form className="space-y-8" onSubmit={handleConfirmOrder} noValidate>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <User size={14} className="text-accent" /> Consignee Name
                                        </label>
                                        <input type="text" defaultValue={user?.name || ''} className={inputClasses('')} readOnly />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Phone size={14} className="text-accent" /> Contact Number <span className="text-red-400">*</span>
                                        </label>
                                        <input type="text" value={phone} onChange={(e) => { setPhone(e.target.value); setFieldErrors(p => ({ ...p, phone: '' })); }}
                                            className={inputClasses('phone')} placeholder="+94 7X XXX XXXX" required />
                                        <FieldError name="phone" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <MapPin size={14} className="text-accent" /> Transportation Address <span className="text-red-400">*</span>
                                    </label>
                                    <textarea rows="3" value={address} onChange={(e) => { setAddress(e.target.value); setFieldErrors(p => ({ ...p, address: '' })); }}
                                        className={`${inputClasses('address')} resize-none`} placeholder="No., Street / Lane, Area" required />
                                    <FieldError name="address" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Building2 size={14} className="text-accent" /> City <span className="text-red-400">*</span>
                                        </label>
                                        <input type="text" value={city} onChange={(e) => { setCity(e.target.value); setFieldErrors(p => ({ ...p, city: '' })); }}
                                            className={inputClasses('city')} placeholder="e.g. Colombo" required />
                                        <FieldError name="city" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Hash size={14} className="text-accent" /> Postal Code <span className="text-red-400">*</span>
                                        </label>
                                        <input type="text" value={postalCode} maxLength={5}
                                            onChange={(e) => { setPostalCode(e.target.value.replace(/\D/g, '')); setFieldErrors(p => ({ ...p, postalCode: '' })); }}
                                            className={inputClasses('postalCode')} placeholder="5-digit code" required />
                                        <FieldError name="postalCode" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <MapPin size={14} className="text-accent" /> Province <span className="text-red-400">*</span>
                                        </label>
                                        <select value={province} onChange={(e) => { setProvince(e.target.value); setFieldErrors(p => ({ ...p, province: '' })); }}
                                            className={`${inputClasses('province')} appearance-none cursor-pointer`} required>
                                            <option value="">Select a province…</option>
                                            {SRI_LANKA_PROVINCES.map(p => (<option key={p} value={p}>{p}</option>))}
                                        </select>
                                        <FieldError name="province" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                            <Calendar size={14} className="text-accent" /> Preferred Delivery Date <span className="text-red-400">*</span>
                                        </label>
                                        <input type="date" value={preferredDeliveryDate} min={minDate} max={maxDate}
                                            onChange={(e) => { setPreferredDeliveryDate(e.target.value); setFieldErrors(p => ({ ...p, preferredDeliveryDate: '' })); }}
                                            className={inputClasses('preferredDeliveryDate')} required />
                                        <p className="text-xs text-gray-400 font-medium px-1">Within 30 days of today.</p>
                                        <FieldError name="preferredDeliveryDate" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <FileText size={14} className="text-accent" /> Order Note <span className="text-gray-300 font-medium normal-case tracking-normal ml-1">(Optional)</span>
                                    </label>
                                    <textarea rows="3" value={orderNote} onChange={(e) => setOrderNote(e.target.value)} maxLength={1000}
                                        className={`${inputClasses('')} resize-none font-medium`} placeholder="Any special instructions…" />
                                    <p className="text-xs text-gray-400 font-medium px-1 text-right">{orderNote.length}/1000</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 px-1">
                                        <Mail size={14} className="text-accent" /> Confirmation Email <span className="text-red-400">*</span>
                                    </label>
                                    <input type="email" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); setFieldErrors(p => ({ ...p, contactEmail: '' })); }}
                                        className={inputClasses('contactEmail')} placeholder="email@example.com" required />
                                    <p className="text-xs text-accent font-semibold px-1">📧 Confirmation will be sent to this email.</p>
                                    <FieldError name="contactEmail" />
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Side: Summary */}
                    <div className="lg:col-span-1">
                        <div className="glass-card rounded-3xl p-10 lg:sticky lg:top-28 shadow-glass-xl">
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-10 tracking-tight">Investment Summary</h2>

                            <div className="space-y-5 mb-10 pb-10 border-b border-white/30">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider font-bold text-gray-400">Subtotal</span>
                                    <span className="text-xl font-extrabold text-gray-900">{totalAmount.toLocaleString()} <span className="text-xs">LKR</span></span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider font-bold text-gray-400">Handling Fee</span>
                                    <span className="glass-badge text-accent-dark">Included</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm uppercase tracking-wider font-bold text-gray-400">Delivery</span>
                                    <span className="glass-badge text-emerald-600">Free Consultation</span>
                                </div>
                            </div>

                            <div className="mb-12 glass rounded-3xl p-8 border-l-4 border-accent">
                                <span className="text-xs font-bold text-accent uppercase tracking-widest mb-2 block">Total Amount Due</span>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-accent-gradient tracking-tighter">{totalAmount.toLocaleString()}</span>
                                    <span className="text-sm font-bold text-accent uppercase tracking-widest">LKR</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <button onClick={handleConfirmOrder} disabled={!isFormReady || loading}
                                    className="w-full py-5 btn-accent rounded-2xl font-extrabold text-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                                    {loading ? (
                                        <span className="flex items-center gap-3">
                                            <div className="animate-spin h-5 w-5 border-3 border-white border-t-transparent rounded-full"></div>
                                            PROCESSING...
                                        </span>
                                    ) : 'PROCEED TO PAYMENT'}
                                </button>
                                <button onClick={() => navigate('/catalog')}
                                    className="w-full py-3 text-gray-400 font-bold hover:text-accent transition text-xs tracking-widest uppercase">
                                    ← Back to Catalog
                                </button>
                            </div>

                            <div className="mt-10 flex items-center justify-center gap-4 opacity-30">
                                <div className="glass h-10 w-16 rounded-lg flex items-center justify-center text-[10px] font-bold italic">VISA</div>
                                <div className="glass h-10 w-16 rounded-lg flex items-center justify-center text-[10px] font-bold italic">MASTER</div>
                                <div className="glass h-10 w-16 rounded-lg flex items-center justify-center text-[10px] font-bold italic">Stripe</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderPage;