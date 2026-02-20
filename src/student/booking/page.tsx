import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Button from "../../components/common/Button";
import {
  Search,
  Leaf,
  AlertTriangle,
  Check,
  ShoppingBag,
  Plus,
  Minus,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { getMenuItems, type MenuItem } from "../../services/menu.service";
import * as canteenService from "../../services/canteen.service";
import type { Canteen } from "../../services/canteen.service";
import { getPublicSettings } from "../../services/system.service";
import { useCart } from "../../store/cart.store";
import toast from "react-hot-toast";
import { getOperatingStatus } from "../../utils/serviceSchedule";

// Frontend Interface
interface FrontendMenuItem {
  id: string;
  name: string;
  price: number;
  category: "Breakfast" | "Lunch" | "Snacks";
  type: "Veg" | "Non-Veg" | "Vegan";
  isJain: boolean;
  allergens: string[];
  ecoScore: number;
  imageColor: string;
  isVeg: boolean;
}

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

const StudentBooking: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryCanteenId = searchParams.get("canteenId") || "";
  const [activeCanteenId, setActiveCanteenId] = useState(() => {
    return queryCanteenId || localStorage.getItem("selectedCanteenId") || "";
  });
  const {
    items: cartItems,
    addItem,
    removeItem,
    updateQuantity,
    getItemCount,
  } = useCart();

  const [activeCategory, setActiveCategory] = useState<
    "Breakfast" | "Lunch" | "Snacks"
  >("Lunch");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [menuItems, setMenuItems] = useState<FrontendMenuItem[]>([]);
  const [loadingFood, setLoadingFood] = useState(true);
  const [canteens, setCanteens] = useState<Canteen[]>([]);
  const [canteensLoading, setCanteensLoading] = useState(true);
  const [serviceNotice, setServiceNotice] = useState("");

  // Fetch Menu on mount
  useEffect(() => {
    if (queryCanteenId) {
      localStorage.setItem("selectedCanteenId", queryCanteenId);
      setActiveCanteenId(queryCanteenId);
      return;
    }

    if (!activeCanteenId) {
      const stored = localStorage.getItem("selectedCanteenId") || "";
      if (stored) {
        setActiveCanteenId(stored);
      }
    }
  }, [queryCanteenId]);

  useEffect(() => {
    fetchFood();
  }, [activeCanteenId]);

  useEffect(() => {
    loadCanteens();
    loadPublicSettings();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadPublicSettings();
    }, 30000);

    const handleFocus = () => {
      loadPublicSettings();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadPublicSettings = async () => {
    try {
      const settings = await getPublicSettings();
      if (!settings.masterBookingEnabled) {
        setServiceNotice("System under maintenance.");
        return;
      }

      if (!settings.onlineBookingEnabled) {
        setServiceNotice("Online booking is currently disabled.");
        return;
      }

      const status = getOperatingStatus(settings.operatingSchedule);
      setServiceNotice(status.isOpen ? "" : status.reason || "");
    } catch (err) {
      console.error("Failed to load public settings:", err);
      setServiceNotice("");
    }
  };

  const loadCanteens = async () => {
    try {
      setCanteensLoading(true);
      const data = await canteenService.getCanteens({ isActive: true });
      setCanteens(data);
    } catch (err) {
      console.error("Failed to fetch canteens:", err);
    } finally {
      setCanteensLoading(false);
    }
  };

  const fetchFood = async () => {
    setLoadingFood(true);
    try {
      const backendItems: MenuItem[] = await getMenuItems(
        activeCanteenId ? { canteen: activeCanteenId } : undefined,
      );
      const mapped: FrontendMenuItem[] = backendItems.map((item) => ({
        id: item.id || item._id || "",
        name: item.itemName,
        price: item.price || 0,
        category: mapCategory(item.category),
        type: mapDietaryType(item.dietaryType),
        isJain: item.dietaryType === "Jain",
        isVeg: item.dietaryType !== "Non-Veg" && item.dietaryType !== "Egg",
        allergens: item.allergens || [],
        ecoScore: mapEcoScore(item.ecoScore),
        imageColor: getColor(item.itemName),
      }));
      setMenuItems(mapped);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    } finally {
      setLoadingFood(false);
    }
  };

  const mapCategory = (cat: string): "Breakfast" | "Lunch" | "Snacks" => {
    const u = cat?.toUpperCase() || "";
    if (u === "BREAKFAST") return "Breakfast";
    if (u === "LUNCH" || u === "DINNER") return "Lunch";
    return "Snacks";
  };

  const mapDietaryType = (type: string): "Veg" | "Non-Veg" | "Vegan" => {
    if (type === "Vegan") return "Vegan";
    if (type === "Non-Veg" || type === "Egg") return "Non-Veg";
    return "Veg";
  };

  const mapEcoScore = (score?: string): number => {
    const map: Record<string, number> = { A: 95, B: 80, C: 60, D: 40, E: 20 };
    return map[score || "C"] || 60;
  };

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter],
    );
  };

  const getCartQty = (itemId: string) => {
    const c = cartItems.find((i) => i.id === itemId);
    return c ? c.quantity : 0;
  };

  const handleAdd = (item: FrontendMenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      imageColor: item.imageColor,
      isVeg: item.isVeg,
    });
    toast.success(`${item.name} added to cart`);
  };

  const handleIncrement = (item: FrontendMenuItem) => {
    const current = getCartQty(item.id);
    updateQuantity(item.id, current + 1);
  };

  const handleDecrement = (item: FrontendMenuItem) => {
    const current = getCartQty(item.id);
    if (current <= 1) {
      removeItem(item.id);
    } else {
      updateQuantity(item.id, current - 1);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesVeg = activeFilters.includes("Veg")
      ? item.type === "Veg" || item.type === "Vegan"
      : true;
    const matchesVegan = activeFilters.includes("Vegan")
      ? item.type === "Vegan"
      : true;
    const matchesJain = activeFilters.includes("Jain") ? item.isJain : true;
    const matchesNutFree = activeFilters.includes("No Nuts")
      ? !item.allergens.some((a) => a.toLowerCase().includes("nut"))
      : true;
    return (
      matchesCategory &&
      matchesSearch &&
      matchesVeg &&
      matchesVegan &&
      matchesJain &&
      matchesNutFree
    );
  });

  const itemCount = getItemCount();

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Food Menu</h1>
            <p className="text-sm text-gray-500">
              Browse and add items to your cart
            </p>
          </div>
          <Link
            to="/user/cart"
            className="relative p-2 bg-gray-100 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        </div>

        {serviceNotice && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-sm text-amber-800">
            {serviceNotice}
          </div>
        )}

        <div className="flex items-center gap-3">
          <label className="text-sm text-gray-600">Canteen</label>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={activeCanteenId}
            onChange={(e) => {
              const value = e.target.value;
              setActiveCanteenId(value);
              if (value) {
                localStorage.setItem("selectedCanteenId", value);
              } else {
                localStorage.removeItem("selectedCanteenId");
              }
            }}
            disabled={canteensLoading}
          >
            <option value="">All Canteens</option>
            {canteens.map((canteen) => {
              const id = canteen.id || canteen._id || "";
              return (
                <option key={id} value={id}>
                  {canteen.name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search food (e.g. Biryani)"
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto">
          {(["Breakfast", "Lunch", "Snacks"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === cat
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Veg", "Vegan", "Jain", "No Nuts"].map((filter) => (
            <button
              key={filter}
              onClick={() => toggleFilter(filter)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-1 whitespace-nowrap",
                activeFilters.includes(filter)
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-200 text-gray-600",
              )}
            >
              {activeFilters.includes(filter) && <Check size={12} />}
              {filter}
            </button>
          ))}
        </div>
      </section>

      {/* Menu Items */}
      <section>
        {loadingFood ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-400 text-sm">Loading menu...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const qty = getCartQty(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex gap-4"
                >
                  {/* Image */}
                  <Link
                    to={`/user/item/${item.id}`}
                    className={cn(
                      "w-24 h-24 rounded-xl flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity",
                      item.imageColor,
                    )}
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          to={`/user/item/${item.id}`}
                          className="font-bold text-gray-900 truncate hover:text-blue-600"
                        >
                          {item.name}
                        </Link>
                        <span
                          className={cn(
                            "w-4 h-4 border flex items-center justify-center flex-shrink-0",
                            item.type === "Non-Veg"
                              ? "border-red-500"
                              : "border-green-500",
                          )}
                        >
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              item.type === "Non-Veg"
                                ? "bg-red-500"
                                : "bg-green-500",
                            )}
                          />
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.ecoScore > 80 && (
                          <span className="text-[10px] font-bold bg-green-50 text-green-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Leaf size={8} /> Eco
                          </span>
                        )}
                        {item.allergens.map((alg) => (
                          <span
                            key={alg}
                            className="text-[10px] font-bold bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded flex items-center gap-1"
                          >
                            <AlertTriangle size={8} /> {alg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-end justify-between mt-3">
                      <p className="text-lg font-bold text-gray-900">
                        ₹{item.price}
                      </p>

                      {qty === 0 ? (
                        <Button
                          size="sm"
                          className="h-8 px-3 text-xs"
                          onClick={() => handleAdd(item)}
                        >
                          Add
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-1">
                          <button
                            onClick={() => handleDecrement(item)}
                            className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="text-sm font-bold text-blue-700 w-4 text-center">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleIncrement(item)}
                            className="p-1 text-blue-700 hover:bg-blue-100 rounded"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredItems.length === 0 && (
              <div className="col-span-full text-center py-10 text-gray-400">
                No items found matching your filters.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Floating Cart Bar */}
      {itemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
          <div className="max-w-2xl mx-auto">
            <Link
              to="/user/cart"
              className="flex items-center justify-between bg-blue-600 text-white rounded-xl px-5 py-3 hover:bg-blue-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <span className="font-medium">
                  {itemCount} item{itemCount > 1 ? "s" : ""} in cart
                </span>
              </div>
              <span className="font-bold text-lg">View Cart →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentBooking;

