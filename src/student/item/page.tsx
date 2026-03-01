import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import {
    ArrowLeft, Clock, Leaf, AlertTriangle,
    Minus, Plus, CheckCircle
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { getMenuItemById } from '../../services/menu.service';
import type { MenuItem } from '../../types';

const StudentItemDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [portion, setPortion] = useState<'small' | 'regular'>('regular');
    const [quantity, setQuantity] = useState(1);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                if (id) {
                    const data = await getMenuItemById(id);
                    setItem(data);
                    if (data.price?.small) {
                        setPortion('regular');
                    }
                }
            } catch (err) {
                console.error("Failed to fetch item", err);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    if (loading) {
        return <div className="p-10 text-center text-gray-500">Loading item details...</div>;
    }

    if (!item) {
        return (
            <div className="p-10 text-center">
                <p className="text-gray-500 mb-4">Item not found.</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    // Price Calculation
    const currentPrice = portion === 'small' && item.price?.small ? item.price.small : item.price?.regular || 0;
    const totalPrice = currentPrice * quantity;

    const handleAddToCart = () => {
        setIsAdding(true);
        setTimeout(() => {
            setIsAdding(false);
            alert(`Added ${quantity} x ${item.name} (${portion}) to cart!`);
            navigate(-1); // Go back
        }, 800);
    };

    return (
        <div className="pb-24">
            {/* 1. Header Image */}
            <div className={cn("h-64 w-full relative", item.imageColor)}>
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
                >
                    <ArrowLeft size={20} className="text-gray-900" />
                </button>
            </div>

            <div className="-mt-6 bg-white rounded-t-3xl relative px-6 pt-8 space-y-6">

                {/* 2. Title & Basic Info */}
                <div>
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-bold text-gray-900">{item.name}</h1>
                        <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-bold border",
                            item.type === 'Non-Veg' ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
                        )}>
                            {item.type}
                        </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <Clock size={16} />
                            <span>{item.prepTime}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                        <div>{item.calories} kcal</div>
                    </div>
                </div>

                {/* 3. Description */}
                <p className="text-gray-600 leading-relaxed">
                    {item.description}
                </p>

                {/* 4. Eco Score Card */}
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                    <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <Leaf size={20} />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="font-bold text-green-900">Eco Score: {item.ecoScore}/100</h3>
                            {item.ecoScore > 80 && <CheckCircle size={14} className="text-green-600" />}
                        </div>
                        <p className="text-xs text-green-700 mt-1 leading-snug">
                            {item.ecoReason}
                        </p>
                    </div>
                </div>

                {/* 5. Allergen Warnings */}
                {item.allergens.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {item.allergens.map((alg: string) => (
                            <span key={alg} className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-100">
                                <AlertTriangle size={14} />
                                Contains {alg}
                            </span>
                        ))}
                    </div>
                )}

                {/* 6. Portion & Price */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-3">Customise Portion</h3>
                    <div className="flex gap-3">
                        {item.price.small && (
                            <button
                                onClick={() => setPortion('small')}
                                className={cn(
                                    "flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all",
                                    portion === 'small' ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"
                                )}
                            >
                                <span className="block text-sm font-bold text-gray-900">Small</span>
                                <span className="text-xs text-gray-500">₹{item.price.small}</span>
                            </button>
                        )}
                        <button
                            onClick={() => setPortion('regular')}
                            className={cn(
                                "flex-1 py-3 px-4 rounded-xl border-2 text-center transition-all",
                                portion === 'regular' ? "border-blue-500 bg-blue-50" : "border-gray-100 bg-white"
                            )}
                        >
                            <span className="block text-sm font-bold text-gray-900">Regular</span>
                            <span className="text-xs text-gray-500">₹{item.price.regular}</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* 7. Sticky Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg safe-area-bottom">
                <div className="flex items-center gap-4 max-w-md mx-auto">
                    {/* Quantity Stepper */}
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1.5">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="p-2 bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} />
                        </button>
                        <span className="font-bold text-gray-900 w-4 text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="p-2 bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900"
                        >
                            <Plus size={16} />
                        </button>
                    </div>

                    {/* Add Button */}
                    <Button
                        className="flex-1 flex justify-between items-center"
                        onClick={handleAddToCart}
                        isLoading={isAdding}
                    >
                        <span>Add to Cart</span>
                        <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{totalPrice}</span>
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default StudentItemDetail;
