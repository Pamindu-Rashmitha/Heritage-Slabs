import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import productService from '../../services/productService';
import {
    LayoutDashboard, Users, Package, Truck, ClipboardList,
    Star, MessageSquare, ShoppingCart, Box, Warehouse, ChevronRight
} from 'lucide-react';

export default function Sidebar() {
    const location = useLocation();
    const [lowStockCount, setLowStockCount] = useState(0);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alerts = await productService.getLowStockAlerts();
                setLowStockCount(alerts.length);
            } catch (error) {
                console.error("Could not load stock alerts for sidebar", error);
            }
        };
        fetchAlerts();
    }, []);

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/users', label: 'User Management', icon: Users },
        { path: '/products', label: 'Products', icon: Package, badge: lowStockCount },
        { path: '/suppliers', label: 'Suppliers', icon: Warehouse },
        { path: '/purchase-orders', label: 'Purchase Orders', icon: ClipboardList, indent: true },
        { path: '/material-intakes', label: 'Material Intakes', icon: Box, indent: true },
        { path: '/vehicles', label: 'Vehicles', icon: Truck },
        { path: '/deliveries', label: 'Deliveries', icon: Truck },
        { path: '/orders', label: 'Orders', icon: ShoppingCart },
        { path: '/admin/reviews', label: 'Reviews', icon: Star },
        { path: '/admin/feedback', label: 'Feedback / Tickets', icon: MessageSquare },
    ];

    return (
        <div className="glass-sidebar w-64 h-full rounded-3xl flex flex-col overflow-hidden">
            {/* Brand */}
            <div className="flex items-center justify-center h-16 border-b border-white/30">
                <h1 className="text-xl font-extrabold text-gray-800 tracking-wide bg-clip-text text-transparent bg-accent-gradient">
                    Heritage Slabs
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                group flex items-center gap-3 px-4 py-2.5 rounded-2xl transition-all duration-300
                                ${item.indent ? 'ml-5 text-sm' : ''}
                                ${active
                                    ? 'bg-accent-gradient text-white shadow-glow-accent font-bold'
                                    : 'text-gray-600 hover:bg-white/40 hover:text-gray-900'
                                }
                            `}
                        >
                            <Icon size={item.indent ? 16 : 18} className={`flex-shrink-0 ${active ? 'text-white' : 'text-gray-400 group-hover:text-accent'} transition-colors`} />
                            <span className="flex-1 truncate">{item.label}</span>
                            {item.badge > 0 && (
                                <span className={`
                                    text-xs font-bold px-2 py-0.5 rounded-full shadow-sm
                                    ${active ? 'bg-white/25 text-white' : 'bg-red-500 text-white animate-pulse'}
                                `}>
                                    {item.badge}
                                </span>
                            )}
                            {!item.indent && (
                                <ChevronRight size={14} className={`opacity-0 group-hover:opacity-100 transition-opacity ${active ? 'text-white/60' : 'text-gray-300'}`} />
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}