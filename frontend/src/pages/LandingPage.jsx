import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
    const navigate = useNavigate();

    const features = [
        {
            title: 'Inventory Management',
            description: 'Track your granite and slab inventory in real-time with powerful analytics and stock alerts.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
            ),
        },
        {
            title: 'Order Tracking',
            description: 'Manage customer orders from placement to delivery with complete visibility at every stage.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
            ),
        },
        {
            title: 'User Management',
            description: 'Control access with role-based permissions for admins, managers, and staff members.',
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            {/* ── Navigation Bar ── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Heritage Slabs
                    </span>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/login')}
                            className="px-5 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate('/register')}
                            className="px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ── */}
            <section className="relative flex-grow flex items-center justify-center pt-16 overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900">
                {/* Decorative shapes */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
                    <div className="inline-flex items-center px-4 py-1.5 mb-8 text-xs font-semibold tracking-wider text-blue-300 uppercase bg-blue-500/10 border border-blue-500/20 rounded-full">
                        Enterprise Resource Planning
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
                        Heritage{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                            Slabs
                        </span>
                    </h1>

                    <p className="mt-6 text-lg md:text-xl text-blue-100/70 max-w-2xl mx-auto leading-relaxed">
                        Streamline your granite &amp; slab business with a modern ERP system built for
                        inventory tracking, order management, and seamless team collaboration.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/register')}
                            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Get Started Free
                        </button>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-blue-100 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:bg-white/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Sign In →
                        </button>
                    </div>
                </div>
            </section>

            {/* ── Features Section ── */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Everything you need to run your business
                        </h2>
                        <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
                            A complete suite of tools designed specifically for the stone and slab industry.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, i) => (
                            <div
                                key={i}
                                className="group relative p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300"
                            >
                                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="mt-6 text-xl font-semibold text-gray-900">
                                    {feature.title}
                                </h3>
                                <p className="mt-3 text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer className="py-8 bg-white border-t border-gray-200">
                <p className="text-center text-sm text-gray-400">
                    &copy; {new Date().getFullYear()} Heritage Slabs. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
