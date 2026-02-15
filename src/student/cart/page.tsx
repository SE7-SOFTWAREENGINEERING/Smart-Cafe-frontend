import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import {
  ArrowLeft,
  Trash2,
  ChevronRight,
  ShoppingBag,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { useCart } from "../../store/cart.store";

const StudentCart: React.FC = () => {
  const navigate = useNavigate();
  const {
    items: cartItems,
    removeItem,
    updateQuantity,
    getTotal,
    getItemCount,
    clearCart,
  } = useCart();

  const totalPrice = getTotal();
  const totalItems = getItemCount();

  return (
    <div className="pb-28 space-y-6">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-900" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Your Cart</h1>
        {totalItems > 0 && (
          <span className="ml-auto bg-blue-100 text-blue-700 font-bold px-3 py-1 rounded-full text-xs">
            {totalItems} Item{totalItems > 1 ? "s" : ""}
          </span>
        )}
      </header>

      {/* Cart Items */}
      <section className="space-y-4">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4"
            >
              {/* Image */}
              <div
                className={cn(
                  "w-20 h-20 rounded-xl flex-shrink-0",
                  item.imageColor || "bg-gray-100",
                )}
              />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900 truncate">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      ₹{item.price} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-gray-900">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-bold text-gray-900 w-5 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 bg-white rounded-md shadow-sm text-gray-600 hover:text-gray-900"
                    >
                      <Plus size={14} />
                    </button>
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
            <p className="text-sm text-gray-500 mt-2 mb-6">
              Looks like you haven't added anything yet.
            </p>
            <Button onClick={() => navigate("/user/booking")}>
              Browse Menu
            </Button>
          </div>
        )}
      </section>

      {cartItems.length > 0 && (
        <>
          {/* Clear cart */}
          <div className="flex justify-end">
            <button
              onClick={clearCart}
              className="text-sm text-red-500 hover:text-red-700 font-medium px-3 py-1 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <section className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900">Order Summary</h3>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between text-sm text-gray-600"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span className="text-lg">₹{totalPrice}</span>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-lg safe-area-bottom z-10">
            <div className="max-w-md mx-auto space-y-3">
              <div className="flex justify-between items-center px-2">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{totalPrice}
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => navigate("/user/booking")}
                >
                  Add More
                </Button>
                <Button
                  className="flex-[2] flex justify-center items-center gap-2"
                  onClick={() => navigate("/user/slots")}
                >
                  <span>Select Slot & Book</span>
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
