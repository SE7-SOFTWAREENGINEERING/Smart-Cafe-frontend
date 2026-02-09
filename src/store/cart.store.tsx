import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// For simplicity, we define basic item structure
export interface CartItem {
    id: string; // Menu Item ID
    name: string;
    price: number;
    quantity: number;
    prepTime: number; // For estimated time
    ecoScore: number; // For impact summary
    imageColor?: string; // For UI
    portion?: 'Regular' | 'Small';
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);

    const addToCart = (newItem: CartItem) => {
        setItems(prev => {
            const existing = prev.find(i => i.id === newItem.id && i.portion === newItem.portion);
            if (existing) {
                return prev.map(i =>
                    (i.id === newItem.id && i.portion === newItem.portion)
                        ? { ...i, quantity: i.quantity + newItem.quantity }
                        : i
                );
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (itemId: string) => {
        setItems(prev => prev.filter(i => i.id !== itemId));
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
