import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContext } from './AuthContext';

const CartContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const cartStorageKey = useMemo(
        () => `cart_${(user?.email || 'guest').toLowerCase()}`,
        [user?.email]
    );

    const [cartItems, setCartItems] = useState(() => {
        try {
            const saved = localStorage.getItem('cart_guest');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            const saved = localStorage.getItem(cartStorageKey);
            setCartItems(saved ? JSON.parse(saved) : []);
        } catch {
            setCartItems([]);
        }
    }, [cartStorageKey]);

    useEffect(() => {
        localStorage.setItem(cartStorageKey, JSON.stringify(cartItems));
    }, [cartItems, cartStorageKey]);

    const addToCart = (product, quantity = 1) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCartItems((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCartItems([]);

    const getCartCount = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getCartTotal = () =>
        cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                getCartCount,
                getCartTotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
