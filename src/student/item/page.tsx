import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import {
  ArrowLeft,
  Clock,
  Leaf,
  AlertTriangle,
  Minus,
  Plus,
  CheckCircle,
  ShoppingBag,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { getMenuItems, type MenuItem } from "../../services/menu.service";
import { useCart } from "../../store/cart.store";
import toast from "react-hot-toast";

const COLORS = [
  "bg-orange-100",
  "bg-gray-100",
  "bg-red-100",
  "bg-green-100",
  "bg-yellow-100",
  "bg-blue-100",
  "bg-purple-100",
];
const getColor = (name: string) => COLORS[name.charCodeAt(0) % COLORS.length];

const ecoLabel: Record<string, { score: number; reason: string }> = {
  A: {
    score: 95,
    reason: "Excellent sustainability. Locally sourced, low carbon footprint.",
  },
  B: { score: 80, reason: "Good sustainability. Mostly local ingredients." },
  C: { score: 60, reason: "Average sustainability. Standard practices." },
  D: { score: 40, reason: "Below average. Higher carbon footprint." },
  E: { score: 20, reason: "Low sustainability rating." },
};

const StudentItemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, items: cartItems } = useCart();

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    setLoading(true);
    try {
      const items = await getMenuItems();
      const found = items.find((i) => (i.id || i._id) === id);
      setItem(found || null);
    } catch (err) {
      console.error("Failed to fetch item:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Item not found</p>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const itemId = item.id || item._id || "";
  const price = item.price || 0;
  const totalPrice = price * quantity;
  const eco = ecoLabel[item.ecoScore || "C"] || ecoLabel.C;
  const isVeg = item.dietaryType !== "Non-Veg" && item.dietaryType !== "Egg";
  const imageColor = getColor(item.itemName);
  const allergens = item.allergens || [];
  const cartQty = cartItems.find((c) => c.id === itemId)?.quantity || 0;

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem({
      id: itemId,
      name: item.itemName,
      price,
      imageColor,
      isVeg,
      quantity,
    });
    toast.success(`Added ${quantity} × ${item.itemName} to cart`);
    setTimeout(() => {
      setIsAdding(false);
      navigate(-1);
    }, 400);
  };

  return (
    <div className="pb-24">
      {/* Header Image */}
      <div className={cn("h-64 w-full relative", imageColor)}>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-900" />
        </button>
        {cartQty > 0 && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <ShoppingBag size={12} /> {cartQty} in cart
          </div>
        )}
      </div>

      <div className="-mt-6 bg-white rounded-t-3xl relative px-6 pt-8 space-y-6">
        {/* Title */}
        <div>
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold text-gray-900">
              {item.itemName}
            </h1>
            <span
              className={cn(
                "px-2.5 py-1 rounded-full text-xs font-bold border",
                !isVeg
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-green-50 text-green-700 border-green-200",
              )}
            >
              {item.dietaryType || (isVeg ? "Veg" : "Non-Veg")}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            {item.portionSize && (
              <>
                <div className="flex items-center gap-1.5">
                  <Clock size={16} />
                  <span>{item.portionSize}</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
              </>
            )}
            <div className="font-medium text-gray-900">₹{price}</div>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        )}

        {/* Eco Score */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
            <Leaf size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-green-900">
                Eco Score: {eco.score}/100
              </h3>
              {eco.score > 80 && (
                <CheckCircle size={14} className="text-green-600" />
              )}
            </div>
            <p className="text-xs text-green-700 mt-1 leading-snug">
              {eco.reason}
            </p>
          </div>
        </div>

        {/* Allergens */}
        {allergens.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allergens.map((alg: string) => (
              <span
                key={alg}
                className="inline-flex items-center gap-1.5 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-orange-100"
              >
                <AlertTriangle size={14} />
                Contains {alg}
              </span>
            ))}
          </div>
        )}

        {/* Nutritional Info */}
        {item.nutritionalInfo && (
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-bold text-gray-900 mb-3">Nutritional Info</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {item.nutritionalInfo.calories && (
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <span className="block font-bold text-gray-900">
                    {item.nutritionalInfo.calories}
                  </span>
                  <span className="text-xs text-gray-500">kcal</span>
                </div>
              )}
              {item.nutritionalInfo.protein && (
                <div className="bg-gray-50 rounded-lg p-2 text-center">
                  <span className="block font-bold text-gray-900">
                    {item.nutritionalInfo.protein}g
                  </span>
                  <span className="text-xs text-gray-500">Protein</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
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
            <span className="font-bold text-gray-900 w-4 text-center">
              {quantity}
            </span>
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
            <span className="bg-white/20 px-2 py-0.5 rounded text-sm">
              ₹{totalPrice}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentItemDetail;
