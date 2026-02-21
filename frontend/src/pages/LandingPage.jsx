import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight, Layout, Shield, TrendingUp, ShoppingCart, ClipboardList } from 'lucide-react';
import { useCart } from '../context/CartContext';

const LandingPage = ({ user, logout }) => {
    const [showDemoModal, setShowDemoModal] = useState(false);

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* Navbar is now global in App.jsx */}

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100/50 via-gray-50 to-white"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 max-w-4xl mx-auto leading-tight">
                        Construct Your Dreams  <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                            With AI Precision
                        </span>
                    </h1>

                    <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                        The all-in-one ERP for Granite & Construction. Visualize designs with our advanced platform.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 group"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button
                            className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
                            onClick={() => setShowDemoModal(true)}
                        >
                            View Demo
                        </button>
                    </div>

                    {/* Feature Grid Mini */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto text-left">
                        {[
                            { icon: Layout, title: "Smart Visualization", desc: "See your projects before you build." },
                            { icon: TrendingUp, title: "Real-time Tracking", desc: "Monitor progress and inventory live." },
                            { icon: Shield, title: "Secure Data", desc: "Enterprise-grade security for your assets." }
                        ].map((feature, idx) => (
                            <div key={idx} className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about" className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">About Us</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Your trusted partner in premium granite and natural stone solutions since 1995
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
                            <p className="text-gray-600 mb-4">
                                Vijitha Granite has been at the forefront of the natural stone industry in Sri Lanka for over 25 years.
                                We specialize in sourcing, processing, and delivering the finest quality granite, marble, and soapstone
                                for residential and commercial projects.
                            </p>
                            <p className="text-gray-600 mb-6">
                                Our commitment to excellence, combined with cutting-edge technology and skilled craftsmanship,
                                ensures that every piece we deliver meets the highest standards of quality and beauty.
                            </p>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-3xl font-bold text-blue-600">25+</p>
                                    <p className="text-sm text-gray-500">Years Experience</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-3xl font-bold text-blue-600">5000+</p>
                                    <p className="text-sm text-gray-500">Happy Clients</p>
                                </div>
                                <div className="p-4 bg-white rounded-xl shadow-sm">
                                    <p className="text-3xl font-bold text-blue-600">100+</p>
                                    <p className="text-sm text-gray-500">Stone Varieties</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 text-white">
                            <h3 className="text-2xl font-bold mb-4">Why Choose Us?</h3>
                            <ul className="space-y-4">
                                {[
                                    "Premium quality natural stones",
                                    "Competitive pricing with no hidden costs",
                                    "Expert consultation and design support",
                                    "On-time delivery across Sri Lanka",
                                    "After-sales support and warranty"
                                ].map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-3">
                                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Products Section */}
            <section id="products" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Products</h2>
                        <p className="text-xl text-gray-500 max-w-3xl mx-auto">
                            Explore our wide range of premium natural stones for every need
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Granite",
                                desc: "Durable and elegant granite slabs perfect for countertops, flooring, and exterior cladding. Available in various colors and patterns.",
                                features: ["Heat Resistant", "Scratch Proof", "Low Maintenance"]
                            },
                            {
                                name: "Marble",
                                desc: "Luxurious marble with timeless beauty for premium interiors, bathrooms, and decorative applications.",
                                features: ["Elegant Finish", "Unique Veining", "Cool Surface"]
                            },
                            {
                                name: "Soapstone",
                                desc: "Natural soapstone ideal for kitchen counters, sinks, and artistic sculptures with excellent heat resistance.",
                                features: ["Chemical Resistant", "Heat Proof", "Easy to Clean"]
                            }
                        ].map((product, idx) => (
                            <div key={idx} className="group bg-gray-50 rounded-2xl p-8 hover:bg-gradient-to-br hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
                                <div className="w-16 h-16 bg-blue-100 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-6 transition-colors">
                                    <Layout className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-white mb-3 transition-colors">{product.name}</h3>
                                <p className="text-gray-600 group-hover:text-white/80 mb-6 transition-colors">{product.desc}</p>
                                <div className="flex flex-wrap gap-2">
                                    {product.features.map((feature, fidx) => (
                                        <span key={fidx} className="px-3 py-1 bg-blue-100 group-hover:bg-white/20 text-blue-700 group-hover:text-white text-sm rounded-full transition-colors">
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-lg"
                        >
                            Browse All Products
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                        <p className="text-xl text-gray-500">Find answers to common questions about our products and services</p>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: "What types of granite do you offer?",
                                a: "We offer a wide variety of granite including Black Galaxy, Kashmir White, Tan Brown, Imperial Red, and many more. Each type comes in different finishes like polished, honed, and flamed."
                            },
                            {
                                q: "Do you provide installation services?",
                                a: "Yes, we provide professional installation services with our team of skilled craftsmen. We also partner with certified contractors across Sri Lanka for seamless delivery and installation."
                            },
                            {
                                q: "What is your delivery timeline?",
                                a: "Standard orders are delivered within 5-7 business days within Colombo and suburbs. For other areas, delivery typically takes 7-14 days depending on the location and order size."
                            },
                            {
                                q: "Do you offer custom cutting and sizing?",
                                a: "Absolutely! We have state-of-the-art cutting facilities that can handle any custom size or shape requirements. Just provide your specifications and we'll cut to your exact needs."
                            },
                            {
                                q: "What payment methods do you accept?",
                                a: "We accept bank transfers, credit/debit cards, and cash payments. For large orders, we also offer flexible payment plans with an initial deposit."
                            }
                        ].map((faq, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.q}</h3>
                                <p className="text-gray-600">{faq.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h2>
                        <p className="text-xl text-gray-500">Get in touch with us for inquiries, quotes, or to visit our showroom</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h3>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Our Location</h4>
                                        <p className="text-gray-600">No. 151, Colombo Road,<br />Ukwatta, Avissawella</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Phone</h4>
                                        <p className="text-gray-600">036 222 2655<br />071 416 1301</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Email</h4>
                                        <p className="text-gray-600">vijithagranites@yahoo.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Business Hours</h4>
                                        <p className="text-gray-600">Mon - Sat: 8:00 AM - 6:00 PM<br />Sunday: Closed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-gray-100 rounded-2xl overflow-hidden h-96">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d507003.271235945!2d79.82433370985817!3d6.895022464296891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a99956e30607%3A0xce1f603c6e7d9734!2sVijitha%20Granite!5e0!3m2!1sen!2slk!4v1769700102876!5m2!1sen!2slk"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Vijitha Granite Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="col-span-2 md:col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                <img src="/logo.png" alt="Vijitha Granites" className="h-10 w-10 rounded-lg object-cover" />
                                <span className="text-xl font-bold">Heritage Slabs</span>
                            </div>
                            <p className="text-gray-400 text-sm">
                                Your trusted partner in premium natural stone solutions since 1995.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Quick Links</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#about" className="hover:text-white transition">About Us</a></li>
                                <li><a href="#products" className="hover:text-white transition">Products</a></li>
                                <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
                                <li><a href="#contact" className="hover:text-white transition">Contact</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Products</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-white transition">Granite</a></li>
                                <li><a href="#" className="hover:text-white transition">Marble</a></li>
                                <li><a href="#" className="hover:text-white transition">Soapstone</a></li>
                                <li><a href="#" className="hover:text-white transition">Custom Orders</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-semibold mb-4">Contact</h4>
                            <ul className="space-y-2 text-gray-400 text-sm">
                                <li>+94 71 416 1301</li>
                                <li>vijithagranites@yahoo.com</li>
                                <li>Ukwatta, Avissawella</li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
                        <p>&copy; {new Date().getFullYear()} Heritage Slabs. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* Demo Video Modal */}
            {showDemoModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowDemoModal(false)}
                >
                    <div
                        className="relative w-full max-w-4xl mx-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowDemoModal(false)}
                            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
                        >
                            <X size={32} />
                        </button>
                        <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
                            <video
                                src="/Demo.mp4"
                                controls
                                autoPlay
                                className="w-full aspect-video"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default LandingPage;
