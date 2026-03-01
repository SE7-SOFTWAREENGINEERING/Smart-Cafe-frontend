import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useCart } from '../../store/cart.store';
import {
    ArrowLeft, Clock, Leaf, Trash2, ChevronRight,
    ShoppingBag
} from 'lucide-react';
import { cn } from '../../utils/cn';



const StudentCart: React.FC = () => {
    const navigate = useNavigate();
    const { items: cartItems, removeFromCart, totalPrice, totalItems } = useCart();

    // Prep time is likely the max of individual items (parallel prep) or some heuristic
    // For safety, let's take the max prep time of any single item + 5 mins buffer
    const maxPrepTime = Math.max(...cartItems.map(i => i.prepTime), 0);
    const totalPrepTime = cartItems.length > 0 ? maxPrepTime + 5 : 0;

    const avgEcoScore = cartItems.length > 0
        ? Math.round(cartItems.reduce((sum, item) => sum + item.ecoScore, 0) / cartItems.length)
        : 0;

    const handleRemove = (id: string) => {
        removeFromCart(id);
    };

    return (
        <div className="pb-28 space-y-6">
            {/* 1. Header */}
            <header className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={24} className="text-gray-900" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
                <span className="ml-auto bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
                    {totalItems} Items
                </span>
            </header>

            {/* 2. Cart Items */}
            <section className="space-y-4">
                {cartItems.length > 0 ? (
                    cartItems.map(item => (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4">
                            {/* Image */}
                            <div className={cn("w-20 h-20 rounded-xl flex-shrink-0", item.imageColor)}></div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.portion} Portion</p>
                                    </div>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                    <div className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                                        Qty: {item.quantity}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="font-bold text-gray-900">Your cart is empty</h3>
                        <p className="text-sm text-gray-500 mt-2 mb-6">Looks like you haven't added anything yet.</p>
                        <Button onClick={() => navigate('/student/booking')}>Browse Menu</Button>
                    </div>
                )}
            </section>

            {cartItems.length > 0 && (
                <>
                    {/* 3. Impact Summary */}
                    <section className="grid grid-cols-2 gap-4">
                        <div className="bg-brand-light p-4 rounded-2xl border border-brand/20">
                            <div className="flex items-center gap-2 text-brand mb-2">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Est. Time</span>
                            </div>
                            <p className="text-2xl font-bold text-brand-hover">{totalPrepTime} mins</p>
                            <p className="text-xs text-brand mt-1">Preparation time</p>
                        </div>

                        <div className={cn(
                            "p-4 rounded-2xl border",
                            avgEcoScore > 75 ? "bg-green-50 border-green-100" : "bg-amber-50 border-amber-100"
                        )}>
                            <div className={cn(
                                "flex items-center gap-2 mb-2",
                                avgEcoScore > 75 ? "text-green-800" : "text-amber-800"
                            )}>
                                <Leaf size={16} />
                                <span className="text-xs font-bold uppercase tracking-wider">Eco Impact</span>
                            </div>
                            <p className={cn(
                                "text-2xl font-bold",
                                avgEcoScore > 75 ? "text-green-900" : "text-amber-900"
                            )}>
                                {avgEcoScore}/100
                            </p>
                            <p className={cn(
                                "text-xs mt-1",
                                avgEcoScore > 75 ? "text-green-600" : "text-amber-600"
                            )}>
                                {avgEcoScore > 75 ? "Great choice!" : "Could be better"}
                            </p>
                        </div>
                    </section>

                    {/* 4. Footer Actions */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg safe-area-bottom z-10">
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="flex justify-between items-center px-2">
                                <span className="text-gray-500 text-sm">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900">₹{totalPrice}</span>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="flex-1"
                                    onClick={() => navigate(-1)}
                                >
                                    Add More
                                </Button>
                                <Button
                                    className="flex-[2] flex justify-center items-center gap-2"
                                    onClick={() => navigate('/student/slots')}
                                >
                                    <span>Select Slot</span>
                                    <ChevronRight size={18} />
                                </Button>
                            </div>
                        </div>
                    </div>
                </>
            )}

        </div>
    );
};

export default StudentCart;
